import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';
import './ListingCard.css';

// 1. Add a "type" prop to the component arguments
const ListingCard = ({ listing, onWishlistClick, isSaved, type }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // 2. CHECK: Is this a service or a house?
    // We check the prop passed from the parent, OR the internal listing.type
    if (type === 'service' || listing.type === 'Service') {
      navigate(`/services/${listing.id}`);
    } else {
      navigate(`/listing/${listing.id}`);
    }
  };

  return (
    <div className="listing-card" onClick={handleCardClick}>
      <div className="image-container">
        <img src={listing.image_url || listing.image} alt={listing.title} />
        
        {/* Only show Heart icon if it's NOT a service (optional preference) */}
        {type !== 'service' && (
           <button 
             className={`wishlist-btn ${isSaved ? 'active' : ''}`} 
             onClick={(e) => {
               e.stopPropagation(); // Stop card click
               onWishlistClick && onWishlistClick();
             }}
           >
             <FaHeart />
           </button>
        )}
      </div>

      <div className="card-details">
        <div className="card-header">
          <h3>{listing.title}</h3>
          <div className="rating">
            <FaStar /> <span>{listing.rating || 'New'}</span>
          </div>
        </div>
        <p className="location">{listing.location}</p>
        <p className="date-range">
            {/* Show duration for services, dates for homes */}
            {listing.duration ? listing.duration : "22-27 Jul"}
        </p>
        <div className="price">
          <strong>₹{listing.price.toLocaleString()}</strong> 
          {/* Hide "night" label for services if you want */}
          <span> {type === 'service' ? '/ session' : ' night'}</span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;