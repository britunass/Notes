import React, { useEffect, useRef, useState } from 'react';
import { glass } from './glass';

const triggers = {
  underline: {
    border: 'none',
    borderBottom: '1px solid #777',
    padding: '4px 2px',
    fontSize: '12px'
  },
  box: {
    border: '1px solid #777',
    borderRadius: '4px',
    padding: '6px 8px',
    fontSize: '12px'
  }
};

const ellipsis = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

function Item({ active, onClick, children, title }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...ellipsis,
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '12px',
        cursor: 'pointer',
        color: active ? '#fff' : '#cfcfcf',
        background: hover ? 'rgba(255,255,255,0.14)' : active ? 'rgba(255,255,255,0.08)' : 'transparent'
      }}
    >
      {children}
    </div>
  );
}

export function Dropdown({ value, options, onChange, variant = 'underline', style = {} }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: 'relative', ...style }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          ...triggers[variant],
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'transparent',
          color: 'inherit',
          cursor: 'pointer',
          outline: 'none',
          textAlign: 'left'
        }}
      >
        <span style={{ ...ellipsis, flex: 1, minWidth: 0 }}>{current?.label ?? ''}</span>
        <span style={{ fontSize: '10px', opacity: 0.7 }}>{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div
          style={{
            ...glass,
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            minWidth: '100%',
            width: 'max-content',
            maxWidth: '200px',
            maxHeight: '220px',
            overflowY: 'auto',
            padding: '4px',
            zIndex: 1000
          }}
        >
          {options.map(o => (
            <Item
              key={o.value}
              title={o.label}
              active={o.value === value}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
            </Item>
          ))}
        </div>
      )}
    </div>
  );
}