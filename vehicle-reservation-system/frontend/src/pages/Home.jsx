import React, { useEffect, useState } from 'react';
import { fetchVehicles } from '../lib/firestore';
import VehicleCard from '../components/VehicleCard';
import { VEHICLE_TYPES } from '../constants/vehicleTypes';
import { LOCATIONS } from '../constants/locations';
import { useNavigate } from 'react-router-dom';

import { DESTINATIONS } from '../constants/destinations';

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingParams, setBookingParams] = useState({
    startDate: '',
    endDate: '', // Not using time locally for now to keep simple, just date
    type: ''
  });
  
  const [selectedDestination, setSelectedDestination] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await fetchVehicles();
      // Sort by price ascending
      data.sort((a, b) => a.pricePerDay - b.pricePerDay);
      setVehicles(data);
    } catch (err) {
      setError("Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAvailability = (e) => {
    e.preventDefault();
    if (!bookingParams.startDate) {
        alert("Please select a date.");
        return;
    }
    const element = document.getElementById('featured-fleet');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredVehicles = bookingParams.type 
    ? vehicles.filter(v => v.category === bookingParams.type || v.type === bookingParams.type)
    : vehicles;

  // Show only first 3 destinations on home
  const homeDestinations = DESTINATIONS.slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="hero" style={{backgroundImage: 'url("/sigiriya.jpg")'}}> 
        <div className="hero-content">
          <h1>Explore the Pearl of the Indian Ocean with <span className="highlight">Your Freedom</span></h1>
          <p>Reliable and comfortable rental cars for your unforgettable journey across Sri Lanka.</p>
          
          <div className="hero-badges">
             <span>Trusted Drivers</span>
             <span>Eco Options</span>
             <span>Custom Itineraries</span>
          </div>

          <form className="quick-book-form" onSubmit={handleCheckAvailability}>
             <input 
               type="date" 
               required 
               value={bookingParams.startDate}
               onChange={e => setBookingParams({...bookingParams, startDate: e.target.value})}
               min={new Date().toISOString().split('T')[0]}
             />
             <select 
                value={bookingParams.type}
                onChange={e => setBookingParams({...bookingParams, type: e.target.value})}
             >
                <option value="">Select Vehicle Type</option>
                {Object.values(VEHICLE_TYPES).map(t => (
                    <option key={t} value={t}>{t}</option>
                ))}
             </select>
             <button type="submit" className="btn-primary">Check Availability</button>
          </form>
        </div>
      </section>

      {/* Featured Fleet */}
      <section className="section container" id="featured-fleet">
         <h2>Our Premium Fleet</h2>
         {loading ? <div className="text-center">Loading...</div> : (
             <div className="vehicle-grid">
                {filteredVehicles.map(v => (
                    <VehicleCard key={v.id} vehicle={v} searchParams={bookingParams} />
                ))}
             </div>
         )}
      </section>

      {/* Features */}
      <section className="section container" style={{backgroundColor: '#fafafa'}}>
         <h2>Why travellers choose Paranamanna Travels</h2>
         <div className="features-grid">
            <div className="feature-card">
               <h4>Professional Drivers</h4>
               <p>Friendly, licensed drivers who know the local routes and hidden gems.</p>
            </div>
            <div className="feature-card">
               <h4>Flexible Policies</h4>
               <p>Transparent pricing and flexible pick-up/drop-off options to suit your plan.</p>
            </div>
            <div className="feature-card">
               <h4>Photo-Ready Routes</h4>
               <p>We help you plan stops at the most Instagram-worthy spots.</p>
            </div>
         </div>
      </section>

      {/* Destinations */}
      <section className="section container" id="destinations">
         <h2>Discover Beautiful Sri Lanka</h2>
         <div className="destination-grid">
            {homeDestinations.map(dest => (
                <div 
                    key={dest.title} 
                    className="destination-card" 
                    style={{backgroundImage: `url("${dest.image}")`}}
                    onClick={() => setSelectedDestination(dest)}
                >
                   <h5>{dest.title}</h5>
                </div>
            ))}
         </div>
         <div className="text-center" style={{marginTop:'2rem'}}>
            <button className="btn-secondary" onClick={() => navigate('/destinations')}>View All Destinations</button>
         </div>
      </section>

      {/* Destination Modal */}
      {selectedDestination && (
        <div className="modal-overlay" onClick={() => setSelectedDestination(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <span className="close-modal" onClick={() => setSelectedDestination(null)}>&times;</span>
                <img src={selectedDestination.image} alt={selectedDestination.title} style={{width:'100%', height:'200px', objectFit:'cover', borderRadius:'8px'}} />
                <h3 style={{margin:'1rem 0', color:'var(--primary)'}}>{selectedDestination.title}</h3>
                <p>{selectedDestination.desc}</p>
                <button className="btn-secondary" style={{marginTop:'1rem'}} onClick={() => setSelectedDestination(null)}>Close</button>
            </div>
        </div>
      )}

      {/* Newsletter */}
      <section className="section container text-center">
          <h3>Get travel tips & deals</h3>
          <div style={{maxWidth:'500px', margin:'1rem auto', display:'flex', gap:'1rem', justifyContent:'center'}}>
             <input type="email" placeholder="Your email" style={{padding:'0.8rem', flex:1, borderRadius:'5px', border:'1px solid #ccc'}} />
             <button className="btn-primary">Subscribe</button>
          </div>
      </section>

    </main>
  );
}
