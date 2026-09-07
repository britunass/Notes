const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


let notes = [
  {
    id: 1,
    title: 'Дама с камелиями',
    content: '# Заголовок\n\nПрочитать биографию **Александра Дюма-сына** и *Мари Дюплесси*.',
    tags: ['литература', 'читать', 'развитие'],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Купить:',
    content: '- Яблоки\n- Бананы\n- Виноград',
    tags: ['важное', 'покупки', 'продукты'],
    createdAt: new Date().toISOString()
  }
];

let nextId = 3;

app.get('/notes', (req, res) => {
  res.json(notes);
});

app.get('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const note = notes.find(n => n.id === id);

  if (!note) {
    return res.status(404).json({ error: 'Заметка с указанным ID не найдена' });
  }

  res.json(note);
});

app.post('/notes', (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Поля "title" и "content" обязательны для заполнения' });
  }

  const newNote = {
    id: nextId++,
    title,
    content,
    tags: Array.isArray(tags) ? tags : [],
    createdAt: new Date().toISOString()
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

app.put('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const noteIndex = notes.findIndex(n => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Заметка с указанным ID не найдена' });
  }

  const { title, content, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Поля "title" и "content" обязательны для обновления' });
  }

  notes[noteIndex] = {
    ...notes[noteIndex],
    title,
    content,
    tags: Array.isArray(tags) ? tags : [],
    updatedAt: new Date().toISOString()
  };

  res.json(notes[noteIndex]);
});

app.delete('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const noteIndex = notes.findIndex(n => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Заметка с указанным ID не найдена' });
  }

  const deletedNote = notes.splice(noteIndex, 1)[0];
  res.json({ message: 'Заметка успешно удалена', deletedNote });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});