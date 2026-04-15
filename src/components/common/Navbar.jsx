import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isEmployee } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.navbar}>
      <div style={styles.navbarBrand}>
        <Link to="/" style={styles.brandLink}>
          <span style={styles.brandIcon}>🏢</span>
          <span style={styles.brandText}>e-Sevai Office</span>
        </Link>
      </div>
      
      <div style={styles.navbarMenu}>
        {user ? (
          <>
            {isAdmin && (
              <>
                <Link 
                  to="/admin/dashboard" 
                  style={{
                    ...styles.navLink,
                    ...(isActive('/admin/dashboard') ? styles.activeLink : {})
                  }}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/works" 
                  style={{
                    ...styles.navLink,
                    ...(isActive('/admin/works') ? styles.activeLink : {})
                  }}
                >
                  All Works
                </Link>
                <Link 
                  to="/admin/employees" 
                  style={{
                    ...styles.navLink,
                    ...(isActive('/admin/employees') ? styles.activeLink : {})
                  }}
                >
                  Employees
                </Link>
                <Link 
                  to="/admin/reports" 
                  style={{
                    ...styles.navLink,
                    ...(isActive('/admin/reports') ? styles.activeLink : {})
                  }}
                >
                  Reports
                </Link>
              </>
            )}
            
            {isEmployee && (
              <>
                <Link 
                  to="/employee/dashboard" 
                  style={{
                    ...styles.navLink,
                    ...(isActive('/employee/dashboard') ? styles.activeLink : {})
                  }}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/employee/works" 
                  style={{
                    ...styles.navLink,
                    ...(isActive('/employee/works') ? styles.activeLink : {})
                  }}
                >
                  My Works
                </Link>
                <Link 
                  to="/employee/reports" 
                  style={{
                    ...styles.navLink,
                    ...(isActive('/employee/reports') ? styles.activeLink : {})
                  }}
                >
                  Reports
                </Link>
              </>
            )}
          </>
        ) : null}
      </div>
      
      <div style={styles.navbarRight}>
        {user && (
          <>
            <div style={styles.userInfo}>
              <span style={styles.userName}>{user.name}</span>
              <span style={styles.userRole}>
                {isAdmin ? 'Admin' : user.employeeId}
              </span>
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    height: '60px',
    backgroundColor: '#2c3e50',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  navbarBrand: {
    display: 'flex',
    alignItems: 'center'
  },
  brandLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'white'
  },
  brandIcon: {
    fontSize: '24px',
    marginRight: '10px'
  },
  brandText: {
    fontSize: '18px',
    fontWeight: 'bold'
  },
  navbarMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  navLink: {
    padding: '8px 16px',
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  },
  activeLink: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontWeight: '500'
  },
  navbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  userName: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500'
  },
  userRole: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '12px'
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s ease'
  }
};

export default Navbar;