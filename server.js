require('dotenv').config();
const express = require('express');
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/auth');
const app = express();
const PORT = process.env.PORT || 5000;
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET не задан');
const http = require('http');
const initSocket = require('./socket');
const server = http.createServer(app);
const { sequelize } = require('./models');

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'db_unavailable' });
  }
});

app.use('/auth', authRoutes);

app.use('/notes', authMiddleware, noteRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.set('io', initSocket(server));
server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
