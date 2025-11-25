import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";

export default function Bookings() {
    return (
        <ProtectedRoute>
            <Header />
            <h1>Bookings</h1>
        </ProtectedRoute>
    );
}