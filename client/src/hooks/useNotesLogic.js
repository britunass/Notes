import { useState, useEffect } from 'react';
import { useNotes } from './useNotes';
import { useNoteForm } from './useNoteForm';
import { useNoteFilter } from './useNoteFilter';
import { useNoteSocket } from './useNoteSocket';
import { leaveNote } from '../api';

export function useNotesLogic() {
  const notesState = useNotes();
  const form = useNoteForm(notesState.selectedNote, notesState.isCreatingNew);
  const filter = useNoteFilter(notesState.notes);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ text: '', isError: false });
  const [shareVersion, setShareVersion] = useState(0);

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

  const applyNoteToForm = (n) => {
    form.setTitle(n.title);
    form.setContent(n.content);
    form.setTags((n.tags || []).join(', '));
  };

  const live = useNoteSocket(
    notesState.isCreatingNew ? null : notesState.selectedNoteId,
    {
      onRemoteEdit: (patch) => {
        if (patch.title !== undefined) form.setTitle(patch.title);
        if (patch.content !== undefined) form.setContent(patch.content);
        if (patch.tags !== undefined) form.setTags(patch.tags);
      },
      onConnection: notify,
      onJoined: (note) => {
        if (note.id !== notesState.selectedNoteId) return;
        notesState.upsertNote({ ...notesState.selectedNote, ...note });
        applyNoteToForm(note);
      },
      onSaved: ({ note, by }) => {
        notesState.upsertNote(note);
        if (note.id === notesState.selectedNoteId) applyNoteToForm(note);
        notify(`${by} сохранил заметку`);
      },
      onDeleted: ({ noteId, by }) => { notesState.removeNote(noteId); notify(`${by} удалил заметку`, true); },
      onShared: ({ note, by }) => { notesState.upsertNote(note); notify(`${by} поделился с вами заметкой «${note.title}»`); },
      onShareChanged: ({ noteId, email, removed }) => {
        if (removed && email) {
          const n = notesState.notes.find(x => x.id === noteId);
          if (n) notesState.setNoteShared(noteId, (n.participants || []).filter(p => p !== email));
        }
        setShareVersion(v => v + 1);
      },
      onUnshared: ({ noteId }) => { notesState.removeNote(noteId); notify('Доступ к заметке закрыт', true); }
    }
  );

  const handleLeave = async () => {
    const id = notesState.selectedNoteId;
    if (!id) return;
    try {
      await leaveNote(id);
      notesState.removeNote(id);
      notify('Вы отключились от заметки');
    } catch (err) {
      notify(err.response?.data?.error || 'Не удалось отключиться', true);
    }
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
    notification,
    live,
    notify,
    handleLeave,
    shareVersion,
    setNoteShared: notesState.setNoteShared
  };
}