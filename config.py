
import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///site.db'  # SQLite database URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Disable track modifications
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your_jwt_secret_key')  # Secret key for JWT