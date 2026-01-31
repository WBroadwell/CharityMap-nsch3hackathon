"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { NewEvent } from "@/types/NewEvent";

export default function AddEvent() {
    const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

    async function addEvent(data: any) {
        // Placeholder for any data fetching logic if needed in the future
        console.log("Submitting event data:", data);
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        try {
                const res = await fetch(`${baseUrl}/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.eventName,
                    host: data.eventHost,
                    date: data.date,
                    location: data.location,
                    description: data.description,
                }),
            }).then((res) => res.json());
            setSubmissionStatus("Successfully added event.");
        } catch (error) {
            console.error("Error during fetch:", error);
            setSubmissionStatus("Error adding event.");
            return;
        }
    };

    const {
        register, handleSubmit, formState: { errors },
    } = useForm<NewEvent>({
        defaultValues: {
            eventName: "",
            eventHost: "",
            date: new Date(),
            location: "",
            description: "",
        }
    });

    return (
        <main className="flex min-h-screen flex-col p-16">
            <h1 className="text-4xl font-bold mb-8 flex justify-center">Add a New Charity Event</h1>
            <Card className="p-8 w-2/3 mx-auto">
                <form className="flex flex-col space-y-6" onSubmit={handleSubmit(addEvent)}>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">Event Name</label>
                        <input type="text" id="eventName" className="border border-gray-300 rounded-md p-2 " placeholder="Name" {...register("eventName", { required: true })} />
                    </div>
                     <div className="flex flex-col">
                        <label className="mb-2 font-semibold">Event Host</label>
                        <input type="text" id="eventHost" className="border border-gray-300 rounded-md p-2 " placeholder="Host Name" {...register("eventHost", { required: true })} />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">Date</label>
                        <input type="date" id="date" className="border border-gray-300 rounded-md p-2" {...register("date", { required: true })} />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">Location</label>
                        <input type="text" id="location" className="border border-gray-300 rounded-md p-2" {...register("location", { required: true })} />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">Description and Information</label>
                        <textarea id="description" className="border border-gray-300 rounded-md p-2" placeholder="Enter description here"rows={4} {...register("description", { required: false })}></textarea>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white rounded-md p-3 font-semibold hover:bg-blue-700 transition">
                        Submit Event
                    </button>
                    {(submissionStatus != null) ? 
                        (submissionStatus == "Successfully added event.") ? 
                        (<p className="mt-4 text-center font-medium text-green-600">{submissionStatus}</p>)
                        : (<p className="mt-4 text-center font-medium text-red-600">{submissionStatus}</p>)
                    : null}
                </form>
            </Card>
        </main>
    );
}