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
  const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://tchbmxvviytmtodrhusk.supabase.co';
  const redirectUrl = window.location.origin;

  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl
        }
      });

      if (!error && data?.url) {
        window.location.href = data.url;
        return { data };
      }
    } catch (err: any) {
      console.warn(`[Supabase OAuth ${provider}] Exceção:`, err);
    }
  }

  // Direct OAuth Authorize URL redirect fallback to Supabase Auth endpoint
  const directOAuthUrl = `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectUrl)}`;
  window.location.href = directOAuthUrl;
  return { data: { url: directOAuthUrl } };
}
