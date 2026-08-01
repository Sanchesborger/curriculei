import { createClient, SupabaseClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://tchbmxvviytmtodrhusk.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjaGJteHZ2aXl0bXRvZHJodXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMjkxNjgsImV4cCI6MjEwMDgwNTE2OH0.drMS-Asq2kuGEz_hxSCwEtVC7W4b6rOUtiqf31nEsjA';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || FALLBACK_SUPABASE_URL;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || FALLBACK_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;
  const url = supabaseUrl.trim() || FALLBACK_SUPABASE_URL;
  const key = supabaseAnonKey.trim() || FALLBACK_SUPABASE_ANON_KEY;

  try {
    supabaseInstance = createClient(url, key);
    return supabaseInstance;
  } catch (err) {
    console.warn('[Supabase Client] Erro ao inicializar:', err);
    return null;
  }
}

export async function signInWithProvider(provider: 'google' | 'apple') {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Cliente Supabase não inicializado.');
  }

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://curriculei.vercel.app';
  
  // URL de redirect oficial do app
  const redirectUrl = (currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1'))
    ? 'https://curriculei.vercel.app/'
    : `${currentOrigin}/`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl
    }
  });

  if (error) {
    console.error(`[Supabase OAuth ${provider}] Erro:`, error.message);
    throw error;
  }

  if (data?.url) {
    window.location.href = data.url;
  }

  return { data };
}

