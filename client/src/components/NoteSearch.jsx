import React from 'react';

export function NoteSearch({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagChange,
  availableTags,
  showOnlyArchived,
  onToggleArchived
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', height: '30px' }}>
      <input
        type="text"
        placeholder="Поиск..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        style={{
          flex: 1,
          border: 'none',
          borderBottom: '1px solid #777',
          background: 'transparent',
          padding: '4px 2px',
          fontSize: '13px',
          outline: 'none',
          color: 'inherit'
        }}
      />

      <select
        value={selectedTag}
        onChange={e => onTagChange(e.target.value)}
        style={{
          border: 'none',
          borderBottom: '1px solid #777',
          background: 'transparent',
          fontSize: '12px',
          padding: '4px 0',
          outline: 'none',
          color: 'inherit'
        }}
      >
        {availableTags.map(tag => (
          <option key={tag} value={tag} style={{ color: '#000' }}>
            #{tag}
          </option>
        ))}
      </select>

      <button
        onClick={onToggleArchived}
        style={{
          border: 'none',
          background: showOnlyArchived ? '#555' : 'transparent',
          cursor: 'pointer',
          borderRadius: '3px',
          padding: '2px 6px',
          fontSize: '13px'
        }}
        title={showOnlyArchived ? 'Показать активные' : 'Показать только архивированные'}
      >
        🗁
      </button>
    </div>
  );
}