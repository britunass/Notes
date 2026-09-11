import React from 'react';
import { useNotes } from './hooks/useNotes';
import { NoteList } from './components/NoteList';

function App() {
  const {
    notes,
    loading,
    error,
    reloadNotes,
    selectedNote,
    selectedNoteId,
    isCreatingNew,
    startCreate,
    selectNote,
    saveNote,
    deleteNote,
    toggleArchive
  } = useNotes();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        color: '#ccc',
        fontSize: '16px'
      }}>
        <div>Загрузка заметок с сервера... </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        color: '#ff6b6b',
        gap: '12px'
      }}>
        <div>{error}</div>
        <button 
          onClick={reloadNotes}
          style={{
            padding: '8px 16px',
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Повторить попытку
        </button>
      </div>
    );
  }

  return (
    <div>
      <NoteList 
        notes={notes}
        selectedNote={selectedNote}
        selectedNoteId={selectedNoteId}
        isCreatingNew={isCreatingNew}
        onStartCreate={startCreate}
        onSelectNote={selectNote}
        onSaveNote={saveNote}
        onDeleteNote={deleteNote}
        onToggleArchive={toggleArchive}
      />
    </div>
  );
}

export default App;