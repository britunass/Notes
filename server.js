const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


const { Note } = require('./models');

app.get('/notes', async (req, res) => {
  try {

    const notes = await Note.findAll();
    res.json(notes);

  } catch (error) {
    next(error);
  }
});

app.get('/notes/:id', async (req, res) => {
  try{

    const note = await Note.findByPk(req.params.id);

    if (!note) {
      return res.status(404).json({ error: 'Заметка с указанным ID не найдена' });
    }

    res.json(note);

  } catch {
    next(error);
  }
});

app.post('/notes', async (req, res) => {
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
});

app.put('/notes/:id', async (req, res) => {
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
});

app.delete('/notes/:id', async (req, res) => {
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
});

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен...`);
});