import React from 'react';
import { ScreenView, UserProfile } from '../types';
import { Sparkles, User, FileText, LayoutDashboard, Briefcase } from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
  onToggleSidebar: () => void;
  onOpenJobSearch?: () => void;
  onOpenInstallPrompt?: () => void;
  user: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onToggleSidebar,
  onOpenJobSearch,
  user
}) => {
  // Hide main header on splash, onboarding, login, signup, interview
  if (['splash', 'onboarding', 'login', 'signup', 'interview'].includes(currentScreen)) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center px-5 h-14 bg-[#f7f9fb]/90 backdrop-blur-md border-b border-[#e0e3e5]/60 z-50 transition-all">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Abrir menu"
          className="p-2 text-[#004ac6] hover:bg-[#2563eb]/10 transition-colors rounded-full active:scale-95 duration-150"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 font-bold text-xl text-[#004ac6] tracking-tight hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[#2563eb] text-[26px]">auto_awesome</span>
          <span>CVPro AI</span>
        </button>
      </div>

      {/* Desktop Header Links */}
      <nav className="hidden md:flex items-center gap-5 font-semibold text-xs uppercase tracking-wider">
        <button
          onClick={() => onNavigate('home')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            currentScreen === 'home' ? 'text-[#004ac6] bg-[#2563eb]/10' : 'text-[#434655] hover:text-[#004ac6]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => onNavigate('resumes')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            currentScreen === 'resumes' ? 'text-[#004ac6] bg-[#2563eb]/10' : 'text-[#434655] hover:text-[#004ac6]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Currículos</span>
        </button>
        <button
          onClick={() => onNavigate('ai-optimize')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            currentScreen === 'ai-optimize' ? 'text-[#004ac6] bg-[#2563eb]/10' : 'text-[#434655] hover:text-[#004ac6]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#2563eb]" />
          <span>Ferramentas IA</span>
        </button>
        {onOpenJobSearch && (
          <button
            onClick={onOpenJobSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#004ac6] bg-[#2563eb]/10 hover:bg-[#2563eb]/20 transition-colors font-bold cursor-pointer"
          >
            <Briefcase className="w-4 h-4 text-[#2563eb]" />
            <span>Busca de Vagas</span>
          </button>
        )}
        <button
          onClick={() => onNavigate('profile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            currentScreen === 'profile' ? 'text-[#004ac6] bg-[#2563eb]/10' : 'text-[#434655] hover:text-[#004ac6]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Perfil</span>
        </button>
      </nav>

      <div className="flex items-center gap-2">
        {onOpenJobSearch && (
          <button
            onClick={onOpenJobSearch}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#2563eb]/10 text-[#004ac6] font-bold text-xs rounded-xl active:scale-95 transition-all"
          >
            <Briefcase className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Vagas</span>
          </button>
        )}
        <button
          onClick={() => onNavigate('profile')}
          className="w-9 h-9 rounded-full overflow-hidden border border-[#c3c6d7] hover:ring-2 hover:ring-[#2563eb]/30 transition-all active:scale-95"
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};

