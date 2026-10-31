import React, { useEffect, useState } from 'react';
import { shareNote, fetchShares, unshareNote } from '../api';

const btn = {
  width: '100%',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '8px 14px',
  fontSize: '12px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const field = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #777',
  borderRadius: '4px',
  background: 'transparent',
  color: 'inherit',
  padding: '6px 8px',
  fontSize: '12px',
  outline: 'none'
};

export function ShareDialog({ noteId, online = [], refreshKey = 0, onMessage, onSharesChange }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('edit');
  const [shares, setShares] = useState([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const { data } = await fetchShares(noteId);
      setShares(data);
      onSharesChange?.(noteId, data.length > 0);
    } catch {
      setShares([]);
    }
  };

  useEffect(() => {
    setOpen(false);
    setEmail('');
  }, [noteId]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId, refreshKey]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await shareNote(noteId, { email, permission });
      setEmail('');
      await load();
      onMessage('Доступ выдан', false);
    } catch (err) {
      onMessage(err.response?.data?.error || 'Ошибка при выдаче доступа', true);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (userId) => {
    try {
      await unshareNote(noteId, userId);
      await load();
      onMessage('Доступ закрыт', false);
    } catch (err) {
      onMessage(err.response?.data?.error || 'Не удалось закрыть доступ', true);
    }
  };

  // свёрнуто: одна кнопка «Поделиться ▾»
  if (!open) {
    return (
      <button type="button" style={btn} onClick={() => setOpen(true)}>
        Поделиться ▾
      </button>
    );
  }

  // развёрнуто: стрелка вверх на месте кнопки, поля, список, внизу сама кнопка «Поделиться»
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <button type="button" style={btn} onClick={() => setOpen(false)} title="Свернуть">
        ▴
      </button>

      <input
        type="email"
        placeholder="email пользователя"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={field}
      />

      <select value={permission} onChange={e => setPermission(e.target.value)} style={field}>
        <option value="edit" style={{ backgroundColor: '#555', color: '#d0d0d0' }}>редактирование</option>
        <option value="read" style={{ backgroundColor: '#555', color: '#d0d0d0' }}>только чтение</option>
      </select>

      <div style={{ fontSize: '11px' }}>
        <div style={{ color: '#888', marginBottom: '4px' }}>Доступ выдан:</div>
        {shares.length === 0 && <div style={{ color: '#888' }}>пока никому</div>}
        {shares.map(s => (
          <div key={s.userId} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <span style={{ color: online.includes(s.email) ? '#28a745' : '#777' }}>●</span>
            <span style={{ flex: 1, wordBreak: 'break-all' }}>
              {s.email} ({s.permission === 'edit' ? 'ред.' : 'чтение'})
            </span>
            <button type="button" onClick={() => remove(s.userId)}
                    style={{ border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer' }}
                    title="Закрыть доступ">×</button>
          </div>
        ))}
      </div>

      <button type="submit" style={btn} disabled={busy}>Поделиться</button>
    </form>
  );
}