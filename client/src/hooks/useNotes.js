import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useNotes() {
  const [notes, setNotes] = useLocalStorage('app_notes_data', []);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const startCreate = () => {
    setIsCreatingNew(true);
    setSelectedNoteId(null);
  };

  const selectNote = (id) => {
    setIsCreatingNew(false);
    setSelectedNoteId(id);
  };

  const saveNote = (noteData) => {
    if (isCreatingNew) {
      const newNote = {
        id: Date.now(),
        isArchived: false,
        createdAt: new Date().toISOString(),
        ...noteData
      };
      setNotes(prev => [newNote, ...prev]);
      setSelectedNoteId(newNote.id);
      setIsCreatingNew(false);
    } else if (selectedNoteId) {
      setNotes(prev =>
        prev.map(n => (n.id === selectedNoteId ? { ...n, ...noteData } : n))
      );
    }
  };

  const deleteNote = () => {
    if (isCreatingNew) {
      setIsCreatingNew(false);
    } else if (selectedNoteId) {
      setNotes(prev => prev.filter(n => n.id !== selectedNoteId));
      setSelectedNoteId(null);
    }
  };

  const toggleArchive = () => {
    if (!selectedNoteId || isCreatingNew) return;
    setNotes(prev =>
      prev.map(n => (n.id === selectedNoteId ? { ...n, isArchived: !n.isArchived } : n))
    );
  };

  return {
    notes,
    selectedNote,
    selectedNoteId,
    isCreatingNew,
    startCreate,
    selectNote,
    saveNote,
    deleteNote,
    toggleArchive
  };
}