import React, { useState, useEffect } from 'react';
import { useNotes } from './hooks/useNotes';
import { NoteList } from './components/NoteList';
import { AuthForm } from './components/AuthForm';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLoginSuccess = () => {
    setToken(localStorage.getItem('token'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return <AuthForm onLoginSuccess={handleLoginSuccess} />;
  }

  return <MainNotesApp onLogout={handleLogout} />;
}

function MainNotesApp({ onLogout }) {
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
    <div style={{ display: 'inline-block', minWidth: '100%' }}>
      <div style={{
        width: '100%',                  
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '10px 20px',
        backgroundColor: '#1e1e1e',
        borderBottom: '1px solid #333'
      }}>
        <button
          onClick={onLogout}
          style={{
            padding: '6px 36px',
            backgroundColor: 'transparent', 
            color: '#dc3545', 
            border: '1px solid #dc3545', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#dc3545';
            e.target.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#dc3545';
          }}
        >
          Выйти
        </button>
      </div>

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