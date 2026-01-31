"use client";
import { useEffect, useState } from "react";
import { Event } from "@/types/Event";
import Link from "next/dist/client/link";

/*
events should be :
- id: number
- name: string
- date: string
- location: string
- description: string
- distance from user: number (in miles)
cut off at 20 miles?
*/

export default function Events() {
    const [events, setEvents] = useState<Event[] | null>(null);

    async function getEvents() {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        return await fetch(`${baseUrl}/events`).then((res) => res.json());
    }

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getEvents();
            if (data["errors"]) {
                console.error("Error fetching events:", data["errors"]);
                return;
            } else {
                console.log("Fetched events successfully:", data);
                setEvents(data);
            }
        };
        fetchEvents();
    }, []);

    /* Sort events by date then by distance from user location */
    return (
        <main className="flex min-h-screen flex-col items-center p-16">
            <h1 className="text-4xl font-bold mb-8">Upcoming Charity Events Near You</h1>
            <div className="w-full flex flex-col items-center space-y-6">
                {events == null ? (
                    <p>Loading events...</p>
                ) : events.length === 0 ? (
                    <p>No events found.</p>
                ) : (
                    events.map((event) => (
                        <Link key={event.id} href={`/events/${event.id}`} className="w-3/5 border border-gray-300 rounded-lg p-6 shadow-md hover:shadow-lg transition cursor-pointer">
                            <h2 className="text-2xl font-semibold mb-2">{event.name}</h2>
                            <p className="text-gray-600 mb-1"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                            <p className="text-gray-600 mb-1"><strong>Location:</strong> {event.location}</p>
                            <p className="text-gray-600"><strong>Distance from you:</strong>
                                
                            </p>
                        </Link>
                    ))
                )}
                
            </div>
            
        </main>
    );
}