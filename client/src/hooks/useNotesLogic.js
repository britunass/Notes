import { useState, useEffect } from 'react';
import { useNotes } from './useNotes';
import { useNoteForm } from './useNoteForm';
import { useNoteFilter } from './useNoteFilter';
import { useNoteSocket } from './useNoteSocket';

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

  const notify = (text, isError = false) => setNotification({ text, isError });

  const live = useNoteSocket(
    notesState.isCreatingNew ? null : notesState.selectedNoteId,
    {
      // правки других применяем прямо в поля формы, не через notes
      onRemoteEdit: (patch) => {
        if (patch.title !== undefined) form.setTitle(patch.title);
        if (patch.content !== undefined) form.setContent(patch.content);
        if (patch.tags !== undefined) form.setTags(patch.tags);
      },
      onConnection: notify,
      onSaved: ({ note, by }) => { notesState.upsertNote(note); notify(`${by} сохранил заметку`); },
      onDeleted: ({ noteId, by }) => { notesState.removeNote(noteId); notify(`${by} удалил заметку`, true); },
      onShared: ({ note, by }) => { notesState.upsertNote(note); notify(`${by} поделился с вами заметкой «${note.title}»`); },
      onUnshared: ({ noteId }) => { notesState.removeNote(noteId); notify('Доступ к заметке закрыт', true); }
    }
  );

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
    notification,
    live,
    notify
  };
}