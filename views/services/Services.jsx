// src/views/services/Services.jsx
import React, { useEffect, useState } from 'react';
import { fetchAllServices } from '../../services/serviceApi';
import ListingCard from '../home/ListingCard';
import './Services.css'; // <--- Import the new CSS

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchAllServices();
        setServices(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  if (loading) return <div className="loading-container">Finding best services...</div>;

  return (
    <div className="services-page">

      {/* New Hero Section */}
      <div className="services-hero">
        <h1>Concierge & Experiences</h1>
        <p>Enhance your stay with premium local services, tours, and housekeeping.</p>
      </div>

      <div className="services-container">
        <h2 className="section-title">Top Rated Services in Mumbai</h2>

        <div className="services-grid">
          {services.length > 0 ? (
            services.map((service) => (
              <ListingCard
                key={service.id}
                listing={service}
                type="service"  // <--- ADD THIS PROP!
              />
            ))
          ) : (
            <div className="no-data">No services available right now.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;