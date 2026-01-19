import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css'; 

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // --- 1. CHECK IF USER IS LOGGED IN ---
  useEffect(() => {
    const checkSession = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/me', {
                credentials: 'include' // Ask backend: "Who am I?"
            });
            const data = await res.json();
            if (data.logged_in) {
                setCurrentUser(data.user);
            } else {
                alert("Please log in to complete your booking.");
                navigate('/'); // Redirect to home if not logged in
            }
        } catch (err) {
            console.error("Session check failed", err);
        }
    };
    checkSession();
  }, [navigate]);

  if (!state) return <div>Error: No booking data found.</div>;

  const { listing, checkIn, checkOut, guestCount } = state;

  // Calculate Costs
  const diffTime = Math.abs(checkOut - checkIn);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  const basePrice = listing.price * nights;
  const gst = basePrice * 0.18; 
  const total = basePrice + gst;

  const handleConfirmPayment = async () => {
    if (!currentUser) return alert("You must be logged in!");

    try {
      // --- 2. SEND BOOKING WITH COOKIE & LOCALHOST ---
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // <--- CRITICAL: Sends the session cookie
        body: JSON.stringify({
            listing_id: listing.id,
            user_name: currentUser, // Use the real email from session
            check_in: checkIn.toISOString().split('T')[0],
            check_out: checkOut.toISOString().split('T')[0],
            guests: guestCount,
            total_price: total
        })
      });

      if (response.ok) {
        alert("Booking Confirmed! Check your email.");
        navigate('/');
      } else {
        const errorData = await response.json();
        alert("Booking Failed: " + errorData.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error processing payment.");
    }
  };

  return (
    <div className="payment-container" style={{maxWidth: '600px', margin: '100px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px'}}>
      <h1>Confirm and Pay</h1>
      
      <div className="summary-section">
        <h3>Your Trip</h3>
        <p><strong>Property:</strong> {listing.title}</p>
        <p><strong>Dates:</strong> {checkIn.toLocaleDateString()} – {checkOut.toLocaleDateString()}</p>
        <p><strong>Guests:</strong> {guestCount} guests</p>
      </div>

      <hr />

      <div className="price-details">
        <h3>Price Details</h3>
        <div style={{display:'flex', justifyContent:'space-between'}}>
           <span>₹{listing.price.toLocaleString()} x {nights} nights</span>
           <span>₹{basePrice.toLocaleString()}</span>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', marginTop: '10px'}}>
           <span>GST (18%)</span>
           <span>₹{gst.toLocaleString()}</span>
        </div>
        <hr />
        <div style={{display:'flex', justifyContent:'space-between', fontWeight: 'bold', fontSize: '1.2rem'}}>
           <span>Total (INR)</span>
           <span>₹{total.toLocaleString()}</span>
        </div>
      </div>

      <button 
        onClick={handleConfirmPayment}
        style={{
            width: '100%', 
            padding: '15px', 
            background: '#ff385c', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '1.1rem', 
            marginTop: '20px', 
            cursor:'pointer'
        }}
      >
        Confirm and Pay
      </button>
    </div>
  );
};

export default Payment;