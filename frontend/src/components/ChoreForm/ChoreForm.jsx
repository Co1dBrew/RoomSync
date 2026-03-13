import { useState } from 'react';
import PropTypes from 'prop-types';
import './ChoreForm.css';

const ROOMMATES = ['Alice', 'Bob', 'Charlie', 'Diana'];

function ChoreForm({ chore, onClose }) {
  const isEditing = Boolean(chore);
  const [title, setTitle] = useState(chore?.title || '');
  const [description, setDescription] = useState(chore?.description || '');
  const [assignedTo, setAssignedTo] = useState(chore?.assignedTo || '');
  const [dueDate, setDueDate] = useState(chore?.dueDate || '');
  const [status, setStatus] = useState(chore?.status || 'pending');
  const [priority, setPriority] = useState(chore?.priority || 'medium');

  const groupMembers = ROOMMATES;

  async function handleSubmit(e) {
    e.preventDefault();
    const body = {
      title,
      description,
      assignedTo,
      dueDate,
      status,
      priority,
    };
    const url = isEditing ? `/api/chores/${chore._id}` : '/api/chores';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      onClose();
    } catch (err) {
      console.error('Failed to save chore:', err);
    }
  }

  return (
    <form className="chore-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit Chore' : 'New Chore'}</h2>

      <div className="form-group">
        <label htmlFor="chore-title">Title</label>
        <input
          id="chore-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="chore-desc">Description</label>
        <textarea
          id="chore-desc"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="chore-assigned">Assigned To</label>
          <select
            id="chore-assigned"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Select member</option>
            {groupMembers.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="chore-due">Due Date</label>
          <input
            id="chore-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="chore-status">Status</label>
          <select
            id="chore-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="chore-priority">Priority</label>
          <select
            id="chore-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
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

ChoreForm.propTypes = {
  chore: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    assignedTo: PropTypes.string,
    dueDate: PropTypes.string,
    status: PropTypes.string,
    priority: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

ChoreForm.defaultProps = {
  chore: null,
};

export default ChoreForm;
