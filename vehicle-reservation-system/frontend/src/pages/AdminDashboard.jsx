import React, { useEffect, useState } from 'react';
import { fetchBookingsByStatus, updateBookingStatus, fetchBookingsForVehicle } from '../lib/firestore';
import { overlaps } from '../lib/dateOverlap';
import { signOutAdmin } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [status, setStatus] = useState('PENDING'); // Uppercase default
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, [status]);

  const loadBookings = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const data = await fetchBookingsByStatus(status);
      // Ensure we only get what we asked for (though API handles it)
      setBookings(data);
    } catch (err) {
      setActionError("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOutAdmin();
    navigate('/admin/login');
  };

  const handleApprove = async (booking) => {
    if (!window.confirm("Approve this booking?")) return;
    setProcessingId(booking.id);
    setActionError(null);

    try {
      // RE-CHECK CONFLICTS
      const existingBookings = await fetchBookingsForVehicle(booking.vehicleId);
      // Filter out self if somehow it's in the list
      const conflicts = existingBookings.filter(b => 
        b.id !== booking.id && 
        overlaps(booking.startDate, booking.endDate, b.startDate, b.endDate)
      );

      if (conflicts.length > 0) {
        throw new Error(`Conflict detected! Overlaps with booking ID: ${conflicts[0].id}`);
      }

      await updateBookingStatus(booking.id, 'APPROVED', adminNote);
      alert("Booking approved.");
      setExpandedId(null);
      setAdminNote("");
      loadBookings();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (bookingId) => {
    if (!window.confirm("Reject this booking?")) return;
    setProcessingId(bookingId);
    setActionError(null);

    try {
      await updateBookingStatus(bookingId, 'REJECTED', adminNote);
      alert("Booking rejected.");
      setExpandedId(null);
      setAdminNote("");
      loadBookings();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setAdminNote("");
    } else {
      setExpandedId(id);
      setAdminNote("");
    }
  };

  return (
    <div className="container dashboard">
      <header className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button className="btn-secondary" onClick={handleLogout}>Logout</button>
      </header>
      
      <div className="tabs">
        {['PENDING', 'APPROVED', 'REJECTED'].map(s => (
          <button 
            key={s} 
            className={status === s ? 'active' : ''} 
            onClick={() => setStatus(s)}
          >
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {actionError && <div className="alert error">{actionError}</div>}
      
      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <div className="bookings-list">
          {bookings.length === 0 ? <p>No {status.toLowerCase()} bookings found.</p> : null}
          {bookings.map(b => (
            <div key={b.id} className={`booking-item ${b.status.toLowerCase()}`}>
              <div className="booking-summary" onClick={() => toggleExpand(b.id)}>
                <div>
                  <strong>{b.vehicleName}</strong> ({b.startDate} to {b.endDate})
                </div>
                <div className="meta">
                  {b.customerName || b.name} | {b.pickupLocation || b.location}
                </div>
              </div>
              
              {expandedId === b.id && (
                <div className="booking-details">
                  <p><strong>Email:</strong> {b.customerEmail || b.email}</p>
                  <p><strong>Phone:</strong> {b.phoneNumber || b.phone || 'N/A'}</p>
                  <p><strong>Category:</strong> {b.vehicleName}</p>
                  <p><strong>Total Price:</strong> ${b.totalPrice}</p>
                  {b.notes && <p><strong>User Notes:</strong> {b.notes}</p>}
                  {b.adminNote && <p><strong>Admin Note:</strong> {b.adminNote}</p>}
                  
                  {status === 'PENDING' && (
                    <div className="admin-actions">
                      <textarea 
                        placeholder="Add note (optional)"
                        value={adminNote}
                        onChange={e => setAdminNote(e.target.value)}
                      />
                      <div className="action-buttons">
                        <button 
                          className="btn-success" 
                          onClick={() => handleApprove(b)}
                          disabled={processingId === b.id}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn-danger" 
                          onClick={() => handleReject(b.id)}
                          disabled={processingId === b.id}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
