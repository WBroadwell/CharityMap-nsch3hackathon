/**
 * NewEvent Type Definition
 *
 * Represents the form data for creating a new event.
 * Used by React Hook Form on the Add Event page.
 *
 * Note: The field names here (eventName, contactInfo) differ from
 * the API field names (name, contact_info). The form submission
 * handler maps these to the correct API format.
 */

export interface NewEvent {
    eventName: string;             // Maps to "name" in API
    date: Date;                    // Event date
    location: string;              // Address (set via location search)
    latitude: number | null;       // Auto-filled from location search
    longitude: number | null;      // Auto-filled from location search
    description: string;           // Event details
    contactInfo: string;           // Maps to "contact_info" in API
}
