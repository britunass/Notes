import React from 'react';

export function NoteCard({ note, isSelected, onSelect }) {
  const hasTags = note.tags && note.tags.length > 0;

  return (
    <div
      onClick={() => onSelect(note.id)}
      style={{
        backgroundColor: '#fff785',
        padding: '12px',
        borderRadius: '2px',
        boxShadow: isSelected ? '0 0 0 2px #4d90fe' : '2px 2px 5px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        opacity: note.isArchived ? 0.5 : 1,
        transition: 'all 0.15s ease',
        minHeight: '110px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        <div style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '13px', marginBottom: '6px', color: '#222' }}>
          {note.title}
        </div>
        <div style={{ fontSize: '12px', color: '#444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {note.content}
        </div>
      </div>

      <div style={{ fontSize: '10px', color: '#666', marginTop: '6px', minHeight: '15px' }}>
        {hasTags ? note.tags.map(t => `#${t}`).join(' ') : ''}
      </div>
    </div>
  );
}