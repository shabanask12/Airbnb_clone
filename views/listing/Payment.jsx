// src/pages/Payment.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from '../common/CheckoutForm';
import './Payment.css';

// Replace with your PUBLIC key from Stripe Dashboard
const stripePromise = loadStripe("pk_test_..."); 

const Payment = () => {
  const { state } = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [serverTotal, setServerTotal] = useState(0);

  useEffect(() => {
    if (!state) return;
    
    // Request the Payment Intent from Backend
    // Inside Payment.jsx

    fetch("http://localhost:5000/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({ 
          listing_id: state.listing.id,
          // FIX: Ensure we only send the date string YYYY-MM-DD
          check_in: new Date(state.checkIn).toISOString().split('T')[0],
          check_out: new Date(state.checkOut).toISOString().split('T')[0]
      }),
    })
      .then((res) => res.json())
.then((data) => {
    if (data.error) {
        console.error("Backend Error:", data.error);
        alert("Payment Error: " + data.error); // Alert the user!
    } else {
        setClientSecret(data.clientSecret);
        setServerTotal(data.total_price || 0); // Safety fallback
    }
})
.catch(err => console.error("Network Error:", err));
  }, [state]);

  if (!state) return <div>Error: No booking data</div>;

  return (
    <div className="payment-container">
      <h1>Confirm and Pay</h1>
      <div className="summary-section">
         <p><strong>{state.listing.title}</strong></p>
   <p>Total to pay: ₹{serverTotal.toLocaleString()}</p>
      </div>

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm total={serverTotal} />
        </Elements>
      )}
    </div>
  );
};

export default Payment;