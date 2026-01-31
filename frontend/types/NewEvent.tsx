export interface NewEvent {
    eventName: string;
    eventHost: string;
    date: Date;
    location: string;
    latitude: number | null;
    longitude: number | null;
    description: string;
}