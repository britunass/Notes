import React from 'react';

export function NotePresence({ online, typingUsers }) {
  if (online.length === 0) return null;
  return (
    <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px', textAlign: 'center' }}>
      <div>В заметке: {online.join(', ')}</div>
      {typingUsers.length > 0 && (
        <div style={{ fontStyle: 'italic' }}>{typingUsers.join(', ')} печатает…</div>
      )}
    </div>
  );
}