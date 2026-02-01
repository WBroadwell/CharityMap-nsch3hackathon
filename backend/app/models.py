"""
Database Models Module

This module defines all the database tables (models) used in CharityMap:
- User: Organizations that can create and manage events
- InviteToken: One-time tokens used to invite new organizations
- Event: Charity events created by organizations
"""

from datetime import datetime

import bcrypt
from database import db


class User(db.Model):
    """
    User Model - Represents an organization account

    Users are organizations (like charities or nonprofits) that can:
    - Sign in to their account
    - Create and manage charity events
    - Admin users can also send invites to new organizations
    """

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)  # Bcrypt hashed password
    organization_name = db.Column(db.String(100), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)  # Admins can send invites
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship: A user can have many events
    events = db.relationship("Event", backref="creator", lazy=True)

    def set_password(self, password):
        """Hash and store a password using bcrypt"""
        self.password_hash = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

    def check_password(self, password):
        """Verify a password against the stored hash"""
        return bcrypt.checkpw(
            password.encode("utf-8"), self.password_hash.encode("utf-8")
        )

    def __repr__(self):
        return f"<User {self.email}>"


class InviteToken(db.Model):
    """
    Invite Token Model - One-time registration tokens

    These tokens are created by admin users to invite new organizations.
    Each token is tied to a specific email address and can only be used once.
    """

    __tablename__ = "invite_tokens"

    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(64), unique=True, nullable=False)  # Random secure token
    email = db.Column(db.String(120), nullable=False)  # Email this invite is for
    used = db.Column(db.Boolean, default=False)  # Becomes True after registration
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<InviteToken {self.email}>"


class Event(db.Model):
    """
    Event Model - Represents a charity event

    Events are created by organizations and displayed on the platform.
    They include location data for the map feature.
    """

    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # Event title
    host = db.Column(db.String(100), nullable=False)  # Organization name (auto-filled)
    date = db.Column(db.Date, nullable=False)  # When the event takes place
    location = db.Column(db.String(150), nullable=False)  # Address or venue name
    latitude = db.Column(db.Float, nullable=True)  # For map positioning
    longitude = db.Column(db.Float, nullable=True)  # For map positioning
    description = db.Column(db.String(255), nullable=True)  # Event details
    contact_info = db.Column(db.String(255), nullable=True)  # How to reach organizers
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    def __repr__(self):
        return f"<Event {self.name}>"
