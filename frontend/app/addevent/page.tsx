import Image from "next/image";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";

interface FormData {
    eventName: string;
    date: string;
    location: string;
    description: string;
}

function saveEvent(data: any) {
    // Placeholder for any data fetching logic if needed in the future
    console.log("Submitting event data:", data);
}

const {
    register, handleSubmit, formState: { errors },
} = useForm<FormData>({
    defaultValues: {
        eventName: "",
        date: "",
        location: "",
        description: "",
    }
})

export default function AddEvent() {
    return (
        <main className="flex min-h-screen flex-col p-16">
            <h1 className="text-4xl font-bold mb-8 flex justify-center">Add a New Charity Event</h1>
            <Card className="p-8 w-2/3 mx-auto">
                <form className="flex flex-col space-y-6" onSubmit={handleSubmit(saveEvent)}>
                    <div className="flex flex-col">
                        <label htmlFor="eventName" className="mb-2 font-semibold">Event Name</label>
                        <input type="text" id="eventName" className="border border-gray-300 rounded-md p-2 " placeholder="Name" {...register("eventName", { required: true })} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="date" className="mb-2 font-semibold">Date</label>
                        <input type="date" id="date" className="border border-gray-300 rounded-md p-2" {...register("date", { required: true })} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="location" className="mb-2 font-semibold">Location</label>
                        <input type="text" id="location" className="border border-gray-300 rounded-md p-2" {...register("location", { required: true })} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="description" className="mb-2 font-semibold">Description</label>
                        <textarea id="description" className="border border-gray-300 rounded-md p-2" placeholder="Enter description here"rows={4} {...register("description", { required: false })}></textarea>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white rounded-md p-3 font-semibold hover:bg-blue-700 transition">
                        Submit Event
                    </button>
                </form>
            </Card>
        </main>
    );
}