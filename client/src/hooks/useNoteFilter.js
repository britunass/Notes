import { useState, useMemo } from 'react';

const isForeign = (n) => !!n.permission && n.permission !== 'owner';
const isMine = (n) => !isForeign(n) && !!n.isShared;

export function useNoteFilter(notes) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('все');
  const [showOnlyArchived, setShowOnlyArchived] = useState(false);
  const [showForeign, setShowForeign] = useState(false);
  const [showMine, setShowMine] = useState(false);

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

      const matchesShare =
        (!showForeign && !showMine) ||
        (showForeign && isForeign(note)) ||
        (showMine && isMine(note));

      return matchesSearch && matchesTag && matchesArchive && matchesShare;
    });
  }, [notes, searchQuery, selectedTag, showOnlyArchived, showForeign, showMine]);

  return {
    searchQuery, setSearchQuery,
    selectedTag: activeTag,
    setSelectedTag,
    showOnlyArchived, setShowOnlyArchived,
    showForeign, setShowForeign,
    showMine, setShowMine,
    availableTags,
    filteredNotes
  };
}