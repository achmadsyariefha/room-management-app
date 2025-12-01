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
                                        <li key={booking.id}>
                                            <p>Booking ID: {booking.id}</p>
                                            <p>Booking Start: {new Date(booking.booking_start).toLocaleDateString()}</p>
                                            <p>Booking End: {new Date(booking.booking_end).toLocaleDateString()}({booking.status})</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No bookings found</p>
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