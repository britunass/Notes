import { useState, useEffect } from 'react';

export function useNoteForm(selectedNote, isCreatingNew) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (isCreatingNew) {
      setTitle('');
      setContent('');
      setTags('');
    } else if (selectedNote) {
      setTitle(selectedNote.title || '');
      setContent(selectedNote.content || '');
      setTags(selectedNote.tags ? selectedNote.tags.join(', ') : '');
    }
  }, [selectedNote, isCreatingNew]);

  const getParsedFormData = () => {
    const parsedTags = tags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    return {
      title: title.trim(),
      content: content.trim(),
      tags: parsedTags
    };
  };

  return {
    title, setTitle,
    content, setContent,
    tags, setTags,
    getParsedFormData
  };
}