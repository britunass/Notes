const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  done: { type: Boolean, default: false }
});

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  isArchived: { type: Boolean, default: false },
  tags: { type: [String], default: [] },
  checklist: [checklistItemSchema],
  createdAt: { type: Date, default: Date.now }
});

noteSchema.index({ tags: 1 });

module.exports = mongoose.model('Note', noteSchema);