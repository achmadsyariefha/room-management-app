export interface Bookings {
    id: number;
    room_id: number;
    user_id: string;
    booking_start: string;
    booking_end: string;
    status: string;
    created_at: string;
    booking_title: string;

    user_email: string | null;
}

export interface NewBooking {
    room_id: number;
    user_id: string;
    booking_start: string;
    booking_end: string;
    status: string;
    created_at: string;
    booking_title: string;
}