require('dotenv').config({
  path: require('path').join(__dirname, '..', '.env'),
});
const { MongoClient } = require('mongodb');

const ROOMMATES = ['Alice', 'Bob', 'Charlie', 'Diana'];

const CHORE_TITLES = [
  'Vacuum living room',
  'Mop kitchen floor',
  'Clean bathroom',
  'Take out trash',
  'Do dishes',
  'Wipe counters',
  'Dust shelves',
  'Clean fridge',
  'Scrub toilet',
  'Sweep porch',
  'Organize pantry',
  'Water plants',
  'Laundry',
  'Clean windows',
  'Tidy common area',
];

const EXPENSE_CATEGORIES = [
  'groceries',
  'utilities',
  'rent',
  'supplies',
  'entertainment',
  'internet',
  'other',
];

const EXPENSE_DESCRIPTIONS = [
  'Weekly groceries',
  'Electric bill',
  'Internet bill',
  'Paper towels & soap',
  'Water bill',
  'Netflix subscription',
  'Pizza night',
  'Cleaning supplies',
  'Light bulbs',
  'Toilet paper',
  'Gas bill',
  'Trash bags',
  'Dish soap',
  'Laundry detergent',
  'Sponges',
];

const STATUSES = ['pending', 'in-progress', 'completed'];
const PRIORITIES = ['low', 'medium', 'high'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSequentialDates(count, startDate) {
  const dates = [];
  const current = new Date(startDate);
  for (let i = 0; i < count; i++) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function generateChores(count) {
  const chores = [];
  const dates = generateSequentialDates(count, new Date('2026-01-01'));
  for (let i = 0; i < count; i++) {
    const created = dates[i];
    const due = new Date(created.getTime() + 3 * 86400000);
    chores.push({
      title: randomItem(CHORE_TITLES),
      description: `Chore #${i + 1} – please complete by the due date.`,
      assignedTo: randomItem(ROOMMATES),
      dueDate: due.toISOString().split('T')[0],
      status: randomItem(STATUSES),
      priority: randomItem(PRIORITIES),
      createdAt: created,
    });
  }
  return chores;
}

function generateExpenses(count) {
  const expenses = [];
  const dates = generateSequentialDates(count, new Date('2025-01-01'));
  for (let i = 0; i < count; i++) {
    const created = dates[i];
    const paidBy = randomItem(ROOMMATES);
    const others = ROOMMATES.filter((r) => r !== paidBy);
    const splitCount = Math.floor(Math.random() * others.length) + 1;
    const splitBetween = [paidBy, ...others.slice(0, splitCount)];
    expenses.push({
      description: randomItem(EXPENSE_DESCRIPTIONS),
      amount: parseFloat((Math.random() * 200 + 5).toFixed(2)),
      paidBy,
      splitBetween,
      category: randomItem(EXPENSE_CATEGORIES),
      date: created.toISOString().split('T')[0],
      createdAt: created,
    });
  }
  return expenses;
}

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    // Clear existing data
    await db.collection('chores').deleteMany({});
    await db.collection('expenses').deleteMany({});

    const chores = generateChores(1000);
    const expenses = generateExpenses(1000);

    await db.collection('chores').insertMany(chores);
    await db.collection('expenses').insertMany(expenses);

    console.log(
      `Seeded ${chores.length} chores and ${expenses.length} expenses (${chores.length + expenses.length} total).`,
    );
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
