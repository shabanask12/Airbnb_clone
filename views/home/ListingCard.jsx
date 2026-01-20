import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import './ListingCard.css';

const ListingCard = ({ listing, onWishlistClick, isSaved }) => {
  const navigate = useNavigate();

  return (
    <div className="listing-card">
      <div className="image-container">
        <img 
            src={listing.image_url} 
            alt={listing.title} 
            className="listing-image"
            onClick={() => navigate(`/listings/${listing.id}`)} // Click image to go to details
        />
        
        {/* --- THE MISSING HEART ICON --- */}
        <div 
            className="wishlist-icon" 
            onClick={(e) => {
                e.stopPropagation(); // Prevent going to details page when clicking heart
                onWishlistClick();
            }}
        >
            {isSaved ? (
                <FaHeart color="#ff385c" size={24} />
            ) : (
                <FaRegHeart color="white" size={24} style={{ fill: 'rgba(0, 0, 0, 0.5)', stroke: 'white', strokeWidth: '20px' }} />
            )}
        </div>
      </div>

      <div className="listing-info" onClick={() => navigate(`/listings/${listing.id}`)}>
        <div className="row-1">
          <h3 className="listing-title">{listing.title}</h3>
          <div className="rating">
            <FaStar size={12} />
            <span>{listing.rating}</span>
          </div>
        </div>
        <p className="listing-location">{listing.location}</p>
        <p className="listing-dates">1 Night</p>
        <div className="listing-price">
          <span className="price-tag">₹{listing.price.toLocaleString()}</span> night
        </div>
      </div>
    </div>
  );
};

export default ListingCard;