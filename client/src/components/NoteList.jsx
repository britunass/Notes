import React from 'react';
import { useNotesLogic } from '../hooks/useNotesLogic';
import { Notification } from './Notification';
import { NoteStats } from './NoteStats';
import { NoteSearch } from './NoteSearch';
import { NoteCard } from './NoteCard';
import { NoteEditor } from './NoteEditor';
import { NoteActions } from './NoteActions';

export function NoteList() {
  const {
    notes,
    selectedNote,
    selectedNoteId,
    isCreatingNew,
    isLoading,
    startCreate,
    selectNote,
    handleSave,
    handleDelete,
    handleToggleArchive,
    form,
    filter,
    notification
  } = useNotesLogic();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: '#666' }}>
        Загрузка...
      </div>
    );
  }
  
  const isArchived = selectedNote ? selectedNote.isArchived : false;

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px', fontFamily: 'sans-serif', position: 'relative' }}>
      <Notification text={notification.text} isError={notification.isError} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', alignItems: 'start' }}>
        
        <div>
          <NoteStats
            total={notes.length}
            active={notes.filter(n => !n.isArchived).length}
            archived={notes.filter(n => n.isArchived).length}
          />

          <NoteSearch
            searchQuery={filter.searchQuery}
            onSearchChange={filter.setSearchQuery}
            selectedTag={filter.selectedTag}
            onTagChange={filter.setSelectedTag}
            availableTags={filter.availableTags}
            showOnlyArchived={filter.showOnlyArchived}
            onToggleArchived={() => filter.setShowOnlyArchived(prev => !prev)}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filter.filteredNotes.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#888' }}>
                {filter.showOnlyArchived ? 'Архивированных заметок нет' : 'Заметки не найдены'}
              </p>
            ) : (
              filter.filteredNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isSelected={note.id === selectedNoteId && !isCreatingNew}
                  onSelect={selectNote}
                />
              ))
            )}
          </div>
        </div>

        <div>
          <div style={{ height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '15px' }}>
            <button
              onClick={startCreate}
              style={{
                background: 'none',
                border: 'none',
                color: '#0066cc',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: '0',
                textDecoration: 'underline',
                lineHeight: '1'
              }}
            >
              + Новая заметка
            </button>
          </div>

          <div style={{ height: '30px', marginBottom: '15px' }} />

          {(selectedNote || isCreatingNew) ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start' }}>
              <NoteEditor
                title={form.title}
                setTitle={form.setTitle}
                content={form.content}
                setContent={form.setContent}
                tags={form.tags}
                setTags={form.setTags}
                isArchived={isArchived}
              />

              <NoteActions
                isArchived={isArchived}
                isCreatingNew={isCreatingNew}
                onSave={handleSave}
                onToggleArchive={handleToggleArchive}
                onDelete={handleDelete}
              />
            </div>
          ) : (
            <div style={{ color: '#aaa', textAlign: 'center', marginTop: '60px', fontSize: '14px' }}>
               Выберите заметку слева или нажмите «+ Новая заметка»
            </div>
          )}
        </div>

      </div>
    </div>
  );
}