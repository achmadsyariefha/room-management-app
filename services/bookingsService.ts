import { supabase } from "../lib/supabaseClient";
import { NewBooking, Bookings } from "../types/bookings";

export async function createBooking(payload: NewBooking): Promise<Bookings> {
    const { data, error } = await supabase
        .from('bookings')
        .insert(payload)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getBookingsByRoomId(roomId: number, days = 7): Promise<Bookings[]> {
    const start = new Date();
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('room_id', roomId)
        .gte('booking_start', start.toISOString())
        .lte('booking_end', end.toISOString())

    if (error) throw error;
    return data ?? [];
}

export async function getBookingsByUserId(userId: string): Promise<Bookings[]> {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('booking_start', { ascending: true });
    if (error) throw error;
    return data || [];
}

export async function deleteBooking(bookingId: number): Promise<void> {
    const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);
    if (error) throw error;
}

export async function checkBookingOverlap(roomId: number, start: string, end: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('room_id', roomId)
        .lt('booking_start', end)
        .gt('booking_end', start);
    if (error) throw error;
    return data.length > 0;
}