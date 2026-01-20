import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Payment.css'; 

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Prevent double-saving in React Strict Mode
  const hasCalledBackend = useRef(false);

  // Stripe automatically adds these to the URL
  const paymentIntentId = searchParams.get('payment_intent'); 
  const redirectStatus = searchParams.get('redirect_status');

  const [statusMessage, setStatusMessage] = useState("Verifying payment...");

  // --- THE NEW PART: CALL BACKEND TO SAVE DATA ---
  useEffect(() => {
    if (paymentIntentId && redirectStatus === 'succeeded' && !hasCalledBackend.current) {
        hasCalledBackend.current = true; // Mark as done so it doesn't run twice

        fetch('http://localhost:5000/api/confirm-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_intent_id: paymentIntentId })
        })
        .then(res => res.json())
        .then(data => {
            console.log("DB Save Result:", data);
            setStatusMessage("Booking Saved to Database!");
        })
        .catch(err => {
            console.error("Save failed:", err);
            setStatusMessage("Payment successful, but saving booking failed.");
        });
    }
  }, [paymentIntentId, redirectStatus]);

  return (
    <div className="payment-container" style={{ textAlign: 'center', marginTop: '100px' }}>
      {redirectStatus === 'succeeded' ? (
        <>
          <div style={{ fontSize: '4rem', color: '#4caf50', marginBottom: '20px' }}>
            ✓
          </div>
          <h1>Booking Confirmed!</h1>
          <p>{statusMessage}</p> {/* Shows "Verifying..." then "Booking Saved!" */}
          
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Reference ID: {paymentIntentId}
          </p>
          
          <button 
            onClick={() => navigate('/')}
            className="book-btn"
            style={{ marginTop: '30px', maxWidth: '200px' }}
          >
            Back to Home
          </button>
        </>
      ) : (
        <>
           <h1 style={{color: 'red'}}>Something went wrong.</h1>
           <p>Payment verification failed.</p>
        </>
      )}
    </div>
  );
};

export default Success;