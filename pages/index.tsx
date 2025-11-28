import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
    return (
        <ProtectedRoute>
            <Layout>
                <h2 className="text-2xl font-bold">Dashboard</h2>
                {/* Dashboard content */}
                <p className="text-gray-700 mt-2">Here's where you'll see room availability and manage bookings.</p>
            </Layout>
        </ProtectedRoute>
    );
}