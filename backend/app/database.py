"""
Database Configuration Module

This module sets up the SQLAlchemy database instance that is shared
across the entire application. The db object is used by models to
define tables and by routes to query and modify data.
"""

from flask_sqlalchemy import SQLAlchemy

# Create the SQLAlchemy database instance
# This will be initialized with the Flask app in main.py
db = SQLAlchemy()
