import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { UserProfile } from '../types';
import { getSupabase, signInWithProvider } from '../lib/supabase';

interface AuthScreenProps {
  initialMode?: 'login' | 'signup';
  onAuthSuccess: (name: string, email: string) => void;
  currentUser?: UserProfile;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'login',
  onAuthSuccess,
  currentUser
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [name, setName] = useState<string>(currentUser?.email ? currentUser.name : '');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const syncUserWithBackend = async (userName: string, userEmail: string, provider: string) => {
    try {
      const res = await fetch('/api/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          authProvider: provider
        })
      });
      const data = await res.json();
      console.log('[Supabase Sync Result]:', data);
      return data;
    } catch (err) {
      console.warn('[Sync Error]:', err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const finalName = name.trim() || email.split('@')[0] || 'Usuário';
    const finalEmail = email.trim();
    const supabase = getSupabase();

    if (supabase) {
      try {
        if (mode === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email: finalEmail,
            password: password,
            options: {
              data: {
                full_name: finalName,
                name: finalName
              }
            }
          });

          if (error) {
            console.error('[Supabase SignUp Error]:', error);
            setErrorMessage(error.message === 'User already registered' 
              ? 'Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.' 
              : error.message || 'Erro ao criar conta no Supabase.');
            setIsLoading(false);
            return;
          }

          if (data?.user && !data?.session) {
            setSuccessMessage('Conta criada com sucesso! Se a confirmação por e-mail estiver ativada, verifique sua caixa de entrada.');
            setIsLoading(false);
            return;
          }

          if (data?.session) {
            await syncUserWithBackend(finalName, finalEmail, 'email');
            setIsLoading(false);
            onAuthSuccess(finalName, finalEmail);
            return;
          }
        } else {
          // Login
          const { data, error } = await supabase.auth.signInWithPassword({
            email: finalEmail,
            password: password
          });

          if (error) {
            console.error('[Supabase Login Error]:', error);
            setErrorMessage(error.message === 'Invalid login credentials' 
              ? 'E-mail ou senha incorretos. Verifique suas credenciais.'
              : error.message || 'Erro ao realizar login.');
            setIsLoading(false);
            return;
          }

          if (data?.session) {
            const userMeta = data.session.user?.user_metadata;
            const sessionName = userMeta?.full_name || userMeta?.name || finalName;
            await syncUserWithBackend(sessionName, finalEmail, 'email');
            setIsLoading(false);
            onAuthSuccess(sessionName, finalEmail);
            return;
          }
        }
      } catch (err: any) {
        console.error('[Auth Error]:', err);
        setErrorMessage(err.message || 'Ocorreu um erro inesperado ao conectar ao Supabase.');
        setIsLoading(false);
        return;
      }
    }

    // Fallback if supabase instance not available
    await syncUserWithBackend(finalName, finalEmail, 'email');
    setIsLoading(false);
    onAuthSuccess(finalName, finalEmail);
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await signInWithProvider('google');
    } catch (err: any) {
      console.warn('Supabase OAuth Google Error:', err);
      setErrorMessage(err.message || 'Erro ao iniciar login social com Google.');
      setIsLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await signInWithProvider('apple');
    } catch (err: any) {
      console.warn('Supabase OAuth Apple Error:', err);
      setErrorMessage(err.message || 'Erro ao iniciar login social com Apple.');
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col md:flex-row antialiased font-sans">
      {/* Left Section: Brand & Image (visible on md+) */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-[#f2f4f6] flex-col justify-center items-center p-8 relative overflow-hidden border-r border-[#c3c6d7]/50">
        <div className="absolute inset-0 z-0">
          <div
            className="bg-cover bg-center w-full h-full opacity-50"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD8awz3hvCiqWXOnCfFuiM6iXwRV1YVACjeNOgSO4IhpAdj-46uOfuqWTqmzIjJK4kdg4J6Ack23duz6ROYlzxBSkDfdBP_qSUfoWwNGugMWXaCS51s85GF7OGh75BtscZVFQvSoRsQHBkLfLOEBXaqrVEvR-EhC2MpxMpIVu66W4huWz6VHh-LmO2ZUPfTcnlYdLX5VO8Do9Pd2dajVrbP_Jun8nE-lZ7jVEbzqx30O7M10M1XdaRLA0TgBGZQe5dVGMNfheX3bBo')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f2f4f6] via-[#f2f4f6]/80 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-[#004ac6]" />
            <span className="font-bold text-3xl text-[#004ac6] tracking-tight">CVPro AI</span>
          </div>

          <h2 className="text-2xl font-semibold text-[#191c1e] mb-4">
            Impulsione sua carreira com currículos criados por IA.
          </h2>

          <p className="text-sm text-[#434655] leading-relaxed">
            Junte-se a milhares de profissionais que estão conquistando as melhores vagas usando nossa tecnologia de otimização de currículos e cartas de apresentação.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <div className="bg-white rounded-xl p-3.5 shadow-sm flex items-center gap-3 border border-[#c3c6d7]/30">
              <CheckCircle2 className="w-5 h-5 text-[#2563eb]" />
              <span className="text-sm font-semibold">Templates Premium Prontos para ATS</span>
            </div>
            <div className="bg-white rounded-xl p-3.5 shadow-sm flex items-center gap-3 border border-[#c3c6d7]/30">
              <CheckCircle2 className="w-5 h-5 text-[#2563eb]" />
              <span className="text-sm font-semibold">Análise de Pontuação e Palavras-chave IA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Form Canvas */}
      <div className="w-full md:w-1/2 lg:w-7/12 flex-1 flex flex-col justify-center items-center p-6 relative min-h-screen">
        
        {/* Mobile Header Logo */}
        <div className="w-full max-w-md md:hidden mb-6 flex items-center justify-center gap-2 pt-4">
          <Sparkles className="w-7 h-7 text-[#004ac6]" />
          <span className="font-bold text-2xl text-[#004ac6]">CVPro AI</span>
        </div>

        <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-[#c3c6d7]/40 relative">
          
          <div className="mb-6 text-center md:text-left">
            <h1 className="text-2xl font-bold text-[#191c1e] mb-1">
              {mode === 'login' ? (currentUser?.name ? `Bem-vindo de volta, ${currentUser.name}` : 'Bem-vindo de volta') : 'Crie sua conta'}
            </h1>
            <p className="text-sm text-[#434655]">
              {mode === 'login' ? 'Acesse sua conta do CVPro AI para continuar.' : 'Comece sua jornada profissional agora.'}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
              <button 
                onClick={() => setErrorMessage(null)} 
                type="button" 
                className="text-red-500 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{successMessage}</div>
              <button 
                onClick={() => setSuccessMessage(null)} 
                type="button" 
                className="text-emerald-600 hover:text-emerald-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Social Logins */}
          <div className="flex flex-col gap-2.5 mb-6">
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              type="button"
              className="w-full h-[50px] bg-white border border-[#c3c6d7] text-[#191c1e] rounded-xl font-semibold text-sm hover:bg-[#f2f4f6] transition-colors flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer disabled:opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continuar com Google</span>
            </button>

            <button
              onClick={handleAppleAuth}
              disabled={isLoading}
              type="button"
              className="w-full h-[50px] bg-white border border-[#c3c6d7] text-[#191c1e] rounded-xl font-semibold text-sm hover:bg-[#f2f4f6] transition-colors flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer disabled:opacity-60"
            >
              <svg className="w-5 h-5 text-black fill-current" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.24-.7 3.59-.7 1.58.02 2.72.63 3.57 1.5-3.15 1.83-2.65 6.01.5 7.21-1.05 2.16-1.72 2.94-2.74 4.16z" />
                <path d="M12.03 7.25c-.15-3.22 2.89-5.74 5.75-5.25.32 3.14-3.08 5.7-5.75 5.25z" />
              </svg>
              <span>Continuar com Apple</span>
            </button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px bg-[#c3c6d7] flex-1" />
            <span className="text-xs text-[#737686] font-medium uppercase px-1">ou com email</span>
            <div className="h-px bg-[#c3c6d7] flex-1" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {mode === 'signup' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#434655] uppercase" htmlFor="name">
                  Nome Completo
                </label>
                <div className="relative">
                  <UserIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737686]" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Ana Silva"
                    className="w-full h-[48px] pl-11 pr-4 rounded-xl bg-white border border-[#c3c6d7] text-sm text-[#191c1e] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#434655] uppercase" htmlFor="email">
                E-mail Profissional
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737686]" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@exemplo.com"
                  className="w-full h-[48px] pl-11 pr-4 rounded-xl bg-white border border-[#c3c6d7] text-sm text-[#191c1e] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-[#434655] uppercase" htmlFor="password">
                  Senha
                </label>
                {mode === 'login' && (
                  <button type="button" className="text-xs text-[#2563eb] hover:underline">
                    Esqueci minha senha
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737686]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full h-[48px] pl-11 pr-11 rounded-xl bg-white border border-[#c3c6d7] text-sm text-[#191c1e] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#191c1e]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full h-[50px] bg-[#2563eb] hover:bg-[#004ac6] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
            >
              <span>{mode === 'login' ? 'Entrar' : 'Criar Conta'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle mode link */}
          <div className="mt-6 text-center text-sm text-[#434655]">
            {mode === 'login' ? (
              <p>
                Não tem uma conta?{' '}
                <button
                  onClick={() => { setMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
                  className="text-[#2563eb] font-bold hover:underline"
                >
                  Criar conta
                </button>
              </p>
            ) : (
              <p>
                Já tem uma conta?{' '}
                <button
                  onClick={() => { setMode('login'); setErrorMessage(null); setSuccessMessage(null); }}
                  className="text-[#2563eb] font-bold hover:underline"
                >
                  Fazer login
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-[#737686]">
          Ao continuar, você concorda com nossos{' '}
          <a href="#" className="underline">Termos de Serviço</a> e{' '}
          <a href="#" className="underline">Política de Privacidade</a>.
        </div>
      </div>
    </div>
  );
};
