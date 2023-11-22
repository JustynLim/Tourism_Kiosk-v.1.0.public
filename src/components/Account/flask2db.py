from flask import Flask, request, jsonify, g, session, current_app
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, current_user, get_jwt_identity
from datetime import timedelta
import os; import sqlite3; import hashlib; import uuid
import jwt
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from dotenv import load_dotenv
import qrcode


load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get('PYTHON_BACKEND_JWT_API_KEY') # env key
# app.secret_key = 'Key from .env file'
CORS(app, supports_credentials=True, origins="*")

# Configure logging
logging.basicConfig(level=logging.DEBUG)

### Global variable ###
global_path         = os.path.dirname(__file__)
db_path             = os.path.join(global_path, "db")

# Global variable declarations
user_table_definition = """
CREATE TABLE USERS (FIRST_NAME TEXT,LAST_NAME TEXT, EMAIL TEXT UNIQUE COLLATE NOCASE, PASSWORD_HASH TEXT,RECORD_ID TEXT)"""

# Connect to db. Create entity
path_db_file = os.path.join(db_path, "database.db")
connection = sqlite3.connect(path_db_file)
cursor_master = connection.cursor()
cursor_master.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='USERS'")
if cursor_master.fetchone() is None:
    cursor = connection.cursor()
    cursor.execute(user_table_definition)
    connection.commit()
    cursor.close()

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(path_db_file)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(error):
    if 'db' in g:
        g.db.close()

cursor_master.close(); connection.close()

def encrypt_pw(salt,password):
    encrypt = hashlib.sha512((salt + password).encode("UTF-8")).hexdigest()
    return encrypt

def fetch_user_profile(email):
    try:
        db_conn = get_db()
        cursor = db_conn.cursor()

        cursor.execute("""
            SELECT FIRST_NAME, LAST_NAME, EMAIL
            FROM USERS
            WHERE lower(EMAIL) = lower(?)
        """, (email,))

        user_profile = cursor.fetchone()

        cursor.close()
        db_conn.close()

        return dict(user_profile) if user_profile else None

    except Exception as e:
        raise e

def fetch_purchase_history(email):
    try:
        db_conn = get_db()
        cursor = db_conn.cursor()

        query = """
            SELECT ORDER_ID, PLACE_NAME, GROUP_CONCAT(ITEM_NAME || ': ' || QUANTITY, ', ') AS ITEM_QUANTITY_LIST
            FROM TRANSACTIONS
            WHERE lower(USER_EMAIL) = lower(?)
            GROUP BY ORDER_ID, PLACE_NAME
            ORDER BY TRANSACTION_ID DESC
        """

        print("SQL Query:", query)
        print("Parameters:", (email,))

        cursor.execute(query, (email,))

        purchase_history = cursor.fetchall()

        cursor.close()
        db_conn.close()

        return [dict(row) for row in purchase_history]

    except Exception as e:
        raise e

def fetch_purchase_details_by_order_id(db_conn, order_id):
    try:
        cursor = db_conn.cursor()

        query = """
            SELECT PLACE_NAME,  GROUP_CONCAT(ITEM_NAME || ': ' || QUANTITY, ', ') AS ITEM_QUANTITY_LIST
            FROM TRANSACTIONS
            WHERE ORDER_ID = ?
        """
        print("Debug SQL Query:",query)
        print("Debug Parameters:", (order_id,))

        cursor.execute(query, (order_id,))
        purchase_history = cursor.fetchone()

        print("Debug Purchase History:", purchase_history)

        cursor.close()

        return dict(purchase_history) if purchase_history else {}

    except Exception as e:
        raise e

def update_password(email, new_password):
    db_conn = None
    try:
        db_conn = get_db()
        cursor = db_conn.cursor()

        # Fetch the existing record_id for current user
        cursor.execute("""SELECT RECORD_ID FROM USERS WHERE lower(EMAIL) = lower(?)""", (email,))

        existing_record_id = cursor.fetchone()

        if existing_record_id is not None:
            salt = existing_record_id[0]
            password_hash = encrypt_pw(salt, new_password)

            # Update the PASSWORD_HASH and RECORD_ID fields with the new values
            cursor.execute("""UPDATE USERS SET PASSWORD_HASH = ?, RECORD_ID = ? WHERE lower(EMAIL) = lower(?)""", (password_hash, salt, email)) 
            db_conn.commit()

        else:
            raise Exception('User not found')

    except Exception as e:
        app.logger.error("Error updating password for user %s: %s",email,str(e))
        raise e
    
    finally:
            if db_conn:
                db_conn.close()

