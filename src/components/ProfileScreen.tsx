import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ScreenView } from '../types';
import { 
  User, 
  Crown, 
  Mail, 
  Shield, 
  HelpCircle, 
  Settings,
  Bell,
  Sliders,
  LogOut, 
  Sparkles, 
  ChevronRight, 
  Save, 
  Download,
  CreditCard,
  Trash2,
  Moon,
  Sun,
  Eye,
  Camera,
  Upload,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onNavigate: (screen: ScreenView) => void;
  onLogout: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  onNavigate,
  onLogout,
  onShowToast
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [email, setEmail] = useState(user.email);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(user.name);
    setRole(user.role);
    setEmail(user.email);
    setAvatarUrl(user.avatarUrl);
  }, [user]);

  const compressImage = (dataUrl: string, maxWidth = 300, maxHeight = 300, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
    });
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        onShowToast('A imagem deve ter no máximo 10MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          try {
            const compressed = await compressImage(reader.result);
            setAvatarUrl(compressed);
            onShowToast('Foto selecionada! Clique em "Salvar Alterações" para aplicar.', 'info');
          } catch {
            setAvatarUrl(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
  ];

  // Settings State
  const [showSettings, setShowSettings] = useState(true);
  const [notifyResume, setNotifyResume] = useState(true);
  const [notifyInterview, setNotifyInterview] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [publicProfile, setPublicProfile] = useState(true);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        setDarkMode(e.newValue === 'dark');
      }
    };

    const handleCustomThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const themeVal = customEvent.detail ?? localStorage.getItem('theme');
      setDarkMode(themeVal === 'dark');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('theme-changed', handleCustomThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('theme-changed', handleCustomThemeChange);
    };
  }, []);

  const handleToggleDarkMode = (isDark: boolean) => {
    setDarkMode(isDark);
    const themeStr = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', themeStr);

    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    window.dispatchEvent(new CustomEvent('theme-changed', { detail: themeStr }));
    onShowToast(isDark ? 'Dark Mode ativado' : 'Light Mode ativado', 'info');
  };

  const [historyItems, setHistoryItems] = useState([
    { id: '1', text: 'A IA sugeriu 3 melhorias para o "Resumo Profissional".', time: 'Há 2 horas', type: 'ai' },
    { id: '2', text: 'Exportação do currículo em PDF concluída.', time: 'Ontem', type: 'download' },
    { id: '3', text: 'Pagamento da assinatura Premium confirmado.', time: '3 dias atrás', type: 'payment' },
  ]);

  const handleSaveProfile = async () => {
    let finalAvatar = avatarUrl;
    if (avatarUrl && avatarUrl.startsWith('data:image')) {
      try {
        finalAvatar = await compressImage(avatarUrl);
      } catch (e) {
        console.error('Error compressing image:', e);
      }
    }
    onUpdateUser({
      ...user,
      name,
      role,
      email,
      avatarUrl: finalAvatar
    });
    setIsEditing(false);
    onShowToast('Perfil e foto atualizados com sucesso!', 'success');
  };

  const handleSaveSettings = () => {
    onShowToast('Configurações salvas com sucesso!');
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
    onShowToast('Histórico limpo com sucesso.', 'info');
  };

  return (
    <main className="pt-6 md:pt-8 pb-28 px-4 md:px-8 max-w-4xl mx-auto flex flex-col gap-6 font-sans">
      
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#c3c6d7]/50 shadow-sm flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        <div 
          className="relative group cursor-pointer flex-shrink-0"
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => fileInputRef.current?.click(), 100);
          }}
          title="Clique para alterar a foto de perfil"
        >
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#2563eb] shadow-md flex-shrink-0 relative">
            <img src={isEditing ? avatarUrl : user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1">
              <Camera className="w-5 h-5" />
              <span>Editar Foto</span>
            </div>
          </div>
          <button 
            type="button" 
            title="Alterar foto de perfil"
            className="absolute bottom-0 right-0 bg-[#2563eb] text-white p-2 rounded-full shadow-md border-2 border-white hover:bg-[#004ac6] transition-transform hover:scale-110"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold text-[#191c1e]">{user.name}</h1>
            <span className="bg-[#2563eb]/10 text-[#004ac6] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-[#2563eb]" /> Membro Premium
            </span>
          </div>

          {user.role ? (
            <p className="text-sm font-semibold text-[#2563eb]">{user.role}</p>
          ) : (
            <p className="text-xs text-[#737686] italic">Cargo não definido (clique em Editar Perfil para adicionar)</p>
          )}
          <p className="text-xs text-[#737686] flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5" /> {user.email}
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-[#f2f4f6] hover:bg-[#c3c6d7]/40 text-[#191c1e] text-xs font-bold px-4 py-2 rounded-xl transition-colors self-center sm:self-start"
        >
          {isEditing ? 'Cancelar' : 'Editar Perfil'}
        </button>
      </div>

      {/* Edit Form Drawer if active */}
      {isEditing && (
        <div className="bg-white rounded-2xl p-6 border border-[#2563eb]/30 shadow-md space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-[#191c1e]">Editar Perfil e Foto</h3>
            <span className="text-xs text-[#737686]">Sua foto é visível nos currículos e PDFs</span>
          </div>

          {/* Avatar Edit Controls */}
          <div className="p-4 bg-[#f8fafc] rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-22 h-22 rounded-full overflow-hidden border-2 border-[#2563eb] shadow-sm flex-shrink-0 group">
              <img src={avatarUrl} alt="Preview Avatar" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1"
              >
                <Camera className="w-5 h-5" />
                <span>Trocar</span>
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2.5">
              <div>
                <span className="text-xs font-bold text-[#434655] uppercase block">Foto de Perfil</span>
                <p className="text-xs text-slate-500 mt-0.5">Faça upload de uma foto do seu dispositivo ou escolha um modelo.</p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Carregar Imagem
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200')}
                  className="bg-slate-200/80 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Restaurar Padrão
                </button>
              </div>

              <div className="pt-1">
                <span className="text-[11px] text-slate-500 font-medium block mb-1.5">Ou escolha um dos avatares sugeridos:</span>
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  {presetAvatars.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(preset)}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                        avatarUrl === preset 
                          ? 'border-[#2563eb] scale-110 shadow-md ring-2 ring-[#2563eb]/30' 
                          : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img src={preset} alt={`Avatar preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#434655] uppercase block mb-1">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#c3c6d7] text-sm focus:border-[#2563eb] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#434655] uppercase block mb-1">Cargo Principal</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ex: Engenheiro de Software, Vendedor, Gerente..."
                className="w-full h-11 px-3.5 rounded-xl border border-[#c3c6d7] text-sm focus:border-[#2563eb] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-[#434655] uppercase block mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#c3c6d7] text-sm focus:border-[#2563eb] outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setName(user.name);
                setRole(user.role);
                setEmail(user.email);
                setAvatarUrl(user.avatarUrl);
                setIsEditing(false);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveProfile}
              className="bg-[#2563eb] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:bg-[#004ac6] transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" /> Salvar Alterações
            </button>
          </div>
        </div>
      )}

      {/* Account Menu List */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/50 shadow-sm divide-y divide-[#e0e3e5] overflow-hidden">
        <button
          onClick={() => onNavigate('subscription')}
          className="w-full p-4 flex justify-between items-center hover:bg-[#f7f9fb] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#191c1e] block">Minha Assinatura</span>
              <span className="text-xs text-[#737686]">Plano Premium PRO (Ativo)</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#737686]" />
        </button>

        <button
          onClick={() => onNavigate('ai-optimize')}
          className="w-full p-4 flex justify-between items-center hover:bg-[#f7f9fb] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2563eb]/10 text-[#004ac6] rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#191c1e] block">Otimizações com IA</span>
              <span className="text-xs text-[#737686]">3 currículos otimizados este mês</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#737686]" />
        </button>

        <button
          onClick={() => onShowToast('Configurações de privacidade salvas.')}
          className="w-full p-4 flex justify-between items-center hover:bg-[#f7f9fb] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#f2f4f6] text-[#434655] rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#191c1e] block">Privacidade e Segurança</span>
              <span className="text-xs text-[#737686]">Autenticação de 2 fatores e dados</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#737686]" />
        </button>

        <button
          onClick={() => onShowToast('Suporte CVPro AI: suporte@cvpro.ai')}
          className="w-full p-4 flex justify-between items-center hover:bg-[#f7f9fb] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#f2f4f6] text-[#434655] rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#191c1e] block">Ajuda e Suporte</span>
              <span className="text-xs text-[#737686]">Perguntas frequentes e canal direto</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#737686]" />
        </button>

        {/* Card de Configurações adicionado abaixo do card de Ajuda e Suporte */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full p-4 flex justify-between items-center hover:bg-[#f7f9fb] transition-colors text-left bg-[#f8fafc]/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#004ac6]/10 text-[#004ac6] rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#191c1e] block">Configurações</span>
              <span className="text-xs text-[#737686]">Notificações, aparência, privacidade e histórico</span>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 text-[#737686] transition-transform duration-200 ${showSettings ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Seção Expandida de Configurações */}
      {showSettings && (
        <div className="space-y-6 animate-fade-in mt-2">
          
          <div className="border-b border-[#e0e3e5] pb-2">
            <h2 className="text-2xl font-bold text-[#191c1e]">Configurações</h2>
            <p className="text-xs text-[#434655] mt-1">Gerencie suas preferências de notificação e privacidade.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Esquerda: Painéis de Notificação e Aparência */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Card Notificações */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#c3c6d7]/50 space-y-6">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-[#004ac6]" />
                  <h3 className="font-bold text-base text-[#191c1e]">Notificações</h3>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-[#191c1e]">Atualizações do Resume</h4>
                      <p className="text-xs text-[#737686]">Receba alertas quando a IA sugerir melhorias.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifyResume} 
                        onChange={(e) => setNotifyResume(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-[#e0e3e5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#c3c6d7] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                    </label>
                  </div>

                  <hr className="border-[#e0e3e5]" />

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-[#191c1e]">Dicas de Entrevista</h4>
                      <p className="text-xs text-[#737686]">E-mails semanais com preparação para entrevistas.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifyInterview} 
                        onChange={(e) => setNotifyInterview(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-[#e0e3e5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#c3c6d7] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Card Aparência & Privacidade */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#c3c6d7]/50 space-y-6">
                <div className="flex items-center gap-3">
                  <Sliders className="w-5 h-5 text-[#004ac6]" />
                  <h3 className="font-bold text-base text-[#191c1e]">Aparência & Privacidade</h3>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-[#191c1e]">Dark Mode</h4>
                      <p className="text-xs text-[#737686]">Alterar tema do aplicativo.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={darkMode} 
                        onChange={(e) => handleToggleDarkMode(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-[#e0e3e5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#c3c6d7] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                    </label>
                  </div>

                  <hr className="border-[#e0e3e5]" />

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-[#191c1e]">Perfil Público</h4>
                      <p className="text-xs text-[#737686]">Permitir que recrutadores encontrem seu perfil.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={publicProfile} 
                        onChange={(e) => setPublicProfile(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-[#e0e3e5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#c3c6d7] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Botão Salvar Alterações */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveSettings}
                  className="bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-sm transition-all active:scale-95"
                >
                  Salvar Alterações
                </button>
              </div>

            </div>

            {/* Direita: Histórico */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#c3c6d7]/50 space-y-4">
                <div className="flex items-center justify-between border-b border-[#e0e3e5] pb-3">
                  <h3 className="font-bold text-sm text-[#191c1e]">Histórico</h3>
                  {historyItems.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      className="text-xs font-semibold text-[#004ac6] hover:underline"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {historyItems.length === 0 ? (
                    <p className="text-xs text-[#737686] text-center py-4">Nenhum histórico recente.</p>
                  ) : (
                    historyItems.map((item) => (
                      <div key={item.id} className="flex gap-3 items-start pb-3 border-b border-[#e0e3e5] last:border-0">
                        <div className="p-2 rounded-xl bg-[#2563eb]/10 text-[#004ac6] shrink-0 mt-0.5">
                          {item.type === 'ai' && <Sparkles className="w-4 h-4" />}
                          {item.type === 'download' && <Download className="w-4 h-4" />}
                          {item.type === 'payment' && <CreditCard className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-[#191c1e] leading-snug">{item.text}</p>
                          <span className="text-[10px] text-[#737686] mt-1 block">{item.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full py-4 rounded-2xl bg-white border border-[#ba1a1a]/30 text-[#ba1a1a] hover:bg-[#ffdad6]/40 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        <LogOut className="w-4 h-4" />
        <span>Sair da Conta</span>
      </button>

    </main>
  );
};

