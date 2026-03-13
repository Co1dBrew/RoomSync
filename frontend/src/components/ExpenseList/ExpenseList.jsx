import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import './ExpenseList.css';

function ExpenseList({ activeGroup = null }) {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  async function loadExpenses() {
    try {
      const res = await fetch('/api/expenses');
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error('Failed to load expenses:', err);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error('Failed to delete expense:', err);
    }
  }

  function handleEdit(expense) {
    setEditingExpense(expense);
    setShowForm(true);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingExpense(null);
    loadExpenses();
  }

  const visibleExpenses = expenses;

  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(visibleExpenses.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  function buildPageItems() {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = new Set([
      1,
      totalPages,
      currentPage,
      currentPage - 1,
      currentPage + 1,
    ]);
    const sorted = [...pages]
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((a, b) => a - b);

    const items = [];
    sorted.forEach((page, index) => {
      const prev = sorted[index - 1];
      if (prev && page - prev > 1) {
        items.push(`ellipsis-${page}`);
      }
      items.push(page);
    });
    return items;
  }

  const pagedExpenses = visibleExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const balances = visibleExpenses.reduce((acc, expense) => {
    const splitCount = expense.splitBetween?.length || 0;
    if (!splitCount) return acc;

    const share = Number(expense.amount || 0) / splitCount;
    expense.splitBetween.forEach((person) => {
      if (person === expense.paidBy) return;
      if (!acc[person]) acc[person] = {};
      acc[person][expense.paidBy] =
        (acc[person][expense.paidBy] || 0) + share;
    });
    return acc;
  }, {});

  const people = Object.keys(balances);
  const [activePerson, setActivePerson] = useState(people[0] || '');

  useEffect(() => {
    if (!activePerson && people.length > 0) {
      setActivePerson(people[0]);
    }
  }, [activePerson, people]);

  if (showForm) {
    return (
      <ExpenseForm
        expense={editingExpense}
        onClose={handleFormClose}
        activeGroup={activeGroup}
      />
    );
  }

  return (
    <section className="expense-list">
      <div className="expense-list-header">
        <div>
          <h1>Expenses</h1>
          <p className="expense-subtitle">
            Summary shows who owes whom. Click a person to view details.
          </p>
        </div>
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + New Expense
        </button>
      </div>

      <section className="expense-summary">
        <h2>Balances</h2>
        <div className="expense-summary-grid">
          {people.length === 0 && (
            <p className="expense-empty">No balances yet.</p>
          )}
          {people.map((person) => {
            const total = Object.values(balances[person]).reduce(
              (sum, value) => sum + value,
              0,
            );
            return (
              <button
                type="button"
                key={person}
                className={`expense-summary-card ${
                  activePerson === person ? 'is-active' : ''
                }`}
                onClick={() => setActivePerson(person)}
              >
                <h3>{person}</h3>
                <p>${total.toFixed(2)} owed</p>
              </button>
            );
          })}
        </div>

        {activePerson && balances[activePerson] && (
          <div className="expense-detail">
            <h3>{activePerson} owes</h3>
            <ul>
              {Object.entries(balances[activePerson]).map(([person, amount]) => (
                <li key={person}>
                  {person}: ${amount.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <div className="expense-table-wrap">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Paid By</th>
              <th>Split Between</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedExpenses.map((expense) => (
              <tr key={expense._id}>
                <td>{expense.description}</td>
                <td className="expense-amount">
                  ${expense.amount?.toFixed(2)}
                </td>
                <td>{expense.paidBy}</td>
                <td>{expense.splitBetween?.join(', ') || '—'}</td>
                <td>
                  <span className="expense-category">{expense.category}</span>
                </td>
                <td>{expense.date}</td>
                <td>
                  <div className="expense-actions">
                    <button
                      className="btn-edit btn-sm"
                      onClick={() => handleEdit(expense)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete btn-sm"
                      onClick={() => handleDelete(expense._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visibleExpenses.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          No expenses yet. Add one to start tracking!
        </p>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {buildPageItems().map((item) => {
            if (typeof item === 'string') {
              return (
                <span key={item} className="pagination-ellipsis">
                  …
                </span>
              );
            }
            return (
              <button
                key={item}
                type="button"
                className={currentPage === item ? 'active' : ''}
                onClick={() => setCurrentPage(item)}
              >
                {item}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default ExpenseList;