@app.route('/register/', methods = ['POST'])
def registration():
    data        = request.get_json()
    first_name  = data.get('firstName')
    last_name   = data.get('lastName')
    email       = data.get('email').lower()
    password    = data.get('password')
    
    path_db_file = os.path.join(db_path, "database.db")
    db_conn = sqlite3.connect(path_db_file)
    cursor_user = db_conn.cursor()
    cursor_user.execute("SELECT * FROM Users WHERE lower(email)=lower(?)", (email,))
    existing_user = cursor_user.fetchone()

    if existing_user is not None:
        print("Email exist")
        return jsonify({'message': 'Email already exist'}),400
        

    else:
        salt = uuid.uuid4().hex
        cursor_user.execute("INSERT INTO Users (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD_HASH, RECORD_ID) VALUES (?,?,?,?,?)", (first_name,last_name,email, encrypt_pw(salt,password),salt))
        db_conn.commit()

    cursor_user.close()
    db_conn.close()

    print("Success")
    return jsonify({'message': 'Registration Successful'},200)


@app.route('/login/', methods = ['POST'])
def login():
    data        = request.get_json()
    email       = data.get('email')
    password    = data.get('password')

    db_conn = sqlite3.connect(path_db_file)
    cursor_user = db_conn.cursor()
    cursor_user.execute("SELECT email,password_hash,record_id FROM Users WHERE lower(email)=lower(?)", (email,))
    row = cursor_user.fetchone()
    
    if row is not None:
        salt_db = row[2]
        password_hash_db = row[1]
        password_hash = encrypt_pw(salt_db,password)
        if password_hash_db != password_hash:
            print("Incorrect password")
            return jsonify ({'message': 'Invalid credentials'}),400

        else:
            print("Login successful")
            session['user'] = {'email': email}
            session.modified = True 
            print('Session Data:', session)
            user_info = {'email': email}
            access_token = create_access_token(identity=user_info, expires_delta=timedelta(days=1))
            return jsonify({'message': 'Login successful', 'access_token': access_token}), 200
            
    else:
        print("Invalid email/password")
        return jsonify ({'message': 'Invalid email/password'}),400

def get_item_details(item_id):
    # Replace this with your actual logic to get item details from your database or items.json
    store_items = [
        {"id": 1, "name": "Adult Ticket", "price": 15.00},
        {"id": 2, "name": "Child Ticket", "price": 10.00},
    ]
    transport_items = [
        {"id": 3, "name": "Adult Ticket", "price": 5.00},
        {"id": 4, "name": "Child Ticket", "price": 3.00},
    ]

    all_items = store_items + transport_items
    for item in all_items:
        if item['id'] == item_id:
            return item

    return None

