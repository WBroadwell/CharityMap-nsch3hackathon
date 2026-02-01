"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface LocationResult {
    display_name: string;
    lat: string;
    lon: string;
}

interface EventFormData {
    eventName: string;
    date: string;
    description: string;
    contactInfo: string;
}

interface EventData {
    id: number;
    name: string;
    host: string;
    date: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
    description: string;
    contact_info: string | null;
    user_id: number;
}

export default function EditEvent() {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const eventId = params.event;

    const [event, setEvent] = useState<EventData | null>(null);
    const [isLoadingEvent, setIsLoadingEvent] = useState(true);
    const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
    const [locationQuery, setLocationQuery] = useState("");
    const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<{
        address: string;
        lat: number;
        lng: number;
    } | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<EventFormData>();

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    // Fetch event data
    const fetchEvent = useCallback(async () => {
        try {
            const response = await fetch(`${baseUrl}/events/${eventId}`);
            if (response.ok) {
                const data: EventData = await response.json();
                setEvent(data);
                // Pre-fill form with event data
                reset({
                    eventName: data.name,
                    date: data.date.split("T")[0], // Format as YYYY-MM-DD
                    description: data.description,
                    contactInfo: data.contact_info || "",
                });
                // Set location
                setLocationQuery(data.location);
                if (data.latitude && data.longitude) {
                    setSelectedLocation({
                        address: data.location,
                        lat: data.latitude,
                        lng: data.longitude,
                    });
                }
            } else {
                setSubmissionStatus("Event not found.");
            }
        } catch (error) {
            console.error("Error fetching event:", error);
            setSubmissionStatus("Error loading event.");
        }
        setIsLoadingEvent(false);
    }, [baseUrl, eventId, reset]);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/signin");
        }
    }, [user, isLoading, router]);

    // Fetch event on load
    useEffect(() => {
        if (eventId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching on mount
            fetchEvent();
        }
    }, [eventId, fetchEvent]);

    // Search for locations using Nominatim
    const searchLocation = async () => {
        if (!locationQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&limit=5`
            );
            const data: LocationResult[] = await response.json();
            setLocationResults(data);
            setShowResults(true);
        } catch (error) {
            console.error("Location search error:", error);
        }
        setIsSearching(false);
    };

    // Select a location from search results
    const selectLocation = (result: LocationResult) => {
        setSelectedLocation({
            address: result.display_name,
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
        });
        setLocationQuery(result.display_name);
        setShowResults(false);
    };

    async function updateEvent(data: EventFormData) {
        if (!selectedLocation) {
            setSubmissionStatus("Please search and select a location.");
            return;
        }

        if (!token) {
            setSubmissionStatus("Please sign in to edit events.");
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/events/${eventId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: data.eventName,
                    date: data.date,
                    location: selectedLocation.address,
                    latitude: selectedLocation.lat,
                    longitude: selectedLocation.lng,
                    description: data.description,
                    contact_info: data.contactInfo,
                }),
            });

            if (response.ok) {
                setSubmissionStatus("Event updated successfully!");
                // Redirect to profile after short delay
                setTimeout(() => {
                    router.push("/profile");
                }, 1500);
            } else {
                const errorData = await response.json();
                setSubmissionStatus(errorData.error || "Error updating event.");
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            setSubmissionStatus("Error updating event.");
        }
    }

    // Show loading while checking auth
    if (isLoading || isLoadingEvent) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"></div>
            </main>
        );
    }

    // Show access denied for non-authenticated users
    if (!user) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign In Required</h1>
                            <p className="text-gray-600 mb-6">
                                Please sign in to edit events.
                            </p>
                            <Link
                                href="/signin"
                                className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl px-6 py-3 font-semibold hover:shadow-lg transition"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // Check if user owns this event
    if (event && event.user_id !== user.id) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
                            <p className="text-gray-600 mb-6">
                                You can only edit events that you created.
                            </p>
                            <Link
                                href="/profile"
                                className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl px-6 py-3 font-semibold hover:shadow-lg transition"
                            >
                                Back to Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!event) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                        <div className="p-8 text-center">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h1>
                            <p className="text-gray-600 mb-6">
                                The event you&apos;re trying to edit doesn&apos;t exist.
                            </p>
                            <Link
                                href="/profile"
                                className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl px-6 py-3 font-semibold hover:shadow-lg transition"
                            >
                                Back to Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Edit{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                            Event
                        </span>
                    </h1>
                    <p className="mt-3 text-gray-600">Update your event details</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                    <form className="p-8 space-y-6" onSubmit={handleSubmit(updateEvent)}>
                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-medium text-gray-700">Event Name</label>
                            <input
                                type="text"
                                id="eventName"
                                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                                placeholder="Give your event a name"
                                {...register("eventName", { required: true })}
                            />
                        </div>

                        {/* Show the organization */}
                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-medium text-gray-700">Host Organization</label>
                            <div className="border border-gray-200 bg-gray-50 rounded-xl p-3 text-gray-600">
                                {event.host}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">The host organization cannot be changed</p>
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                id="date"
                                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                                {...register("date", { required: true })}
                            />
                        </div>

                        {/* Location Search */}
                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-medium text-gray-700">Location</label>
                            <div className="relative">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={locationQuery}
                                        onChange={(e) => {
                                            setLocationQuery(e.target.value);
                                            setSelectedLocation(null);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                searchLocation();
                                            }
                                        }}
                                        className="flex-1 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                                        placeholder="Search for an address..."
                                    />
                                    <button
                                        type="button"
                                        onClick={searchLocation}
                                        disabled={isSearching}
                                        className="px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg transition disabled:opacity-50"
                                    >
                                        {isSearching ? (
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* Search Results Dropdown */}
                                {showResults && locationResults.length > 0 && (
                                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                        {locationResults.map((result, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => selectLocation(result)}
                                                className="w-full text-left px-4 py-3 hover:bg-rose-50 transition border-b border-gray-100 last:border-b-0"
                                            >
                                                <p className="text-sm text-gray-800 line-clamp-2">{result.display_name}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {showResults && locationResults.length === 0 && !isSearching && (
                                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
                                        <p className="text-sm text-gray-500 text-center">No locations found. Try a different search.</p>
                                    </div>
                                )}
                            </div>

                            {/* Selected Location Display */}
                            {selectedLocation && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                                    <div className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-green-700">Location selected</p>
                                            <p className="text-xs text-green-600 mt-1">{selectedLocation.address}</p>
                                            <p className="text-xs text-green-500 mt-1">
                                                Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                id="description"
                                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition resize-none"
                                placeholder="Tell people what this event is about..."
                                rows={4}
                                {...register("description", { required: false })}
                            ></textarea>
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-medium text-gray-700">Contact Information</label>
                            <input
                                type="text"
                                id="contactInfo"
                                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                                placeholder="Email, phone number, or website for inquiries"
                                {...register("contactInfo", { required: false })}
                            />
                            <p className="mt-1 text-xs text-gray-500">How can people reach you about this event?</p>
                        </div>

                        <div className="flex gap-4">
                            <Link
                                href="/profile"
                                className="flex-1 text-center bg-gray-200 text-gray-700 rounded-xl p-4 font-semibold hover:bg-gray-300 transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl p-4 font-semibold hover:shadow-lg hover:scale-[1.02] transition"
                            >
                                Save Changes
                            </button>
                        </div>

                        {submissionStatus && (
                            <div
                                className={`p-4 rounded-xl text-center font-medium ${
                                    submissionStatus === "Event updated successfully!"
                                        ? "bg-green-50 text-green-600 border border-green-200"
                                        : "bg-red-50 text-red-600 border border-red-200"
                                }`}
                            >
                                {submissionStatus}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
}
