import PropTypes from 'prop-types';
import './Navbar.css';

function Navbar({ activePage, onNavigate }) {
  const links = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'chores', label: 'Chores' },
    { key: 'expenses', label: 'Expenses' },
  ];

  return (
    <nav className="navbar">
      <button className="navbar-brand" onClick={() => onNavigate('dashboard')}>
        <span>🏠</span> RoomSync
      </button>
      <div className="navbar-links">
        {links.map((link) => (
          <button
            key={link.key}
            className={`navbar-link${activePage === link.key ? ' active' : ''}`}
            onClick={() => onNavigate(link.key)}
          >
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  activePage: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default Navbar;
