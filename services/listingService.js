// src/services/listingService.js
import { ListingModel } from '../models/listingModel';

const API_URL = "http://127.0.0.1:5000/api/listings";

// 1. Get ALL listings
export const fetchAllListings = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error fetching data');
    const rawData = await response.json();
    
    return rawData.map(item => new ListingModel({
      id: item.id,
      title: item.title,
      location: item.location,
      price: parseFloat(item.price),
      rating: item.rating || 0,
      image: item.image_url,
      category: item.category || 'General',
      
      // --- ADD THIS LINE ---
      type: item.type || 'Local', // Map the database column here
      
      duration: item.duration, 
      guests: item.guests 
    }));
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    throw error;
  }
};

// 2. Get SINGLE listing (Add this here!)
export const fetchListingById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Listing not found');
        
        const item = await response.json();
        
        return {
            id: item.id,
            title: item.title,
            location: item.location,
            price: parseFloat(item.price),
            rating: item.rating,
            image: item.image_url,
            description: item.description,
            guests: item.guests,
            duration: item.duration,
            facilities: item.facilities ? item.facilities.split(',') : [],
            category: item.category // Ensure category is included if needed
        };
    } catch (error) {
        console.error("Error fetching details:", error);
        return null;
    }
};