import { supabase } from '@/lib/supabaseClient';

import { Item, ItemQueue } from '@/model/item';

// NOTE: All calls rely on the `items` table Row Level Security policies in
// supabase/schema.sql to restrict rows to the authenticated user (auth.uid()).
// Column shape: id, user_id, name, due (date), urgency (int2), impact (int2),
//               complete (bool), recurrence_interval (int2|null),
//               recurrence_unit (text|null), created_at (timestamptz).

// Postgres `date` columns come back as 'YYYY-MM-DD'; parse as local midnight
// so .toDateString() renders the same day the user picked.
function parseDue(value) {
  return new Date(value + 'T00:00:00');
}

function rowToItem(row) {
  return new Item(
    row.id,
    row.name,
    parseDue(row.due),
    row.urgency,
    row.impact,
    row.complete,
    row.recurrence_interval,
    row.recurrence_unit,
  );
}

export async function addItem(name, due, urgency, impact, recurrenceInterval, recurrenceUnit) {
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
      recurrence_interval: recurrenceInterval ? Number(recurrenceInterval) : null,
      recurrence_unit: recurrenceInterval ? recurrenceUnit : null,
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
    .select('id, name, due, urgency, impact, complete, recurrence_interval, recurrence_unit')
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

// Rebuild the items atom from Supabase. Used after operations that change the
// set of rows (e.g. spawning the next occurrence of a recurring task) so both
// the Home "Up Next" view and the List view stay in sync. `setItems` is the
// Jotai atom setter returned by useAtom(itemsAtom).
export async function refreshItemsAtom(setItems) {
  try {
    const itemData = await getItems();
    const itemList = (itemData || []).map(rowToItem);
    setItems(new ItemQueue(itemList));
  } catch (err) {
    setItems(new ItemQueue());
  }
}