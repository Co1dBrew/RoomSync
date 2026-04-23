import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChoreForm from '../ChoreForm/ChoreForm';
import { API } from '../../config/api';
import './ChoreList.css';

function ChoreList({ activeGroup = null }) {
  const [chores, setChores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingChore, setEditingChore] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [personFilter, setPersonFilter] = useState('all');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');

  async function loadChores() {
    try {
      const res = await fetch(API.chores);
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
      await fetch(`${API.chores}/${id}`, {
        method: 'DELETE',
      });
      setChores((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Failed to delete chore:', err);
    }
  }

  async function handleToggleComplete(chore) {
    const nextStatus = chore.status === 'completed' ? 'pending' : 'completed';
    try {
      const res = await fetch(
        `${API.chores}/${chore._id}`,
        {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const updated = await res.json();
      setChores((prev) =>
        prev.map((item) => (item._id === chore._id ? updated : item)),
      );
    } catch (err) {
      console.error('Failed to update chore:', err);
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

  const sortedChores = [...chores].sort(
    (a, b) => new Date(a.dueDate || a.createdAt) - new Date(b.dueDate || b.createdAt),
  );

  const filteredChores = sortedChores.filter((chore) => {
    if (statusFilter !== 'all' && chore.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && chore.priority !== priorityFilter) return false;
    if (personFilter !== 'all' && chore.assignedTo !== personFilter) return false;
    if (dateRangeStart && chore.dueDate && chore.dueDate < dateRangeStart) return false;
    if (dateRangeEnd && chore.dueDate && chore.dueDate > dateRangeEnd) return false;
    return true;
  });

  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredChores.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, priorityFilter, personFilter, dateRangeStart, dateRangeEnd]);

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

  const pagedChores = filteredChores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  function clearAllFilters() {
    setStatusFilter('all');
    setPriorityFilter('all');
    setPersonFilter('all');
    setDateRangeStart('');
    setDateRangeEnd('');
  }

  if (showForm) {
    return <ChoreForm chore={editingChore} onClose={handleFormClose} />;
  }

  const choresByDate = pagedChores.reduce((acc, chore) => {
    const key = chore.dueDate || 'No date';
    if (!acc[key]) acc[key] = [];
    acc[key].push(chore);
    return acc;
  }, {});

  const sortedDates = Object.keys(choresByDate).sort((a, b) => {
    if (a === 'No date') return 1;
    if (b === 'No date') return -1;
    return new Date(a) - new Date(b);
  });

  return (
    <section className="chore-list">
      <div className="chore-list-header">
        <div>
          <h1>Chores Calendar</h1>
          <p className="chore-subtitle">
            Tap a chore to mark it complete. Each day shows who does what.
          </p>
        </div>
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + New Chore
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <label>Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Priority</label>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Assigned To</label>
          <select value={personFilter} onChange={(e) => setPersonFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="Alice">Alice</option>
            <option value="Bob">Bob</option>
            <option value="Charlie">Charlie</option>
            <option value="Diana">Diana</option>
          </select>
        </div>

        <div className="filter-group">
          <label>From</label>
          <input type="date" value={dateRangeStart} onChange={(e) => setDateRangeStart(e.target.value)} />
        </div>

        <div className="filter-group">
          <label>To</label>
          <input type="date" value={dateRangeEnd} onChange={(e) => setDateRangeEnd(e.target.value)} />
        </div>

        <button className="btn-clear-filters" onClick={clearAllFilters}>
          Clear All
        </button>
      </div>

      <div className="chore-calendar">
        {sortedDates.map((dateKey) => (
          <section key={dateKey} className="chore-day">
            <header className="chore-day-header">
              <h2>{dateKey === 'No date' ? 'No due date' : dateKey}</h2>
              <span className="chore-day-count">
                {choresByDate[dateKey].length} chores
              </span>
            </header>
            <div className="chore-day-list">
              {choresByDate[dateKey].map((chore) => (
                <div
                  key={chore._id}
                  className={`chore-entry ${
                    chore.status === 'completed' ? 'is-complete' : ''
                  }`}
                >
                  <button
                    type="button"
                    className="chore-entry-complete"
                    onClick={() => handleToggleComplete(chore)}
                  >
                    {chore.status === 'completed' ? '✓' : '○'}
                  </button>
                  <div className="chore-entry-main">
                    <h3>{chore.title}</h3>
                    <p>
                      Assigned to {chore.assignedTo || '—'} • Priority{' '}
                      {chore.priority}
                    </p>
                  </div>
                  <div className="chore-entry-actions">
                    <button
                      type="button"
                      className="btn-edit"
                      onClick={() => handleEdit(chore)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => handleDelete(chore._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {filteredChores.length === 0 && chores.length > 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          No chores match your filters.
        </p>
      )}

      {chores.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          No chores yet. Create one to get started!
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

export default ChoreList;
