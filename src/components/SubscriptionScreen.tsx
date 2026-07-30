import React, { useState } from 'react';
import { Crown, Check, ShieldCheck, Zap, ArrowRight, Loader2, Sparkles, AlertCircle, X } from 'lucide-react';

interface SubscriptionScreenProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ onShowToast }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoMessage, setDemoMessage] = useState('');

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

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.demo || data.error) {
        setDemoMessage(data.message || data.error || 'Configure a chave secreta do Stripe para habilitar pagamentos reais.');
        setShowDemoModal(true);
      } else {
        onShowToast(data.error || 'Não foi possível gerar a sessão de checkout.', 'error');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      setDemoMessage('O servidor backend não respondeu à chamada do Stripe. Verifique suas configurações de ambiente.');
      setShowDemoModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateSubscription = () => {
    setShowDemoModal(false);
    onShowToast('Parabéns! Plano Premium PRO ativado em modo demonstração!', 'success');
    window.location.search = '?subscription=success';
  };

  return (
    <main className="pt-6 md:pt-8 pb-28 px-4 md:px-8 max-w-5xl mx-auto flex flex-col gap-8 font-sans relative">
      
      {/* Demo Modal for Stripe Setup & Testing */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 animate-fade-in space-y-5 relative">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-[#2563eb]">
              <div className="p-3 bg-[#2563eb]/10 rounded-2xl">
                <Crown className="w-6 h-6 text-[#2563eb]" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#191c1e]">Integração do Stripe</h3>
                <p className="text-xs text-slate-500">Configuração de Pagamento</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Status da Chave do Stripe</span>
              </div>
              <p className="leading-relaxed">{demoMessage}</p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p className="font-bold text-slate-800">Para ativar o checkout Stripe em produção:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Acesse o Dashboard do Stripe (stripe.com) e copie sua <strong>Secret Key</strong> (ex: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">sk_test_...</code>).</li>
                <li>Defina a variável <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">STRIPE_SECRET_KEY</code> nas configurações da sua aplicação.</li>
              </ol>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSimulateSubscription}
                className="flex-1 py-3 px-4 bg-[#2563eb] hover:bg-[#004ac6] text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ativar Assinatura PRO (Demonstração)</span>
              </button>
              <button
                onClick={() => setShowDemoModal(false)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

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
