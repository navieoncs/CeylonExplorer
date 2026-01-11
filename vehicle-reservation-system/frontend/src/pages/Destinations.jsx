import React from 'react';
import { useNavigate } from 'react-router-dom';

import { DESTINATIONS } from '../constants/destinations';

export default function Destinations() {
  const navigate = useNavigate();

  return (
    <main className="container" style={{ padding: '60px 0' }}>
      <h1 className="text-center" style={{marginBottom: '1rem', color:'var(--primary)'}}>Unforgettable Places in Sri Lanka</h1>
      <p className="text-center" style={{marginBottom: '3rem'}}>We provide the vehicle, you create the adventure. Here are some incredible spots for your itinerary.</p>
      
      <div className="destination-grid-page">
        {DESTINATIONS.map((dest, i) => (
            <div key={i} className="destination-item">
                {/* Fallback image if local file missing */}
                <img 
                    src={dest.image} 
                    alt={dest.title} 
                    onError={(e) => {e.target.src = 'https://placehold.co/600x400?text=Destination'}}
                />
                <div className="destination-content">
                    <h3>{dest.title}</h3>
                    <p>{dest.desc}</p>
                    <button onClick={() => navigate('/#fleet')} className="btn-secondary">Plan a Trip Here</button>
                    {/* The design link went to booking.html, here we guide them to book a vehicle */}
                </div>
            </div>
        ))}
      </div>
    </main>
  );
}
