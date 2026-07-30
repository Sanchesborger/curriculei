import React, { useState } from 'react';
import { Crown, Check, ShieldCheck, Zap, ArrowRight, Loader2 } from 'lucide-react';

interface SubscriptionScreenProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ onShowToast }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    onShowToast('Iniciando checkout seguro Stripe...', 'info');

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let data: any = {};
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Server returned non-JSON response:', text);
        data = { error: 'O servidor retornou uma resposta inesperada. Verifique se a variável STRIPE_SECRET_KEY está salva e implantada na Vercel.' };
      }

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        onShowToast(data.error || 'Não foi possível gerar a sessão de checkout. Verifique a chave STRIPE_SECRET_KEY na Vercel.', 'error');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      onShowToast('Falha na comunicação com o serviço de pagamento. Tente novamente em instantes.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pt-6 md:pt-8 pb-28 px-4 md:px-8 max-w-5xl mx-auto flex flex-col gap-8 font-sans">
      {/* Hero Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 text-[#004ac6] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Crown className="w-4 h-4 text-[#2563eb]" /> Planos e Preços
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#191c1e] tracking-tight">
          Desbloqueie seu Potencial Profissional
        </h1>
        <p className="text-sm md:text-base text-[#434655]">
          Acelere sua recolocação com modelos testados em ATS e inteligência artificial ilimitada.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* Free Plan */}
        <div className="bg-white rounded-3xl p-8 border border-[#c3c6d7]/60 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-[#737686] tracking-wider">Plano Gratuito</span>
            <div className="text-3xl font-extrabold text-[#191c1e] mt-2">R$ 0 <span className="text-sm font-normal text-[#737686]">/mês</span></div>
            <p className="text-xs text-[#434655] mt-2">Para quem precisa de um currículo rápido e simples.</p>

            <ul className="mt-6 space-y-3 text-xs text-[#191c1e] font-medium">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>1 Currículo em PDF</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Modelo Básico Bicolor</span>
              </li>
              <li className="flex items-center gap-3 text-[#737686] line-through">
                <span>Análise de IA e Pontuação ATS</span>
              </li>
              <li className="flex items-center gap-3 text-[#737686] line-through">
                <span>Gerador de Cartas de Apresentação</span>
              </li>
            </ul>
          </div>

          <button
            disabled
            className="mt-8 w-full py-3.5 rounded-2xl bg-[#f2f4f6] text-[#737686] font-bold text-xs uppercase tracking-wider cursor-not-allowed"
          >
            Plano Atual
          </button>
        </div>

        {/* Premium PRO Plan */}
        <div className="bg-gradient-to-br from-[#004ac6] to-[#1d3989] rounded-3xl p-8 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden border-2 border-[#2563eb]">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-amber-300 tracking-wider flex items-center gap-1">
                <Zap className="w-4 h-4 fill-amber-300" /> Mais Popular
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                Acesso Ilimitado
              </span>
            </div>

            <div className="text-4xl font-extrabold text-white mt-3">
              R$ 29 <span className="text-sm font-normal text-white/70">/mês</span>
            </div>
            <p className="text-xs text-white/80 mt-2">Cancele a qualquer momento com 1 toque.</p>

            <ul className="mt-6 space-y-3 text-xs text-white font-medium">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>Currículos Ilimitados e Download HD</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>Acesso Completo à Galeria de Templates Premium</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>Otimizador IA de Resumo e Verbos de Ação</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>Simulador de Diagnóstico e Pontuação ATS</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>Cartas de Apresentação Geradas por IA</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="mt-8 relative z-10 w-full py-4 rounded-2xl bg-white text-[#004ac6] hover:bg-amber-300 hover:text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-75 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#004ac6]" />
                <span>Processando Checkout...</span>
              </>
            ) : (
              <>
                <span>Assinar Premium Agora</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>

      {/* Guarantee & Trust Badges */}
      <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#434655]">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#2563eb]" />
          <div>
            <span className="font-bold text-[#191c1e] block">Garantia de Satisfação de 7 Dias</span>
            <span>Se não se destacar nos processos seletivos, devolvemos 100% do seu investimento.</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#737686] font-semibold">
          <span>Pagamento Seguro via Stripe</span>
        </div>
      </div>

    </main>
  );
};
