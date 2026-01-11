import React from 'react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer>
      <div className="container footer-content">
        <div>
          <p>&copy; 2025 Paranamanna Travels. All rights reserved. <a href="/admin/login" style={{color: 'inherit', textDecoration: 'none', opacity: 0.1, fontSize: '0.8rem'}}>Admin</a></p>
        </div>

      </div>
      <button 
        id="backToTop" 
        onClick={scrollToTop}
        style={{
            position: 'absolute', right: '2rem', bottom: '2rem', 
            background: 'rgba(255,255,255,0.2)', border: 'none', 
            color: 'white', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer'
        }}
      >
        ↑ Top
      </button>
    </footer>
  );
}
