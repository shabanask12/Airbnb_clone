// src/services/listingService.js
const API_URL = "http://localhost:5000/api/listings"; 

export const fetchAllListings = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error fetching data');
    const rawData = await response.json();
    
    return rawData.map(item => ({
      id: item.id,
      title: item.title,
      location: item.location,
      price: parseFloat(item.price),
      rating: item.rating || 0,
      
      // FIX 1: Handle both names. If 'image_url' is missing, use 'image'
      image_url: item.image_url || item.image, 
      
      category: item.category || 'General',
      type: item.type || 'Local', 
      duration: item.duration, 
      guests: item.guests 
    }));
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    throw error;
  }
};

export const fetchListingById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        
        // If the ID doesn't exist in DB, this throws an error
        if (!response.ok) throw new Error('Listing not found');
        
        const item = await response.json();
        
        return {
            id: item.id,
            title: item.title,
            location: item.location,
            price: parseFloat(item.price),
            rating: item.rating,
            
            // FIX 1: Same fix for the details page
            image_url: item.image_url || item.image, 
            
            description: item.description,
            guests: item.guests,
            duration: item.duration,
            
            // FIX 2: Ensure this is ALWAYS an array (prevents "Unexpected token" crash)
            facilities: item.facilities ? item.facilities.split(',') : [],
            category: item.category 
        };
    } catch (error) {
        console.error("Error fetching details:", error);
        return null;
    }
};