import Link from "next/link";
import { useRouter } from "next/router";   

interface SidebarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
    const router = useRouter();
    const isActive = (path: string) => {
        return router.pathname === path ? "font-bold text-white underline" : "text-white";
    };
    return (
        <>
        {open && (
            <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setOpen(false)}
            />
        )}
        <aside className={`fixed top-0 left-0 z-50 h-full transition-transform transform duration-300 text-white bg-gray-800 ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:h-auto md:w-64`}>
            {/* Toggle Button */}
            <div className="p-6 flex flex-col h-full">
                <button onClick={() => setOpen(false)} className="md:hidden mb-6 p-2 text-left text-sm font-semibold hover:bg-gray-700 rounded">
                    ✖ Close
                </button>
                <h2 className="text-2xl font-bold mb-8">Menu</h2>
                <nav className="flex flex-col gap-4">
                    <Link href="/" className={`hover:underline ${isActive("/")}`} onClick={() => setOpen(false)}>Dashboard</Link>
                    <Link href="/bookings" className={`hover:underline ${isActive("/bookings")}`} onClick={() => setOpen(false)}>Bookings</Link>
                    <Link href="/rooms" className={`hover:underline ${isActive("/rooms")}`} onClick={() => setOpen(false)}>Rooms</Link>
                </nav>
                <div className="flex-1" />
                <p className="text-xs text-gray-400">© {new Date().getFullYear()} Room Management App. All rights reserved.</p>
            </div>
        </aside>
        </>
    );
}