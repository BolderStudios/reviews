import { NextResponse } from 'next/server';
import supabase from '@/utils/supabaseClient';

export async function GET() {
  try {
    // Fetch all notes
    const { data: notes, error: notesError } = await supabase.from('notes').select('*');
    if (notesError) {
      throw new Error(notesError.message);
    }

    // Fetch total number of notes
    const { count, error: countError } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw new Error(countError.message);
    }

    // Return response
    return NextResponse.json({ notes, total: count });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
