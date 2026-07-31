import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Monitor, 
  ExternalLink, 
  CheckCircle2, 
  Share, 
  PlusSquare, 
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onShowToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
  onDeferredPromptConsumed?: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onShowToast,
  onDeferredPromptConsumed
}) => {
  const [isInIframe, setIsInIframe] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  useEffect(() => {
    // Check if running inside iframe
    try {
      setIsInIframe(window.self !== window.top);
    } catch (e) {
      setIsInIframe(true);
    }

    // Check iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check standalone
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);
  }, []);

  // Helper to get a fresh deferredPrompt from the global getter (captured by main.tsx)
  const getFreshDeferredPrompt = (): any => {
    if (deferredPrompt) return deferredPrompt;
    if (typeof (window as any).getDeferredPrompt === 'function') {
      return (window as any).getDeferredPrompt();
    }
    return null;
  };

  const handleNativeInstall = async () => {
    const prompt = getFreshDeferredPrompt();
    
    if (!prompt) {
      if (isInIframe) {
        window.open(window.location.href, '_blank');
        if (onShowToast) {
          onShowToast('Aplicação aberta em nova aba! Clique no botão de instalar no topo.', 'info');
        }
      } else if (!isIOS) {
        // Not in iframe, not iOS, but no deferred prompt available
        // This can happen if the beforeinstallprompt event was missed
        if (onShowToast) {
          onShowToast('Clique no ícone de instalação (+) na barra de endereços do seu navegador.', 'info');
        }
      }
      return;
    }

    setIsInstalling(true);
    try {
      // Notify parent that we're about to consume the prompt
      if (onDeferredPromptConsumed) {
        onDeferredPromptConsumed();
      }

      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') {
        if (onShowToast) onShowToast('Aplicativo CVPro AI instalado com sucesso!', 'success');
        setIsStandalone(true);
        onClose();
      } else {
        if (onShowToast) onShowToast('Instalação cancelada pelo usuário.', 'info');
      }
    } catch (err) {
      console.error('Error prompting PWA install:', err);
      if (onShowToast) onShowToast('Não foi possível iniciar a instalação. Tente usar o ícone da barra de endereços.', 'error');
    } finally {
      setIsInstalling(false);
    }
  };

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank');
    if (onShowToast) {
      onShowToast('Abrindo em nova aba para suporte total a instalação PWA...', 'info');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[70] transition-opacity duration-300"
      />

      {/* Centered Modal */}
      <div className="fixed inset-0 z-[75] flex items-center justify-center p-4 font-sans">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#c3c6d7]/50 overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#004ac6] to-[#2563eb] text-white p-6 relative">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white text-[#004ac6] rounded-2xl flex items-center justify-center shadow-md font-black text-xl">
                CV
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/80 bg-white/15 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> Aplicativo Web PWA
                </span>
                <h3 className="text-xl font-bold text-white">Instalar o CVPro AI</h3>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">

            {isStandalone ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">O App já está instalado!</h4>
                <p className="text-xs text-emerald-700">
                  Você já está utilizando o CVPro AI no modo aplicativo autônomo (standalone).
                </p>
              </div>
            ) : (
              <>
                {/* Benefits */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-[#434655] uppercase tracking-wider">
                    Vantagens ao instalar no seu dispositivo:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-[#191c1e]">
                    <div className="bg-[#f0f4f9] p-2.5 rounded-xl flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#2563eb]" />
                      <span>Acesso rápido na tela inicial</span>
                    </div>
                    <div className="bg-[#f0f4f9] p-2.5 rounded-xl flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Sem consumir memória da loja</span>
                    </div>
                    <div className="bg-[#f0f4f9] p-2.5 rounded-xl flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-[#2563eb]" />
                      <span>Interface sem barras de navegador</span>
                    </div>
                    <div className="bg-[#f0f4f9] p-2.5 rounded-xl flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-600" />
                      <span>Carregamento ultra-rápido</span>
                    </div>
                  </div>
                </div>

                {/* If inside iframe Warning & Primary Solution */}
                {isInIframe && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-3 text-amber-900">
                    <div className="flex items-start gap-2.5">
                      <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <span className="font-bold block text-sm text-amber-950">Atenção ao Modo de Visualização</span>
                        <p className="leading-relaxed">
                          Os navegadores bloqueiam o botão direto de instalação PWA quando a página está dentro de um quadro de pré-visualização (iFrame).
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenNewTab}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Abrir em Nova Aba para Instalar</span>
                    </button>
                  </div>
                )}

                {/* iOS Tutorial */}
                {isIOS && (
                  <div className="bg-[#f0f4f9] p-4 rounded-2xl space-y-3 border border-[#e0e3e5]">
                    <h5 className="font-bold text-xs text-[#004ac6] uppercase tracking-wider flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4" /> Instalar no iPhone ou iPad (Safari):
                    </h5>
                    <ol className="text-xs text-[#191c1e] space-y-2 list-decimal list-inside font-medium">
                      <li className="leading-tight">
                        Toque no botão <span className="font-bold text-[#004ac6] inline-flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-[#c3c6d7]"><Share className="w-3.5 h-3.5 inline" /> Compartilhar</span> do Safari.
                      </li>
                      <li className="leading-tight">
                        Role para baixo e selecione <span className="font-bold text-[#004ac6] inline-flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-[#c3c6d7]"><PlusSquare className="w-3.5 h-3.5 inline" /> Adicionar à Tela de Início</span>.
                      </li>
                      <li className="leading-tight">
                        Confirme tocando em <span className="font-bold text-emerald-700">Adicionar</span> no canto superior.
                      </li>
                    </ol>
                  </div>
                )}

                {/* Direct Native Install Button - shown when not in iframe and has a deferred prompt */}
                {!isInIframe && getFreshDeferredPrompt() && (
                  <button
                    type="button"
                    onClick={handleNativeInstall}
                    disabled={isInstalling}
                    className="w-full py-3.5 bg-[#004ac6] hover:bg-[#1d3989] text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>{isInstalling ? 'Instalando...' : 'Instalar Aplicativo Agora'}</span>
                  </button>
                )}

                {/* Desktop Instructions fallback when no deferred prompt and not in iframe */}
                {!isInIframe && !getFreshDeferredPrompt() && !isIOS && (
                  <div className="bg-[#f0f4f9] p-4 rounded-2xl text-xs text-[#434655] space-y-2 border border-[#e0e3e5]">
                    <span className="font-bold text-[#191c1e] block">
                      Como instalar no computador ou Android:
                    </span>
                    <p className="leading-relaxed">
                      Procure pelo ícone de instalação <span className="font-bold text-[#004ac6]">(+)</span> localizado no lado direito da barra de endereços do seu navegador (Chrome, Edge ou Brave) e clique em <strong>Instalar</strong>.
                    </p>
                  </div>
                )}
              </>
            )}

          </div>

          {/* Footer */}
          <div className="p-4 bg-[#f7f9fb] border-t border-[#e0e3e5] flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-white hover:bg-[#e0e3e5] text-[#191c1e] text-xs font-bold rounded-xl border border-[#c3c6d7] transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>

        </div>
      </div>
    </>
  );
};
