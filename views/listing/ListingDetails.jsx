import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import { fetchListingById } from '../../services/listingService';
import { FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
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
  const [isSaved, setIsSaved] = useState(false);

  // 1. FETCH THE LISTING (This was likely missing or broken)
  useEffect(() => {
    const loadListing = async () => {
      try {
        setLoading(true);
        const data = await fetchListingById(id);

        // If data is null (ID not found in DB), this will stay null
        setListing(data);
      } catch (err) {
        console.error("Failed to load listing", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadListing();
  }, [id]);

  // 2. CHECK WISHLIST (Only runs if listing exists)
  useEffect(() => {
    if (!listing) return;

    const checkSavedStatus = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/wishlists', {
          method: 'GET',
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          const found = data.some(item => item.id === listing.id || item.listing_id === listing.id);
          setIsSaved(found);
        }
      } catch (err) { console.error("Wishlist check failed", err); }
    };
    checkSavedStatus();
  }, [listing]);

  const handleBooking = () => {
    if (!dateRange[0] || !dateRange[1]) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    navigate('/payment', { state: { listing, checkIn: dateRange[0], checkOut: dateRange[1], guestCount } });
  };

  if (loading) return <div className="loading">Loading...</div>;

  // ERROR STATE: If listing is null, it means ID wasn't found in DB
  if (!listing) return (
    <div className="error" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Listing not found.</h2>
      <p>The ID #{id} does not exist in the database.</p>
      <button onClick={() => navigate('/')}>Go Home</button>
    </div>
  );

  return (
    <div className="details-container">
      {/* Hero Image */}
      <div className="hero-section" style={{ backgroundImage: `url(${listing.image_url})` }}>
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>{listing.title}</h1>
          <div className="hero-location"><FaMapMarkerAlt /> {listing.location}</div>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="main-info">
          <div className="section">
            <h2>About this place</h2>
            <p>{listing.description}</p>
          </div>

          {/* FIX: Removed JSON.parse() */}
          <div className="section">
            <h2>What this place offers</h2>
            <div className="facilities-grid">
              {listing.facilities && listing.facilities.map((facility, index) => (
                <div key={index} className="facility-item">
                  <FaCheckCircle className="check-icon" />
                  <span>{facility.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOOKING CARD */}
        <div className="booking-card">
          <div className="price-tag">
            <h3>₹{listing.price.toLocaleString()}</h3>
            <span>/ night</span>
          </div>
          <hr />
          <div className="booking-form">
            <div className="input-group">
              <label>Check-in – Check-out</label>
              <Flatpickr
                className="date-input"
                placeholder="Select dates"
                options={{ mode: "range", minDate: "today", dateFormat: "Y-m-d" }}
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
              />
            </div>
            <div className="input-group">
              <label>Guests</label>
              <input
                type="number"
                className="guest-input"
                min="1"
                max={listing.guests}
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
              />
            </div>
            {error && <div className="error-msg">{error}</div>}
          </div>
          <button className="book-btn" onClick={handleBooking}>Reserve</button>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;