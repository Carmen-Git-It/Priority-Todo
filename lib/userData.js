import { supabase } from '@/lib/supabaseClient';

// NOTE: All calls rely on the `items` table Row Level Security policies in
// supabase/schema.sql to restrict rows to the authenticated user (auth.uid()).
// Column shape: id (uuid), user_id (uuid), name (text), due (date),
//               urgency (int2), impact (int2), complete (bool),
//               created_at (timestamptz).

export async function addItem(name, due, urgency, impact) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('items')
    .insert({
      user_id: user?.id,
      name,
      due,
      urgency: Number(urgency),
      impact: Number(impact),
      complete: false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function removeItem(id) {
  const { data, error } = await supabase
    .from('items')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getItems() {
  const { data, error } = await supabase
    .from('items')
    .select('id, name, due, urgency, impact, complete')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function completeItem(id) {
  const { data, error } = await supabase
    .from('items')
    .update({ complete: true })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function resetItem(id) {
  const { data, error } = await supabase
    .from('items')
    .update({ complete: false })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}