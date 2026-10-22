const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.get('/', noteController.getAllNotes);
router.get('/:id', noteController.getNoteById);
router.post('/', noteController.createNote);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

router.post('/:id/checklist', noteController.addChecklistItem);
router.patch('/:id/checklist/:itemId', noteController.updateChecklistItem);
router.delete('/:id/checklist/:itemId', noteController.deleteChecklistItem);

module.exports = router;