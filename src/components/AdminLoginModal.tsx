import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { getSupabase } from '../lib/supabase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onShowToast
}) => {
  const [email, setEmail] = useState('enoquesanbor@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      // Check default specified admin credentials
      if (cleanEmail === 'enoquesanbor@gmail.com' && cleanPass === 'sanbor2510') {
        // Register local admin session
        const adminSession = {
          email: cleanEmail,
          role: 'ADMIN',
          loggedInAt: new Date().toISOString()
        };
        localStorage.setItem('cvpro_admin_session', JSON.stringify(adminSession));

        // Try syncing with Supabase Auth if connected
        const supabase = getSupabase();
        if (supabase) {
          try {
            // Attempt Supabase sign in (if user exists in Supabase)
            const { error: sbError } = await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password: cleanPass
            });
            if (sbError) {
              console.log('[Supabase Admin Auth Sync] Aviso:', sbError.message);
            } else {
              console.log('[Supabase Admin Auth Sync] Autenticado com sucesso no Supabase!');
            }
          } catch (sbEx) {
            console.log('[Supabase Admin Sync] Supabase local fallback ativo.');
          }
        }

        onShowToast('Acesso de Administrador Autenticado!', 'success');
        setLoading(false);
        onClose();
        onLoginSuccess();
        return;
      }

      // Invalid credentials error
      setErrorMessage('E-mail ou senha de administrador incorretos.');
      setLoading(false);
    } catch (err: any) {
      setErrorMessage('Erro ao autenticar administrador. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-slate-900 text-slate-100 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-800 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mt-1 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white flex items-center justify-center gap-1.5">
            Painel do Administrador
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Área restrita de gestão e sincronização com banco de dados Supabase.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              E-mail do Administrador
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enoquesanbor@gmail.com"
                required
                className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-[11px] text-amber-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Sincronização ativa via Supabase. Suas credenciais concedem privilégios elevados de gerenciamento no sistema.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Entrar no Painel Admin</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
