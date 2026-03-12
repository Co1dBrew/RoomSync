const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connection');

const router = express.Router();

// GET /api/expenses – list all expenses
router.get('/', async (_req, res) => {
  try {
    const db = getDb();
    const expenses = await db
      .collection('expenses')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/expenses/:id – get one expense
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const expense = await db
      .collection('expenses')
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/expenses – create a new expense
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const newExpense = {
      description: req.body.description,
      amount: Number(req.body.amount),
      paidBy: req.body.paidBy || '',
      splitBetween: req.body.splitBetween || [],
      category: req.body.category || 'other',
      date: req.body.date || new Date().toISOString().split('T')[0],
      createdAt: new Date(),
    };
    const result = await db.collection('expenses').insertOne(newExpense);
    res.status(201).json({ ...newExpense, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/expenses/:id – update an expense
router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    const updates = {};
    const allowedFields = [
      'description',
      'amount',
      'paidBy',
      'splitBetween',
      'category',
      'date',
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] =
          field === 'amount' ? Number(req.body[field]) : req.body[field];
      }
    });
    const result = await db
      .collection('expenses')
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: updates },
        { returnDocument: 'after' },
      );
    if (!result) return res.status(404).json({ error: 'Expense not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/expenses/:id – delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const result = await db
      .collection('expenses')
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
