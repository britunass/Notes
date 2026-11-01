const Note = require('../models/note');

exports.getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

exports.getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Заметка с указанным ID не найдена' });
    }
    res.json(note);
  } catch (error) {
    next(error);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    const { title, content, isArchived, tags, checklist } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Поля "title" и "content" обязательны для заполнения' });
    }
    const newNote = await Note.create({ title, content, isArchived, tags, checklist });
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const { title, content, isArchived, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Поля "title" и "content" обязательны для обновления' });
    }
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, isArchived, tags },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Заметка не найдена' });
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Заметка не найдена' });
    }
    res.json({ message: 'Заметка успешно удалена', note: deleted });
  } catch (error) {
    next(error);
  }
};


exports.addChecklistItem = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Поле "text" обязательно' });

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $push: { checklist: { text } } },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ error: 'Заметка не найдена' });
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

exports.updateChecklistItem = async (req, res, next) => {
  try {
    const { done } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, 'checklist._id': req.params.itemId },
      { $set: { 'checklist.$.done': done } },
      { new: true }
    );
    if (!note) return res.status(404).json({ error: 'Заметка или пункт не найдены' });
    res.json(note);
  } catch (error) {
    next(error);
  }
};

exports.deleteChecklistItem = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $pull: { checklist: { _id: req.params.itemId } } },
      { new: true }
    );
    if (!note) return res.status(404).json({ error: 'Заметка не найдена' });
    res.json(note);
  } catch (error) {
    next(error);
  }
};