/**
 * Map Component
 *
 * An interactive map that displays charity events near the user's location.
 * Uses Leaflet for map rendering and OpenStreetMap for tiles.
 *
 * Features:
 * - Shows user's current location (blue marker)
 * - Displays nearby events as red markers
 * - Clicking an event marker shows details and a link to the event page
 * - Supports two-finger scroll/pinch zoom on touch devices
 */

"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GestureHandling } from "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";

// Enable gesture handling for better mobile experience
// Requires two-finger scroll instead of one to pan the map
L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

// Type definitions
interface Coordinates {
  lat: number;
  lng: number;
}

interface EventWithDistance {
  id: number;
  name: string;
  host: string;
  date: Date;
  location: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  distance: number;           // Miles from user's location
  coordinates?: Coordinates;  // Parsed lat/lng for map
}

interface MapComponentProps {
  userLocation: Coordinates;
  events: EventWithDistance[];
}

// Custom marker icon for user's location (blue)
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom marker icon for events (red)
const eventIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/**
 * MapController - Internal component to manage map state
 *
 * Handles recentering the map when the user's location changes
 * and enables gesture handling for better mobile UX.
 */
function MapController({ center }: { center: Coordinates }) {
  const map = useMap();

  // Recenter map when location changes
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);

  // Enable two-finger scroll on touch devices
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (map as any).gestureHandling?.enable();
  }, [map]);

  return null;
}

/**
 * MapComponent - Main exported component
 *
 * Renders the Leaflet map with user location and event markers.
 */
export default function MapComponent({ userLocation, events }: MapComponentProps) {
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={10}
      scrollWheelZoom={true}
      className="w-full h-[600px] rounded-xl z-0"
    >
      {/* Map tiles from OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Controller for map state management */}
      <MapController center={userLocation} />

      {/* User's location marker (blue) */}
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Popup>
          <div className="text-center">
            <strong className="text-blue-600">Your Location</strong>
          </div>
        </Popup>
      </Marker>

      {/* Event markers (red) */}
      {events.map((event) => (
        event.coordinates && (
          <Marker
            key={event.id}
            position={[event.coordinates.lat, event.coordinates.lng]}
            icon={eventIcon}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-gray-800 text-lg">{event.name}</h3>
                <p className="text-rose-500 text-sm">{event.host}</p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>{event.location}</p>
                  <p className="mt-1">
                    <span className="font-semibold text-rose-600">{event.distance.toFixed(1)} miles</span> away
                  </p>
                </div>
                <a
                  href={`/events/${event.id}`}
                  className="mt-3 inline-block w-full text-center bg-rose-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-rose-600 transition"
                >
                  View Details
                </a>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}
