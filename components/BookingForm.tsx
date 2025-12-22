import { useState } from "react";
import { User } from "@/types/user";
import { checkBookingOverlap, createBooking } from "../services/bookingsService";
import { toUTC8ISOString } from "@/lib/utils";

interface BookingFormProps {
    roomId: number;
    user: User;
}

export default function BookingForm({ roomId, user }: BookingFormProps) {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('09:00');

    const handleSubmit = async () => {
        const hasOverlap = await checkBookingOverlap(roomId, toUTC8ISOString(date, startTime), toUTC8ISOString(date, endTime));
        if (hasOverlap) {
            alert('this room is already booked at this time');
            return;
        }
        
        await createBooking({
            room_id: roomId,
            user_id: user.id,
            booking_start: toUTC8ISOString(date, startTime),
            booking_end: toUTC8ISOString(date, endTime),
            status: 'pending',
            created_at: new Date().toISOString(),
            booking_title: title,
        });

    };
    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow-md">
            <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Booking Title / Topic</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Enter booking title" required/>
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">Date:</label>
                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded px-3 py-2" required/>
            </div>
            <div>
                <label htmlFor="startTime" className="block text-sm font-medium mb-1">Start Time:</label>
                <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full border rounded px-3 py-2" required/>
            </div>
            <div>
                <label htmlFor="endTime" className="block text-sm font-medium mb-1">End Time:</label>
                <input type="time" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full border rounded px-3 py-2" required/>
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Submit</button>
        </form>
    );
}