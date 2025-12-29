import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { getRoomById } from "@/services/roomsService";
import { getOfficeById } from "@/services/officesService";
import { deleteBooking, getBookingsByRoomId } from "@/services/bookingsService";
import BookingForm from "@/components/BookingForm";
import { format } from "date-fns";
import { Rooms } from "@/types/rooms";
import { Offices } from "@/types/offices";
import { Bookings } from "@/types/bookings";
import { AppUser } from "@/types/user";
import Layout from "@/components/Layout";

export default function RoomDetails() {
    const { user, loading } = useUser();
    const router = useRouter();
    const roomId = Number(router.query.id);

    const [room, setRoom] = useState<Rooms | null>(null);
    const [office, setOffice] = useState<Offices | null>(null);
    const [bookings, setBookings] = useState<Bookings[]>([]);
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    useEffect(() => {
        if (!router.isReady || isNaN(roomId)) return;
        fetchRoomAndOffice();
        fetchBookings();
    }, [router.isReady, roomId]);

    const fetchRoomAndOffice = async () => {
        try {
            const roomData = await getRoomById(roomId);
            setRoom(roomData);
            
            if (roomData?.office_id){
                const officeData = await getOfficeById(roomData.office_id);
                setOffice(officeData);
            }  
        } catch {
            alert("Failed to load room or office");
        }
    };

    const fetchBookings = async () => {
        try {
            const bookingsData = await getBookingsByRoomId(roomId);
            console.log("Fetched bookings:", bookingsData);
            setBookings(bookingsData);
        } catch (error){
            alert("Failed to load bookings");
            console.error(error);
        }
    };

    const handleDeleteBooking = async () => {
        if (!selectedBookingId) {
            alert('No booking selected');
            return;
        }
        try {
            await deleteBooking(selectedBookingId);
            setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== selectedBookingId));
            setSelectedBookingId(null);
            setShowConfirmDelete(false);
            alert('Booking deleted successfully');
        } catch {
            alert("Failed to delete booking");
        }
    };

    if (loading || !user ) return <p className="p-4">Loading user...</p>;

    const safeUser: AppUser = {
        id: user.id,
        email: user.email!,
    };
    
    return (
        <ProtectedRoute>
            <Layout>
                <div className="p-4 space-y-6">
                    {room && (
                        <div>
                            <h2 className="text-2xl font-bold">{room.name}</h2>
                            {/* Room details */}
                            <p className="text-gray-700 mt-2">Capacity: {room.capacity}</p>
                            <p className="text-gray-700 mt-2">Description: {room.description}</p>
                        </div>
                    )}
                    {office && (
                        <div>
                            <h3 className="text-xl font-bold">Office Info</h3>
                            <p className="text-gray-700 mt-2">{office.name} - {office.location}</p>
                            <p className="text-gray-700 mt-2">{office.description}</p>
                        </div>
                    )}
                    {user && (
                        <BookingForm
                            roomId={roomId}
                            user={safeUser}
                            onBookingCreated={fetchBookings}
                        />
                    )}
                    <div>
                        <h3 className="text-xl font-bold">Bookings</h3>
                        {bookings.length !== 0 ? (
                            <ul>
                                {bookings.map((booking: Bookings) => (
                                    <li key={booking.id} className="flex justify-between items-center border-b py-2">
                                        <div>
                                            <p className="font-bold">{booking.booking_title}</p>
                                            <p>Booked by : {booking.user_email}</p>
                                            <p>
                                                {format(new Date(booking.booking_start), "Pp")} - {" "}
                                                {format(new Date(booking.booking_end), "Pp")}
                                            </p>
                                        </div>
                                        {booking.user_id === user?.id && (
                                            <button
                                                onClick={() => {
                                                    setSelectedBookingId(booking.id);
                                                    setShowConfirmDelete(true);
                                                }}
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                            >
                                                Delete Booking
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No bookings yet.</p>
                        )}
                    </div>
                    {showConfirmDelete && (
                        <div className="bg-white p-6 rounded shadow-lg z-70">
                            <h3 className="text-lg font-bold mb-4">Delete Booking</h3>
                            <p>Are you sure you want to delete this booking : 
                                <span className="font-semibold">{selectedBookingId}</span>?</p>
                                <div className="flex gap-4 mt-6">
                                    <button
                                        onClick={() => {
                                            setShowConfirmDelete(false);
                                            setSelectedBookingId(null);
                                        }}
                                        className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteBooking}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                                    >
                                        Delete Booking
                                    </button>
                                </div>
                        </div>
                    )}
                </div>
            </Layout>
        </ProtectedRoute>
    );
}