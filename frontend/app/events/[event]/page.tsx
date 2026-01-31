"use client";
import React, { useState, useEffect } from 'react';
import { Event } from '@/types/Event';


interface EventPageProps {
  params: Promise<{ eventid: string }>;
}

export default function IndividualEvent({ params }: EventPageProps) {
    const { eventid } = React.use(params);
    const [eventDetails, setEventDetails] = useState<Event | null>(null);

    useEffect(() => {
        // Fetch event details using eventid when implemented
        console.log("Event ID:", eventid);
        const fetchEventDetails = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
            const response = await fetch(`${baseUrl}/events/${eventid}`);
            if (response.ok) {
                const data = await response.json();
                setEventDetails(data);
            } else {
                console.error("Failed to fetch event details");
            }
        };
        fetchEventDetails();
    }, [eventid]);
    return (
        <main className="flex min-h-screen flex-col p-16">
            {eventDetails != null ? (
                <>
                    <h1 className="text-4xl font-bold mb-4">{eventDetails.name}</h1>
                    <p className="text-lg mb-2"><strong>Host:</strong> {eventDetails.host}</p>
                    <p className="text-lg mb-2"><strong>Date:</strong> {new Date(eventDetails.date).toLocaleDateString()}</p>
                    <p className="text-lg mb-2"><strong>Location:</strong> {eventDetails.location}</p>
                    <p className="text-lg"><strong>Description:</strong> {eventDetails.description}</p>
                </>
            ) : (
                <p>Loading event details...</p>
            )}
        </main>
    );
}