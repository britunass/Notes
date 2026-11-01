const { Note, NoteShare, User } = require('../models');

exports.shareNote = async (req, res, next) => {
  try {
    const { email, permission = 'edit' } = req.body;
    if (!email || !['read', 'edit'].includes(permission)) {
      return res.status(400).json({ error: 'Укажите email и право (read или edit)' });
    }
    const note = await Note.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!note) return res.status(404).json({ error: 'Заметка не найдена или вы не владелец' });

    const target = await User.findOne({ where: { email } });
    if (!target) return res.status(404).json({ error: 'Пользователь с таким email не найден' });
    if (target.id === req.user.id) return res.status(400).json({ error: 'Нельзя поделиться с самим собой' });

    const [share, created] = await NoteShare.findOrCreate({
      where: { noteId: note.id, userId: target.id },
      defaults: { permission }
    });
    if (!created && share.permission !== permission) await share.update({ permission });

    const io = req.app.get('io');
    io.in(`user:${target.id}`).socketsLeave(`note:${note.id}`);
    io.to(`user:${target.id}`).emit('note:shared', {
      note: { ...note.toJSON(), permission, ownerEmail: req.user.email, isShared: true, participants: [req.user.email]},
      by: req.user.email
    });

    res.status(created ? 201 : 200).json({ noteId: note.id, email, permission });
  } catch (error) {
    next(error);
  }
};

exports.getShares = async (req, res, next) => {
  try {
    const note = await Note.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!note) return res.status(404).json({ error: 'Заметка не найдена или вы не владелец' });
    const shares = await NoteShare.findAll({
      where: { noteId: note.id },
      include: [{ model: User, attributes: ['id', 'email'] }]
    });
    res.json(shares.map(s => ({ userId: s.userId, email: s.User.email, permission: s.permission })));
  } catch (error) {
    next(error);
  }
};

exports.unshare = async (req, res, next) => {
  try {
    const note = await Note.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!note) return res.status(404).json({ error: 'Заметка не найдена или вы не владелец' });

    const deleted = await NoteShare.destroy({ where: { noteId: note.id, userId: req.params.userId } });
    if (!deleted) return res.status(404).json({ error: 'Доступ не найден' });

    const io = req.app.get('io');
    io.in(`user:${req.params.userId}`).socketsLeave(`note:${note.id}`);
    io.to(`user:${req.params.userId}`).emit('note:unshared', { noteId: note.id });
    res.json({ message: 'Доступ закрыт' });
  } catch (error) {
    next(error);
  }
};

exports.leave = async (req, res, next) => {
  try {
    const noteId = Number(req.params.id);
    const note = await Note.findByPk(noteId);
    if (!note) return res.status(404).json({ error: 'Заметка не найдена' });

    const deleted = await NoteShare.destroy({ where: { noteId, userId: req.user.id } });
    if (!deleted) return res.status(404).json({ error: 'Вы не подключены к этой заметке' });

    const io = req.app.get('io');
    io.in(`user:${req.user.id}`).socketsLeave(`note:${noteId}`);
    io.to(`note:${noteId}`).emit('presence:left', { noteId, email: req.user.email });
    io.to(`user:${note.userId}`).emit('note:share-changed', { noteId, email: req.user.email, removed: true });
    
    res.json({ message: 'Вы отключились от заметки' });
  } catch (error) {
    next(error);
  }
};