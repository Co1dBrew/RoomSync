const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const API = {
  chores: `${API_BASE}/api/chores`,
  expenses: `${API_BASE}/api/expenses`,
};
