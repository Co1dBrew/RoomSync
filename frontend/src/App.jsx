import { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import ChoreList from './components/ChoreList/ChoreList';
import ExpenseList from './components/ExpenseList/ExpenseList';
import './App.css';

function App() {
  const [page, setPage] = useState('dashboard');

  let content;
  switch (page) {
    case 'chores':
      content = <ChoreList />;
      break;
    case 'expenses':
      content = <ExpenseList />;
      break;
    default:
      content = <Dashboard onNavigate={setPage} />;
  }

  return (
    <div className="app-container">
      <Navbar activePage={page} onNavigate={setPage} />
      <main className="app-main">{content}</main>
    </div>
  );
}

export default App;
