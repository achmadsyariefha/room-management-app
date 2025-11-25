import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Header() {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const isActive = (path: string) => {
        return router.pathname === path ? "font-bold text-white underline" : "text-white";
    };

    return (
        <header className="flex justify-between items-center bg-primary px-6 py-4 shadow">
            <h1 className="text-xl font-bold text-white">Room Management App</h1>
            <nav className="flex gap-6">
                <Link href="/" className={`hover:underline ${isActive("/")}`}>Home</Link>
                <Link href="/bookings" className={`hover:underline ${isActive("/bookings")}`}>Bookings</Link>
            </nav>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 font-semibold rounded hover:bg-red-600 transition-colors text-sm">Logout</button>
        </header>
    );
}