import React from 'react';
import { FaHeart, FaStar, FaClock } from 'react-icons/fa'; // Added FaClock
import { useNavigate } from 'react-router-dom';
import './Home.css';

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="listing-card" 
      onClick={() => navigate(`/listing/${listing.id}`)}
    >
      <div className="image-container">
        <img src={listing.image} alt={listing.title} />
        <div className="heart-icon"><FaHeart /></div>
        {/* Optional: Show Category Badge on Image */}
        <div className="category-badge">{listing.category}</div>
      </div>
      
      <div className="details">
        <div className="header">
          <span className="location">{listing.location}</span>
          <span className="rating">
             <FaStar className="star"/> {listing.rating}
          </span>
        </div>

        {/* Updated to show Duration from DB */}
        <p className="description" style={{color: '#717171', margin: '4px 0', fontSize: '0.9rem'}}>
           <FaClock style={{marginRight: '5px'}}/> 
           {listing.duration || 'Flexible duration'}
        </p>

        <p className="price">
           {/* toLocaleString adds commas (e.g., 4,500) */}
           <strong>₹{listing.price.toLocaleString()}</strong> 
        </p>
      </div>
    </div>
  );
};

export default ListingCard;