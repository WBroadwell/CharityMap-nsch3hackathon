/**
 * Event Type Definition
 *
 * Represents a charity event as returned from the API.
 * Used throughout the frontend for type safety.
 */

export interface Event {
    id: number;                    // Unique event identifier
    name: string;                  // Event title
    host: string;                  // Organization hosting the event
    date: Date;                    // When the event takes place
    location: string;              // Address or venue name
    latitude: number | null;       // For map positioning (optional)
    longitude: number | null;      // For map positioning (optional)
    description: string;           // Event details
    contact_info: string | null;   // How to reach organizers (optional)
    user_id: number;               // ID of the user who created the event
    distanceFromUser?: number;     // Calculated distance in miles (only on map page)
}
