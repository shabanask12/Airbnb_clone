// src/views/services/ServiceDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchServiceById } from '../../services/serviceApi'; 
import { FaMapMarkerAlt, FaCheck, FaClock, FaStar, FaArrowLeft } from 'react-icons/fa';
import '../listing/ListingDetails.css'; // Keep reusing or make a new ServiceDetails.css

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadService = async () => {
      try {
        const data = await fetchServiceById(id);
        setService(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadService();
  }, [id]);

  if (loading) return <div className="loading">Loading details...</div>;
  if (!service) return <div className="error">Service not found.</div>;

  return (
    <div className="details-container">
      
      {/* Back Button (UX Improvement) */}
      <button 
        onClick={() => navigate('/services')}
        style={{marginTop: '80px', marginLeft: '40px', background:'none', border:'none', cursor:'pointer', fontSize:'1rem', display:'flex', alignItems:'center', gap:'5px', color:'#222'}}
      >
        <FaArrowLeft /> Back to Services
      </button>

      {/* Hero Image */}
      <div className="hero-section" style={{ backgroundImage: `url(${service.image_url})`, marginTop:'20px' }}>
        <div className="overlay"></div>
        <div className="hero-content">
          <span style={{background:'#ff385c', padding:'5px 12px', borderRadius:'15px', fontSize:'0.8rem', fontWeight:'bold', textTransform:'uppercase', marginBottom:'10px', display:'inline-block'}}>
            {service.category || 'Service'}
          </span>
          <h1>{service.title}</h1>
          <div className="hero-location"><FaMapMarkerAlt /> {service.location}</div>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="main-info">
          
          {/* Quick Stats Row */}
          <div style={{display:'flex', gap:'20px', padding:'20px 0', borderBottom:'1px solid #ddd'}}>
             <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                <FaClock color="#717171"/> <span>{service.duration}</span>
             </div>
             <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                <FaStar color="#ff385c"/> <span>{service.rating || 'New'} Rating</span>
             </div>
          </div>

          <div className="section">
            <h2>About this experience</h2>
            <p style={{lineHeight:'1.6', color:'#484848'}}>{service.description}</p>
          </div>

          <div className="section">
            <h2>What is included</h2>
            <div className="facilities-grid">
              {service.facilities.map((facility, index) => (
                <div key={index} className="facility-item" style={{background:'#f7f7f7', padding:'12px', borderRadius:'8px', border:'none'}}>
                  <FaCheck style={{color:'#008a05', marginRight:'8px'}} />
                  <span style={{fontWeight:'500'}}>{facility}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div className="booking-card">
          <div className="price-tag">
            <h3>₹{service.price.toLocaleString()}</h3>
            <span style={{fontSize:'0.9rem', color:'#717171'}}> total</span>
          </div>
          <hr />

          <div className="booking-form">
            <div style={{background:'#f1f1f1', padding:'15px', borderRadius:'8px', marginBottom:'20px', fontSize:'0.9rem'}}>
                <strong>Free Cancellation</strong> <br/>
                Cancel up to 24 hours before for a full refund.
            </div>
            
            <button className="book-btn" onClick={() => alert("Booking functionality coming soon!")}>
                Request to Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;