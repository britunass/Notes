import React, { useEffect, useState } from 'react';
import { shareNote, fetchShares, unshareNote } from '../api';
import { Dropdown } from './Dropdown';
import { Tooltip } from './Tooltip';

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

const roles = [
  { value: 'edit', label: 'редактирование' },
  { value: 'read', label: 'только чтение' }
];

function RemoveButton({ onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <Tooltip text="Закрыть доступ">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: '15px',
          lineHeight: 1,
          padding: '0 2px',
          color: hover ? '#ff4d4d' : 'inherit',
          transition: 'color 0.15s'
        }}
      >
        ×
      </button>
    </Tooltip>
  );
}

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

  if (!open) {
    return (
      <button type="button" style={btn} onClick={() => setOpen(true)}>
        Поделиться ▾
      </button>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Tooltip text="Свернуть">
        <button type="button" style={btn} onClick={() => setOpen(false)}>▴</button>
      </Tooltip>

      <input
        type="email"
        placeholder="email пользователя"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={field}
      />

      <Dropdown value={permission} options={roles} onChange={setPermission} variant="box" />

      <div style={{ fontSize: '11px' }}>
        <div style={{ color: '#888', marginBottom: '4px' }}>Доступ выдан:</div>
        {shares.length === 0 && <div style={{ color: '#888' }}>пока никому</div>}
        {shares.map(s => (
          <div key={s.userId} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <span style={{ color: online.includes(s.email) ? '#28a745' : '#777' }}>●</span>
            <span style={{ flex: 1, wordBreak: 'break-all' }}>
              {s.email} ({s.permission === 'edit' ? 'ред.' : 'чтение'})
            </span>
            <RemoveButton onClick={() => remove(s.userId)} />
          </div>
        ))}
      </div>

      <button type="submit" style={btn} disabled={busy}>Поделиться</button>
    </form>
  );
}