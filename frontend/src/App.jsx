import { useState } from 'react';
import PropTypes from 'prop-types';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import ChoreList from './components/ChoreList/ChoreList';
import ExpenseList from './components/ExpenseList/ExpenseList';
import './App.css';

function App({ initialPage }) {
  const [page, setPage] = useState(initialPage);

  let content;
  if (page === 'chores') {
    content = <ChoreList />;
  } else if (page === 'expenses') {
    content = <ExpenseList />;
  } else {
    content = <Dashboard onNavigate={setPage} />;
  }

  return (
    <div className="app-container">
      <Navbar activePage={page} onNavigate={setPage} />
      <main className="app-main">{content}</main>
    </div>
  );
}

App.propTypes = {
  initialPage: PropTypes.oneOf(['dashboard', 'chores', 'expenses']),
};

App.defaultProps = {
  initialPage: 'dashboard',
};

export default App;
