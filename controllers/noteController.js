const { Note, NoteShare, User } = require('../models');
const { getNoteAccess } = require('../utils/access');

exports.getAllNotes = async (req, res, next) => {
  try {

    const own = await Note.findAll(
      {
      where: { userId: req.user.id }
      }
    );
    const shares = await NoteShare.findAll({
      where: { userId: req.user.id },
      include: [{ model: Note, include: [{ model: User, as: 'owner', attributes: ['email'] }] }]
    });
    const shared = shares
    .filter(s => s.Note)
    .map(s => ({ ...s.Note.toJSON(), permission: s.permission, ownerEmail: s.Note.owner?.email }));

    res.json([...own.map(n => ({ ...n.toJSON(), permission: 'owner' })), ...shared]);

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

    } catch {
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

  } catch {
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

  } catch{
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
    
  } catch{
    next(error);
  }
};