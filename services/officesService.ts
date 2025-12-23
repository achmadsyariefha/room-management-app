import { supabase } from "../lib/supabaseClient";
import { Offices } from "@/types/offices";

export async function getOfficeById(id: number): Promise<Offices | null> {
    const { data, error } = await supabase.from('offices').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
}