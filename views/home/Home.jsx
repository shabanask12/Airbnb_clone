import React, { useState, useEffect } from 'react';
import ListingCard from './ListingCard';
import { fetchAllListings } from '../../services/listingService'; 
import { useSearch } from '../../context/SearchContext'; 
import WishlistModal from '../common/WishlistModal';
import './Home.css';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Track which IDs are already in the wishlist (to make hearts red)
  const [savedIds, setSavedIds] = useState([]); 

  const { searchTerm } = useSearch(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Fetch All Listings
        const allListings = await fetchAllListings(); 
        setListings(allListings);

        // 2. Fetch Wishlists (To know which hearts should be RED)
        const response = await fetch('http://127.0.0.1:5000/api/wishlists');
        if (response.ok) {
          const wishData = await response.json();
          // Extract just the listing IDs: [1, 5, 8]
          const ids = wishData.map(item => item.listing_id || item.id); 
          setSavedIds(ids);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- HANDLERS ---
  const handleHeartClick = (listing) => {
    // Only open modal if NOT already saved (Optional logic, remove check if you want to allow duplicates)
    if (savedIds.includes(listing.id)) {
      alert("This item is already in your wishlist!");
      return;
    }
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleCreateWishlist = async (name) => {
    try {
      // 1. Send to Backend
      const response = await fetch('http://localhost:5000/api/wishlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // <--- CRITICAL: Sends the "I am logged in" cookie
        body: JSON.stringify({
          name: name,
          listing_id: selectedListing.id
        }),
      });

      if (response.ok) {
        // 2. Update UI immediately (Turn heart red)
        setSavedIds((prev) => [...prev, selectedListing.id]);
        setIsModalOpen(false);
      } else {
        alert("Failed to save wishlist.");
      }
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  // --- FILTERING ---
  const filteredListings = listings.filter((listing) => {
    const term = searchTerm.toLowerCase();
    return (
      listing.location.toLowerCase().includes(term) || 
      listing.title.toLowerCase().includes(term)
    );
  });

  const localListings = filteredListings.filter(l => l.type === 'Local');
  const internationalListings = filteredListings.filter(l => l.type === 'International');

  if (loading) return <div className="loading-container">Loading homes...</div>;

  return (
    <div className="home-container" style={{ marginTop: '60px' }}>
      {searchTerm && <h3 style={{marginBottom: '20px'}}>Results for "{searchTerm}"</h3>}

      {/* Local Section */}
      {localListings.length > 0 && (
        <div className="section">
          <h2 className="section-title">Explore Local Stays</h2>
          <div className="listings-grid">
            {localListings.map((listing) => (
              <ListingCard 
                key={listing.id} 
                listing={listing}
                onWishlistClick={() => handleHeartClick(listing)}
                isSaved={savedIds.includes(listing.id)} // <--- Passes TRUE if saved
              />
            ))}
          </div>
        </div>
      )}

      {/* International Section */}
      {internationalListings.length > 0 && (
        <div className="section">
          <h2 className="section-title">International Getaways</h2>
          <div className="listings-grid">
            {internationalListings.map((listing) => (
              <ListingCard 
                key={listing.id} 
                listing={listing}
                onWishlistClick={() => handleHeartClick(listing)}
                isSaved={savedIds.includes(listing.id)} // <--- Passes TRUE if saved
              />
            ))}
          </div>
        </div>
      )}

      {/* Fallback */}
      {localListings.length === 0 && internationalListings.length === 0 && !loading && (
        <div className="no-data">No listings found.</div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <WishlistModal 
           listing={selectedListing}
           onClose={() => setIsModalOpen(false)}
           onSave={handleCreateWishlist}
        />
      )}
    </div>
  );
};

export default Home;