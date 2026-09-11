import { useState, useMemo } from 'react';

export function useNoteFilter(notes) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('все');
  const [showOnlyArchived, setShowOnlyArchived] = useState(false);

  const availableTags = useMemo(() => {
    const tagsSet = new Set();
    notes.forEach(note => note.tags?.forEach(tag => tagsSet.add(tag)));
    return ['все', ...Array.from(tagsSet)];
  }, [notes]);

  const activeTag = availableTags.includes(selectedTag) ? selectedTag : 'все';

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = activeTag === 'все' || note.tags?.includes(activeTag);
      const matchesArchive = showOnlyArchived ? note.isArchived : !note.isArchived;

      return matchesSearch && matchesTag && matchesArchive;
    });
  }, [notes, searchQuery, selectedTag, showOnlyArchived]);

  return {
    searchQuery, setSearchQuery,
    selectedTag: activeTag,
    setSelectedTag,
    showOnlyArchived, setShowOnlyArchived,
    availableTags,
    filteredNotes
  };
}