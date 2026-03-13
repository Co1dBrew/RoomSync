const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');

const router = express.Router();

// GET /api/groups – list all groups
router.get('/', async (_req, res) => {
  try {
    const db = getDb();
    const groups = await db.collection('groups').find({}).toArray();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/groups/seed – seed default groups if empty
router.post('/seed', async (_req, res) => {
  try {
    const db = getDb();
    const count = await db.collection('groups').countDocuments();
    if (count > 0) {
      return res.json({ message: 'Groups already exist.' });
    }

    const defaultGroups = [
      {
        name: 'Room A',
        members: ['Alice', 'Bob', 'Charlie', 'Diana'],
        createdAt: new Date(),
      },
      {
        name: 'Room B',
        members: ['Ethan', 'Fiona', 'Grace', 'Henry'],
        createdAt: new Date(),
      },
    ];

    const result = await db.collection('groups').insertMany(defaultGroups);
    res.status(201).json({ insertedCount: result.insertedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/groups/:id – update group members
router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    const updates = {};
    if (Array.isArray(req.body.members)) {
      updates.members = req.body.members;
    }
    if (req.body.name !== undefined) {
      updates.name = req.body.name;
    }
    const result = await db
      .collection('groups')
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: updates },
        { returnDocument: 'after' },
      );

    if (!result) return res.status(404).json({ error: 'Group not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
