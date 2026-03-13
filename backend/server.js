const express = require('express');
const path = require('path');
require('dotenv').config();

const { connectToDb } = require('./db/connection');
const choresRouter = require('./routes/chores');
const expensesRouter = require('./routes/expenses');

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://roomsync-1-cftl.onrender.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Serve the React production build when available
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// API routes
app.use('/api/chores', choresRouter);
app.use('/api/expenses', expensesRouter);

// For client-side routing – serve index.html for non-API routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

async function start() {
  try {
    await connectToDb();
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

start();
