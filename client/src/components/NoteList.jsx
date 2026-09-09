import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function NoteList() {
  const [notes, setNotes] = useLocalStorage('app_notes_data');

  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('все');
  const [showOnlyArchived, setShowOnlyArchived] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ text: '', isError: false });

  const textareaRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [editContent, selectedNoteId, isCreatingNew]);

  useEffect(() => {
    if (selectedNoteId && !isCreatingNew) {
      const current = notes.find(n => n.id === selectedNoteId);
      if (current) {
        setEditTitle(current.title);
        setEditContent(current.content);
        setEditTags(current.tags ? current.tags.join(', ') : '');
      }
    }
  }, [selectedNoteId, notes, isCreatingNew]);

  useEffect(() => {
    const activeCount = notes.filter(n => !n.isArchived).length;
    document.title = `Заметки (${activeCount})`;
  }, [notes]);

  useEffect(() => {
    if (!notification.text) return;
    const timer = setTimeout(() => setNotification({ text: '', isError: false }), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  const availableTags = useMemo(() => {
    const tagsSet = new Set();
    notes.forEach(note => note.tags?.forEach(tag => tagsSet.add(tag)));
    return ['все', ...Array.from(tagsSet)];
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag =
        selectedTag === 'все' || note.tags?.includes(selectedTag);

      const matchesArchive = showOnlyArchived ? note.isArchived : !note.isArchived;

      return matchesSearch && matchesTag && matchesArchive;
    });
  }, [notes, searchQuery, selectedTag, showOnlyArchived]);

  const handleStartCreateNew = () => {
    setIsCreatingNew(true);
    setSelectedNoteId(null);
    setEditTitle('');
    setEditContent('');
    setEditTags('');
  };

  const handleSelectNote = (id) => {
    setIsCreatingNew(false);
    setSelectedNoteId(id);
  };

  const handleSave = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      setNotification({
        text: '⚠️ Заполните заголовок и текст заметки!',
        isError: true
      });
      return;
    }

    const parsedTags = editTags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    if (isCreatingNew) {
      const newNote = {
        id: Date.now(),
        title: editTitle.trim(),
        content: editContent.trim(),
        isArchived: false,
        tags: parsedTags,
        createdAt: new Date().toISOString()
      };
      setNotes(prev => [newNote, ...prev]);
      setSelectedNoteId(newNote.id);
      setIsCreatingNew(false);
      setNotification({ text: 'Новая заметка сохранена!', isError: false });
    } else if (selectedNoteId) {
      setNotes(prev =>
        prev.map(note =>
          note.id === selectedNoteId
            ? { ...note, title: editTitle.trim(), content: editContent.trim(), tags: parsedTags }
            : note
        )
      );
      setNotification({ text: 'Изменения сохранены!', isError: false });
    }
  };

  const handleDelete = () => {
    if (isCreatingNew) {
      setIsCreatingNew(false);
      setEditTitle('');
      setEditContent('');
      setEditTags('');
      return;
    }

    if (selectedNoteId) {
      setNotes(prev => prev.filter(note => note.id !== selectedNoteId));
      setSelectedNoteId(null);
      setNotification({ text: 'Заметка удалена!', isError: false });
    }
  };

  const toggleArchive = () => {
    if (isCreatingNew || !selectedNoteId) return;

    setNotes(prev =>
      prev.map(note =>
        note.id === selectedNoteId ? { ...note, isArchived: !note.isArchived } : note
      )
    );
    setNotification({ text: 'Статус архивации изменен!', isError: false });
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: '#666' }}>
         Загрузка...
      </div>
    );
  }

  const selectedNote = notes.find(n => n.id === selectedNoteId);
  const isArchived = selectedNote ? selectedNote.isArchived : false;

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px', fontFamily: 'sans-serif', position: 'relative' }}>

      {notification.text && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 18px',
            backgroundColor: notification.isError ? '#f8d7da' : '#d4edda',
            color: notification.isError ? '#721c24' : '#155724',
            border: `1px solid ${notification.isError ? '#f5c6cb' : '#c3e6cb'}`,
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '13px',
            fontWeight: 'bold',
            zIndex: 1000
          }}
        >
          {notification.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', alignItems: 'start' }}>
        
        <div>
          <div style={{ height: '20px', display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ fontSize: '11px', color: '#888', display: 'flex', gap: '8px', lineHeight: '1' }}>
              <span>Всего: <b>{notes.length}</b></span>
              <span>•</span>
              <span>Активных: <b>{notes.filter(n => !n.isArchived).length}</b></span>
              <span>•</span>
              <span>В архиве: <b>{notes.filter(n => n.isArchived).length}</b></span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', height: '30px' }}>
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
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
              onChange={e => setSelectedTag(e.target.value)}
              style={{ border: 'none', borderBottom: '1px solid #777', background: 'transparent', fontSize: '12px', padding: '4px 0', outline: 'none', color: 'inherit' }}
            >
              {availableTags.map(tag => (
                <option key={tag} value={tag} style={{ color: '#000' }}>#{tag}</option>
              ))}
            </select>

            <button
              onClick={() => setShowOnlyArchived(prev => !prev)}
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
              📥
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredNotes.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#888' }}>
                {showOnlyArchived ? 'Архивированных заметок нет' : 'Заметки не найдены'}
              </p>
            ) : (
              filteredNotes.map(note => {
                const isSelected = note.id === selectedNoteId && !isCreatingNew;
                const hasTags = note.tags && note.tags.length > 0;
                return (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note.id)}
                    style={{
                      backgroundColor: '#fff785',
                      padding: '12px',
                      borderRadius: '2px',
                      boxShadow: isSelected ? '0 0 0 2px #4d90fe' : '2px 2px 5px rgba(0,0,0,0.2)',
                      cursor: 'pointer',
                      opacity: note.isArchived ? 0.5 : 1,
                      transition: 'all 0.15s ease',
                      minHeight: '110px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '13px', marginBottom: '6px', color: '#222' }}>
                        {note.title || 'Без названия'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {note.content || 'Пусто...'}
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '6px', minHeight: '15px' }}>
                      {hasTags ? note.tags.map(t => `#${t}`).join(' ') : ''}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div>
          <div style={{ height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '15px' }}>
            <button
              onClick={handleStartCreateNew}
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
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '20px',
                alignItems: 'start'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    backgroundColor: '#fff785',
                    padding: '20px',
                    borderRadius: '2px',
                    boxShadow: '4px 4px 12px rgba(0,0,0,0.2)',
                    minWidth: '280px',
                    maxWidth: '320px',
                    minHeight: '280px',
                    height: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    boxSizing: 'border-box',
                    opacity: isArchived ? 0.65 : 1
                  }}
                >
                  <div>
                    <input
                      type="text"
                      value={editTitle}
                      disabled={isArchived}
                      onChange={e => setEditTitle(e.target.value)}
                      placeholder="Заголовок..."
                      style={{
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        outline: 'none',
                        marginBottom: '15px',
                        color: '#222'
                      }}
                    />

                    <textarea
                      ref={textareaRef}
                      value={editContent}
                      disabled={isArchived}
                      onChange={e => {
                        setEditContent(e.target.value);
                        adjustTextareaHeight();
                      }}
                      placeholder={isArchived ? 'Заметка в архиве (редактирование недоступно)' : 'Текст заметки...'}
                      rows={8}
                      style={{
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '13px',
                        outline: 'none',
                        resize: 'none',
                        overflow: 'hidden',
                        fontFamily: 'inherit',
                        color: '#333'
                      }}
                    />
                  </div>

                  <input
                    type="text"
                    value={editTags}
                    disabled={isArchived}
                    onChange={e => setEditTags(e.target.value)}
                    placeholder="теги через запятую"
                    style={{
                      width: '100%',
                      border: 'none',
                      borderTop: '1px dashed #dcd356',
                      background: 'transparent',
                      fontSize: '11px',
                      outline: 'none',
                      paddingTop: '8px',
                      color: '#555'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '120px' }}>
                {!isArchived && (
                  <button
                    onClick={handleSave}
                    style={{
                      background: '#28a745',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 14px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Сохранить
                  </button>
                )}

                {!isCreatingNew && (
                  <button
                    onClick={toggleArchive}
                    style={{
                      background: isArchived ? '#007bff' : '#6c757d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 14px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {isArchived ? 'Разархивировать' : 'В архив'}
                  </button>
                )}

                <button
                  onClick={handleDelete}
                  style={{
                    background: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {isCreatingNew ? 'Отмена' : 'Удалить'}
                </button>
              </div>

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