import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://tchbmxvviytmtodrhusk.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;
  if (supabaseUrl && supabaseAnonKey && supabaseAnonKey.trim()) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
      return supabaseInstance;
    } catch (err) {
      console.warn('[Supabase Client] Erro ao inicializar:', err);
    }
  }
  return null;
}

export async function signInWithProvider(provider: 'google' | 'apple') {
  const supabase = getSupabase();
  if (!supabase) return { error: new Error('Supabase client não configurado.') };

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      console.warn(`[Supabase OAuth ${provider}] Aviso:`, error.message);
      return { error };
    }

    return { data };
  } catch (err: any) {
    console.warn(`[Supabase OAuth ${provider}] Exceção:`, err);
    return { error: err };
  }
}
