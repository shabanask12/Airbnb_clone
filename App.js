import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './views/common/Navbar';     // 
import Footer from './views/common/Footer';     // 
import AppRoutes from './routes/AppRoutes';     // 
import './App.css';

function App() {
  return (
    // BrowserRouter wraps the app to enable routing
    <BrowserRouter>
      <div className="app-container">
        {/* Navbar stays at the top of every page */}
        <Navbar />
        
        {/* 'main' contains the changing content (Home, ListingDetails, etc.) */}
        <main className="main-content">
           <AppRoutes />
        </main>

        {/* Footer stays at the bottom */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;