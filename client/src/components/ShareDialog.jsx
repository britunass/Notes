import React, { useEffect, useState } from 'react';
import { shareNote, fetchShares, unshareNote } from '../api';

export function ShareDialog({ noteId, onMessage }) {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('edit');
  const [shares, setShares] = useState([]);

  const load = () =>
    fetchShares(noteId).then(r => setShares(r.data)).catch(() => setShares([]));

  useEffect(() => { load(); }, [noteId]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await shareNote(noteId, { email, permission });
      setEmail('');
      load();
      onMessage('Доступ выдан', false);
    } catch (err) {
      onMessage(err.response?.data?.error || 'Ошибка при выдаче доступа', true);
    }
  };

  const remove = async (userId) => {
    await unshareNote(noteId, userId);
    load();
    onMessage('Доступ закрыт', false);
  };

  return (
    <div style={{ marginTop: '20px', fontSize: '12px' }}>
      <form onSubmit={submit} style={{ display: 'flex', gap: '6px' }}>
        <input type="email" placeholder="email пользователя" value={email}
               onChange={e => setEmail(e.target.value)} required style={{ flex: 1 }} />
        <select value={permission} onChange={e => setPermission(e.target.value)}>
          <option value="edit">редактирование</option>
          <option value="read">чтение</option>
        </select>
        <button type="submit">Поделиться</button>
      </form>
      {shares.map(s => (
        <div key={s.userId} style={{ marginTop: '6px' }}>
          {s.email} ({s.permission === 'edit' ? 'редактирует' : 'читает'}){' '}
          <button onClick={() => remove(s.userId)}>×</button>
        </div>
      ))}
    </div>
  );
}