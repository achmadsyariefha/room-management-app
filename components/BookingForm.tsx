import { useState } from "react";
import { AppUser } from "@/types/user";
import { checkBookingOverlap, createBooking } from "../services/bookingsService";
import { toUTC8ISOString } from "@/lib/utils";
import { Field } from "./Field";

interface BookingFormProps {
    roomId: number;
    user: AppUser;
    onBookingCreated?: () => void;
}

export default function BookingForm({ roomId, user, onBookingCreated }: BookingFormProps) {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('09:00');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date || !startTime || !endTime) {
            alert('Please fill in all fields');
            return;
        }

        const start = toUTC8ISOString(date, startTime);
        const end = toUTC8ISOString(date, endTime);

        if (start >= end) {
            alert('End time must be after start time');
            return;
        }
        setLoading(true);
        try {
            const hasOverlap = await checkBookingOverlap(roomId, start, end);
            if (hasOverlap) {
                alert('this room is already booked at this time');
                return;
            }

            await createBooking({
                room_id: roomId,
                user_id: user.id,
                booking_start: start,
                booking_end: end,
                status: 'pending',
                created_at: new Date().toISOString(),
                booking_title: title,
            });
            onBookingCreated?.();
            setTitle('');
            setDate('');
            setStartTime('08:00');
            setEndTime('09:00');
        } catch {
            alert('Failed to check booking overlap');
        } finally {
            setLoading(false);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow-md">
            <Field label="Booking Title / Topic">
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Enter booking title" required/>
            </Field>
            <Field label="Date">
                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded px-3 py-2" required/>
            </Field>
            <div className="grid grid-cols-2 gap-4">
                <Field label="Start Time">
                    <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full border rounded px-3 py-2" required/>
                </Field>
                <Field label="End Time">
                    <input type="time" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full border rounded px-3 py-2" required/>
                </Field>
            </div>
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{loading ? 'Loading...' : 'Submit'}</button>
        </form>
    );
}