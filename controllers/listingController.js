// src/controllers/listingController.js
import { useState, useEffect } from 'react';
// IMPORT from the service layer
import { fetchAllListings } from '../services/listingService'; 

export const useListingController = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllListings();
        setListings(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load listings.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { listings, loading, error };
};