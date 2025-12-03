import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabaseClient";
import { Bookings } from "@/types/bookings";
import { Offices } from "@/types/offices";
import { Rooms } from "@/types/rooms";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function RoomDetails() {
    const router = useRouter();
    const { id } = router.query;

    const [room, setRoom] = useState<Rooms | null>(null);
    const [office, setOffice] = useState<Offices | null>(null);
    const [bookings, setBookings] = useState<Bookings[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const handleBooking = async (roomId: number) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert('You must be logged in to book a room');
            return;
        }

        const start = new Date();
        const end = new Date(start.getTime() + 60 * 60 * 1000);

        const { error } = await supabase
            .from('bookings')
            .insert({
                room_id: roomId,
                user_id: user.id,
                booking_start: start.toISOString(),
                booking_end: end.toISOString(),
                status: 'pending',
                created_at: new Date().toISOString(),
                booking_title: 'Booking',
            });

        if (error) {
            console.error(error);
            alert('Failed to create booking');
        } else {
            alert('Booking created successfully');
        }
    };

    const handleDeleteBooking = async () => {
        if (!selectedBookingId) {
            alert('No booking selected');
            return;
        }
        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', selectedBookingId);

        if (error) {
            console.error(error);
            alert('Failed to delete booking');
        } else {
            alert('Booking deleted successfully');
            setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== selectedBookingId));
            setSelectedBookingId(null);
            setShowConfirmDelete(false);
        }
    };
    
    useEffect(() => {
        if(!id) return;

        const fetchData = async () => {
            setLoading(true);
            
            const { data: roomData, error: roomError } = await supabase
                .from('rooms')
                .select('*')
                .eq('id', id)
                .single();
            if (roomError || !roomData) {
                console.error('Error fetching room:', roomError);
                setLoading(false);
                return;
            }
            setRoom(roomData as Rooms);

            const { data: officeData } = await supabase
                .from('offices')
                .select('*')
                .eq('id', roomData.office_id)
                .single();
            if(officeData) setOffice(officeData as Offices);

            const { data: bookingsData } = await supabase
                .from('bookings')
                .select('*')
                .eq('room_id', id)
                .order('booking_start', { ascending: true });
            if(bookingsData) setBookings(bookingsData as Bookings[]);

            setLoading(false);        
        };

        fetchData();
    }, [id]);
    
    return (
        <ProtectedRoute>
            <Layout>
                {loading ? (
                    <p>Loading...</p>
                ) : room ? (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold">{room.name}</h2>
                            {/* Room details */}
                            <p className="text-gray-700 mt-2">Capacity: {room.capacity}</p>
                            <p className="text-gray-700 mt-2">Description: {room.description}</p>
                            <p className="text-gray-700 mt-2">Status: {room.status}</p>
                        </div>
                        {office && (
                            <div>
                                <h3 className="text-xl font-bold">Office Info</h3>
                                <p className="text-gray-700 mt-2">{office.name} - {office.location}</p>
                                <p className="text-gray-700 mt-2">{office.description}</p>
                            </div>
                        )}
                        <div>
                            <h3 className="text-xl font-bold">Bookings</h3>
                            {bookings.length > 0 ? (
                                <ul>
                                    {bookings.map((booking) => (
                                        <li key={booking.id} className="flex justify-between items-center border-b py-2">
                                            <div>
                                                <p>Booking Title: {booking.booking_title}</p>
                                                <p>Booking Start: {
                                                        new Date(booking.booking_start).toLocaleString("en-GB", {
                                                        timeZone: "Asia/Singapore",   
                                                        hour12: false,
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                                <p>Booking End: {
                                                        new Date(booking.booking_end).toLocaleString("en-GB", {
                                                        timeZone: "Asia/Singapore",   
                                                        hour12: false,
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                    {" "}({booking.status})
                                                </p>
                                                <p>Booked By: {booking.user_id}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedBookingId(booking.id);
                                                    setShowConfirmDelete(true);
                                                }}
                                                className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition"
                                            >
                                                Delete Booking
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No bookings found</p>
                            )}
                        </div>
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => handleBooking(room.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
                            >
                                Book This Room
                            </button>
                            {showConfirmDelete && selectedBookingId && (
                                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 transition-opacity duration-300 ease-in-out">
                                    <div className="bg-white p-6 rounded shadow-lg z-70">
                                        <h3 className="text-lg font-bold mb-4">Delete Booking</h3>
                                        <p>Are you sure you want to delete this booking? ID: {" "}
                                            <span className="font-semibold">{selectedBookingId}</span>
                                        </p>
                                        <div className="flex gap-4 mt-6">
                                            <button
                                                onClick={() => {
                                                    setShowConfirmDelete(false);
                                                    setSelectedBookingId(null);
                                                }}
                                                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleDeleteBooking}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                                            >
                                                Delete Booking
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}                   
                        </div>                   
                    </div>                   
                ) : (
                    <p>Room not found</p>
                )}
            </Layout>
        </ProtectedRoute>
    );
}