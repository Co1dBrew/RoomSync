import { useState, useEffect } from 'react';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import './ExpenseList.css';

function ExpenseList() {
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

  if (showForm) {
    return <ExpenseForm expense={editingExpense} onClose={handleFormClose} />;
  }

  return (
    <section className="expense-list">
      <div className="expense-list-header">
        <h1>Expenses</h1>
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + New Expense
        </button>
      </div>

      <div className="expense-table-wrap">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Paid By</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td>{expense.description}</td>
                <td className="expense-amount">
                  ${expense.amount?.toFixed(2)}
                </td>
                <td>{expense.paidBy}</td>
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

      {expenses.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          No expenses yet. Add one to start tracking!
        </p>
      )}
    </section>
  );
}

export default ExpenseList;
