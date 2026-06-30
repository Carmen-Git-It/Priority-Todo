import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

function ensureConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and ' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY (locally in .env.local, on Vercel under ' +
      'Project Settings > Environment Variables).'
    );
  }
}

// Sign in an existing user with email/password.
// Supabase Auth manages the session automatically (persisted to localStorage).
export async function authenticateUser(email, password) {
  ensureConfigured();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new Error(error.message);
  }
  return data.user;
}

export async function registerUser(email, password, password2) {
  if (password !== password2) {
    throw new Error('Passwords do not match');
  }
  ensureConfigured();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // If email confirmation is enabled on the project, ask the user to confirm.
  if (data?.user && !data.session) {
    return { pendingConfirmation: true };
  }
  return { pendingConfirmation: false };
}

export async function signOut() {
  await supabase.auth.signOut();
}