import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabaseClient";
import { Offices } from "@/types/offices";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OfficeIndex() {
    const [offices, setOffices] = useState<Offices[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffices = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('offices')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching offices:', error);
                setLoading(false);
                return;
            } 

            setOffices(data as Offices[]);
            setLoading(false);
        };

        fetchOffices();
    }, []);

    return (
        <ProtectedRoute>
            <Layout>
                <h2 className="text-2xl font-bold mb-6">Offices</h2>
                { loading ? (
                    <p>Loading...</p>
                ) : offices.length > 0 ? (
                    <ul className="space-y-4">
                        {offices.map((office) => (
                            <li key={office.id} className="border p-4 rounded hover:shadow transition">
                                <Link href={`/offices/${office.id}`} className="text-lg font-semibold hover:underline">
                                    {office.name}
                                </Link>
                                <p>{office.location}</p>
                                <p className="text-sm text-gray-500">{office.description}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No offices found.</p>
                )}
            </Layout>
        </ProtectedRoute>
    );
}