import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
    return (
        <ProtectedRoute>
            <Header />
            <main className="p-6">
                <h2 className="text-2xl font-bold">Dashboard</h2>
                {/* Dashboard content */}
            </main>
        </ProtectedRoute>
    );
}