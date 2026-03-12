const { MongoClient } = require('mongodb');

let db = null;

async function connectToDb() {
  if (db) return db;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  const client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialised – call connectToDb() first');
  }
  return db;
}

module.exports = { connectToDb, getDb };
