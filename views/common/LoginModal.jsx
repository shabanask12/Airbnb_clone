import React, { useState } from 'react';
import './LoginModal.css';

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) return alert("Please fill in all fields");

    if (isSignup) {
        // --- SIGNUP FLOW ---
        try {
            const res = await fetch('http://localhost:5000/api/auth/signup-init', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            
            if (res.ok) {
                alert("OTP sent to your email!");
                setStep(2); 
            } else {
                alert(data.error || "Signup failed");
            }
        } catch (err) {
            console.error(err);
            alert("Connection Error");
        }
    } else {
        // --- LOGIN FLOW ---
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include', // <--- SAVES COOKIE
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                alert("Login Successful!");
                onLoginSuccess(data.user);
                onClose();
            } else {
                alert(data.error || "Invalid credentials");
            }
        } catch (err) {
            console.error(err);
            alert("Connection Error");
        }
    }
  };

  const handleVerifySignup = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/auth/signup-complete', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include', // <--- SAVES COOKIE
            body: JSON.stringify({ email, otp, password })
        });
        const data = await res.json();

        if (res.ok) {
            alert("Account Created! You are logged in.");
            onLoginSuccess(email);
            onClose();
        } else {
            alert(data.error || "Verification failed");
        }
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{isSignup ? 'Sign Up' : 'Log In'}</h2>
        <hr />
        <div className="modal-body">
            {step === 1 && (
                <>
                    <h3>{isSignup ? 'Create an Account' : 'Welcome Back'}</h3>
                    <input type="email" placeholder="Email address" className="modal-input"
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" className="modal-input"
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    
                    <button className="continue-btn" onClick={handleSubmit}>
                        {isSignup ? 'Send OTP & Signup' : 'Log In'}
                    </button>
                    <p style={{marginTop: '15px', fontSize: '12px', cursor: 'pointer', color: '#717171'}} 
                       onClick={() => setIsSignup(!isSignup)}>
                       {isSignup ? 'Already have an account? Log in' : 'New here? Create an account'}
                    </p>
                </>
            )}
            {step === 2 && (
                <>
                     <h3>Verify your Email</h3>
                     <p>We sent a code to <b>{email}</b>.</p>
                     <input type="text" placeholder="Enter 6-digit code" className="modal-input"
                        value={otp} onChange={(e) => setOtp(e.target.value)} />
                    <button className="continue-btn" onClick={handleVerifySignup}>Verify & Create Account</button>
                    <p style={{marginTop: '10px', fontSize: '12px', cursor:'pointer', color:'blue'}} onClick={() => setStep(1)}>
                        Back
                    </p>
                </>
            )}
        </div>
      </div>
    </div>
  );
};
export default LoginModal;