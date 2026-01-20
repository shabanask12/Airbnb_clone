from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import mysql.connector
import random
import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
from datetime import datetime, timedelta
import stripe

# 1. Load Environment Variables
load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
app = Flask(__name__)

# --- SESSION CONFIGURATION ---
app.secret_key = os.getenv("SECRET_KEY", "super_secret_secure_key_123") 
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False 

# --- CORS CONFIGURATION ---
# Allow both localhost and 127.0.0.1 so it works no matter what you type
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"], supports_credentials=True)

bcrypt = Bcrypt(app)

# 2. Database Config
db_config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'real_estate_db'
}

# 3. Email Credentials
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
APP_PASSWORD = os.getenv("APP_PASSWORD")  # <--- Make sure this is your NEW code (No Spaces!)

# --- HELPER FUNCTION: SEND EMAIL ---
def send_email(to_email, subject, body):
    msg = EmailMessage()
    msg.set_content(body)
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL
    msg['To'] = to_email

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
            smtp.login(SENDER_EMAIL, APP_PASSWORD)
            smtp.send_message(msg)
        print(f"SUCCESS: Email sent to {to_email}")
        return True
    except Exception as e:
        print("EMAIL FAILED:", e)
        return False

# ==========================================
#              AUTH ROUTES
# ==========================================
@app.route('/api/create-payment-intent', methods=['POST'])
def create_payment_intent():
    try:
        if 'user' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
            
        data = request.json
        listing_id = data.get('listing_id')
        check_in = data.get('check_in') # Format 'YYYY-MM-DD'
        check_out = data.get('check_out')

        # --- SECURITY CRITICAL: RE-CALCULATE PRICE ---
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        # 1. Get the REAL price from DB, not from frontend
        cursor.execute("SELECT price, title FROM listings WHERE id = %s", (listing_id,))
        listing = cursor.fetchone()
        cursor.close()
        conn.close()

        # ... inside create_payment_intent ...

        if not listing:
            return jsonify({'error': 'Listing not found'}), 404

        # --- FIX STARTS HERE ---
        # The frontend might send "2026-01-20" OR "2026-01-20T18:30:00.000Z"
        # .split('T')[0] handles BOTH cases safely.
        
        check_in_date = check_in.split('T')[0]  # Grab only "2026-01-20"
        check_out_date = check_out.split('T')[0] 

        d1 = datetime.strptime(check_in_date, "%Y-%m-%d")
        d2 = datetime.strptime(check_out_date, "%Y-%m-%d")
        # --- FIX ENDS HERE ---

        nights = (d2 - d1).days
        
        if nights < 1: return jsonify({'error': 'Invalid dates'}), 400

        # 3. Calculate Total (Base + 18% GST)
        # The Fix: Convert listing['price'] to float first
        raw_total = (float(listing['price']) * nights) * 1.18
        
        # Stripe expects integers (paise/cents). 
        # e.g., ₹100.50 -> 10050
        amount_in_paise = int(raw_total * 100) 

        # 4. Create the Intent
        intent = stripe.PaymentIntent.create(
            amount=amount_in_paise,
            currency='inr',
            automatic_payment_methods={'enabled': True},
            metadata={
                'user_email': session['user'],
                'listing_id': listing_id,
                'check_in': check_in,
                'check_out': check_out
            }
        )

        return jsonify({
            'clientSecret': intent.client_secret,
            'total_price': raw_total # Send back for display only
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/api/confirm-booking', methods=['POST'])
def confirm_booking():
    try:
        data = request.json
        payment_id = data.get('payment_intent_id')

        # 1. Ask Stripe: "Who paid for this ID?"
        intent = stripe.PaymentIntent.retrieve(payment_id)

        if intent['status'] != 'succeeded':
            return jsonify({'error': 'Payment not successful'}), 400

        # 2. Extract the hidden data we saved earlier
        meta = intent['metadata'] 
        # meta looks like: {'listing_id': '1', 'check_in': '2026-01-20', ...}

        # 3. Insert into MySQL (Now we store it!)
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        query = """
            INSERT INTO bookings (listing_id, user_name, check_in, check_out, guests, total_price, payment_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        # Note: You might need to add 'payment_id' column to your DB, or remove it from this query if you don't want it.
        # For now, let's assume you just want the standard fields:
        
        query_standard = """
            INSERT INTO bookings (listing_id, user_name, check_in, check_out, guests, total_price)
            VALUES (%s, %s, %s, %s, 1, %s) 
        """
        # (Assuming 1 guest for now, as metadata doesn't have guest count unless we add it)
        
        values = (meta['listing_id'], meta['user_email'], meta['check_in'], meta['check_out'], intent['amount']/100)
        
        cursor.execute(query_standard, values)
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Booking Saved Successfully!'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500 
# app.py

@app.route('/api/user/history', methods=['GET'])
def get_user_history():
    try:
        if 'user' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
            
        user_email = session['user']
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        # JOIN query to get Booking Details + Hotel Name + Image
        query = """
            SELECT 
                b.id as booking_id,
                b.check_in,
                b.check_out,
                b.total_price,
                b.payment_id,
                b.guests,
                l.title as hotel_name,
                l.image_url,
                l.location
            FROM bookings b
            JOIN listings l ON b.listing_id = l.id
            WHERE b.user_name = %s
            ORDER BY b.id DESC
        """
        
        cursor.execute(query, (user_email,))
        bookings = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(bookings)

    except Exception as e:
        return jsonify({'error': str(e)}), 500    
@app.route('/api/auth/signup-init', methods=['POST'])
def signup_init():
    try:
        data = request.json
        email = data.get('email')

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'error': 'User already exists. Please login.'}), 400

        otp = str(random.randint(100000, 999999)) 
        otp_hash = bcrypt.generate_password_hash(otp).decode('utf-8')
        expires_at = datetime.now() + timedelta(minutes=5)

        cursor.execute("""
            INSERT INTO otps (email, otp_hash, expires_at, attempts) 
            VALUES (%s, %s, %s, 0)
            ON DUPLICATE KEY UPDATE 
            otp_hash=%s, expires_at=%s, attempts=0
        """, (email, otp_hash, expires_at, otp_hash, expires_at))
        conn.commit()
        cursor.close()
        conn.close()

        # Send Email
        success = send_email(email, "Airbnb Signup Code", f"Your verification code is: {otp}")
        if success:
            return jsonify({'message': 'OTP sent!'}), 200
        else:
             # Fallback for testing if email fails
            print(f"DEBUG OTP: {otp}") 
            return jsonify({'message': 'OTP generated (Check Console)'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/signup-complete', methods=['POST'])
def signup_complete():
    try:
        data = request.json
        email = data.get('email')
        otp_input = data.get('otp')
        password = data.get('password')

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM otps WHERE email = %s", (email,))
        record = cursor.fetchone()

        if not record: return jsonify({'error': 'No OTP found.'}), 400
        if datetime.now() > record['expires_at']: return jsonify({'error': 'OTP Expired.'}), 400
        if record['attempts'] >= 3: return jsonify({'error': 'Too many attempts.'}), 429
        
        if not bcrypt.check_password_hash(record['otp_hash'], otp_input):
            cursor.execute("UPDATE otps SET attempts = attempts + 1 WHERE email = %s", (email,))
            conn.commit()
            return jsonify({'error': 'Invalid OTP'}), 400

        hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
        cursor.execute("INSERT INTO users (email, password_hash) VALUES (%s, %s)", (email, hashed_pw))
        cursor.execute("DELETE FROM otps WHERE email = %s", (email,))
        conn.commit()
        cursor.close()
        conn.close()

        session.permanent = True
        session['user'] = email
        return jsonify({'message': 'Account created!', 'user': email}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user and bcrypt.check_password_hash(user['password_hash'], password):
            session.permanent = True
            session['user'] = email
            return jsonify({'message': 'Login successful!', 'user': email}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
def check_session():
    if 'user' in session:
        email = session['user']
        
        # Connect to DB to check if this user is an admin
        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT is_admin FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            cursor.close()
            conn.close()
            
            is_admin = False
            if user and user['is_admin'] == 1:
                is_admin = True
                
            return jsonify({
                'logged_in': True, 
                'user': email,
                'is_admin': is_admin 
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
            
    return jsonify({'logged_in': False}), 200
@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'message': 'Logged out'}), 200

# ==========================================
#           CORE APP ROUTES
# ==========================================

@app.route('/api/listings', methods=['GET'])
def get_listings():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM listings")
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# app.py

@app.route('/api/listings/<int:id>', methods=['GET'])
def get_single_listing(id):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        # Query for the specific ID
        cursor.execute("SELECT * FROM listings WHERE id = %s", (id,))
        listing = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if listing: 
            return jsonify(listing)
        return jsonify({'error': 'Not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/services', methods=['GET'])
def get_services():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM services")
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/services/<int:id>', methods=['GET'])
def get_single_service(id):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM services WHERE id = %s", (id,))
        service = cursor.fetchone()
        cursor.close()
        conn.close()
        if service: return jsonify(service)
        return jsonify({'error': 'Not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    try:
        data = request.json
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = """
            INSERT INTO bookings (listing_id, user_name, check_in, check_out, guests, total_price)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (data['listing_id'], data['user_name'], data['check_in'], 
                  data['check_out'], data['guests'], data['total_price'])
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        
        if 'user' in session:
             send_email(session['user'], "Booking Confirmed", f"Your booking is confirmed!")
        elif 'user_email' in data:
             send_email(data['user_email'], "Booking Confirmed", f"Your booking is confirmed!")

        return jsonify({'message': 'Booking created!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==========================================
#           WISHLIST ROUTES (USER SPECIFIC)
# ==========================================

@app.route('/api/wishlists', methods=['GET'])
def get_wishlists():
    try:
        # 1. Check if user is logged in
        if 'user' not in session:
            return jsonify([]) # Return empty list if not logged in

        user_email = session['user'] # Get current user's email

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        # 2. ONLY fetch wishlists belonging to this email
        query = """
            SELECT w.id as wishlist_id, w.name as wishlist_name, l.* FROM wishlists w
            JOIN listings l ON w.listing_id = l.id
            WHERE w.user_email = %s 
            ORDER BY w.created_at DESC
        """
        cursor.execute(query, (user_email,)) # Pass email to query
        results = cursor.fetchall()
        
        cursor.close()
        conn.close()
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/wishlists', methods=['POST'])
def create_wishlist():
    try:
        # 1. Check if user is logged in
        if 'user' not in session:
            return jsonify({'error': 'You must be logged in to save wishlists'}), 401

        user_email = session['user']
        data = request.json
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # 2. Save the wishlist WITH the user's email
        query = "INSERT INTO wishlists (user_email, name, listing_id) VALUES (%s, %s, %s)"
        values = (user_email, data['name'], data['listing_id'])
        
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Added to wishlist!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/wishlist-names', methods=['GET'])
def get_wishlist_names():
    try:
        if 'user' not in session:
            return jsonify([])

        user_email = session['user']
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # 3. Only fetch categories for this user
        cursor.execute("SELECT DISTINCT name FROM wishlists WHERE user_email = %s", (user_email,))
        results = [row[0] for row in cursor.fetchall()]
        
        cursor.close()
        conn.close()
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
# ... inside app.py (Place this section before 'if __name__ == ...')

# ==========================================
#              ADMIN ROUTES
# ==========================================

@app.route('/api/admin/add-listing', methods=['POST'])
def add_listing():
    try:
        data = request.json
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        query = """
            INSERT INTO listings 
            (title, location, price, description, image_url, category, type, guests, facilities, rating)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        # Default rating to 4.5 if not provided
        values = (
            data['title'], data['location'], data['price'], data['description'], 
            data['image_url'], data['category'], 'Local', data['guests'], 
            data['facilities'], 4.5
        )
        
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Listing added successfully!'}), 201
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/add-service', methods=['POST'])
def add_service():
    try:
        data = request.json
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Matches your screenshot of the services table
        query = """
            INSERT INTO services 
            (title, location, price, description, image_url, category, type, guests, facilities, duration, rating)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data['title'], data['location'], data['price'], data['description'], 
            data['image_url'], data['category'], 'Service', data['guests'], 
            data['facilities'], data['duration'], 4.8
        )
        
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Service added successfully!'}), 201
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True, port=5000)
