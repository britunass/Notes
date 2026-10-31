import React from 'react';
import { Dropdown } from './Dropdown';
import { Tooltip } from './Tooltip';
import { PeopleFilter } from './PeopleFilter';

const toggleStyle = (active) => ({
  border: 'none',
  background: active ? '#555' : 'transparent',
  cursor: 'pointer',
  borderRadius: '3px',
  padding: '2px 6px',
  fontSize: '13px',
  flexShrink: 0
});

export function NoteSearch({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagChange,
  availableTags,
  showOnlyArchived,
  onToggleArchived,
  showForeign,
  onToggleForeign,
  showMine,
  onToggleMine,
  people,
  selectedPeople,
  onTogglePerson,
  onClearPeople
}) {
  const tagOptions = availableTags.map(tag => ({ value: tag, label: `#${tag}` }));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', height: '30px', width: '350px', maxWidth: '100%', boxSizing: 'border-box' }}>
      <input
        type="text"
        placeholder="Поиск..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        style={{
          flex: 1,
          minWidth: 0,
          border: 'none',
          borderBottom: '1px solid #777',
          background: 'transparent',
          padding: '4px 2px',
          fontSize: '13px',
          outline: 'none',
          color: 'inherit'
        }}
      />

      <Dropdown
        value={selectedTag}
        options={tagOptions}
        onChange={onTagChange}
        style={{ width: '90px', flexShrink: 0 }}
      />

      <PeopleFilter
        people={people}
        selected={selectedPeople}
        onToggle={onTogglePerson}
        onClear={onClearPeople}
      >
        <Tooltip text={showForeign ? 'Показать все заметки' : 'Только заметки, которыми поделились с вами'}>
          <button onClick={onToggleForeign} style={toggleStyle(showForeign)}>👥</button>
        </Tooltip>
        <Tooltip text={showMine ? 'Показать все заметки' : 'Только мои заметки, которыми я поделился'}>
          <button onClick={onToggleMine} style={toggleStyle(showMine)}>🔗</button>
        </Tooltip>
      </PeopleFilter>

      <Tooltip text={showOnlyArchived ? 'Показать активные' : 'Показать только архивированные'}>
        <button onClick={onToggleArchived} style={toggleStyle(showOnlyArchived)}>🗁</button>
      </Tooltip>
    </div>
  );
}