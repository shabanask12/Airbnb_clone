import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css'; // You can copy ListingDetails.css basics for this

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <div>Error: No booking data found.</div>;

  const { listing, checkIn, checkOut, guestCount } = state;

  // Calculate Nights
  const diffTime = Math.abs(checkOut - checkIn);
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  // Calculate Bill
  const basePrice = listing.price * nights;
  const gst = basePrice * 0.18; // 18% GST
  const total = basePrice + gst;

  const handleConfirmPayment = async () => {
    // Send to Backend
    try {
      const response = await fetch('http://127.0.0.1:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            listing_id: listing.id,
            user_name: "Guest User", // You can update this later with login
            check_in: checkIn.toISOString().split('T')[0], // Format YYYY-MM-DD
            check_out: checkOut.toISOString().split('T')[0],
            guests: guestCount,
            total_price: total
        })
      });

      if (response.ok) {
        alert("Booking Confirmed! Saved to Database.");
        navigate('/');
      } else {
        alert("Booking Failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Error processing payment.");
    }
  };

  return (
    <div className="payment-container" style={{maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px'}}>
      <h1>Confirm and Pay</h1>
      
      <div className="summary-section">
        <h3>Your Trip</h3>
        <p><strong>Dates:</strong> {checkIn.toLocaleDateString()} – {checkOut.toLocaleDateString()}</p>
        <p><strong>Guests:</strong> {guestCount} guests</p>
      </div>

      <hr />

      <div className="price-details">
        <h3>Price Details</h3>
        <div style={{display:'flex', justifyContent:'space-between'}}>
           <span>₹{listing.price} x {nights} nights</span>
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
        style={{width: '100%', padding: '15px', background: '#ff5a5f', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', marginTop: '20px', cursor:'pointer'}}
      >
        Confirm and Pay
      </button>
    </div>
  );
};

export default Payment;