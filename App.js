import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './views/common/Navbar';
import Footer from './views/common/Footer';
import AppRoutes from './routes/AppRoutes';
import './App.css';
// This import will fail UNTIL you create the file in Step 2
import { SearchProvider } from './context/SearchContext'; 

function App() {
  return (
    <SearchProvider>
      <BrowserRouter>
        <div className="app-container">
          {/* Navbar stays at the top */}
          <Navbar />
          
          {/* Main content area */}
          <main className="main-content">
             <AppRoutes />
          </main>

          {/* Footer stays at the bottom */}
          <Footer />
        </div>
      </BrowserRouter>
    </SearchProvider>
  );
}

export default App;