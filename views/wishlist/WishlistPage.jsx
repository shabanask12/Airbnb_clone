import React, { useEffect, useState } from 'react';
import ListingCard from '../home/ListingCard';
import { FaArrowLeft } from 'react-icons/fa';
import './WishlistPage.css';

const WishlistPage = () => {
  const [allItems, setAllItems] = useState([]);
  const [folders, setFolders] = useState({}); 
  const [selectedFolder, setSelectedFolder] = useState(null); 

  useEffect(() => {
    // --- CHANGE 1: URL is now localhost ---
    fetch('http://localhost:5000/api/wishlists', {
        method: 'GET',
        credentials: 'include' // --- CHANGE 2: Send Cookie so backend knows WHO you are ---
    })
      .then(res => res.json())
      .then(data => {
        // Handle empty data (if user not logged in or has no wishlists)
        if (!data || data.length === 0) {
            setFolders({});
            return;
        }

        // 1. Format data 
        const formatted = data.map(item => ({
            ...item,
            image: item.image_url, 
            price: parseFloat(item.price), 
            rating: item.rating || 0
        }));
        setAllItems(formatted);

        // 2. Group by Wishlist Name
        const groups = {};
        formatted.forEach(item => {
            const name = item.wishlist_name || 'Uncategorized';
            if (!groups[name]) {
                groups[name] = [];
            }
            groups[name].push(item);
        });
        setFolders(groups);
      })
      .catch(err => console.error(err));
  }, []);

  // --- VIEW 1: LIST OF FOLDERS ---
  if (!selectedFolder) {
    return (
      <div className="wishlist-container">
        <h1 className="wishlist-title">Your Wishlists</h1>
        
        {Object.keys(folders).length === 0 ? (
          <div className="no-items">
             No saved trips. <br/>
             <span style={{fontSize: '14px', color: '#717171'}}>
                (Make sure you are logged in!)
             </span>
          </div>
        ) : (
          <div className="folder-grid">
            {Object.keys(folders).map((folderName) => {
               const firstItem = folders[folderName][0]; 
               const count = folders[folderName].length;
               
               return (
                 <div 
                   key={folderName} 
                   className="folder-card" 
                   onClick={() => setSelectedFolder(folderName)}
                 >
                   <div className="folder-thumb">
                       <img src={firstItem.image} alt={folderName} />
                   </div>
                   <div className="folder-info">
                       <h3>{folderName}</h3>
                       <p>{count} {count === 1 ? 'saved stay' : 'saved stays'}</p>
                   </div>
                 </div>
               );
            })}
          </div>
        )}
      </div>
    );
  }

  // --- VIEW 2: INSIDE A SPECIFIC FOLDER ---
  return (
    <div className="wishlist-container">
      <button className="back-btn" onClick={() => setSelectedFolder(null)}>
         <FaArrowLeft /> Back to folders
      </button>

      <h1 className="wishlist-title">{selectedFolder}</h1>
      
      <div className="listings-grid">
         {folders[selectedFolder].map(item => (
           <ListingCard 
             key={item.wishlist_id} 
             listing={item}
             onWishlistClick={() => console.log("Already saved")}
             isSaved={true} 
           />
         ))}
      </div>
    </div>
  );
};

export default WishlistPage;