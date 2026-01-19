// src/services/adminService.js
const BASE_URL = "http://localhost:5000/api/admin";

export const addListing = async (listingData) => {
  const response = await fetch(`${BASE_URL}/add-listing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(listingData),
  });
  if (!response.ok) throw new Error("Failed to add listing");
  return await response.json();
};

export const addService = async (serviceData) => {
  const response = await fetch(`${BASE_URL}/add-service`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(serviceData),
  });
  if (!response.ok) throw new Error("Failed to add service");
  return await response.json();
};