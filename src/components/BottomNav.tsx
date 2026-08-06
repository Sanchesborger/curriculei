import React, { useState, useRef } from 'react';
import { ScreenView, UserProfile } from '../types';
import { LayoutDashboard, FileText, Sparkles, User, Mic, MicOff, Search, X, Volume2, ArrowRight, Crown } from 'lucide-react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface BottomNavProps {
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
  onOpenJobSearch?: () => void;
  onCreateNewResume?: () => void;
  user?: UserProfile;
  onShowToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  currentScreen, 
  onNavigate,
  onOpenJobSearch,
  onCreateNewResume,
  user,
  onShowToast
}) => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceQuery, setVoiceQuery] = useState<string>('');
  const [voiceFeedback, setVoiceFeedback] = useState<{ actionText: string; success: boolean } | null>(null);
  const recognitionRef = useRef<any>(null);

  const DAILY_VOICE_LIMIT = 5;

  const getVoiceUsageInfo = () => {
    if (user?.isPremium) {
      return { count: 0, limit: Infinity, remaining: Infinity, isLimitReached: false };
    }
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('cvpro_voice_usage_date');
    let count = parseInt(localStorage.getItem('cvpro_voice_usage_count') || '0', 10);
    if (storedDate !== today) {
      count = 0;
    }
    const remaining = Math.max(0, DAILY_VOICE_LIMIT - count);
    return { count, limit: DAILY_VOICE_LIMIT, remaining, isLimitReached: count >= DAILY_VOICE_LIMIT };
  };

  const checkAndIncrementVoiceUsage = (): boolean => {
    if (user?.isPremium) return true;

    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('cvpro_voice_usage_date');
    let count = parseInt(localStorage.getItem('cvpro_voice_usage_count') || '0', 10);

    if (storedDate !== today) {
      count = 0;
      localStorage.setItem('cvpro_voice_usage_date', today);
      localStorage.setItem('cvpro_voice_usage_count', '0');
    }

    if (count >= DAILY_VOICE_LIMIT) {
      const limitMsg = `⚠️ Limite diário de ${DAILY_VOICE_LIMIT} pesquisas por voz atingido (Plano Gratuito). Faça upgrade para o Premium para pesquisas ilimitadas!`;
      if (onShowToast) {
        onShowToast(limitMsg, 'info');
      }
      setVoiceFeedback({
        actionText: limitMsg,
        success: false
      });
      return false;
    }

    const newCount = count + 1;
    localStorage.setItem('cvpro_voice_usage_date', today);
    localStorage.setItem('cvpro_voice_usage_count', newCount.toString());

    if (newCount === DAILY_VOICE_LIMIT && onShowToast) {
      onShowToast(`⚡ Esta é sua última pesquisa por voz gratuita de hoje (${newCount}/${DAILY_VOICE_LIMIT}). Assine o Premium para uso ilimitado!`, 'info');
    }

    return true;
  };

  // Hide on splash, onboarding, login, signup, interview, admin
  if (['splash', 'onboarding', 'login', 'signup', 'interview', 'admin'].includes(currentScreen)) {
    return null;
  }

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        // Fallback silencioso
      }
    }
  };

  const handleProcessVoiceCommand = (rawText: string) => {
    if (!rawText || !rawText.trim()) return;
    const lower = rawText.toLowerCase().trim();

    // 1. Navegação de telas
    if (lower.includes('criar currículo') || lower.includes('criar curriculo') || lower.includes('novo currículo') || lower.includes('novo curriculo') || lower.includes('fazer currículo')) {
      setVoiceFeedback({ actionText: 'Executando: Criar Novo Currículo', success: true });
      speakText('Criando um novo currículo.');
      setTimeout(() => {
        setIsVoiceModalOpen(false);
        if (onCreateNewResume) onCreateNewResume();
        else onNavigate('editor');
      }, 700);
      return;
    }

    if (lower.includes('meus currículos') || lower.includes('meus curriculos') || lower.includes('ver currículos') || lower.includes('ver curriculos') || lower.includes('lista de currículos')) {
      setVoiceFeedback({ actionText: 'Executando: Abrindo Meus Currículos', success: true });
      speakText('Abrindo seus currículos.');
      setTimeout(() => {
        setIsVoiceModalOpen(false);
        onNavigate('resumes');
      }, 700);
      return;
    }

    if (lower.includes('modelo') || lower.includes('modelos') || lower.includes('template') || lower.includes('templates')) {
      setVoiceFeedback({ actionText: 'Executando: Abrindo Modelos e Templates', success: true });
      speakText('Abrindo galeria de modelos.');
      setTimeout(() => {
        setIsVoiceModalOpen(false);
        onNavigate('templates');
      }, 700);
      return;
    }

    if (lower.includes('entrevista') || lower.includes('simular entrevista') || lower.includes('treinar entrevista')) {
      setVoiceFeedback({ actionText: 'Executando: Abrindo Simulador de Entrevista', success: true });
      speakText('Abrindo simulador de entrevista com IA.');
      setTimeout(() => {
        setIsVoiceModalOpen(false);
        onNavigate('interview');
      }, 700);
      return;
    }

    if (lower.includes('carta') || lower.includes('apresentação') || lower.includes('apresentacao')) {
      setVoiceFeedback({ actionText: 'Executando: Carta de Apresentação', success: true });
      speakText('Abrindo gerador de carta de apresentação.');
      setTimeout(() => {
        setIsVoiceModalOpen(false);
        onNavigate('cover-letter');
      }, 700);
      return;
    }

    if (lower.includes('perfil') || lower.includes('minha conta')) {
      setVoiceFeedback({ actionText: 'Executando: Abrindo Perfil', success: true });
      speakText('Navegando para o seu perfil.');
      setTimeout(() => {
        setIsVoiceModalOpen(false);
        onNavigate('profile');
      }, 700);
      return;
    }

    if (lower.includes('plano') || lower.includes('planos') || lower.includes('assinatura') || lower.includes('premium')) {
      setVoiceFeedback({ actionText: 'Executando: Planos e Assinaturas', success: true });
      speakText('Abrindo planos e assinaturas.');
      setTimeout(() => {
        setIsVoiceModalOpen(false);
        onNavigate('subscription');
      }, 700);
      return;
    }

    // 2. Busca por Vagas (Padrão)
    setVoiceFeedback({ actionText: `Buscando vagas para: "${rawText}"`, success: true });
    speakText(`Buscando vagas para ${rawText}.`);
    setTimeout(() => {
      setIsVoiceModalOpen(false);
      if (onOpenJobSearch) {
        onOpenJobSearch();
      } else {
        onNavigate('jobs' as any);
      }
    }, 800);
  };

  // Helpers para Feedback Tátil (Vibração) e Áudio (Bip/Chime)
  const triggerHaptic = (pattern: number | number[]) => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch (e) {
      // Ignora erro de vibração caso não suportado
    }
  };

  const playBeepSound = (type: 'start' | 'stop') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'start') {
        // Tom suave ascendente (520Hz -> 880Hz)
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else {
        // Tom suave descendente (660Hz -> 440Hz)
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (e) {
      // Ignora erro de áudio se bloqueado pelo navegador
    }
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
      triggerHaptic(40);
      playBeepSound('stop');
      return;
    }

    // Check daily limit before starting voice recognition
    if (!checkAndIncrementVoiceUsage()) {
      triggerHaptic([100, 50, 100]);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceFeedback({ actionText: 'Reconhecimento de voz não é suportado neste navegador. Digite sua busca.', success: false });
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceFeedback(null);
        triggerHaptic([60, 30, 60]); // Feedback tátil ao iniciar
        playBeepSound('start');       // Som de notificação ao iniciar
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setVoiceQuery(transcript);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        triggerHaptic(50);
        playBeepSound('stop');
        if (event.error === 'not-allowed') {
          setVoiceFeedback({ actionText: 'Permissão de microfone negada. Permita o acesso ao microfone no navegador.', success: false });
        } else if (event.error === 'no-speech') {
          setVoiceFeedback({ actionText: 'Nenhum som detectado. Clique no microfone e fale novamente.', success: false });
        } else {
          setVoiceFeedback({ actionText: 'Erro ao reconhecer voz. Digite no campo.', success: false });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        triggerHaptic(40);     // Feedback tátil ao encerrar
        playBeepSound('stop'); // Som de notificação ao encerrar
        if (voiceQuery.trim()) {
          handleProcessVoiceCommand(voiceQuery);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
      setVoiceFeedback({ actionText: 'Erro ao iniciar microfone. Digite manualmente.', success: false });
    }
  };

  const handleOpenVoiceModal = () => {
    setIsVoiceModalOpen(true);
    const voiceInfo = getVoiceUsageInfo();
    if (voiceInfo.isLimitReached) {
      const limitMsg = `⚠️ Limite diário de ${DAILY_VOICE_LIMIT} pesquisas por voz atingido. Faça upgrade para o Premium para uso ilimitado!`;
      if (onShowToast) {
        onShowToast(limitMsg, 'info');
      }
      setVoiceFeedback({ actionText: limitMsg, success: false });
    } else {
      setTimeout(() => {
        toggleListening();
      }, 200);
    }
  };

  const voiceInfo = getVoiceUsageInfo();

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-3 pb-safe h-16 bg-[#f7f9fb]/95 backdrop-blur-md shadow-lg border-t border-[#e0e3e5]/60 z-50 rounded-t-2xl">
        {/* 1. Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center w-14 h-12 transition-all ${
            currentScreen === 'home'
              ? 'text-[#004ac6] font-bold'
              : 'text-[#434655] hover:text-[#004ac6]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-wider">Início</span>
        </button>

        {/* 2. Currículos */}
        <button
          onClick={() => onNavigate('resumes')}
          className={`flex flex-col items-center justify-center w-14 h-12 transition-all ${
            currentScreen === 'resumes' || currentScreen === 'editor' || currentScreen === 'preview'
              ? 'text-[#004ac6] font-bold'
              : 'text-[#434655] hover:text-[#004ac6]'
          }`}
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-wider">Currículos</span>
        </button>

        {/* 3. BOTÃO DE DESTAQUE NO CENTRO - BUSCA POR VOZ */}
        <button
          onClick={handleOpenVoiceModal}
          title="Busca & Comandos por Voz"
          className="relative -top-4 flex flex-col items-center justify-center group cursor-pointer shrink-0"
        >
          <div className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg border-4 border-[#f7f9fb] transition-all transform active:scale-90 ${
            isListening || isVoiceModalOpen
              ? 'bg-red-600 text-white ring-4 ring-red-200 animate-pulse'
              : 'bg-[#004ac6] hover:bg-[#2563eb] text-white shadow-blue-500/30'
          }`}>
            <Mic className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-extrabold tracking-wider text-[#004ac6] -mt-1 bg-white/90 px-1.5 py-0.2 rounded-full border border-blue-200 shadow-2xs">
            Voz
          </span>
        </button>

        {/* 4. IA */}
        <button
          onClick={() => onNavigate('ai-optimize')}
          className={`flex flex-col items-center justify-center w-14 h-12 transition-all ${
            currentScreen === 'ai-optimize' || currentScreen === 'cover-letter'
              ? 'text-[#004ac6] font-bold'
              : 'text-[#434655] hover:text-[#004ac6]'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5 text-[#2563eb]" />
          <span className="text-[10px] font-semibold tracking-wider">IA</span>
        </button>

        {/* 5. Perfil */}
        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center w-14 h-12 transition-all ${
            currentScreen === 'profile' || currentScreen === 'subscription'
              ? 'text-[#004ac6] font-bold'
              : 'text-[#434655] hover:text-[#004ac6]'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-wider">Perfil</span>
        </button>
      </nav>

      {/* OVERLAY MODAL BUSCA POR VOZ */}
      {isVoiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex flex-col justify-end md:justify-center items-center p-0 md:p-4 animate-in fade-in duration-200">
          <div 
            className="w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4 relative animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004ac6]">
                  <Mic className="w-4 h-4 text-[#004ac6]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#191c1e] flex items-center gap-1.5 flex-wrap">
                    Busca & Comandos por Voz
                    {user?.isPremium ? (
                      <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Crown className="w-2.5 h-2.5 text-amber-600" /> PRO Ilimitado
                      </span>
                    ) : (
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                        voiceInfo.isLimitReached 
                          ? 'bg-amber-100 text-amber-800 border-amber-300' 
                          : 'bg-blue-50 text-[#004ac6] border-blue-200'
                      }`}>
                        {voiceInfo.remaining}/{DAILY_VOICE_LIMIT} buscas hoje
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-500">Diga o nome da vaga ou comando do app</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (recognitionRef.current) {
                    try { recognitionRef.current.stop(); } catch (e) {}
                  }
                  setIsListening(false);
                  setIsVoiceModalOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Premium Upgrade Banner when Limit Reached */}
            {!user?.isPremium && voiceInfo.isLimitReached && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between text-xs text-amber-900 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-semibold text-[11px]">Limite diário de {DAILY_VOICE_LIMIT} pesquisas atingido no plano Gratuito.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsVoiceModalOpen(false);
                    onNavigate('subscription');
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl cursor-pointer shrink-0 transition-all shadow-xs"
                >
                  Seja Premium
                </button>
              </div>
            )}

            {/* Pulsing Visualizer Circle */}
            <div className="flex flex-col items-center justify-center py-4 space-y-3">
              <button
                onClick={toggleListening}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-600 text-white shadow-xl shadow-red-500/40 ring-8 ring-red-100 animate-pulse'
                    : 'bg-[#004ac6] text-white shadow-xl shadow-blue-500/30 hover:bg-[#2563eb]'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-9 h-9 text-white animate-bounce" />
                ) : (
                  <Mic className="w-9 h-9 text-white" />
                )}
              </button>

              <div className="text-center space-y-1">
                <p className={`text-xs font-bold ${isListening ? 'text-red-600 animate-pulse' : 'text-slate-700'}`}>
                  {isListening ? 'Ouvindo... Fale agora!' : 'Clique no microfone para falar'}
                </p>
                {isListening && (
                  <div className="flex items-center justify-center gap-1 h-3 pt-1">
                    <div className="w-1 bg-red-600 h-full animate-pulse"></div>
                    <div className="w-1 bg-red-400 h-2/3 animate-pulse delay-75"></div>
                    <div className="w-1 bg-red-600 h-full animate-pulse delay-150"></div>
                    <div className="w-1 bg-red-500 h-1/2 animate-pulse delay-100"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Text Input & Submit */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (voiceQuery.trim()) {
                  handleProcessVoiceCommand(voiceQuery);
                }
              }} 
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={voiceQuery}
                  onChange={(e) => setVoiceQuery(e.target.value)}
                  placeholder="Ou digite: 'Vagas de TI', 'Criar currículo'..."
                  className="w-full pl-9 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 text-slate-800"
                />
                {voiceQuery && (
                  <button
                    type="button"
                    onClick={() => setVoiceQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-[#004ac6] hover:bg-[#2563eb] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>Executar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Feedback alert */}
            {voiceFeedback && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                voiceFeedback.success 
                  ? 'bg-blue-50 border-blue-200 text-[#004ac6]' 
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <span className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 shrink-0 text-[#004ac6]" />
                  {voiceFeedback.actionText}
                </span>
                <button 
                  onClick={() => setVoiceFeedback(null)} 
                  className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quick Command Suggestions */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Exemplos de comandos por voz:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Buscar vagas de TI",
                  "Criar currículo",
                  "Simular entrevista",
                  "Ver modelos",
                  "Meus currículos"
                ].map((cmd, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setVoiceQuery(cmd);
                      handleProcessVoiceCommand(cmd);
                    }}
                    className="bg-slate-100 hover:bg-blue-50 hover:text-[#004ac6] text-slate-700 border border-slate-200 text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Mic className="w-3 h-3 text-slate-400" />
                    <span>"{cmd}"</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
