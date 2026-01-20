// src/components/CheckoutForm.jsx
import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import '../listing/Payment.css';

export default function CheckoutForm({ total }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirect to your success page after payment
        return_url: "http://localhost:3000/success", 
      },
    });

    if (error) {
      setMessage(error.message);
    } 
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <PaymentElement />
      <button disabled={isProcessing || !stripe || !elements} className="book-btn">
        {isProcessing ? "Processing..." : `Pay ₹${total.toLocaleString()}`}
      </button>
      {message && <div className="error-msg">{message}</div>}
    </form>
  );
}