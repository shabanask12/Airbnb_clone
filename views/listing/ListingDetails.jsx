import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css"; // Import calendar style
import { fetchListingById } from '../../services/listingService';
import { FaMapMarkerAlt, FaUserFriends, FaClock, FaStar, FaCheckCircle } from 'react-icons/fa';
import './ListingDetails.css';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking State
  const [dateRange, setDateRange] = useState([null, null]);
  const [guestCount, setGuestCount] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadListing = async () => {
      const data = await fetchListingById(id);
      setListing(data);
      setLoading(false);
    };
    loadListing();
  }, [id]);

  const handleBooking = () => {
    // Validation
    if (!dateRange[0] || !dateRange[1]) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    if (guestCount > listing.guests) {
      setError(`Max guests allowed: ${listing.guests}`);
      return;
    }

    // Navigate to Payment Page with booking data
    navigate('/payment', {
      state: {
        listing,
        checkIn: dateRange[0],
        checkOut: dateRange[1],
        guestCount
      }
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!listing) return <div className="error">Listing not found.</div>;

  return (
    <div className="details-container">
      {/* ... (Hero Section and Left Side content remain the same) ... */}
      <div className="hero-section" style={{ backgroundImage: `url(${listing.image})` }}>
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>{listing.title}</h1>
          <div className="hero-location"><FaMapMarkerAlt /> {listing.location}</div>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="main-info">
          {/* Same as before... */}
          <div className="section">
            <h2>About this place</h2>
            <p>{listing.description}</p>
          </div>
          <div className="section">
            <h2>What this place offers</h2>
            <div className="facilities-grid">
              {listing.facilities.map((facility, index) => (
                <div key={index} className="facility-item">
                  <FaCheckCircle className="check-icon" /><span>{facility}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- MODIFIED BOOKING CARD --- */}
        <div className="booking-card">
          <div className="price-tag">
            <h3>₹{listing.price.toLocaleString()}</h3>
            <span>/ night</span>
          </div>
          <hr />

          <div className="booking-form">
            {/* Date Input Group */}
            <div className="input-group">
              <label>Check-in – Check-out</label>
              <Flatpickr
                className="date-input"
                placeholder="Select dates"
                options={{
                  mode: "range",
                  minDate: "today",
                  dateFormat: "Y-m-d"
                }}
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
              />
            </div>

            {/* Guests Input Group */}
            <div className="input-group">
              <label>Guests</label>
              <input
                type="number"
                className="guest-input"
                min="1"
                max={listing.guests}
                value={guestCount}
                onChange={(e) => {
                  setGuestCount(e.target.value);
                  setError('');
                }}
              />
            </div>

            {/* Max Guest Hint */}
            <small style={{ color: '#717171', fontSize: '0.85rem' }}>
              Maximum {listing.guests} guests allowed
            </small>

            {/* Error Message */}
            {error && <div className="error-msg">{error}</div>}
          </div>

          <button className="book-btn" onClick={handleBooking}>Reserve</button>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;