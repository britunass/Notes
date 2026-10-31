import React, { useRef, useState } from 'react';
import { glass } from './glass';

function PersonRow({ person, checked, onToggle }) {
  const [hover, setHover] = useState(false);
  return (
    <label
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={person.email}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 6px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '12px',
        color: '#d0d0d0',
        background: hover ? 'rgba(255,255,255,0.12)' : 'transparent'
      }}
    >
      <input type="checkbox" checked={checked} onChange={onToggle} style={{ cursor: 'pointer' }} />
      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {person.email}
      </span>
      <span style={{ color: '#888', fontSize: '11px' }}>{person.count}</span>
    </label>
  );
}

export function PeopleFilter({ people, selected, onToggle, onClear, children }) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const disabled = people.length === 0;

  const enter = () => { clearTimeout(timer.current); setHover(true); };
  const leave = () => {
    timer.current = setTimeout(() => { setHover(false); setOpen(false); }, 200);
  };

  return (
    <div
      onMouseEnter={enter}
      onMouseLeave={leave}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}
    >
      {children}

      <button
        type="button"
        disabled={disabled}
        onMouseEnter={() => !disabled && setOpen(true)}
        onClick={() => !disabled && setOpen(o => !o)}
        style={{
          width: '14px',
          border: 'none',
          background: 'transparent',
          padding: 0,
          fontSize: '10px',
          cursor: disabled ? 'default' : 'pointer',
          color: selected.length > 0 ? '#4d90fe' : 'inherit',
          opacity: !disabled && (hover || selected.length > 0) ? 1 : 0,
          transition: 'opacity 0.15s'
        }}
      >
        {open ? '▴' : '▾'}
      </button>

      {open && (
        <div
          style={{
            ...glass,
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: '240px',
            maxHeight: '240px',
            overflowY: 'auto',
            padding: '6px',
            zIndex: 1000
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#999', padding: '2px 6px 6px' }}>
            <span>Общие заметки с:</span>
            {selected.length > 0 && (
              <span onClick={onClear} style={{ cursor: 'pointer', color: '#4d90fe' }}>сбросить</span>
            )}
          </div>
          {people.map(p => (
            <PersonRow
              key={p.email}
              person={p}
              checked={selected.includes(p.email)}
              onToggle={() => onToggle(p.email)}
            />
          ))}
        </div>
      )}
    </div>
  );
}