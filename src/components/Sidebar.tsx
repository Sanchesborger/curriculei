import React from 'react';
import { ScreenView, UserProfile } from '../types';
import { 
  Folder, 
  FileEdit, 
  MessageSquare, 
  Crown, 
  Settings, 
  X,
  Sparkles,
  LayoutDashboard,
  User,
  Layout
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
  user: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onNavigate,
  user
}) => {
  return (
    <>
      {/* Backdrop for overlay on tablet/mobile if open */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 top-14 bg-black/40 backdrop-blur-xs z-[39] transition-opacity"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-80 flex-shrink-0 bg-[#f7f9fb] shadow-2xl z-[40] flex flex-col py-6 transition-transform duration-300 border-r border-[#e0e3e5] ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:sticky md:top-14 md:z-30 md:shadow-none'
        }`}
      >
        <div className="px-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#2563eb]"
            />
            <div>
              <h2 className="font-bold text-base text-[#191c1e]">{user.name}</h2>
              <span className="text-xs text-[#004ac6] font-semibold bg-[#2563eb]/10 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit mt-0.5">
                <Crown className="w-3 h-3 text-[#2563eb]" /> Premium
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="md:hidden text-[#737686] hover:text-[#191c1e] p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 pr-4 mt-2">
          <button
            onClick={() => { onNavigate('home'); onClose(); }}
            className={`w-full flex items-center gap-4 py-3 pl-6 rounded-r-full font-medium transition-all text-left ${
              currentScreen === 'home'
                ? 'bg-[#8fa7fe]/25 text-[#1d3989] font-semibold'
                : 'text-[#434655] hover:bg-[#e6e8ea] hover:pl-7'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 text-[#2563eb]" />
            <span>Início</span>
          </button>

          <button
            onClick={() => { onNavigate('resumes'); onClose(); }}
            className={`w-full flex items-center gap-4 py-3 pl-6 rounded-r-full font-medium transition-all text-left ${
              currentScreen === 'resumes'
                ? 'bg-[#8fa7fe]/25 text-[#1d3989] font-semibold'
                : 'text-[#434655] hover:bg-[#e6e8ea] hover:pl-7'
            }`}
          >
            <Folder className="w-5 h-5 text-[#2563eb]" />
            <span>Meus Currículos</span>
          </button>

          <button
            onClick={() => { onNavigate('templates'); onClose(); }}
            className={`w-full flex items-center gap-4 py-3 pl-6 rounded-r-full font-medium transition-all text-left ${
              currentScreen === 'templates'
                ? 'bg-[#8fa7fe]/25 text-[#1d3989] font-semibold'
                : 'text-[#434655] hover:bg-[#e6e8ea] hover:pl-7'
            }`}
          >
            <Layout className="w-5 h-5 text-[#2563eb]" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => { onNavigate('cover-letter'); onClose(); }}
            className={`w-full flex items-center gap-4 py-3 pl-6 rounded-r-full font-medium transition-all text-left ${
              currentScreen === 'cover-letter'
                ? 'bg-[#8fa7fe]/25 text-[#1d3989] font-semibold'
                : 'text-[#434655] hover:bg-[#e6e8ea] hover:pl-7'
            }`}
          >
            <FileEdit className="w-5 h-5 text-[#2563eb]" />
            <span>Cartas de Apresentação</span>
          </button>

          <button
            onClick={() => { onNavigate('ai-optimize'); onClose(); }}
            className={`w-full flex items-center gap-4 py-3 pl-6 rounded-r-full font-medium transition-all text-left ${
              currentScreen === 'ai-optimize'
                ? 'bg-[#8fa7fe]/25 text-[#1d3989] font-semibold'
                : 'text-[#434655] hover:bg-[#e6e8ea] hover:pl-7'
            }`}
          >
            <Sparkles className="w-5 h-5 text-[#2563eb]" />
            <span>Otimizador IA (ATS)</span>
          </button>

          <button
            onClick={() => { onNavigate('interview'); onClose(); }}
            className={`w-full flex items-center gap-4 py-3 pl-6 rounded-r-full font-medium transition-all text-left ${
              currentScreen === 'interview'
                ? 'bg-[#8fa7fe]/25 text-[#1d3989] font-semibold'
                : 'text-[#434655] hover:bg-[#e6e8ea] hover:pl-7'
            }`}
          >
            <MessageSquare className="w-5 h-5 text-[#2563eb]" />
            <span>Simulação de Entrevista</span>
          </button>

          <button
            onClick={() => { onNavigate('subscription'); onClose(); }}
            className={`w-full flex items-center gap-4 py-3 pl-6 rounded-r-full font-medium transition-all text-left ${
              currentScreen === 'subscription'
                ? 'bg-[#8fa7fe]/25 text-[#1d3989] font-semibold'
                : 'text-[#434655] hover:bg-[#e6e8ea] hover:pl-7'
            }`}
          >
            <Crown className="w-5 h-5 text-[#2563eb]" />
            <span>Assinatura Premium</span>
          </button>

          <button
            onClick={() => { onNavigate('profile'); onClose(); }}
            className={`w-full flex items-center gap-4 py-3 pl-6 rounded-r-full font-medium transition-all text-left ${
              currentScreen === 'profile'
                ? 'bg-[#8fa7fe]/25 text-[#1d3989] font-semibold'
                : 'text-[#434655] hover:bg-[#e6e8ea] hover:pl-7'
            }`}
          >
            <User className="w-5 h-5 text-[#2563eb]" />
            <span>Meu Perfil</span>
          </button>
        </nav>

        <div className="px-6 mt-auto border-t border-[#e0e3e5] pt-4">
          <button
            onClick={() => { onNavigate('profile'); onClose(); }}
            className="flex items-center gap-4 py-2.5 text-[#434655] hover:text-[#004ac6] transition-colors w-full font-medium"
          >
            <Settings className="w-5 h-5" />
            <span>Configurações</span>
          </button>
        </div>
      </aside>
    </>
  );
};
