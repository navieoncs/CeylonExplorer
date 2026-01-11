import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchVehicles, createBooking } from '../lib/firestore';

export default function BookVehicle() {
  const { vehicleId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicleId: vehicleId || '',
    pickupDate: searchParams.get('startDate') || '',
    pickupTime: '',
    dropoffDate: searchParams.get('endDate') || '',
    dropoffTime: '',
    pickupLocation: '',
    dropoffLocation: '',
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load vehicles for the dropdown
    const load = async () => {
      const data = await fetchVehicles();
      // Sort as requested
      data.sort((a,b) => a.pricePerDay - b.pricePerDay);
      setVehicles(data);
      // If vehicleId param provided, ensure it's selected (React state init handled it, but just in case)
      if (vehicleId) {
        setFormData(prev => ({ ...prev, vehicleId }));
      }
    };
    load();
  }, [vehicleId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.vehicleId) throw new Error("Please select a vehicle.");

      // Calculate days roughly
      const starT = new Date(`${formData.pickupDate}T${formData.pickupTime || '12:00'}`);
      const endT = new Date(`${formData.dropoffDate}T${formData.dropoffTime || '12:00'}`);
      const diffTime = Math.abs(endT - starT);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

      // Find vehicle for price
      const vehicle = vehicles.find(v => v.id === formData.vehicleId);
      const price = vehicle ? vehicle.pricePerDay * diffDays : 0;

      await createBooking({
        vehicleId: formData.vehicleId,
        vehicleName: vehicle ? vehicle.name : 'Unknown',
        startDate: formData.pickupDate,
        endDate: formData.dropoffDate, // Using date strings for simplicity
        pickupTime: formData.pickupTime,
        dropoffTime: formData.dropoffTime,
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
        customerName: formData.name,
        customerEmail: formData.email,
        phoneNumber: formData.phone,
        notes: formData.notes,
        totalPrice: price,
        status: 'pending'
      });

      setSuccess(true);
      window.scrollTo(0,0);
    } catch (err) {
      console.error(err);
      setError("Failed to submit booking. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="container" style={{padding:'60px 0'}}>
        <section className="booking-summary">
            <h3>Thank you for your booking!</h3>
            <p>Your reservation has been received. We will contact you soon with confirmation details.</p>
            <button onClick={() => navigate('/')} className="btn-secondary" style={{marginTop:'1rem'}}>Back to Home</button>
        </section>
      </main>
    );
  }

  return (
    <main>
        <section className="booking-section container">
            <h2>Book Your Adventure</h2>
            {error && <div style={{color:'red', marginBottom:'1rem', textAlign:'center'}}>{error}</div>}
            
            <form className="booking-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="vehicleId">Select Vehicle</label>
                    <select 
                        id="vehicleId" 
                        name="vehicleId" 
                        value={formData.vehicleId} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Choose a vehicle</option>
                        {vehicles.map(v => (
                            <option key={v.id} value={v.id}>
                                {v.name} - ${v.pricePerDay}/day
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="pickupDate">Pick-up Date</label>
                        <input type="date" id="pickupDate" name="pickupDate" required value={formData.pickupDate} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pickupTime">Pick-up Time</label>
                        <input type="time" id="pickupTime" name="pickupTime" required value={formData.pickupTime} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="dropoffDate">Drop-off Date</label>
                        <input type="date" id="dropoffDate" name="dropoffDate" required value={formData.dropoffDate} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dropoffTime">Drop-off Time</label>
                        <input type="time" id="dropoffTime" name="dropoffTime" required value={formData.dropoffTime} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="pickupLocation">Pick-up Location</label>
                    <input type="text" id="pickupLocation" name="pickupLocation" placeholder="e.g. Colombo Airport" required value={formData.pickupLocation} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="dropoffLocation">Drop-off Location</label>
                    <input type="text" id="dropoffLocation" name="dropoffLocation" placeholder="e.g. Kandy City" required value={formData.dropoffLocation} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} />
                </div>
                
                <div className="form-group">
                    <label htmlFor="notes">Special Requests</label>
                    <textarea id="notes" name="notes" rows="3" placeholder="Any special requests?" value={formData.notes} onChange={handleChange}></textarea>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Processing...' : 'Book Now'}
                </button>
            </form>
        </section>
    </main>
  );
}
