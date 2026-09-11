import { useState, useEffect, useCallback } from 'react';
import { fetchNotes, createNote, updateNote, deleteNote as apiDeleteNote } from '../api';

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Функция перезагрузки
  const loadNotes = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchNotes(signal ? { signal } : {});
      setNotes(response.data);
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        console.error(err);
        setError('Не удалось загрузить заметки с сервера');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Вызов при монтировании с AbortController
  useEffect(() => {
    const controller = new AbortController();
    loadNotes(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadNotes]);

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const startCreate = () => {
    setIsCreatingNew(true);
    setSelectedNoteId(null);
  };

  const selectNote = (id) => {
    setIsCreatingNew(false);
    setSelectedNoteId(id);
  };

  const saveNote = async (noteData) => {
    if (isCreatingNew) {
      const tempId = `temp-${Date.now()}`;
      const optimisticNote = {
        id: tempId,
        isArchived: false,
        createdAt: new Date().toISOString(),
        ...noteData
      };

      setNotes(prev => [optimisticNote, ...prev]);
      setSelectedNoteId(tempId);
      setIsCreatingNew(false);

      try {
        const response = await createNote(noteData);
        setNotes(prev => prev.map(n => (n.id === tempId ? response.data : n)));
        setSelectedNoteId(response.data.id);
      } catch (err) {
        setNotes(prev => prev.filter(n => n.id !== tempId));
        setSelectedNoteId(null);
        alert('Ошибка при сохранении заметки на сервере');
      }
    } else if (selectedNoteId) {
      const previousNotes = [...notes];

      setNotes(prev =>
        prev.map(n => (n.id === selectedNoteId ? { ...n, ...noteData } : n))
      );

      try {
        await updateNote(selectedNoteId, noteData);
      } catch (err) {
        setNotes(previousNotes);
        alert('Ошибка при обновлении заметки на сервере');
      }
    }
  };

  const deleteNote = async () => {
    if (isCreatingNew) {
      setIsCreatingNew(false);
    } else if (selectedNoteId) {
      const previousNotes = [...notes];
      const targetId = selectedNoteId;

      setNotes(prev => prev.filter(n => n.id !== targetId));
      setSelectedNoteId(null);

      try {
        await apiDeleteNote(targetId);
      } catch (err) {
        setNotes(previousNotes);
        setSelectedNoteId(targetId);
        alert('Ошибка при удалении заметки');
      }
    }
  };

  const toggleArchive = async () => {
    if (!selectedNoteId || isCreatingNew) return;

    const previousNotes = [...notes];
    const targetNote = notes.find(n => n.id === selectedNoteId);
    if (!targetNote) return;

    const updatedArchiveState = !targetNote.isArchived;

    setNotes(prev =>
      prev.map(n => (n.id === selectedNoteId ? { ...n, isArchived: updatedArchiveState } : n))
    );

    try {
      // Передаем весь объект targetNote с обновленным isArchived
      await updateNote(selectedNoteId, {
        ...targetNote,
        isArchived: updatedArchiveState
      });
    } catch (err) {
      setNotes(previousNotes);
      alert('Ошибка при изменении статуса архива');
    }
  };

  return {
    notes,
    loading,
    error,
    reloadNotes: () => loadNotes(),
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