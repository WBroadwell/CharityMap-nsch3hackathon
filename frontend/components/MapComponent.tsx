"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  distance: number;
  coordinates?: Coordinates;
}

interface MapComponentProps {
  userLocation: Coordinates;
  events: EventWithDistance[];
}

// Fix for default marker icons in Leaflet with Next.js
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const eventIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to recenter map when location changes
function RecenterMap({ center }: { center: Coordinates }) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);

  return null;
}

export default function MapComponent({ userLocation, events }: MapComponentProps) {
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={10}
      scrollWheelZoom={true}
      className="w-full h-[600px] rounded-xl z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap center={userLocation} />

      {/* User location marker */}
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Popup>
          <div className="text-center">
            <strong className="text-blue-600">Your Location</strong>
          </div>
        </Popup>
      </Marker>

      {/* Event markers */}
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
