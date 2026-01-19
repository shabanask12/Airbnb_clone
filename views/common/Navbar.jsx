import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserCircle, FaHeart, FaConciergeBell, FaHome } from 'react-icons/fa'; 
import { Link, useLocation } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import LoginModal from './LoginModal';
import './Navbar.css'; 

const Navbar = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const location = useLocation();

  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(''); 

  // --- CHECK SESSION ON LOAD ---
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
            method: 'GET',
            credentials: 'include' // <--- CHECKS COOKIE
        });
        const data = await res.json();
        
        if (data.logged_in) {
            setIsLoggedIn(true);
            setUserName(data.user);
        }
      } catch (err) {
        console.log("Not logged in");
      }
    };
    checkSession();
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar" style={styles.nav}>
        <div style={styles.topRow}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="logo"><h2 style={{ color: '#ff385c', margin: 0 }}>airbnb</h2></div>
          </Link>

          <div className="search-bar" style={styles.search}>
            <input type="text" placeholder="Search destinations" style={styles.input} 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <span style={styles.searchIcon}><FaSearch color="white" size={12} /></span>
          </div>

          <div className="profile" style={styles.profile}>
            <Link to="/wishlists" style={styles.linkItem}>
                <div style={styles.iconContainer}><FaHeart size={18} /></div>
            </Link>
            <div style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}}
               onClick={() => isLoggedIn ? alert(`Logged in as ${userName}`) : setShowLogin(true)}>
               <FaUserCircle size={30} color={isLoggedIn ? '#ff385c' : '#717171'} style={{ marginLeft: '10px' }} />
               {isLoggedIn && <span style={{fontSize:'12px', marginLeft:'5px', fontWeight:'bold'}}>Hi, {userName.split('@')[0]}</span>}
            </div>
          </div>
        </div>

        <div style={styles.bottomRow}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={styles.navItem}>
               <FaHome size={24} color={isActive('/') ? 'black' : '#717171'} />
               <span style={isActive('/') ? styles.activeText : styles.inactiveText}>Home</span>
            </div>
          </Link>
          <Link to="/services" style={{ textDecoration: 'none' }}>
            <div style={styles.navItem}>
               <FaConciergeBell size={24} color={isActive('/services') ? 'black' : '#717171'} />
               <span style={isActive('/services') ? styles.activeText : styles.inactiveText}>Services</span>
            </div>
          </Link>
        </div>
      </nav>

      {showLogin && (
        <LoginModal 
            onClose={() => setShowLogin(false)}
            onLoginSuccess={(user) => {
                setIsLoggedIn(true);
                setUserName(user);
            }}
        />
      )}
    </>
  );
};

const styles = {
  nav: { display: 'flex', flexDirection: 'column', borderBottom: '1px solid #ebebeb', position: 'fixed', top: 0, width: '100%', backgroundColor: 'white', zIndex: 100, boxSizing: 'border-box', paddingBottom: '5px' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', width: '100%', boxSizing: 'border-box' },
  bottomRow: { display: 'flex', justifyContent: 'center', gap: '40px', paddingTop: '5px' },
  search: { display: 'flex', alignItems: 'center', border: '1px solid #dddddd', borderRadius: '40px', padding: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' },
  input: { border: 'none', outline: 'none', fontWeight: '600', marginLeft: '10px', width: '250px' },
  searchIcon: { backgroundColor: '#ff385c', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '8px' },
  profile: { display: 'flex', alignItems: 'center', gap: '15px' },
  linkItem: { textDecoration: 'none', color: '#222', cursor: 'pointer' },
  iconContainer: { padding: '10px', borderRadius: '50%', backgroundColor: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', paddingBottom: '10px', minWidth: '60px', borderBottom: '2px solid transparent' },
  activeText: { fontSize: '12px', fontWeight: '700', color: 'black', marginTop: '4px' },
  inactiveText: { fontSize: '12px', fontWeight: '600', color: '#717171', marginTop: '4px' }
};

export default Navbar;