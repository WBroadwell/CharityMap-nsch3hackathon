"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { NewEvent } from "@/types/NewEvent";

interface LocationResult {
    display_name: string;
    lat: string;
    lon: string;
}

export default function AddEvent() {
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
        formState: { errors },
        reset,
    } = useForm<NewEvent>({
        defaultValues: {
            eventName: "",
            eventHost: "",
            date: new Date(),
            location: "",
            latitude: null,
            longitude: null,
            description: "",
        },
    });

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

    async function addEvent(data: NewEvent) {
        if (!selectedLocation) {
            setSubmissionStatus("Please search and select a location.");
            return;
        }

        console.log("Submitting event data:", data);
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        try {
            await fetch(`${baseUrl}/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.eventName,
                    host: data.eventHost,
                    date: data.date,
                    location: selectedLocation.address,
                    latitude: selectedLocation.lat,
                    longitude: selectedLocation.lng,
                    description: data.description,
                }),
            });
            setSubmissionStatus("Successfully added event.");
            reset();
            setSelectedLocation(null);
            setLocationQuery("");
        } catch (error) {
            console.error("Error during fetch:", error);
            setSubmissionStatus("Error adding event.");
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Host a{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                            Charity Event
                        </span>
                    </h1>
                    <p className="mt-3 text-gray-600">Share your event with the community</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                    <form className="p-8 space-y-6" onSubmit={handleSubmit(addEvent)}>
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
                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-medium text-gray-700">Host / Organization</label>
                            <input
                                type="text"
                                id="eventHost"
                                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                                placeholder="Who is hosting this event?"
                                {...register("eventHost", { required: true })}
                            />
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
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl p-4 font-semibold hover:shadow-lg hover:scale-[1.02] transition"
                        >
                            Create Event
                        </button>
                        {submissionStatus && (
                            <div
                                className={`p-4 rounded-xl text-center font-medium ${
                                    submissionStatus === "Successfully added event."
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
