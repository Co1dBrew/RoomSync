const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');

const router = express.Router();

// GET /api/chores – list all chores
router.get('/', async (_req, res) => {
  try {
    const db = getDb();
    const chores = await db
      .collection('chores')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(chores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/chores/:id – get one chore
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const chore = await db
      .collection('chores')
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!chore) return res.status(404).json({ error: 'Chore not found' });
    res.json(chore);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chores – create a new chore
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const newChore = {
      title: req.body.title,
      description: req.body.description || '',
      assignedTo: req.body.assignedTo || '',
      dueDate: req.body.dueDate || null,
      status: req.body.status || 'pending',
      priority: req.body.priority || 'medium',
      createdAt: new Date(),
    };
    const result = await db.collection('chores').insertOne(newChore);
    res.status(201).json({ ...newChore, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/chores/:id – update a chore
router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    const updates = {};
    const allowedFields = [
      'title',
      'description',
      'assignedTo',
      'dueDate',
      'status',
      'priority',
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    const result = await db
      .collection('chores')
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: updates },
        { returnDocument: 'after' },
      );
    if (!result) return res.status(404).json({ error: 'Chore not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/chores/:id – delete a chore
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const result = await db
      .collection('chores')
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: 'Chore not found' });
    res.json({ message: 'Chore deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
