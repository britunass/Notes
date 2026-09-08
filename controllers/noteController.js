const { Note } = require('../models');

exports.getAllNotes = async (req, res, next) => {
  try {

    const notes = await Note.findAll();
    res.json(notes);

  } catch (error) {
    next(error);
  }
};

exports.getNoteById = async (req, res, next) => {
    try{

        const note = await Note.findByPk(req.params.id);

        if (!note) {
        return res.status(404).json({ error: 'Заметка с указанным ID не найдена' });
        }

        res.json(note);

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

    const newNote = await Note.create({ title, content, isArchived, tags });

    res.status(201).json(newNote);

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

    const [updatedRows] = await Note.update(
      { title, content, isArchived, tags },
      { where: { id: req.params.id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Заметка не найдена' });
    }

    const updatedNote = await Note.findByPk(req.params.id);

    res.json(updatedNote);

  } catch{
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
    try{ 
  
    const deletedRows = await Note.destroy({
        where: { id: req.params.id }
    });

    if (deletedRows === 0) {
        return res.status(404).json({ error: 'Заметка не найдена' });
      }

    res.json({ message: 'Заметка успешно удалена'});
    
  } catch{
    next(error);
  }
};