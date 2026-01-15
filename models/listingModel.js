export class ListingModel {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.location = data.location;
    this.price = data.price;
    this.rating = data.rating || 0;
    this.image = data.image;
    this.category = data.category;
    
    // --- ADD THIS LINE ---
    this.type = data.type; // Now the model accepts the 'type' field
    
    // While we are here, add these too so your details page works later
    this.guests = data.guests;
    this.duration = data.duration;
  }
}