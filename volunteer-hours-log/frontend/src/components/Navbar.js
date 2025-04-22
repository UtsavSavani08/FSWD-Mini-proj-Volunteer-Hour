import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          Volunteer Log
        </Link>
        
        {isAuthenticated ? (
          <div className="nav-right">
            <ul className="nav-links">
              <li>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  <i className="fas fa-home"></i>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/entries/new"
                  className={`nav-link ${location.pathname === '/entries/new' ? 'active' : ''}`}
                >
                  <i className="fas fa-clock"></i>
                  <span>Log Hours</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/reports"
                  className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`}
                >
                  <i className="fas fa-chart-bar"></i>
                  <span>Reports</span>
                </Link>
              </li>
              <li>
                <span className="welcome-text">
                  Welcome, utsav
                </span>
              </li>
            </ul>
            <div className="user-section">
              <div className="user-profile">
                <span className="user-avatar">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
                <span className="user-name">{user?.username}</span>
              </div>
              <button onClick={logout} className="logout-btn">
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link 
              to="/login"
              className={`auth-btn login ${location.pathname === '/login' ? 'active' : ''}`}
            >
              <i className="fas fa-sign-in-alt"></i>
              <span>Login</span>
            </Link>
            <Link 
              to="/register"
              className={`auth-btn register ${location.pathname === '/register' ? 'active' : ''}`}
            >
              <i className="fas fa-user-plus"></i>
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;