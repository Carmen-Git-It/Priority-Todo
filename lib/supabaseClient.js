import { createClient } from '@supabase/supabase-js';

// These are NEXT_PUBLIC_* so Next inlines them at build time. On Vercel they
// must be set in Project Settings > Environment Variables. We avoid throwing
// at module load so `next build` (which statically prerenders public pages that
// transitively import this module) succeeds even when the vars are absent —
// instead we surface a clear error only when a call is actually made.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});