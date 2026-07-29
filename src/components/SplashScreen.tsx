import React, { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  title?: string;
  subtitle?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  title = "Gerando seu Currículo", 
  subtitle = "Otimizando layout ATS e aprimorando textos com IA..." 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="bg-[#004ac6] text-white min-h-screen w-full flex flex-col items-center justify-center overflow-hidden relative select-none">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-900/40 blur-[100px]" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 animate-fade-in">
        {/* Animated Icon Box */}
        <div className="w-24 h-24 mb-6 flex items-center justify-center rounded-3xl bg-white shadow-2xl relative overflow-hidden group border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-[48px] text-[#004ac6] relative z-10 font-bold">
            description
          </span>
        </div>

        {/* Brand Title / Dynamic Action Title */}
        <h1 className="font-extrabold text-3xl md:text-4xl text-white tracking-tight max-w-md leading-tight">
          {title}
        </h1>

        {/* Dynamic Subtitle */}
        <p className="font-medium text-sm text-white/90 mt-3 max-w-sm">
          {subtitle}
        </p>

        {/* Loading Indicator */}
        <div className="mt-8 flex items-center justify-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-amber-300 animate-ping" />
          <div className="w-3 h-3 rounded-full bg-white animate-pulse delay-150" />
          <div className="w-3 h-3 rounded-full bg-white/70 animate-pulse delay-300" />
        </div>
      </main>

      {/* Bottom Footer */}
      <div className="absolute bottom-8 left-0 w-full text-center z-10">
        <p className="text-xs text-white/60 font-medium tracking-wider uppercase">
          CVPro AI • Inteligência em Carreiras
        </p>
      </div>
    </div>
  );
};
