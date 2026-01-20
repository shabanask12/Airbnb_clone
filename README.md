# 🏡 Airbnb Clone – Full Stack Web Application

A full‑stack Airbnb‑style booking platform built with **React + Flask + MySQL + Stripe**.
This project demonstrates real‑world features like authentication with OTP, property listings, wishlist management, secure online payments, booking confirmation, and an admin panel.

---

## 🚀 Tech Stack

### Frontend

* React (with React Router)
* Stripe Elements (for secure payments)
* CSS (custom styling)

### Backend

* Flask (Python)
* MySQL (database)
* Stripe API (Payment Gateway)
* Flask‑Session + Cookies (authentication)
* SMTP (Email OTP & booking confirmation)

---

## ✨ Key Features

### 🔐 Authentication & Security

* User Signup with **Email OTP verification via Gmail (SMTP)**
* Secure Login / Logout using Flask sessions
* Password hashing with **bcrypt**
* Session-based authentication with expiry

---

### 📧 SMTP Email System (OTP & Notifications)

* Integrated **Gmail SMTP** for sending real emails
* OTP is delivered directly to user’s Gmail during signup
* Booking confirmation email sent after successful payment
* Secure email sending using Gmail App Password

---

### 🏘️ Property Listings

* User Signup with **Email OTP verification**
* Secure Login / Logout using Flask sessions
* Password hashing with **bcrypt**
* Session‑based authentication with expiry

---

### 🏘️ Property Listings

* View all available listings
* View detailed page for a single listing
* Listings stored and fetched from MySQL database

---

### ❤️ Wishlist System

* Logged‑in users can:

  * Add properties to wishlist
  * Create multiple wishlist categories
  * View only their own saved wishlists

---

### 📅 Booking System

* Select:

  * Check‑in date
  * Check‑out date
* Backend calculates:

  * Number of nights
  * Final price with **18% GST**
* Booking stored only after successful payment

---

### 💳 Stripe Payment Gateway (Core Feature 🔥)

Secure end‑to‑end payment integration using **Stripe PaymentIntents**.

#### How payment works:

1. Frontend sends booking details (listing + dates) to backend
2. Backend:

   * Fetches real price from database
   * Calculates nights + GST
   * Creates a Stripe `PaymentIntent`
3. Frontend opens Stripe Checkout using `clientSecret`
4. User completes payment (Card / UPI / Netbanking)
5. Stripe redirects to success page with `payment_intent_id`
6. Backend verifies payment directly with Stripe API
7. Only after verification, booking is saved in MySQL

✅ No card data is ever handled by backend (PCI compliant)

---

### ✅ Booking Confirmation

* After successful payment:

  * Booking details saved in database
  * Success page shows confirmation message
  * Reference ID displayed to user
* Automatic protection from:

  * Fake payments
  * Duplicate booking saves (React Strict Mode handled)

---

### 🛠️ Admin Panel

* Admin can:

  * Add new listings
  * Add new services
* Separate admin routes with role checking

---

### 📧 Email System

* OTP sent via email during signup
* Booking confirmation email sent after successful booking

---

## 🔒 Security Highlights

* Price is **never trusted from frontend** – always recalculated on backend
* Payments are verified directly from Stripe before saving bookings
* Card details are handled only by Stripe (not stored in app)
* Environment variables used for:

  * Stripe Secret Key
  * Email credentials
  * Flask secret key

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/shabanask12/Airbnb_clone.git
cd Airbnb_clone
```

---

### 2️⃣ Backend Setup (Flask)

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
SENDER_EMAIL=your_email@gmail.com
APP_PASSWORD=your_gmail_app_password
SECRET_KEY=your_flask_secret
```

Run backend:

```bash
python app.py
```

Backend runs on:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup (React)

Install packages:

```bash
npm install
```

Start frontend:

```bash
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🧪 Stripe Test Cards

Use these in **test mode only**:

```
Card: 4242 4242 4242 4242
Expiry: Any future date
CVV: Any 3 digits
```

---

## 📌 Future Improvements

* Guest count support in bookings
* Booking cancellation & refund system
* Reviews & ratings by users
* Image upload instead of image URLs
* Deployment on cloud (AWS / Render / Railway)

---

## 💼 Resume Highlight

This project demonstrates:

* Full‑stack development
* Secure payment integration
* Real‑world booking workflow
* Authentication, authorization, and admin management

---

## 🙌 Author

**Shabana Shaikh**


---


Screenshot

<img width="800" height="412" alt="image" src="https://github.com/user-attachments/assets/dc7e2905-675f-4c3e-b41e-da5117faa0be" />

<img width="1280" height="248" alt="image" src="https://github.com/user-attachments/assets/398da918-fed6-4db8-a49b-fc990a6d2f11" />

<img width="1912" height="1071" alt="image" src="https://github.com/user-attachments/assets/1561fa0f-3f04-4c52-98ff-37fb9ce328bb" />

<img width="1894" height="987" alt="image" src="https://github.com/user-attachments/assets/7b50688b-f77a-4a53-8013-6cb3e44b48c7" />

<img width="1919" height="974" alt="image" src="https://github.com/user-attachments/assets/cf7b8309-9f67-4b0e-8b41-de1fd6036451" />

<img width="1914" height="949" alt="image" src="https://github.com/user-attachments/assets/8b99cca3-3740-4c4e-9c9c-8c75a85cfb9f" />


<img width="1912" height="945" alt="image" src="https://github.com/user-attachments/assets/92431d9f-e6f1-497e-9802-05236c325b2f" />

<img width="1918" height="1077" alt="image" src="https://github.com/user-attachments/assets/82988448-da9b-4e4e-86ae-77a3177f33c1" />

<img width="1917" height="1034" alt="image" src="https://github.com/user-attachments/assets/2f730991-2233-429e-9af4-57be85ddcc01" />

Admin Panel

<img width="1893" height="1088" alt="image" src="https://github.com/user-attachments/assets/f1f17df4-111a-4f39-8cf4-980b3095e99c" />








⭐ If you like this project, don’t forget to star the repository!
