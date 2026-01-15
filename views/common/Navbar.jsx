import React from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import './Navbar.css'; // We will add styles later or you can comment this out

const Navbar = () => {
  return (
    <nav className="navbar" style={styles.nav}>
      <div className="logo" style={styles.logo}>
        <h2 style={{ color: '#ff385c', margin: 0 }}>airbnb</h2>
      </div>

      <div className="search-bar" style={styles.search}>
        <input type="text" placeholder="Search destinations" style={styles.input} />
        <span style={styles.searchIcon}><FaSearch color="white" size={12} /></span>
      </div>

      <div className="profile" style={styles.profile}>
        <span>Become a Host</span>
        <FaUserCircle size={24} color="#717171" style={{ marginLeft: '10px' }} />
      </div>
    </nav>
  );
};

// Basic inline styles to make it look decent immediately
const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 40px',
    borderBottom: '1px solid #ebebeb',
    position: 'fixed',
    top: 0,
    width: '100%',
    backgroundColor: 'white',
    zIndex: 100,
    boxSizing: 'border-box'
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #dddddd',
    borderRadius: '40px',
    padding: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
  },
  input: {
    border: 'none',
    outline: 'none',
    fontWeight: '600',
    marginLeft: '10px'
  },
  searchIcon: {
    backgroundColor: '#ff385c',
    borderRadius: '50%',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '8px'
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    fontWeight: '600',
    color: '#222'
  }
};

export default Navbar;