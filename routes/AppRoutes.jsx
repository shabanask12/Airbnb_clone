// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPanel from '../views/admin/AdminPanel'; // Import the file
import Home from '../views/home/Home';
import Payment from '../views/listing/Payment';
import Profile from '../views/common/Profile';
import ListingDetails from '../views/listing/ListingDetails';
import WishlistPage from '../views/wishlist/WishlistPage';
import Services from '../views/services/Services';
import ServiceDetails from '../views/services/ServiceDetails'; // <--- 1. ADD IMPORT HERE
import AdminRoute from './AdminRoute';
import Success from '../views/listing/Success';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/listing/:id" element={<ListingDetails />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/wishlists" element={<WishlistPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/success" element={<Success />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPanel />} />
      </Route>
      {/* Services Page */}
      <Route path="/services" element={<Services />} />
      <Route path="/admin" element={<AdminPanel />} />
      {/* 2. ADD THIS NEW ROUTE */}
      <Route path="/services/:id" element={<ServiceDetails />} />
    </Routes>
  );
};

export default AppRoutes;