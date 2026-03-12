import { useState } from 'react';
import PropTypes from 'prop-types';
import './ExpenseForm.css';

function ExpenseForm({ expense, onClose }) {
  const isEditing = Boolean(expense);
  const [description, setDescription] = useState(expense?.description || '');
  const [amount, setAmount] = useState(expense?.amount ?? '');
  const [paidBy, setPaidBy] = useState(expense?.paidBy || '');
  const [splitBetween, setSplitBetween] = useState(
    expense?.splitBetween?.join(', ') || '',
  );
  const [category, setCategory] = useState(expense?.category || 'other');
  const [date, setDate] = useState(
    expense?.date || new Date().toISOString().split('T')[0],
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const body = {
      description,
      amount: Number(amount),
      paidBy,
      splitBetween: splitBetween
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      category,
      date,
    };
    const url = isEditing ? `/api/expenses/${expense._id}` : '/api/expenses';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      onClose();
    } catch (err) {
      console.error('Failed to save expense:', err);
    }
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit Expense' : 'New Expense'}</h2>

      <div className="form-group">
        <label htmlFor="expense-desc">Description</label>
        <input
          id="expense-desc"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="expense-amount">Amount ($)</label>
          <input
            id="expense-amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="expense-paid">Paid By</label>
          <input
            id="expense-paid"
            type="text"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="expense-split">
          Split Between (comma-separated names)
        </label>
        <input
          id="expense-split"
          type="text"
          value={splitBetween}
          onChange={(e) => setSplitBetween(e.target.value)}
          placeholder="Alice, Bob, Charlie"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="expense-category">Category</label>
          <select
            id="expense-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="groceries">Groceries</option>
            <option value="utilities">Utilities</option>
            <option value="rent">Rent</option>
            <option value="supplies">Supplies</option>
            <option value="entertainment">Entertainment</option>
            <option value="internet">Internet</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="expense-date">Date</label>
          <input
            id="expense-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-save">
          {isEditing ? 'Update' : 'Create'}
        </button>
        <button type="button" className="btn-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}

ExpenseForm.propTypes = {
  expense: PropTypes.shape({
    _id: PropTypes.string,
    description: PropTypes.string,
    amount: PropTypes.number,
    paidBy: PropTypes.string,
    splitBetween: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string,
    date: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

ExpenseForm.defaultProps = {
  expense: null,
};

export default ExpenseForm;
