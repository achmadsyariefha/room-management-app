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
            router.push('/bookings');
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
                                                <p>Booking Start: {new Date(booking.booking_start).toLocaleDateString()}</p>
                                                <p>Booking End: {new Date(booking.booking_end).toLocaleDateString()}({booking.status})</p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedBookingId(booking.id)}
                                                className="ml-4 bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition"
                                            >
                                                Select Booking
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
                            {selectedBookingId && (
                                <button
                                    onClick={handleDeleteBooking}
                                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
                                >
                                    Delete Booking (ID: {selectedBookingId})
                                </button>
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