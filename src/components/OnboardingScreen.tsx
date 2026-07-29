import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';

interface OnboardingScreenProps {
  onFinish: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [step, setStep] = useState<number>(1);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col items-center justify-center font-sans antialiased relative p-4">
      <main className="w-full max-w-md mx-auto min-h-[800px] bg-white rounded-3xl shadow-xl border border-[#c3c6d7]/30 overflow-hidden flex flex-col justify-between p-6 relative">
        
        {/* Top bar with back and skip/step counter */}
        <div className="flex justify-between items-center w-full z-10">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              aria-label="Voltar"
              className="text-[#434655] hover:text-[#004ac6] transition-colors p-2 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <span className="font-bold text-lg text-[#004ac6]">CVPro AI</span>
          )}

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase text-[#737686]">
              {step} DE 3
            </span>
            <button
              onClick={onFinish}
              className="text-[#434655] font-semibold text-xs uppercase hover:text-[#004ac6] transition-colors"
            >
              PULAR
            </button>
          </div>
        </div>

        {/* Content per step */}
        <div className="flex-1 flex flex-col items-center justify-center my-6 relative w-full">
          
          {step === 1 && (
            <div className="w-full flex flex-col items-center text-center animate-fade-in">
              <div className="relative w-full aspect-[4/3] mb-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#dbe1ff] to-[#dce1ff] rounded-[32px] opacity-50 blur-xl" />
                <div className="relative w-full h-full bg-white border border-[#c3c6d7]/30 rounded-[32px] shadow-md overflow-hidden flex items-center justify-center p-4">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuArcWXSW78Mq16uxnBQRMskDRQX1-wWA7Uyyoxv-5tbK_rgvJ-1twlpeG_MXCTw1WLkGPetOafqThCqvWUHrHW31ZZWk2ibYn_2ax4aOv0h5Ne5aVP3txxfQC-5x7UkfWCsZK7zmcEvvjQHi96UUKF-pHcGjhu0vuCX8s8TfJblMb-6_aec4AGdpWuguLM5atwIHWH1Go0mR0JMvvj92eLCIKo3l5ajtiYIto5XfDpBsp1fqvJhpnxK-STXMeHmiP3E-oUqWw5dL_w"
                    alt="Crie seu currículo em minutos"
                    className="object-cover w-full h-full rounded-2xl"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#c3c6d7]/30 shadow-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#2563eb]" />
                    <span className="text-xs font-semibold text-[#191c1e]">AI Optimized</span>
                  </div>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-[#191c1e] mb-3">
                Crie seu currículo em minutos
              </h1>
              <p className="text-sm text-[#434655] max-w-[300px]">
                Utilize nossa tecnologia de ponta para destacar suas habilidades no mercado de trabalho.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="w-full flex flex-col items-center text-center animate-fade-in">
              <div className="relative w-full aspect-square max-w-[300px] mb-6 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-md p-6 border border-[#c3c6d7]/30 shadow-lg flex flex-col gap-4 justify-center">
                <div className="w-full h-12 bg-[#eceef0] rounded-lg relative overflow-hidden flex items-center px-4">
                  <div className="w-3/4 h-2 bg-[#c3c6d7] rounded-full" />
                </div>

                <div className="w-full h-12 bg-[#eceef0] rounded-lg relative overflow-hidden flex items-center px-4 justify-between border-2 border-[#2563eb]/30">
                  <div className="w-1/2 h-2 bg-[#2563eb] rounded-full animate-pulse" />
                  <Sparkles className="w-5 h-5 text-[#2563eb]" />
                </div>

                <div className="w-full h-12 bg-[#eceef0] rounded-lg relative overflow-hidden flex items-center px-4">
                  <div className="w-2/3 h-2 bg-[#c3c6d7] rounded-full" />
                </div>

                <div className="absolute -right-2 top-1/3 bg-white px-3.5 py-2 rounded-full shadow-lg border border-[#c3c6d7]/30 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                  <span className="text-xs font-bold text-[#191c1e]">Otimizado</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#191c1e] mb-3">
                IA que melhora seu texto
              </h2>
              <p className="text-sm text-[#434655] max-w-[300px]">
                Nossa inteligência artificial sugere as melhores palavras-chave e descrições para seu perfil.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="w-full flex flex-col items-center text-center animate-fade-in">
              <div className="relative w-full aspect-[4/3] mb-6 flex items-center justify-center">
                <div className="relative w-full h-full bg-white border border-[#c3c6d7]/50 rounded-2xl shadow-md overflow-hidden flex flex-col items-center justify-center p-2">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuALp0MzTvsd6HMrg_hbS2bZkaqZaMXnDO6BfZE9TzyrWhn2MWHzRVvN1TNAUvM-EdUsrOCjq5Irr8YYtth9Q9zUm-P_GoICbyH_sFNgSmqD8szRRZ7SyTYFRdlZsjAqx2lEy6lgizQi9OuxOTFXXQhZtmItjsKxYHBuUkCySTQW912NQ1RyXioJZTOwPWKEo4LYgnd4L0Zl73W3s9DqhUuti-NbEvZbUlZepu5Q8sdUSntavnYuzQRtEjSHuIhf1zE4PF09x5-FTM4"
                    alt="PDF Gerado com Sucesso"
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <div className="absolute bottom-4 bg-white/95 backdrop-blur-md px-5 py-2 rounded-full shadow-md border border-[#c3c6d7]/30 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#2563eb]" />
                    <span className="text-xs font-bold text-[#191c1e]">PDF Gerado com Sucesso</span>
                  </div>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-[#191c1e] mb-3">
                Exporte e conquiste vagas
              </h1>
              <p className="text-sm text-[#434655] max-w-[320px]">
                Gere PDFs profissionais prontos para sistemas ATS e compartilhe com recrutadores com apenas um toque.
              </p>
            </div>
          )}

        </div>

        {/* Bottom indicators and action */}
        <div className="w-full flex flex-col gap-6 z-10">
          {/* Progress Indicators */}
          <div className="flex justify-center items-center gap-2">
            <div className={`h-2 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-[#2563eb]' : 'w-2 bg-[#e0e3e5]'}`} />
            <div className={`h-2 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-[#2563eb]' : 'w-2 bg-[#e0e3e5]'}`} />
            <div className={`h-2 rounded-full transition-all duration-300 ${step === 3 ? 'w-8 bg-[#2563eb]' : 'w-2 bg-[#e0e3e5]'}`} />
          </div>

          <button
            onClick={handleNext}
            className="w-full h-[52px] bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md"
          >
            <span>{step === 3 ? 'Começar Agora' : 'Próximo'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </main>
    </div>
  );
};
