import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';
import './WishlistModal.css';

const WishlistModal = ({ onClose, onSave, listing }) => {
  const [view, setView] = useState('list'); 
  const [existingLists, setExistingLists] = useState([]);
  const [newListName, setNewListName] = useState('');

  // Fetch existing wishlist names
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/wishlist-names')
      .then(res => res.json())
      .then(data => setExistingLists(data))
      .catch(err => console.error(err));
  }, []);

  const handleCreateNew = () => {
    if (newListName.trim()) {
      onSave(newListName);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}><FaTimes /></button>
          <h3>{view === 'create' ? 'Name this wishlist' : 'Save to wishlist'}</h3>
        </div>

        <div className="modal-body">
          
          {/* VIEW 1: SELECT EXISTING LIST */}
          {view === 'list' && (
            <div className="list-view">
               
               {/* --- EXISTING LISTS (TEXT ONLY) --- */}
               <div className="existing-lists">
                 {existingLists.length > 0 ? (
                    existingLists.map((name, index) => (
                      <button 
                        key={index} 
                        className="wishlist-option"
                        onClick={() => onSave(name)}
                      >
                        {/* No Image Here - Just Text */}
                        <span className="list-name">{name}</span>
                      </button>
                    ))
                 ) : (
                   <p className="empty-msg">No wishlists yet.</p>
                 )}
               </div>

               {/* --- CREATE NEW BUTTON --- */}
               <button className="create-row-btn" onClick={() => setView('create')}>
                 <div className="plus-box"><FaPlus size={14}/></div>
                 <span>Create new wishlist</span>
               </button>
            </div>
          )}

          {/* VIEW 2: CREATE NEW FORM (Same as before) */}
          {view === 'create' && (
            <div className="create-form">
               <input 
                 type="text" 
                 placeholder="Name" 
                 maxLength={50}
                 autoFocus
                 value={newListName}
                 onChange={(e) => setNewListName(e.target.value)}
               />
               <p className="char-count">{newListName.length}/50 characters</p>
               
               <div className="create-actions">
                  <button className="btn-text" onClick={() => setView('list')}>Cancel</button>
                  <button 
                    className="btn-black" 
                    disabled={!newListName.trim()}
                    onClick={handleCreateNew}
                  >
                    Create
                  </button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default WishlistModal;