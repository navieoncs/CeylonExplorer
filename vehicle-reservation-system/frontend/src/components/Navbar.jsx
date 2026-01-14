import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="modern-header">
      <div className="container navbar-container">
        <Link to="/" className="logo-modern">
          <div className="logo-icon">
            <img src="/favicon.png" alt="CeylonExplorer Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          </div>
          <span className="logo-text">
            <span className="logo-main">Ceylon</span>
            <span className="logo-sub">Explorer</span>
          </span>
        </Link>
        <nav className="nav-links-modern">
          <Link to="/" className={isActive('/') ? 'nav-link active' : 'nav-link'}>
            Home
          </Link>
          <Link to="/fleet" className={isActive('/fleet') ? 'nav-link active' : 'nav-link'}>
            Our Fleet
          </Link>
          <Link to="/destinations" className={isActive('/destinations') ? 'nav-link active' : 'nav-link'}>
            Destinations
          </Link>
          <Link to="/about" className={isActive('/about') ? 'nav-link active' : 'nav-link'}>
            About
          </Link>
          <button className="btn-nav-modern" onClick={() => navigate('/book')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Book Now
          </button>
        </nav>
      </div>
    </header>
  );
}
