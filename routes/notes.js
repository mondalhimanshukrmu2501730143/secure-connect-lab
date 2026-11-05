// routes/notes.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { authenticateToken } = require('../middleware/auth');
const appEmitter = require('../eventEmitter');

// In-memory notes store
const notes = [];

// GET /api/notes - Retrieve notes owned by logged-in user
router.get('/', authenticateToken, (req, res) => {
  const userNotes = notes.filter((n) => n.owner === req.user.id);
  return res.status(200).json(userNotes);
});

// POST /api/notes - Create a new note
router.post('/', authenticateToken, (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'title and content are required' });
  }

  const timestamp = new Date().toISOString();
  const newNote = {
    _id: crypto.randomBytes(12).toString('hex'),
    title,
    content,
    owner: req.user.id,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  notes.push(newNote);
  appEmitter.emit('note:created', newNote);

  return res.status(201).json(newNote);
});

module.exports = router;