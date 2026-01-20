import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // We will create this CSS next

const Profile = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Fetch Data on Load
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/user/history', {
            credentials: 'include' // Important for session cookie
        });
        
        if (res.status === 401) {
            alert("Please log in first.");
            navigate('/');
            return;
        }

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);

  // 2. Logout Logic
  const handleLogout = async () => {
      await fetch('http://localhost:5000/api/auth/logout', { method: 'POST', credentials: 'include' });
      window.location.href = '/'; // Hard refresh to clear state
  };

  if (loading) return <div style={{padding:'50px', textAlign:'center'}}>Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Account</h1>
        <button onClick={handleLogout} className="logout-btn">Log Out</button>
      </div>

      <h2>Booking History</h2>
      
      {bookings.length === 0 ? (
        <p>No bookings found. <span onClick={() => navigate('/')} style={{color:'#ff385c', cursor:'pointer'}}>Start exploring!</span></p>
      ) : (
        <div className="history-list">
          {bookings.map((item) => (
            <div key={item.booking_id} className="history-card">
              <img src={item.image_url} alt={item.hotel_name} className="history-img" />
              <div className="history-details">
                <h3>{item.hotel_name}</h3>
                <p className="location">{item.location}</p>
                <div className="meta-row">
                    <span>📅 {new Date(item.check_in).toLocaleDateString()} — {new Date(item.check_out).toLocaleDateString()}</span>
                    <span>👥 {item.guests} Guest(s)</span>
                </div>
                <div className="price-row">
                    <span className="total">Total: ₹{parseFloat(item.total_price).toLocaleString()}</span>
                    <span className="status success">Paid ✓</span>
                </div>
                <p className="trans-id">Transaction ID: {item.payment_id || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;