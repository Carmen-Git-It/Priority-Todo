import { supabase } from '@/lib/supabaseClient';

// Sign in an existing user with email/password.
// Supabase Auth manages the session automatically (persisted to localStorage).
export async function authenticateUser(email, password) {
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