@app.route('/checkout/', methods=['POST'])
@jwt_required()
def checkout():
    try:
        data = request.get_json()
        user_email = get_jwt_identity()['email']
        cart_items = data.get('cart_items')
        place_name = data.get('place_name')

        if not user_email:
            return jsonify({'error': 'User not authenticated'}), 401
        
        if isinstance(place_name,dict):
            place_name = place_name.get('name','')

        db_conn = get_db()
        cursor_checkout = db_conn.cursor()

        order_id = str(uuid.uuid4())
        purchase_history = fetch_purchase_details_by_order_id(db_conn, order_id)

        transactions = []

        for cart_item in cart_items:
            item_id = cart_item['id']  # Directly access the 'id' key
            quantity = cart_item['quantity']

            # Retrieve item details from your database or items.json
            item_details = get_item_details(item_id)
            
            if item_details:
                item_name = item_details['name']
                item_price = item_details['price']

                print("Debug values:", user_email, place_name, item_name, item_price, quantity)

                cursor_checkout.execute("""
                    INSERT INTO TRANSACTIONS (USER_EMAIL, PLACE_NAME, ITEM_NAME, ITEM_PRICE, QUANTITY, ORDER_ID)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (user_email, place_name, item_name, item_price, quantity, order_id))

                transactions.append({
                    'place_name': place_name,
                    'item_name': item_name,
                    'item_price': item_price,
                    'quantity': quantity,
                    'order_id': order_id,
                })
            else:
                print(f"Item with id {item_id} not found")

        send_confirmation_email(user_email, transactions, db_conn)

        db_conn.commit()
        cursor_checkout.close()

        return jsonify({'message': 'Checkout successful'}), 200

    except Exception as e:
        app.logger.error("Error during checkout: %s", e)
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    try:
        user_identity = get_jwt_identity()
        user_email = user_identity['email']  # Extract email from the dictionary
        print("User Email:", user_email)
        
        # Fetch user profile data from the database
        user_profile = fetch_user_profile(user_email)
        print("User Profile:", user_profile)
        
        return jsonify(user_profile), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/user/purchase-history', methods=['GET'])
@jwt_required()
def get_purchase_history():
    try:
        user_email = get_jwt_identity()
        if not user_email:
            return jsonify({'error': 'User not authenticated'}), 401

        # Extract email from the user_identity dictionary
        email = user_email['email']

        # Fetch purchase history from the database
        # Pass the email as a string, not as a dictionary
        purchase_history = fetch_purchase_history(email)

        return jsonify(purchase_history), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/change-password', methods=['PATCH'])
@jwt_required()
def change_password():
    try:
        user_email = get_jwt_identity()
        new_password = request.json.get('new_password')

        # Updates user password in the database
        update_password(user_email['email'], new_password)  
        return jsonify({'message': 'Password changed successfully'}), 200
    
    except Exception as e:
        app.logger.error("Error changing password: %s", str(e))
        return jsonify({'error': 'Error changing password. Please try again.'}), 500
    
    
@app.route('/api/user/logout', methods=['POST'])
@jwt_required()
def user_logout():
    # You may not need an explicit logout endpoint with JWT, as tokens are stateless.
    # Optionally, you can add additional logic (e.g., token revocation) here.
    try:
        return jsonify({'message': 'Logout successful'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}),500

@app.route('/check-auth/', methods=['GET'])
@jwt_required()
def check_auth():
    user_email = get_jwt_identity()
    #user_email = session.get('user', {}).get('email') << Incorrect logic
    return jsonify({'authenticated': bool(user_email)})
    

def generate_qr_code(order_id):
    # Generate QR Code for order_id
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(order_id)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(f"order_qr_{order_id}.png")

    return f"order_qr_{order_id}.png"

def send_confirmation_email(email, transactions, db_conn):

        smtp_server = 'smtp.gmail.com'
        smtp_port = 587  # Use the appropriate port
        sender_email = os.environ.get('PYTHON_BACKEND_SENDER_EMAIL_CREDENTIALS')        # Email address
        sender_password = os.environ.get('PYTHON_BACKEND_SENDER_PASSWORD_CREDENTIALS')  # Email password

        try:
            # Connect to the SMTP server
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(sender_email, sender_password)

            for transaction in transactions:
                place_name = transaction['place_name']
                order_id = transaction['order_id']

                # Create the email message
                subject = f"Order Confirmation {order_id}"

                # Get purchase history for the current order_id
                purchase_history_for_order = fetch_purchase_details_by_order_id(db_conn, order_id)
                print(f"Debug: place_name={place_name}, order_id={order_id}, purchase_history_for_order={purchase_history_for_order}")
                
                # Convert purchase_history to a string
                purchase_history_string = purchase_history_for_order.get('ITEM_QUANTITY_LIST', "No items")
                print(f"Debug: purchase_history_string={purchase_history_string}")

                body =  f"""<html>
                            <body>
                                <p>This is a confirmation email for Order ID: {order_id}</p>
                                <p>Summary: </p>
                                <p>Attraction name/Transport ticket: {place_name}</p>
                                <p>Item(s) purchased: {purchase_history_string}
                                <p>Thank you for your purchase!</p>
                                <p>Scan the generated QR code to gain access to services provided by: {place_name} </p>
                                <img src = "cid:qr_code_{order_id}.png">
                            </body>
                            </html>"""
                
                msg = MIMEMultipart()
                msg['From'] = sender_email
                msg['To'] = email
                msg['Subject'] = subject
                msg.attach(MIMEText(body, 'html'))

                qr_code_file = generate_qr_code(order_id)
                with open(qr_code_file, 'rb') as qr_file:
                    img_data = qr_file.read()
                    image = MIMEImage(img_data, name = f'qr_code_{order_id}.png')
                    image.add_header('Content-ID', f'<qr_code_{order_id}.png>')
                    msg.attach(image)

            # Send the email
            text = msg.as_string()
            server.sendmail(sender_email, email, text)

            # Close the connection
            server.quit()

            print("Transaction successful! Email has been sent to user's email address.")
        except Exception as e:
            print("Email error:", e)
            print("Email sending failed. Please check your email settings.")

if __name__ == '__main__':
    app.config['JWT_SECRET_KEY'] = os.environ.get('PYTHON_BACKEND_JWT_API_KEY') # env key
    jwt = JWTManager(app)
    app.run(port=4000)

# Log messages
logging.info("Server started.")