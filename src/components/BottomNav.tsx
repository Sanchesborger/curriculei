import React from 'react';
import { ScreenView } from '../types';
import { LayoutDashboard, FileText, Sparkles, User } from 'lucide-react';

interface BottomNavProps {
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  // Hide on splash, onboarding, login, signup, interview, admin
  if (['splash', 'onboarding', 'login', 'signup', 'interview', 'admin'].includes(currentScreen)) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-safe h-16 bg-[#f7f9fb]/95 backdrop-blur-md shadow-lg border-t border-[#e0e3e5]/60 z-50 rounded-t-2xl">
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center w-16 h-12 transition-all ${
          currentScreen === 'home'
            ? 'text-[#004ac6] font-bold'
            : 'text-[#434655] hover:text-[#004ac6]'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] uppercase font-semibold tracking-wider">Home</span>
      </button>

      <button
        onClick={() => onNavigate('resumes')}
        className={`flex flex-col items-center justify-center w-16 h-12 transition-all ${
          currentScreen === 'resumes' || currentScreen === 'editor' || currentScreen === 'preview'
            ? 'text-[#004ac6] font-bold bg-[#2563eb]/10 rounded-full px-3 py-1'
            : 'text-[#434655] hover:text-[#004ac6]'
        }`}
      >
        <FileText className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] uppercase font-semibold tracking-wider">Currículos</span>
      </button>

      <button
        onClick={() => onNavigate('ai-optimize')}
        className={`flex flex-col items-center justify-center w-16 h-12 transition-all ${
          currentScreen === 'ai-optimize' || currentScreen === 'cover-letter'
            ? 'text-[#004ac6] font-bold bg-[#2563eb]/10 rounded-full px-3 py-1'
            : 'text-[#434655] hover:text-[#004ac6]'
        }`}
      >
        <Sparkles className="w-5 h-5 mb-0.5 text-[#2563eb]" />
        <span className="text-[10px] uppercase font-semibold tracking-wider">IA</span>
      </button>

      <button
        onClick={() => onNavigate('profile')}
        className={`flex flex-col items-center justify-center w-16 h-12 transition-all ${
          currentScreen === 'profile' || currentScreen === 'subscription'
            ? 'text-[#004ac6] font-bold'
            : 'text-[#434655] hover:text-[#004ac6]'
        }`}
      >
        <User className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] uppercase font-semibold tracking-wider">Perfil</span>
      </button>
    </nav>
  );
};
