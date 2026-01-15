import React from 'react';
import { Routes, Route } from 'react-router-dom';

// CORRECT IMPORTS: Only importing the page components
import Home from '../views/home/Home';
import Payment from '../views/listing/Payment';
import ListingDetails from '../views/listing/ListingDetails';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/listing/:id" element={<ListingDetails />} />
      <Route path="/payment" element={<Payment />} />
    </Routes>
  );
};

export default AppRoutes;