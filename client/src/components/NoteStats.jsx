import React from 'react';
import { Tooltip } from './Tooltip';

export function NoteStats({ total, active, archived, foreign = 0, mine = 0 }) {
  return (
    <div style={{ height: '20px', display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
      <div style={{ fontSize: '11px', color: '#888', display: 'flex', gap: '8px', lineHeight: '1', whiteSpace: 'nowrap' }}>
        <span>Всего: <b>{total}</b></span>
        <span>•</span>
        <span>Активных: <b>{active}</b></span>
        <span>•</span>
        <span>В архиве: <b>{archived}</b></span>
        <span>•</span>
        <Tooltip text="Заметки других пользователей, которыми поделились с вами">
          <span>👥 <b>{foreign}</b></span>
        </Tooltip>
        <Tooltip text="Ваши заметки, которыми вы поделились">
          <span>🔗 <b>{mine}</b></span>
        </Tooltip>
      </div>
    </div>
  );
}