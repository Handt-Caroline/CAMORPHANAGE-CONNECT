# Import necessary libraries (pre-built code we can reuse instead of writing from scratch)
from flask import Flask, jsonify, request    # Flask = main web framework, jsonify = convert Python to JSON, request = read user input
from flask_sqlalchemy import SQLAlchemy      # SQLAlchemy = database ORM (Object Relational Mapper) for managing database in Python
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity  
# JWT (JSON Web Tokens) = library for authentication (login security).  
# JWTManager = handles tokens, create_access_token = generates a token when user logs in,  
# jwt_required = protects routes, get_jwt_identity = identifies current logged-in user  

from models import db, User, Orphanage, Visit, Alert   
# Import your custom models (classes) from models.py → db = database, User = user class, etc.  
# OOP concept here: **Encapsulation & Class Usage** (models are defined as classes and reused here).


# -------------------- FLASK APP SETUP --------------------

# Initialize Flask application (creates your web app)
app = Flask(__name__)

# Load configuration from config.py (like database connection, secret keys, etc.)
app.config.from_object('config.Config')

# Connect database to this Flask app
db.init_app(app)

# Initialize JWT manager (adds security system for login)
jwt = JWTManager(app)


# -------------------- ROUTES (Endpoints) --------------------
# Routes = specific URLs your users can visit (like /signup, /login).  
# Each route is linked to a function that runs when that URL is visited.


# ------------- USER AUTHENTICATION -------------

# Route to create a new user (signup/register)
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json    # Get user input (username, password, role) in JSON format
    new_user = User(username=data['username'], role=data['role'])   # Create new User object (OOP: Class instantiation)
    new_user.set_password(data['password'])  # Call method inside User class to hash (encrypt) password
    db.session.add(new_user)   # Save new user into database
    db.session.commit()        # Confirm/save the transaction
    return jsonify(message="User created"), 201   # Respond back with success message


# Route to login an existing user
@app.route('/login', methods=['POST'])
def login():
    data = request.json   # Get input (username & password)
    user = User.query.filter_by(username=data['username']).first()  # Search for user in database
    if user and user.verify_password(data['password']):   # Check if user exists & password is correct
        access_token = create_access_token(identity=user.id)   # Generate login token (JWT)
        return jsonify(access_token=access_token), 200   # Send token to user
    return jsonify(message='Bad username or password'), 401   # If wrong login → error


# ------------- ORPHANAGE MANAGEMENT -------------

# Get all orphanages (only logged-in users)
@app.route('/orphanages', methods=['GET'])
@jwt_required()   # Protect this route (only users with valid token can access)
def get_orphanages():
    orphanages = Orphanage.query.all()   # Fetch all orphanages from DB
    return jsonify([o.as_dict() for o in orphanages]), 200   # Convert them to JSON and return


# Add a new orphanage (Admin only)
@app.route('/orphanages', methods=['POST'])
@jwt_required()
def add_orphanage():
    current_user = User.query.get(get_jwt_identity())  # Get current logged-in user
    if current_user.role != 'admin':   # Check if user is NOT an admin
        return jsonify(message='Unauthorized'), 403

    data = request.json
    new_orphanage = Orphanage(name=data['name'], location=data['location'])   # Create orphanage object
    db.session.add(new_orphanage)   # Save to database
    db.session.commit()
    return jsonify(message="Orphanage created"), 201


# Get a single orphanage by its ID
@app.route('/orphanages/<int:id>', methods=['GET'])
@jwt_required()
def get_orphanage(id):
    orphanage = Orphanage.query.get_or_404(id)   # Find orphanage or return 404 if not found
    return jsonify(orphanage.as_dict()), 200


# Update orphanage info (Admin only)
@app.route('/orphanages/<int:id>', methods=['PUT'])
@jwt_required()
def update_orphanage(id):
    current_user = User.query.get(get_jwt_identity())
    if current_user.role != 'admin':   # Only admin can update
        return jsonify(message='Unauthorized'), 403

    data = request.json
    orphanage = Orphanage.query.get_or_404(id)
    orphanage.name = data['name']         # Update orphanage name
    orphanage.location = data['location'] # Update orphanage location
    db.session.commit()
    return jsonify(message="Orphanage updated"), 200


# Delete orphanage (Admin only)
@app.route('/orphanages/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_orphanage(id):
    current_user = User.query.get(get_jwt_identity())
    if current_user.role != 'admin':
        return jsonify(message='Unauthorized'), 403

    orphanage = Orphanage.query.get_or_404(id)
    db.session.delete(orphanage)   # Remove orphanage
    db.session.commit()
    return jsonify(message="Orphanage deleted"), 200


# ------------- VISITS -------------

# Schedule a new visit
@app.route('/visits', methods=['POST'])
@jwt_required()
def schedule_visit():
    data = request.json
    new_visit = Visit(org_id=data['orgId'], orphanage_id=data['orphanageId'], date=data['date'])
    db.session.add(new_visit)
    db.session.commit()
    return jsonify(message="Visit scheduled"), 201


# Get total visit statistics
@app.route('/visits/stats', methods=['GET'])
@jwt_required()
def get_visit_statistics():
    total_visits = Visit.query.count()   # Count all visits
    return jsonify(total_visits=total_visits), 200


# ------------- ALERTS -------------

# Get all alerts (Admin only)
@app.route('/alerts', methods=['GET'])
@jwt_required()
def get_alerts():
    current_user = User.query.get(get_jwt_identity())
    if current_user.role != 'admin':
        return jsonify(message='Unauthorized'), 403

    alerts = Alert.query.all()
    return jsonify([alert.as_dict() for alert in alerts]), 200


# Create new alert
@app.route('/alerts', methods=['POST'])
@jwt_required()
def create_alert():
    data = request.json
    new_alert = Alert(description=data['description'])  # Create alert object
    db.session.add(new_alert)
    db.session.commit()
    return jsonify(message="Alert created"), 201


# ------------- ORGANIZATION MANAGEMENT -------------

# Admin approves an organization
@app.route('/organizations/<int:id>/approve', methods=['PUT'])
@jwt_required()
def approve_organization(id):
    current_user = User.query.get(get_jwt_identity())
    if current_user.role != 'admin':
        return jsonify(message='Unauthorized'), 403

    org = User.query.get_or_404(id)
    org.role = 'approved'   # Change status
    db.session.commit()
    return jsonify(message="Organization approved"), 200


# Admin bans an organization
@app.route('/organizations/<int:id>/ban', methods=['PUT'])
@jwt_required()
def ban_organization(id):
    current_user = User.query.get(get_jwt_identity())
    if current_user.role != 'admin':
        return jsonify(message='Unauthorized'), 403

    org = User.query.get_or_404(id)
    org.role = 'banned'   # Change status
    db.session.commit()
    return jsonify(message="Organization banned"), 200


# -------------------- RUN APP --------------------
if __name__ == "__main__":
    with app.app_context():   # Ensures database works inside Flask app
        db.create_all()       # Create all database tables if they don’t exist
    app.run(debug=True)       # Start the web server (debug=True means show errors in browser)
