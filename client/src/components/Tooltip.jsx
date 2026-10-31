import React, { useState } from 'react';
import { glass } from './glass';

export function Tooltip({ text, children }) {
  const [pos, setPos] = useState(null);

  const show = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(r.left + r.width / 2, 110), window.innerWidth - 110);
    setPos({ x, y: r.bottom + 6 });
  };

  return (
    <span
      style={{ display: 'inline-block' }}
      onMouseEnter={show}
      onMouseLeave={() => setPos(null)}
    >
      {children}
      {pos && text && (
        <span
          style={{
            ...glass,
            position: 'fixed',
            left: pos.x,
            top: pos.y,
            transform: 'translateX(-50%)',
            width: 'max-content',
            maxWidth: '220px',
            padding: '5px 10px',
            fontSize: '11px',
            lineHeight: 1.35,
            color: '#e0e0e0',
            fontWeight: 'normal',
            textAlign: 'center',
            whiteSpace: 'normal',
            pointerEvents: 'none',
            zIndex: 2000
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}