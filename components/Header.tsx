import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import Link from "next/link";

interface HeaderProps {
    setSidebarOpen: (open: boolean) => void;
    sidebarOpen: boolean;
}

export default function Header({ setSidebarOpen, sidebarOpen }: HeaderProps) {
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
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="relative flex flex-col justify-between w-8 h-6 md:hidden"
                >
                    <span 
                        className={`block h-1 bg-white rounded transition-transform duration-300 ${
                            sidebarOpen ? "rotate-45 translate-y-2" : ""
                        }`}
                    />
                    <span 
                        className={`block h-1 bg-white rounded transition-opacity duration-300 ${
                            sidebarOpen ? "opacity-0" : ""
                        }`}
                    />
                    <span 
                        className={`block h-1 bg-white rounded transition-transform duration-300 ${
                            sidebarOpen ? "-rotate-45 -translate-y-2" : ""
                        }`}
                    />
                </button>
                <h1 className="text-xl font-bold text-white">Room Management App</h1>
            </div>
            <div className="flex items-center gap-6">
                <nav className="hidden md:flex gap-6">
                    <Link href="/" className={`hover:underline ${isActive("/")}`}>Home</Link>
                    <Link href="/bookings" className={`hover:underline ${isActive("/bookings")}`}>Bookings</Link>
                    <Link href="/rooms" className={`hover:underline ${isActive("/rooms")}`}>Rooms</Link>
                </nav>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 font-semibold rounded hover:bg-red-600 transition-colors text-sm">Logout</button>
            </div>
        </header>
    );
}