// src/routes/AdminRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(null); // null = checking...

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Ask backend: "Am I an admin?"
        const res = await fetch('http://localhost:5000/api/auth/me', {
            credentials: 'include' // Important: Sends your session cookie
        });
        const data = await res.json();
        
        if (data.logged_in && data.is_admin) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
      } catch (err) {
        console.error(err);
        setIsAdmin(false);
      }
    };
    checkAuth();
  }, []);

  // 1. While checking, show nothing (or a spinner)
  if (isAdmin === null) return <div>Checking permissions...</div>;

  // 2. If NOT admin, kick them to Home Page
  if (isAdmin === false) {
      alert("Access Denied: You are not an Admin.");
      return <Navigate to="/" replace />;
  }

  // 3. If Admin, show the Admin Panel
  return <Outlet />;
};

export default AdminRoute;