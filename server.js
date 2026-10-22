require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/notes', noteRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Некорректный ID' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
});