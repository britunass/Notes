import React from 'react';

export function NoteStats({ total, active, archived }) {
  return (
    <div style={{ height: '20px', display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
      <div style={{ fontSize: '11px', color: '#888', display: 'flex', gap: '8px', lineHeight: '1' }}>
        <span>Всего: <b>{total}</b></span>
        <span>•</span>
        <span>Активных: <b>{active}</b></span>
        <span>•</span>
        <span>В архиве: <b>{archived}</b></span>
      </div>
    </div>
  );
}