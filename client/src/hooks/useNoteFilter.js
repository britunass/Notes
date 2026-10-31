import { useState, useMemo } from 'react';

const isForeign = (n) => !!n.permission && n.permission !== 'owner';
const isMine = (n) => !isForeign(n) && !!n.isShared;

export function useNoteFilter(notes) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('все');
  const [showOnlyArchived, setShowOnlyArchived] = useState(false);
  const [showForeign, setShowForeign] = useState(false);
  const [showMine, setShowMine] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState([]);

  const availableTags = useMemo(() => {
    const tagsSet = new Set();
    notes.forEach(note =>
      note.tags?.forEach(tag => {
        if (tag !== 'все') tagsSet.add(tag);
      })
    );
    return ['все', ...Array.from(tagsSet)];
  }, [notes]);

  const activeTag = availableTags.includes(selectedTag) ? selectedTag : 'все';

  const people = useMemo(() => {
    const map = new Map();
    notes.forEach(n => (n.participants || []).forEach(p => map.set(p, (map.get(p) || 0) + 1)));
    return [...map.entries()]
      .map(([email, count]) => ({ email, count }))
      .sort((a, b) => a.email.localeCompare(b.email));
  }, [notes]);

  const activePeople = useMemo(
    () => selectedPeople.filter(p => people.some(x => x.email === p)),
    [selectedPeople, people]
  );

  const togglePerson = (email) =>
    setSelectedPeople(prev => (prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]));
  const clearPeople = () => setSelectedPeople([]);

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

      const matchesPeople =
        activePeople.length === 0 ||
        (note.participants || []).some(p => activePeople.includes(p));

      return matchesSearch && matchesTag && matchesArchive && matchesShare && matchesPeople;
    });
  }, [notes, searchQuery, activeTag, showOnlyArchived, showForeign, showMine, activePeople]);

  return {
    searchQuery, setSearchQuery,
    selectedTag: activeTag, setSelectedTag,
    showOnlyArchived, setShowOnlyArchived,
    showForeign, setShowForeign,
    showMine, setShowMine,
    people, activePeople, togglePerson, clearPeople,
    availableTags,
    filteredNotes
  };
}