const { Note, NoteShare } = require('../models');

async function getNoteAccess(noteId, userId) {
  const note = await Note.findByPk(noteId);
  if (!note) return { note: null, access: null };
  if (note.userId === userId) return { note, access: 'owner' };
  const share = await NoteShare.findOne({ where: { noteId: note.id, userId } });
  return { note, access: share ? share.permission : null };
}

module.exports = { getNoteAccess };