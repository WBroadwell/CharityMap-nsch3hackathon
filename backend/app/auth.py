"""
Authentication Module

This module handles all user authentication features:
- Login and registration
- JWT token generation and validation
- Protected route decorators (token_required, admin_required)
- Invite token management for new user registration
"""

import os
import secrets
from datetime import datetime, timedelta
from functools import wraps

import jwt
from database import db
from flask import Blueprint, jsonify, request
from models import InviteToken, User

# Create a Blueprint for auth routes (all routes start with /auth)
auth_bp = Blueprint("auth", __name__)

# JWT configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
JWT_EXPIRATION_HOURS = 24  # Tokens expire after 24 hours


# =============================================================================
# AUTHENTICATION DECORATORS
# These are used to protect routes that require login or admin access
# =============================================================================


def token_required(f):
    """
    Decorator that requires a valid JWT token to access a route.

    Usage: Add @token_required above any route that needs login.
    The decorated function will receive current_user as its first argument.
    """

    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Look for token in the Authorization header (format: "Bearer <token>")
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            # Decode and validate the token
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            current_user = User.query.get(data["user_id"])
            if not current_user:
                return jsonify({"error": "User not found"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        # Pass the user to the route function
        return f(current_user, *args, **kwargs)

    return decorated


def admin_required(f):
    """
    Decorator that requires admin privileges to access a route.

    Similar to token_required, but also checks if user.is_admin is True.
    Returns 403 Forbidden if user is not an admin.
    """

    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            current_user = User.query.get(data["user_id"])
            if not current_user:
                return jsonify({"error": "User not found"}), 401
            if not current_user.is_admin:
                return jsonify({"error": "Admin access required"}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(current_user, *args, **kwargs)

    return decorated


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================


def generate_token(user):
    """
    Create a JWT token for a user.

    The token contains the user's ID and email, and expires after 24 hours.
    """
    payload = {
        "user_id": user.id,
        "email": user.email,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


# =============================================================================
# AUTHENTICATION ROUTES
# =============================================================================


@auth_bp.route("/auth/login", methods=["POST"])
def login():
    """
    POST /auth/login - Log in an existing user

    Request body: { email, password }
    Returns: { token, user } on success, or error message on failure
    """
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400

    # Find user by email (case-insensitive)
    user = User.query.filter_by(email=data["email"].lower()).first()
    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    # Generate token and return user info
    token = generate_token(user)
    return jsonify(
        {
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "organization_name": user.organization_name,
                "is_admin": user.is_admin,
            },
        }
    )


@auth_bp.route("/auth/register", methods=["POST"])
def register():
    """
    POST /auth/register - Register a new organization account

    Requires a valid invite token that matches the provided email.

    Request body: { email, password, organization_name, invite_token }
    Returns: { token, user } on success
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Check all required fields are present
    required = ["email", "password", "organization_name", "invite_token"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    # Verify the invite token exists and hasn't been used
    invite = InviteToken.query.filter_by(token=data["invite_token"], used=False).first()
    if not invite:
        return jsonify({"error": "Invalid or expired invite token"}), 400

    # Make sure the email matches the invite
    if invite.email.lower() != data["email"].lower():
        return jsonify({"error": "Email does not match invite"}), 400

    # Check if email is already registered
    if User.query.filter_by(email=data["email"].lower()).first():
        return jsonify({"error": "Email already registered"}), 400

    # Create the new user
    user = User(
        email=data["email"].lower(), organization_name=data["organization_name"]
    )
    user.set_password(data["password"])

    # Mark the invite token as used so it can't be reused
    invite.used = True

    db.session.add(user)
    db.session.commit()

    # Return token so user is logged in immediately
    token = generate_token(user)
    return jsonify(
        {
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "organization_name": user.organization_name,
                "is_admin": user.is_admin,
            },
        }
    ), 201


@auth_bp.route("/auth/me", methods=["GET"])
@token_required
def get_current_user(current_user):
    """
    GET /auth/me - Get the currently logged-in user's info

    Requires: Valid JWT token in Authorization header
    Returns: User profile information
    """
    return jsonify(
        {
            "id": current_user.id,
            "email": current_user.email,
            "organization_name": current_user.organization_name,
            "is_admin": current_user.is_admin,
        }
    )


# =============================================================================
# INVITE TOKEN ROUTES
# =============================================================================


@auth_bp.route("/auth/verify-invite/<token>", methods=["GET"])
def verify_invite(token):
    """
    GET /auth/verify-invite/<token> - Check if an invite token is valid

    Used by the registration page to verify the invite before showing the form.
    Returns: { valid: true, email } or { valid: false, error }
    """
    invite = InviteToken.query.filter_by(token=token, used=False).first()
    if not invite:
        return jsonify(
            {"valid": False, "error": "Invalid or expired invite token"}
        ), 400
    return jsonify({"valid": True, "email": invite.email})


@auth_bp.route("/auth/create-invite", methods=["POST"])
@admin_required
def create_invite(current_user):
    """
    POST /auth/create-invite - Create an invite token for a new organization

    Requires: Admin privileges
    Request body: { email }
    Returns: { token, email, invite_url }

    If an unused invite already exists for this email, returns that one instead.
    """
    data = request.get_json()
    if not data or not data.get("email"):
        return jsonify({"error": "Email required"}), 400

    # Check if there's already an unused invite for this email
    existing = InviteToken.query.filter_by(
        email=data["email"].lower(), used=False
    ).first()
    if existing:
        return jsonify(
            {
                "token": existing.token,
                "email": existing.email,
                "message": "Existing invite token returned",
            }
        )

    # Create a new secure random token
    token = secrets.token_urlsafe(32)
    invite = InviteToken(token=token, email=data["email"].lower())
    db.session.add(invite)
    db.session.commit()

    return jsonify(
        {
            "token": token,
            "email": invite.email,
            "invite_url": f"/register?token={token}",
        }
    ), 201
