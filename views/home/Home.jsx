import React, { useState, useEffect } from 'react';
import ListingCard from './ListingCard';
import { fetchAllListings } from '../../services/listingService';
import './Home.css';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllListings();
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  console.log("ALL LISTINGS:", listings);
  // --- FILTERING LOGIC ---
  // Ensure your Database has exactly 'Local' and 'International' in the category column
  // --- FILTERING LOGIC ---

  // 1. Local Filter (Looks at 'type')
  const localListings = listings.filter(
    (listing) => listing.type === 'Local'
  );

  // 2. International Filter (MUST look at 'type', NOT 'category')
  const internationalListings = listings.filter(
    (listing) => listing.type === 'International' 
  );
  if (loading) return <div className="loading-container">Loading homes...</div>;

  return (
    <div className="home-container">

      {/* --- Section 1: Local Places --- */}
      {localListings.length > 0 && (
        <div className="section">
          <h2 className="section-title">Explore Local Stays</h2>
          <div className="listings-grid">
            {localListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}

      {/* --- Section 2: International Places --- */}
      {internationalListings.length > 0 && (
        <div className="section">
          <h2 className="section-title">International Getaways</h2>
          <div className="listings-grid">
            {internationalListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}

      {/* Fallback if no data matches */}
      {listings.length === 0 && !loading && (
        <div className="no-data">No listings available at the moment.</div>
      )}

    </div>
  );
};

export default Home;