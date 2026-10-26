const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { getNoteAccess } = require('./utils/access');

const SECRET = process.env.JWT_SECRET || 'super_secret_key_notes_app';
const roomOf = (noteId) => `note:${noteId}`;

module.exports = function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' },
    maxHttpBufferSize: 1e6            // ограничение размера одного сообщения (1 МБ)
  });

  // Защита: без валидного JWT соединение не устанавливается
  io.use((socket, next) => {
    try {
      socket.data.user = jwt.verify(socket.handshake.auth.token, SECRET);
      socket.data.access = {};        // noteId -> право в этой комнате
      next();
    } catch (err) {
      next(new Error(err.name === 'TokenExpiredError' ? 'token_expired' : 'unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const { id: userId, email } = socket.data.user;
    console.log('User connected', socket.id, email);
    socket.join(`user:${userId}`);    // личная комната для персональных уведомлений

    // Вход в комнату заметки (с подтверждением через acknowledgement)
    socket.on('note:join', async ({ noteId } = {}, ack) => {
      try {
        const id = Number(noteId);
        if (!Number.isInteger(id)) return ack?.({ ok: false, error: 'Некорректный ID' });

        const { access } = await getNoteAccess(id, userId);
        if (!access) return ack?.({ ok: false, error: 'Нет доступа к заметке' });

        socket.join(roomOf(id));
        socket.data.access[id] = access;
        socket.to(roomOf(id)).emit('presence:joined', { noteId: id, email });

        const sockets = await io.in(roomOf(id)).fetchSockets();
        const users = [...new Set(sockets.map(s => s.data.user.email))];
        ack?.({ ok: true, access, users });
      } catch (err) {
        console.error(err);
        ack?.({ ok: false, error: 'Ошибка сервера' });
      }
    });

    socket.on('note:leave', ({ noteId } = {}) => {
      const id = Number(noteId);
      if (!socket.rooms.has(roomOf(id))) return;
      socket.leave(roomOf(id));
      socket.to(roomOf(id)).emit('presence:left', { noteId: id, email });
    });

    // Живая правка: всем в комнате, кроме отправителя
    socket.on('note:edit', ({ noteId, patch } = {}) => {
      const id = Number(noteId);
      if (!socket.rooms.has(roomOf(id))) return;
      if (!['owner', 'edit'].includes(socket.data.access[id])) return;   // read-only не правит
      const { title, content, tags } = patch || {};
      if (typeof content === 'string' && content.length > 20000) return; // защита от гигантских правок
      socket.to(roomOf(id)).emit('note:edited', { noteId: id, patch: { title, content, tags }, by: email });
    });

    // «Печатает…» без отправки текста
    socket.on('note:typing', ({ noteId, isTyping } = {}) => {
      const id = Number(noteId);
      if (!socket.rooms.has(roomOf(id))) return;
      socket.to(roomOf(id)).emit('note:typing', { noteId: id, email, isTyping: !!isTyping });
    });

    // 'disconnecting' срабатывает, пока socket.rooms ещё заполнен
    socket.on('disconnecting', () => {
      for (const room of socket.rooms) {
        if (room.startsWith('note:')) {
          socket.to(room).emit('presence:left', { noteId: Number(room.slice(5)), email });
        }
      }
    });

    socket.on('disconnect', (reason) => console.log('User disconnected', socket.id, reason));
  });

  return io;
};