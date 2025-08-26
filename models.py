from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# Create the SQLAlchemy database object.
# This "db" will be imported and initialized inside app.py
db = SQLAlchemy()


# ---------------- USER MODEL ---------------- #
class User(db.Model):
    """
    User model for storing login credentials and roles.
    Roles can be: 'user', 'admin', 'approved', 'banned'
    """
    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each user
    username = db.Column(db.String(80), unique=True, nullable=False)  # Username must be unique
    password_hash = db.Column(db.String(200), nullable=False)  # Store hashed password (not plain text!)
    role = db.Column(db.String(20), default='user')  # Default role is 'user'

    # Set password securely by hashing it before saving
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Verify password when user logs in
    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    # Convert object to dictionary (useful for JSON responses)
    def as_dict(self):
        return {"id": self.id, "username": self.username, "role": self.role}


# ---------------- ORPHANAGE MODEL ---------------- #
class Orphanage(db.Model):
    """
    Orphanage model for storing orphanage information.
    Each orphanage has a name and location.
    """
    id = db.Column(db.Integer, primary_key=True)  # Unique ID
    name = db.Column(db.String(100), nullable=False)  # Orphanage name
    location = db.Column(db.String(100), nullable=False)  # Orphanage location

    # Convert object to dictionary
    def as_dict(self):
        return {"id": self.id, "name": self.name, "location": self.location}


# ---------------- VISIT MODEL ---------------- #
class Visit(db.Model):
    """
    Visit model for storing scheduled visits.
    An organization (user) visits an orphanage on a given date.
    """
    id = db.Column(db.Integer, primary_key=True)  # Unique ID
    org_id = db.Column(db.Integer, nullable=False)  # ID of the organization (User ID)
    orphanage_id = db.Column(db.Integer, nullable=False)  # ID of the orphanage
    date = db.Column(db.String(50), nullable=False)  # Visit date (kept as string for simplicity)

    # Convert object to dictionary
    def as_dict(self):
        return {
            "id": self.id,
            "org_id": self.org_id,
            "orphanage_id": self.orphanage_id,
            "date": self.date
        }


# ---------------- ALERT MODEL ---------------- #
class Alert(db.Model):
    """
    Alert model for storing suspicious activity alerts.
    Only admins can create and view alerts.
    """
    id = db.Column(db.Integer, primary_key=True)  # Unique ID
    description = db.Column(db.String(200), nullable=False)  # Alert message/description

    # Convert object to dictionary
    def as_dict(self):
        return {"id": self.id, "description": self.description}
