import { supabase } from "../lib/supabaseClient";
import { Rooms } from "@/types/rooms";

export async function getRoomById(roomId: number): Promise<Rooms | null> {
    const { data, error } = await supabase.from('rooms').select('*').eq('id', roomId).single();
    if (error) throw error;
    return data;
}