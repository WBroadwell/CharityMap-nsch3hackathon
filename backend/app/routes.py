from flask import Blueprint, request, jsonify
from models import Event
from flask_cors import CORS
from database import db

bp = Blueprint("bp", __name__)

@bp.route("/events", methods=["GET"])
def get_events():
    events = Event.query.all()
    return jsonify([{"id": i.id, "name": i.name, "host": i.host, "date": i.date, "location": i.location, "description": i.description} for i in events])

@bp.route("/events", methods=["POST"])
def add_event():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400
    print("Received data:", data)
    event = Event(name=data["name"], host=data["host"], date=data["date"], location=data["location"], description=data.get("description", "No description provided."))
    db.session.add(event)
    db.session.commit()
    return jsonify({"id": event.id, "name": event.name, "host": event.host, "date": event.date, "location": event.location, "description": event.description}), 201

@bp.route("/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    if not event_id:
        return jsonify({"error": "No event ID provided"}), 400
    event = Event.query.get_or_404(event_id)
    return jsonify({"id": event.id, "name": event.name, "host": event.host, "date": event.date, "location": event.location, "description": event.description})