export interface Event {
    id: number;
    name: string;
    host: string;
    date: Date;
    location: string;
    latitude: number | null;
    longitude: number | null;
    description: string;
    distanceFromUser?: number;
}