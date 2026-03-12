import { useState, useEffect } from 'react';
import ChoreForm from '../ChoreForm/ChoreForm';
import './ChoreList.css';

function ChoreList() {
  const [chores, setChores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingChore, setEditingChore] = useState(null);

  async function loadChores() {
    try {
      const res = await fetch('/api/chores');
      const data = await res.json();
      setChores(data);
    } catch (err) {
      console.error('Failed to load chores:', err);
    }
  }

  useEffect(() => {
    loadChores();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this chore?')) return;
    try {
      await fetch(`/api/chores/${id}`, { method: 'DELETE' });
      setChores((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Failed to delete chore:', err);
    }
  }

  function handleEdit(chore) {
    setEditingChore(chore);
    setShowForm(true);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingChore(null);
    loadChores();
  }

  if (showForm) {
    return <ChoreForm chore={editingChore} onClose={handleFormClose} />;
  }

  return (
    <section className="chore-list">
      <div className="chore-list-header">
        <h1>Chores</h1>
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + New Chore
        </button>
      </div>

      <div className="chore-grid">
        {chores.map((chore) => (
          <article key={chore._id} className="chore-card">
            <h3>{chore.title}</h3>
            <div className="chore-meta">
              <span className={`chore-badge badge-${chore.status}`}>
                {chore.status}
              </span>
              <span className={`chore-badge badge-${chore.priority}`}>
                {chore.priority}
              </span>
            </div>
            <p>Assigned to: {chore.assignedTo || '—'}</p>
            <p>Due: {chore.dueDate || '—'}</p>
            <div className="chore-actions">
              <button className="btn-edit" onClick={() => handleEdit(chore)}>
                Edit
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(chore._id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {chores.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          No chores yet. Create one to get started!
        </p>
      )}
    </section>
  );
}

export default ChoreList;
