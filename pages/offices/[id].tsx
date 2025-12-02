import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabaseClient";
import { Offices } from "@/types/offices";
import { Rooms } from "@/types/rooms";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function OfficeDetails() {
    const router = useRouter();
    const { id } = router.query;

    const [office, setOffice] = useState<Offices | null>(null);
    const [rooms, setRooms] = useState<Rooms[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            setLoading(true);
            const { data: officeData } = await supabase
                .from('offices')
                .select('*')
                .eq('id', id)
                .single();
            setOffice(officeData as Offices);

            const { data: roomData } = await supabase
                .from('rooms')
                .select('*')
                .eq('office_id', id);
            setRooms(roomData as Rooms[]);

            setLoading(false);
        };

        fetchData();
    }, [id]);

    return (
        <ProtectedRoute>
            <Layout>
                {loading ? (
                    <p>Loading...</p>
                ) : office ? (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">{office.name}</h2>
                        <p>{office.location}</p>
                        <p>{office.description}</p>
                        <div>
                            <h3 className="text-lg font-semibold mt-4">Rooms in this Office</h3>
                            {rooms.length > 0 ? (
                                <ul>
                                    {rooms.map((room) => (
                                        <li key={room.id} className="border p-2 rounded">
                                            <Link href={`/rooms/${room.id}`}>
                                                {room.name} (Capacity: {room.capacity})
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No rooms found in this Office</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>Office not found</p>
                )}
            </Layout>
        </ProtectedRoute>
    );
}