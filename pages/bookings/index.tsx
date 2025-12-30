import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import BookingAccordion from "@/components/BookingAccordion";
import { getBookings } from "@/services/bookingsService";

export default function Bookings() {
    return (
        <ProtectedRoute>
            <Layout>
                <h2 className="text-2xl font-bold">Bookings</h2>
                <p className="text-gray-700 mt-2">Manage your bookings here.</p>
            </Layout>
        </ProtectedRoute>
    );
}