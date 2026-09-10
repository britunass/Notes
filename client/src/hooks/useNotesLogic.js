import { useState, useEffect } from 'react';
import { useNotes } from './useNotes';
import { useNoteForm } from './useNoteForm';
import { useNoteFilter } from './useNoteFilter';

export function useNotesLogic() {
  const notesState = useNotes();
  const form = useNoteForm(notesState.selectedNote, notesState.isCreatingNew);
  const filter = useNoteFilter(notesState.notes);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ text: '', isError: false });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!notification.text) return;
    const timer = setTimeout(() => setNotification({ text: '', isError: false }), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  useEffect(() => {
    const activeCount = notesState.notes.filter(n => !n.isArchived).length;
    document.title = `Заметки (${activeCount})`;
  }, [notesState.notes]);

  const handleSave = () => {
    const data = form.getParsedFormData();
    if (!data.title || !data.content) {
      setNotification({ text: 'Заполните заголовок и текст заметки!', isError: true });
      return;
    }

    notesState.saveNote(data);
    setNotification({
      text: notesState.isCreatingNew ? 'Новая заметка сохранена!' : 'Изменения сохранены!',
      isError: false
    });
  };

  const handleDelete = () => {
    notesState.deleteNote();
    setNotification({ text: 'Заметка удалена!', isError: false });
  };

  const handleToggleArchive = () => {
    notesState.toggleArchive();
    setNotification({ text: 'Статус архивации изменен!', isError: false });
  };

  return {
    notes: notesState.notes,
    selectedNote: notesState.selectedNote,
    selectedNoteId: notesState.selectedNoteId,
    isCreatingNew: notesState.isCreatingNew,
    isLoading,
    startCreate: notesState.startCreate,
    selectNote: notesState.selectNote,
    handleSave,
    handleDelete,
    handleToggleArchive,
    form,
    filter,
    notification
  };
}