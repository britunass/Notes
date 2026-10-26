const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const shareController = require('../controllers/shareController');

router.get('/', noteController.getAllNotes);
router.get('/:id', noteController.getNoteById);
router.post('/', noteController.createNote);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

router.get('/:id/share', shareController.getShares);
router.post('/:id/share', shareController.shareNote);
router.delete('/:id/share/:userId', shareController.unshare);

module.exports = router;