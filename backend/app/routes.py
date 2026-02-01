"""
Event Routes Module

This module handles all charity event-related API endpoints:
- Listing all events (public)
- Getting a single event (public)
- Creating events (requires login)
- Updating events (requires login, must own the event)
- Deleting events (requires login, must own the event)
- Listing user's own events (requires login)
"""

from auth import token_required
from database import db
from flask import Blueprint, jsonify, request
from models import Event

# Create a Blueprint for event routes
bp = Blueprint("bp", __name__)


def serialize_event(event):
    """
    Convert an Event database object to a dictionary for JSON response.

    This ensures dates are properly formatted and all fields are included.
    """
    return {
        "id": event.id,
        "name": event.name,
        "host": event.host,
        "date": event.date.isoformat(),  # Convert date to "YYYY-MM-DD" string
        "location": event.location,
        "latitude": event.latitude,
        "longitude": event.longitude,
        "description": event.description,
        "contact_info": event.contact_info,
        "user_id": event.user_id,
    }


# =============================================================================
# PUBLIC ROUTES (no login required)
# =============================================================================


@bp.route("/events", methods=["GET"])
def get_events():
    """
    GET /events - Get all charity events

    Returns a list of all events in the database.
    Used by the events listing page and map page.
    """
    events = Event.query.all()
    return jsonify([serialize_event(e) for e in events])


@bp.route("/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    """
    GET /events/<id> - Get a single event by ID

    Returns 404 if the event doesn't exist.
    Used by the individual event detail page.
    """
    if not event_id:
        return jsonify({"error": "No event ID provided"}), 400
    event = Event.query.get_or_404(event_id)
    return jsonify(serialize_event(event))


# =============================================================================
# PROTECTED ROUTES (login required)
# =============================================================================


@bp.route("/events", methods=["POST"])
@token_required
def add_event(current_user):
    """
    POST /events - Create a new charity event

    Requires: Valid JWT token
    Request body: { name, date, location, latitude, longitude, description, contact_info }

    The host field is automatically set to the user's organization name
    to prevent people from creating fake events under other organizations.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    print("Received data:", data)

    # Create the event with the user's organization as the host
    event = Event(
        name=data["name"],
        host=current_user.organization_name,  # Auto-set from logged-in user
        date=data["date"],
        location=data["location"],
        latitude=data.get("latitude"),
        longitude=data.get("longitude"),
        description=data.get("description", "No description provided."),
        contact_info=data.get("contact_info"),
        user_id=current_user.id,  # Link event to the creating user
    )

    db.session.add(event)
    db.session.commit()

    return jsonify(serialize_event(event)), 201


@bp.route("/events/<int:event_id>", methods=["PUT"])
@token_required
def update_event(current_user, event_id):
    """
    PUT /events/<id> - Update an existing event

    Requires: Valid JWT token and ownership of the event
    Request body: { name, date, location, latitude, longitude, description, contact_info }

    Users can only edit events they created. The host cannot be changed.
    """
    event = Event.query.get_or_404(event_id)

    # Check that the user owns this event
    if event.user_id != current_user.id:
        return jsonify({"error": "You can only edit your own events"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    # Update fields (keep existing value if not provided)
    event.name = data.get("name", event.name)
    event.date = data.get("date", event.date)
    event.location = data.get("location", event.location)
    event.latitude = data.get("latitude", event.latitude)
    event.longitude = data.get("longitude", event.longitude)
    event.description = data.get("description", event.description)
    event.contact_info = data.get("contact_info", event.contact_info)
    # Note: host is NOT updatable to prevent fraud

    db.session.commit()

    return jsonify(serialize_event(event))


@bp.route("/events/<int:event_id>", methods=["DELETE"])
@token_required
def delete_event(current_user, event_id):
    """
    DELETE /events/<id> - Delete an event

    Requires: Valid JWT token and ownership of the event
    Users can only delete events they created.
    """
    event = Event.query.get_or_404(event_id)

    # Check that the user owns this event
    if event.user_id != current_user.id:
        return jsonify({"error": "You can only delete your own events"}), 403

    db.session.delete(event)
    db.session.commit()

    return jsonify({"message": "Event deleted successfully"})


@bp.route("/my-events", methods=["GET"])
@token_required
def get_my_events(current_user):
    """
    GET /my-events - Get all events created by the logged-in user

    Requires: Valid JWT token
    Used by the profile page to show the user's events.
    """
    events = Event.query.filter_by(user_id=current_user.id).all()
    return jsonify([serialize_event(e) for e in events])
