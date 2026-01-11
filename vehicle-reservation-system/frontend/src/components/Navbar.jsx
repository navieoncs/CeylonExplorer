import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header>
      <div className="container navbar-container">
        <Link to="/" className="logo">Paranamanna Travels</Link>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/fleet">Our Fleet</Link>
          <Link to="/destinations">Destinations</Link>
          <button className="btn-nav" onClick={() => navigate('/book')}>Book Now</button>
        </nav>
      </div>
    </header>
  );
}
