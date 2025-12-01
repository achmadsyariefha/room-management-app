export interface Bookings {
    id: number;
    room_id: number;
    user_id: number;
    booking_start: string;
    booking_end: string;
    status: string;
    created_at: string;
    booking_title: string;
}