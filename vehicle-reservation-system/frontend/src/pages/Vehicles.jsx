import React, { useEffect, useState } from 'react';
import { fetchVehicles } from '../lib/firestore';
import { useNavigate } from 'react-router-dom';

/* 
  Enriching fallback/fetched data with extra static details for the design 
  since Firestore schema is simpler.
*/
const SPEC_DETAILS = {
  "deepol-s05": {
    transmission: "Automatic (Electric)",
    luggage: "4 Bags",
    fuel: "Electric",
    feature: "Quiet, Smooth Ride",
    idealFor: "Couples & Eco-Tours"
  },
  "toyota-hiace": {
    transmission: "Automatic",
    luggage: "10 Bags",
    fuel: "Diesel",
    feature: "Dual AC",
    idealFor: "Group Tours & Airport Transfers"
  },
  "toyota-axio": {
    transmission: "Automatic",
    luggage: "3 Medium Bags",
    fuel: "Petrol (Hybrid model)",
    feature: "Excellent Fuel Economy",
    idealFor: "Small Families & Road Trips"
  }
};

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSpecs = (id, capacity) => {
    const details = SPEC_DETAILS[id] || {
        transmission: "Automatic",
        luggage: "Standard",
        fuel: "Petrol",
        feature: "AC",
        idealFor: "Travelers"
    };
    return [
        `Capacity: ${capacity} Passengers`,
        `Transmission: ${details.transmission}`,
        `Luggage: ${details.luggage}`,
        `Fuel Type: ${details.fuel}`,
        `Key Feature: ${details.feature}`,
        `Ideal For: ${details.idealFor}`
    ];
  };

  if (loading) return <div className="container" style={{padding:'60px 0', textAlign:'center'}}>Loading fleet...</div>;

  return (
    <main className="container" style={{ padding: '60px 0' }}>
      <h1 className="text-center" style={{marginBottom: '1rem', color:'var(--primary)'}}>Choose Your Ride for Sri Lanka</h1>
      <p className="text-center" style={{marginBottom: '3rem'}}>Reliability, comfort, and safety are guaranteed across our entire fleet.</p>
      
      {vehicles.map(vehicle => (
        <section key={vehicle.id} className="vehicle-detail-card" id={vehicle.id}>
            <div className="vehicle-image-container">
                {/* Ensure we handle both absolute URLs or local public paths */}
                <img src={vehicle.imageUrl || "https://placehold.co/600x400"} alt={vehicle.name} />
            </div>
            <div className="vehicle-info">
                <h2>{vehicle.name}</h2>
                <div className="price-box">Starting from <span>${vehicle.pricePerDay} USD</span> / day</div>
                <p>{vehicle.description || "A safe and comfortable ride for your journey."}</p>
                <ul className="vehicle-specs">
                    {getSpecs(vehicle.id, vehicle.capacity).map((spec, i) => (
                        <li key={i}>{spec}</li>
                    ))}
                </ul>
                <button 
                  onClick={() => navigate(`/book/${vehicle.id}`)} 
                  className="btn-primary"
                >
                  Book {vehicle.name} Now
                </button>
            </div>
        </section>
      ))}
    </main>
  );
}
