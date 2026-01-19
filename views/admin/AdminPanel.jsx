import React, { useState } from 'react';
import { addListing, addService } from '../../services/adminService';
import { FaHome, FaConciergeBell, FaSignOutAlt, FaPlusCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css'; 

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('listing');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Initial Form State
  const initialForm = {
    title: '', location: '', price: '', description: '',
    image_url: '', category: 'General', guests: 2,
    facilities: '', duration: '' 
  };

  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'listing') {
        await addListing(formData);
        setMessage('✅ New Home Listing Added!');
      } else {
        await addService(formData);
        setMessage('✅ New Service Added!');
      }
      setFormData(initialForm);
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error adding item. Check console.');
      console.error(error);
    }
  };

  const handleLogout = () => {
    // You might want to call a logout API here
    navigate('/');
  };

  return (
    <div className="admin-layout">
      
      {/* 1. RENAMED CLASS: admin-sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
           <h2>Admin<span style={{color:'#ff385c'}}>Panel</span></h2>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={activeTab === 'listing' ? 'nav-item active' : 'nav-item'} 
            onClick={() => setActiveTab('listing')}
          >
            <FaHome /> Add Home
          </button>
          
          <button 
            className={activeTab === 'service' ? 'nav-item active' : 'nav-item'} 
            onClick={() => setActiveTab('service')}
          >
            <FaConciergeBell /> Add Service
          </button>
        </nav>

        <div className="sidebar-footer">
           <button className="nav-item logout" onClick={handleLogout}>
             <FaSignOutAlt /> Back to Site
           </button>
        </div>
      </aside>

      {/* 2. RENAMED CLASS: admin-main-content */}
      <main className="admin-main-content">
        <header className="content-header">
           <h1>{activeTab === 'listing' ? 'Add New Property' : 'Add New Service'}</h1>
           <p>Fill in the details below to publish to the live site.</p>
        </header>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="admin-form">
            {/* ... Form content remains exactly the same ... */}
             <div className="form-group">
              <label>Title</label>
              <input name="title" value={formData.title} onChange={handleChange} required placeholder={activeTab === 'listing' ? "e.g. Sea View Villa" : "e.g. City Tour"} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input name="location" value={formData.location} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input name="price" type="number" value={formData.price} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input name="image_url" value={formData.image_url} onChange={handleChange} required placeholder="https://..." />
            </div>

            <div className="form-row">
              <div className="form-group">
                 <label>Category</label>
                 <select name="category" value={formData.category} onChange={handleChange}>
                   <option>General</option>
                   <option>Beachfront</option>
                   <option>Trending</option>
                   {activeTab === 'service' && <option>Tours</option>}
                   {activeTab === 'service' && <option>Cleaning</option>}
                 </select>
              </div>
              
              {activeTab === 'listing' ? (
                <div className="form-group">
                  <label>Max Guests</label>
                  <input name="guests" type="number" value={formData.guests} onChange={handleChange} />
                </div>
              ) : (
                <div className="form-group">
                  <label>Duration</label>
                  <input name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 2 Hours" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Facilities / Includes (Comma separated)</label>
              <input name="facilities" value={formData.facilities} onChange={handleChange} placeholder="Wifi, Pool, Breakfast" />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" rows="5" value={formData.description} onChange={handleChange} required />
            </div>

            <button type="submit" className="submit-btn">
               <FaPlusCircle /> {activeTab === 'listing' ? 'Publish Listing' : 'Publish Service'}
            </button>
            
            {message && <div className={`status-msg ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;