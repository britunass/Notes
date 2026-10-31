import React from 'react';

export function NoteActions({ isArchived, isCreatingNew, readOnly, isOwner, onSave, onToggleArchive, onDelete, onLeave  }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '120px' }}>
      {!isArchived && !readOnly &&  (
        <button
          onClick={onSave}
          style={{
            background: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 14px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Сохранить
        </button>
      )}

      {!isOwner && (
        <button
          onClick={onLeave}
          style={{
            background: '#17a2b8',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 14px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Отключиться
        </button>
      )}

      {!isCreatingNew && isOwner &&  (
        <button
          onClick={onToggleArchive}
          style={{
            background: isArchived ? '#007bff' : '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 14px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          {isArchived ? 'Разархивировать' : 'В архив'}
        </button>
      )}

      {isOwner &&  (
        <button
          onClick={onDelete}
          style={{
            background: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 14px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          {isCreatingNew ? 'Отмена' : 'Удалить'}
        </button>
      )}
    </div>
  );
}