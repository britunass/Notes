import { useEffect, useRef, useState, useCallback } from 'react';
import { socket } from '../socket';

export function useNoteSocket(noteId, handlers) {
  const [online, setOnline] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  const h = useRef(handlers);
  h.current = handlers;                       // всегда актуальные колбэки
  const noteIdRef = useRef(noteId);
  noteIdRef.current = noteId;
  const joinRef = useRef(null);
  const typingTimer = useRef(null);
  const isTypingRef = useRef(false);

  // Соединение и события, не привязанные к конкретной заметке
  useEffect(() => {
    socket.connect();

    const onShared = (p) => {
      h.current.onShared?.(p);
      if (p.note.id === noteIdRef.current) joinRef.current?.();   // право изменилось: зайти заново
    };
    const onUnshared = (p) => h.current.onUnshared?.(p);
    const onSaved = (p) => h.current.onSaved?.(p);
    const onDeleted = (p) => h.current.onDeleted?.(p);
    const onDisconnect = (reason) => {
      if (reason !== 'io client disconnect') h.current.onConnection?.('Соединение потеряно...', true);
    };
    const onReconnect = () => h.current.onConnection?.('Соединение восстановлено', false);
    const onConnectError = (err) => {
      if (err.message === 'token_expired' || err.message === 'unauthorized') {
        localStorage.removeItem('token');
        window.location.reload();
      }
    };

    socket.on('note:shared', onShared);
    socket.on('note:unshared', onUnshared);
    socket.on('note:saved', onSaved);
    socket.on('note:deleted', onDeleted);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.io.on('reconnect', onReconnect);

    return () => {
      socket.off('note:shared', onShared);
      socket.off('note:unshared', onUnshared);
      socket.off('note:saved', onSaved);
      socket.off('note:deleted', onDeleted);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.io.off('reconnect', onReconnect);
      socket.disconnect();
    };
  }, []);

  // Комната текущей заметки
  useEffect(() => {
    setOnline([]);
    setTypingUsers([]);
    if (!noteId || String(noteId).startsWith('temp-')) return;

    const join = () => {
      socket.emit('note:join', { noteId }, (res) => {
        if (res?.ok) setOnline(res.users);
        else h.current.onConnection?.(res?.error || 'Не удалось подключиться к заметке', true);
      });
    };
    joinRef.current = join;
    if (socket.connected) join();
    socket.on('connect', join);               // после переподключения заходим в комнату заново

    const onEdited = ({ noteId: id, patch, by }) => {
      if (id === noteId) h.current.onRemoteEdit?.(patch, by);
    };
    const onPresenceJoined = ({ noteId: id, email }) => {
      if (id !== noteId) return;
      setOnline(prev => (prev.includes(email) ? prev : [...prev, email]));
      h.current.onConnection?.(`${email} подключился к заметке`, false);
    };
    const onPresenceLeft = ({ noteId: id, email }) => {
      if (id !== noteId) return;
      setOnline(prev => prev.filter(e => e !== email));
      setTypingUsers(prev => prev.filter(e => e !== email));
      h.current.onConnection?.(`${email} отключился от заметки`, false);
    };
    const onTyping = ({ noteId: id, email, isTyping }) => {
      if (id !== noteId) return;
      setTypingUsers(prev => {
        const without = prev.filter(e => e !== email);
        return isTyping ? [...without, email] : without;
      });
    };

    socket.on('note:edited', onEdited);
    socket.on('presence:joined', onPresenceJoined);
    socket.on('presence:left', onPresenceLeft);
    socket.on('note:typing', onTyping);

    return () => {
      socket.emit('note:leave', { noteId });
      socket.off('connect', join);
      socket.off('note:edited', onEdited);
      socket.off('presence:joined', onPresenceJoined);
      socket.off('presence:left', onPresenceLeft);
      socket.off('note:typing', onTyping);
      joinRef.current = null;
    };
  }, [noteId]);

  const sendEdit = useCallback((patch) => {
    if (noteIdRef.current && socket.connected) socket.emit('note:edit', { noteId: noteIdRef.current, patch });
  }, []);

  // typing: true при первом нажатии, false через 1.5 с тишины
  const sendTyping = useCallback(() => {
    const id = noteIdRef.current;
    if (!id || !socket.connected) return;
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit('note:typing', { noteId: id, isTyping: true });
    }
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit('note:typing', { noteId: id, isTyping: false });
    }, 1500);
  }, []);

  return { online, typingUsers, sendEdit, sendTyping };
}