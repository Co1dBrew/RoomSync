import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Dashboard.css';

function Dashboard({ onNavigate, activeGroup = null }) {
  const [chores, setChores] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [choresRes, expensesRes] = await Promise.all([
          fetch('/api/chores'),
          fetch('/api/expenses'),
        ]);
        const choresData = await choresRes.json();
        const expensesData = await expensesRes.json();
        setChores(choresData);
        setExpenses(expensesData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '3rem' }}>Loading…</p>;
  }

  const filteredChores = activeGroup
    ? chores.filter((chore) => chore.groupId === activeGroup.id)
    : chores;
  const filteredExpenses = activeGroup
    ? expenses.filter((expense) => expense.groupId === activeGroup.id)
    : expenses;

  const pendingChores = filteredChores.filter(
    (c) => c.status === 'pending',
  ).length;
  const totalExpenses = filteredExpenses
    .reduce((sum, e) => sum + (e.amount || 0), 0)
    .toFixed(2);

  return (
    <section className="dashboard">
      <h1>Dashboard</h1>

      <div className="dashboard-cards">
        <div
          className="dashboard-card"
          onClick={() => onNavigate('chores')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('chores')}
        >
          <span className="dashboard-card-icon">📋</span>
          <h2>Total Chores</h2>
          <span className="stat">{filteredChores.length}</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-icon">⏳</span>
          <h2>Pending Chores</h2>
          <span className="stat">{pendingChores}</span>
        </div>

        <div
          className="dashboard-card"
          onClick={() => onNavigate('expenses')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('expenses')}
        >
          <span className="dashboard-card-icon">💰</span>
          <h2>Total Expenses</h2>
          <span className="stat">${totalExpenses}</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-icon">🧾</span>
          <h2>Expense Count</h2>
          <span className="stat">{filteredExpenses.length}</span>
        </div>
      </div>

      <div className="dashboard-recent">
        <h2>Recent Chores</h2>
        <ul className="dashboard-recent-list">
          {filteredChores.slice(0, 5).map((chore) => (
            <li key={chore._id} className="dashboard-recent-item">
              <span>{chore.title}</span>
              <span>{chore.assignedTo}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="dashboard-recent">
        <h2>Recent Expenses</h2>
        <ul className="dashboard-recent-list">
          {filteredExpenses.slice(0, 5).map((expense) => (
            <li key={expense._id} className="dashboard-recent-item">
              <span>{expense.description}</span>
              <span>${expense.amount?.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

Dashboard.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  activeGroup: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
};

export default Dashboard;
