import { Rooms } from "@/types/rooms";
import { Offices } from "@/types/offices";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";

export default function RoomsIndex() {
    const [rooms, setRooms] = useState<(Rooms & { office?: Offices })[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            const { data: roomsData, error} = await supabase
                .from('rooms')
                .select('*, offices(*)')
                .order('created_at', { ascending: true });
            if (error) {
                console.error('Error fetching rooms:', error);
                setLoading(false);
                return;
            }
            setRooms(roomsData as (Rooms & { office?: Offices })[]);
            setLoading(false);
        };
        fetchRooms();
    }, []);
    
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

    return (
        <ProtectedRoute>
            <Layout>
                <h2 className="text-2xl font-bold mb-6">Rooms</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : rooms.length > 0 ? (
                    <ul className="space-y-4">
                        {rooms.map((room) => (
                            <li key={room.id} className="border transition flex p-4 rounded hover:shadow items-center justify-between">
                                <div>
                                    <Link href={`/rooms/${room.id}`} className="text-lg font-semibold hover:underline">
                                        {room.name}
                                    </Link>
                                    <p className="text-gray-700 mt-2">Capacity: {room.capacity}</p>
                                    <p className="text-gray-700 mt-2">Description: {room.description}</p>
                                    <p className="text-gray-700 mt-2">Status: {room.status}</p>
                                    {room.office && (
                                        <p className="text-gray-500 text-sm">Office: {room.office.name} - {room.office.location}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleBooking(room.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
                                >
                                    Book This Room
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No rooms found</p>
                )}
            </Layout>
        </ProtectedRoute>
    );
}