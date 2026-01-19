// src/services/serviceApi.js

// 🔴 Ensure this matches your Flask port (5000)
const API_URL = "http://localhost:5000/api/services"; 

export const fetchAllServices = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error fetching services');
    const rawData = await response.json();
    
    // Transform the data so React can use it
    return rawData.map(item => ({
      id: item.id,
      title: item.title,
      location: item.location,
      price: parseFloat(item.price),
      
      // FIX 1: Handle Image URL (DB sends 'image', Frontend needs 'image_url')
      image_url: item.image_url || item.image, 
      
      description: item.description,
      duration: item.duration,
      
      // FIX 2: Ensure facilities is always an array (even if DB sends string)
      facilities: item.facilities ? item.facilities.split(',') : []
    }));
  } catch (error) {
    console.error("Failed to fetch services:", error);
    throw error;
  }
};

export const fetchServiceById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Service not found');
        
        const item = await response.json();
        
        return {
            id: item.id,
            title: item.title,
            location: item.location,
            price: parseFloat(item.price),
            
            // FIX 1: Image Mapping
            image_url: item.image_url || item.image, 
            
            description: item.description,
            duration: item.duration,
            
            // FIX 2: Split string into Array for .map()
            facilities: item.facilities ? item.facilities.split(',') : [] 
        };
    } catch (error) {
        console.error("Error fetching service details:", error);
        return null;
    }
};