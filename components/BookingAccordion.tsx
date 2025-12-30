import { Bookings } from "@/types/bookings";
import { useState } from "react";
import { format } from "date-fns";

function groupBookingsByDate(bookings: Bookings[]) {
    return bookings.reduce((groups, booking) => {
        const date = format(new Date(booking.booking_start), 'yyyy-MM-dd');
        if (!groups[date]) groups[date] = [];
        groups[date].push(booking);
        return groups;
    }, {} as Record<string, Bookings[]>);
}

export default function BookingAccordion({ bookings }: { bookings: Bookings[] }) {
    const [open, setOpen] = useState<Record<string, boolean>>({});
    const groupedBookings = groupBookingsByDate(bookings);

    const toggleAccordion = (date: string) => {
        setOpen((prev) => ({
            ...prev,
            [date]: !prev[date],
        }));
    };

    return (
        <div>
            {Object.entries(groupedBookings).map(([date, items]) => {
                const isOpen = open[date];

                return (
                    <div key={date} className="border rounded-lg overflow-hidden">
                        <button onClick={() => toggleAccordion(date)} className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 transition">
                            <span className="font-semibold">{format(new Date(date), 'yyyy-MM-dd')}</span>
                            <span className="text-gray-600">{isOpen ? 'Hide' : 'Show'}</span>
                        </button>
                        {isOpen && (
                            <div className="p-4 space-y-3 bg-white">
                                {items.map((booking) => (
                                    <div key={booking.id} className="border rounded p-3 shadow-sm bg-gray-50">
                                        <p className="font-medium">{booking.booking_title}</p>
                                        <p className="text-sm">{format(new Date(booking.booking_start), 'hh:mm a')} - {format(new Date(booking.booking_end), 'hh:mm a')}</p>
                                        <p className="text-sm">Booked by : {booking.user_email ?? booking.user_id}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}