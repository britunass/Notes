const { Note, NoteShare, User } = require('../models');
const { getNoteAccess } = require('../utils/access');

exports.getAllNotes = async (req, res, next) => {
  try {
    const me = req.user.email;
    const own = await Note.findAll({ where: { userId: req.user.id } });

    const shares = await NoteShare.findAll({
      where: { userId: req.user.id },
      include: [{ model: Note, include: [{ model: User, as: 'owner', attributes: ['email'] }] }]
    });
    const foreignNotes = shares.filter(s => s.Note);

    const allIds = [...own.map(n => n.id), ...foreignNotes.map(s => s.Note.id)];
    const byNote = {};
    if (allIds.length) {
      const rows = await NoteShare.findAll({
        where: { noteId: allIds },
        include: [{ model: User, attributes: ['email'] }]
      });
      rows.forEach(r => {
        if (r.User) (byNote[r.noteId] = byNote[r.noteId] || []).push(r.User.email);
      });
    }

    const ownOut = own.map(n => {
      const participants = (byNote[n.id] || []).sort();
      return { ...n.toJSON(), permission: 'owner', isShared: participants.length > 0, participants };
    });

    const foreignOut = foreignNotes.map(s => {
      const ownerEmail = s.Note.owner?.email;
      const others = (byNote[s.Note.id] || []).filter(e => e !== me);
      const participants = [ownerEmail, ...others].filter(Boolean).sort();
      return {
        ...s.Note.toJSON(),
        permission: s.permission,
        ownerEmail,
        isShared: true,
        participants
      };
    });

    res.json([...ownOut, ...foreignOut]);
  } catch (error) {
    next(error);
  }
};

exports.getNoteById = async (req, res, next) => {
    try{

      const { note, access } = await getNoteAccess(req.params.id, req.user.id);

      if (!note || !access) {
        return res.status(404).json({ error: 'Заметка с указанным ID не найдена' });
      }

      res.json({ ...note.toJSON(), permission: access });

    } catch (error) {
        next(error);
    }
};

exports.createNote = async (req, res, next) => {
    try{

    const { title, content, isArchived, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Поля "title" и "content" обязательны для заполнения' });
    }

    const newNote = await Note.create({ title, content, isArchived, tags, userId: req.user.id });

    res.status(201).json({ ...newNote.toJSON(), permission: 'owner' });

  } catch (error) {
    next(error);
  } 
};

exports.updateNote = async (req, res, next) => {
    try{

    const { title, content, isArchived, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Поля "title" и "content" обязательны для обновления' });
    }

    const { note, access } = await getNoteAccess(req.params.id, req.user.id);

    if (!note || !access) return res.status(404).json({ error: 'Заметка не найдена' });
    if (access === 'read') return res.status(403).json({ error: 'Нет прав на редактирование' });

    const data = { title, content, tags };

    if (access === 'owner' && isArchived !== undefined) data.isArchived = isArchived;
    await note.update(data);

    req.app.get('io')
      .to(`note:${note.id}`)
      .except(`user:${req.user.id}`)
      .emit('note:saved', { note: note.toJSON(), by: req.user.email });

    res.json({ ...note.toJSON(), permission: access });

  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
    try{ 
  
    const { note, access } = await getNoteAccess(req.params.id, req.user.id);

    if (!note || !access) return res.status(404).json({ error: 'Заметка не найдена' });
    if (access !== 'owner') return res.status(403).json({ error: 'Удалять может только владелец' });

    const id = note.id;
    await note.destroy();
    req.app.get('io').to(`note:${id}`).emit('note:deleted', { noteId: id, by: req.user.email });

    res.json({ message: 'Заметка успешно удалена'});
    
  } catch (error) {
    next(error);
  }
};