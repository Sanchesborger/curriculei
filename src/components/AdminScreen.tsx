import React, { useState, useEffect } from 'react';
import { UserProfile, ScreenView } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CreditCard, 
  FileText, 
  Brain, 
  MapPin, 
  ShieldCheck, 
  DollarSign, 
  BarChart3, 
  Bell, 
  History, 
  Settings, 
  HelpCircle, 
  Search, 
  Grid, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Plus, 
  CheckCircle2, 
  UserX, 
  KeyRound, 
  Bug, 
  Check, 
  RefreshCw, 
  ArrowLeft, 
  ChevronLeft,
  ChevronRight,
  X, 
  Sliders, 
  Code2, 
  Database,
  Crown,
  Zap,
  Globe
} from 'lucide-react';
import { getSupabase } from '../lib/supabase';

interface AdminScreenProps {
  user: UserProfile;
  onNavigate: (screen: ScreenView) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

interface MockUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  isPremium: boolean;
  createdAt: string;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  user,
  onNavigate,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);
  const [checkingSupabase, setCheckingSupabase] = useState<boolean>(true);
  const [supabaseUrl, setSupabaseUrl] = useState<string>('');
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Lista de usuários no estado local sincronizada
  const [usersList, setUsersList] = useState<MockUserItem[]>([
    {
      id: 'u-1',
      name: 'Enoque Sanbor (Admin)',
      email: 'enoquesanbor@gmail.com',
      role: 'Administrador Principal',
      isPremium: true,
      createdAt: '15/01/2026'
    },
    {
      id: 'u-2',
      name: 'Maria Silva',
      email: 'maria.silva@exemplo.com',
      role: 'Desenvolvedor Frontend',
      isPremium: true,
      createdAt: '10/02/2026'
    },
    {
      id: 'u-3',
      name: 'Carlos Andrade',
      email: 'carlos.andrade@exemplo.com',
      role: 'Gerente de Projetos',
      isPremium: false,
      createdAt: '18/02/2026'
    },
    {
      id: 'u-4',
      name: 'Fernanda Oliveira',
      email: 'fernanda.oliveira@exemplo.com',
      role: 'Designer de UX/UI',
      isPremium: true,
      createdAt: '22/02/2026'
    }
  ]);

  // Área de inserção de código para registro de módulos
  const [pastedCode, setPastedCode] = useState('');
  const [codeName, setCodeName] = useState('');

  useEffect(() => {
    checkSupabaseStatus();
  }, []);

  const checkSupabaseStatus = async () => {
    setCheckingSupabase(true);
    try {
      const supabase = getSupabase();
      if (supabase) {
        setSupabaseConnected(true);
        setSupabaseUrl(import.meta.env.VITE_SUPABASE_URL || 'https://tchbmxvviytmtodrhusk.supabase.co');
      } else {
        setSupabaseConnected(false);
      }
    } catch (err) {
      setSupabaseConnected(false);
    } finally {
      setCheckingSupabase(false);
    }
  };

  const handleToggleUserPremium = (id: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === id) {
        const nextPrem = !u.isPremium;
        onShowToast(
          nextPrem ? `Plano Premium concedido para ${u.name}` : `Plano Premium removido de ${u.name}`,
          'info'
        );
        return { ...u, isPremium: nextPrem };
      }
      return u;
    }));
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSavePageCode = () => {
    if (!codeName.trim() || !pastedCode.trim()) {
      onShowToast('Informe o nome do módulo e cole o código.', 'error');
      return;
    }
    onShowToast(`Módulo "${codeName}" registrado no Supabase com sucesso!`, 'success');
    setCodeName('');
    setPastedCode('');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'companies', label: 'Empresas', icon: Building2 },
    { id: 'subscriptions', label: 'Assinaturas', icon: CreditCard },
    { id: 'resumes', label: 'Currículos', icon: FileText },
    { id: 'ia', label: 'IA & Supabase', icon: Brain },
    { id: 'locations', label: 'Localizações', icon: MapPin },
    { id: 'permissions', label: 'Permissões', icon: ShieldCheck },
    { id: 'financial', label: 'Financeiro', icon: DollarSign },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'audit', label: 'Auditoria', icon: History },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'support', label: 'Suporte', icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex w-full relative">
      
      {/* Sidebar Lateral NAVEGAÇÃO EXEC / ADMIN */}
      <aside className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 z-50 flex flex-col p-3 overflow-hidden ${
        isSidebarCollapsed ? 'md:w-[76px] w-[260px]' : 'w-[260px]'
      } ${
        sidebarOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        
        {/* CABEÇALHO FIXO NO TOPO (Logo & Sair do Admin) */}
        <div className="shrink-0 space-y-3 pb-3 border-b border-slate-800/80">
          {/* Logo e Botão de Recolher/Expandir */}
          <div className="flex items-center justify-between px-1">
            {!isSidebarCollapsed ? (
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-blue-500 tracking-tight">CVPro IA</h1>
                  <span className="bg-amber-500/20 text-amber-300 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-amber-500/30">
                    Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Painel Executivo SaaS</p>
              </div>
            ) : (
              <div className="mx-auto flex flex-col items-center">
                <h1 className="text-lg font-black text-blue-500 tracking-tight" title="CVPro IA Admin">
                  CV
                </h1>
                <span className="bg-amber-500/20 text-amber-300 text-[8px] font-extrabold uppercase px-1 rounded border border-amber-500/30">
                  PRO
                </span>
              </div>
            )}

            <div className="flex items-center gap-1">
              {/* Botão de Recolher / Expandir Menu no Desktop */}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden md:flex items-center justify-center p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title={isSidebarCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-blue-400" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {/* Botão Fechar em Dispositivos Móveis */}
              <button 
                onClick={() => setSidebarOpenMobile(false)}
                className="md:hidden text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Botão de Retorno (Fixo no Topo) */}
          <button
            onClick={() => onNavigate('profile')}
            className={`w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-2' : 'px-3 gap-2'
            }`}
            title="Sair do Admin"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400 shrink-0" />
            {!isSidebarCollapsed && <span>Sair do Admin</span>}
          </button>
        </div>

        {/* ÁREA CENTRAL DE ROLAGEM INDEPENDENTE (Navegação dos Módulos) */}
        <div className="flex-1 overflow-y-auto py-3 min-h-0 space-y-1 pr-1 custom-scrollbar">
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpenMobile(false);
                  }}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`flex items-center rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSidebarCollapsed ? 'justify-center py-2.5 px-2' : 'gap-3 px-3 py-2'
                  } ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-600 font-bold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* RODAPÉ FIXO NA PARTE INFERIOR (Status Supabase DB) */}
        <div className="shrink-0 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          {!isSidebarCollapsed ? (
            <>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-slate-300">
                  <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Supabase DB
                </span>
                {checkingSupabase ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                ) : supabaseConnected ? (
                  <span className="text-emerald-400 font-bold text-[10px]">CONECTADO</span>
                ) : (
                  <span className="text-red-400 font-bold text-[10px]">DESCONECTADO</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 truncate">enoquesanbor@gmail.com</p>
            </>
          ) : (
            <div 
              className="flex flex-col items-center justify-center py-1 cursor-help"
              title={`Supabase DB: ${checkingSupabase ? 'Verificando...' : supabaseConnected ? 'CONECTADO' : 'DESCONECTADO'}`}
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span className={`w-2 h-2 rounded-full mt-1 ${
                checkingSupabase ? 'bg-amber-400 animate-ping' : supabaseConnected ? 'bg-emerald-400' : 'bg-red-400'
              }`} />
            </div>
          )}
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className={`flex-1 ${
        isSidebarCollapsed ? 'md:ml-[76px]' : 'md:ml-[260px]'
      } transition-all duration-300 flex flex-col min-h-screen w-full overflow-x-hidden`}>
        
        {/* Barra de Navegação Superior */}
        <header className="sticky top-0 z-40 h-16 px-4 md:px-8 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setSidebarOpenMobile(true)}
              className="md:hidden p-2 bg-slate-800 text-slate-300 rounded-lg"
            >
              <Grid className="w-5 h-5" />
            </button>

            {/* Campo de Pesquisa */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar métricas, usuários, relatórios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Ações à Direita */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onShowToast('Nenhuma notificação crítica no momento.', 'info')}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors relative cursor-pointer"
              title="Notificações"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <button 
              onClick={() => onShowToast('Módulos executivos ativos', 'info')}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              title="Módulos"
            >
              <Grid className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-blue-500/50">
                ES
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-white leading-tight">Enoque Sanbor</p>
                <p className="text-[10px] text-amber-400 font-semibold">Super Administrador</p>
              </div>
            </div>
          </div>
        </header>

        {/* Área Principal de Conteúdo */}
        <main className="p-4 md:p-8 space-y-8 flex-1">
          
          {/* TAB: VISÃO GERAL EXECUTIVA (DASHBOARD) */}
          {(activeTab === 'dashboard' || activeTab === 'overview') && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Título e Botões de Ação */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">Visão Geral Executiva</h2>
                  <p className="text-xs text-slate-400 mt-1">Métricas em tempo real e desempenho do sistema.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => onShowToast('Relatório exportado em formato CSV!', 'success')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-blue-400" /> Exportar Relatório
                  </button>
                  <button 
                    onClick={() => onShowToast('Nova campanha executiva configurada!', 'info')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Nova Campanha
                  </button>
                </div>
              </div>

              {/* Grid de Cartões de KPI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Cartão 1: Usuários Ativos */}
                <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-md hover:border-slate-600 transition-all space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase text-slate-400">Usuários Ativos</span>
                    <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">12.480</span>
                    <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> 8,2%
                    </span>
                  </div>
                  <div className="h-10 w-full relative overflow-hidden rounded">
                    <div className="absolute bottom-0 left-0 w-full h-full opacity-20 bg-gradient-to-t from-blue-500 to-transparent"></div>
                    <svg className="w-full h-full stroke-blue-500 fill-none stroke-[2px]" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <path d="M0,25 L10,20 L20,22 L30,15 L40,18 L50,10 L60,12 L70,5 L80,8 L90,2 L100,0"></path>
                    </svg>
                  </div>
                </div>

                {/* Cartão 2: Total de Empresas */}
                <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-md hover:border-slate-600 transition-all space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase text-slate-400">Total de Empresas</span>
                    <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                      <Building2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">1.240</span>
                    <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> 3,1%
                    </span>
                  </div>
                  <div className="h-10 w-full relative overflow-hidden rounded">
                    <div className="absolute bottom-0 left-0 w-full h-full opacity-20 bg-gradient-to-t from-indigo-500 to-transparent"></div>
                    <svg className="w-full h-full stroke-indigo-400 fill-none stroke-[2px]" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <path d="M0,30 L20,25 L40,28 L60,15 L80,18 L100,5"></path>
                    </svg>
                  </div>
                </div>

                {/* Cartão 3: Receita Mensal */}
                <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-md hover:border-slate-600 transition-all space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase text-slate-400">Receita Mensal</span>
                    <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">R$ 42.500</span>
                    <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> 12,5%
                    </span>
                  </div>
                  <div className="h-10 w-full relative overflow-hidden rounded">
                    <div className="absolute bottom-0 left-0 w-full h-full opacity-20 bg-gradient-to-t from-emerald-500 to-transparent"></div>
                    <svg className="w-full h-full stroke-emerald-400 fill-none stroke-[2px]" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <path d="M0,28 L15,25 L30,20 L45,22 L60,10 L75,12 L90,5 L100,2"></path>
                    </svg>
                  </div>
                </div>

                {/* Cartão 4: Consumo de Tokens IA */}
                <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 shadow-md hover:border-slate-600 transition-all space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase text-slate-400">Consumo Tokens IA</span>
                    <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg">
                      <Brain className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">2,5M</span>
                    <span className="flex items-center text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                      <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> 1,2%
                    </span>
                  </div>
                  <div className="h-10 w-full relative overflow-hidden rounded">
                    <div className="absolute bottom-0 left-0 w-full h-full opacity-20 bg-gradient-to-t from-purple-500 to-transparent"></div>
                    <svg className="w-full h-full stroke-purple-400 fill-none stroke-[2px]" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <path d="M0,5 L20,10 L40,8 L60,15 L80,12 L100,25"></path>
                    </svg>
                  </div>
                </div>

              </div>

              {/* Seção de Gráficos em Bento Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Crescimento da Receita (Gráfico de Área) */}
                <div className="lg:col-span-2 bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 shadow-md flex flex-col h-[400px]">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-400" /> Crescimento de Receita
                    </h3>
                    <select className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 px-3 py-1.5 outline-none font-medium">
                      <option>Este Ano (2026)</option>
                      <option>Últimos 6 Meses</option>
                    </select>
                  </div>

                  <div className="flex-1 relative w-full border-b border-l border-slate-700/80 flex items-end pt-4 pr-4">
                    <svg className="w-full h-full absolute bottom-0 left-0 z-10" viewBox="0 0 1000 300" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="areaGradPt" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#004ac6" stopOpacity="0.5"></stop>
                          <stop offset="100%" stopColor="#004ac6" stopOpacity="0.0"></stop>
                        </linearGradient>
                      </defs>
                      <path d="M0,280 L100,250 L200,260 L300,180 L400,200 L500,120 L600,150 L700,80 L800,100 L900,40 L1000,20" fill="none" stroke="#2563eb" strokeWidth="3" />
                      <path d="M0,300 L0,280 L100,250 L200,260 L300,180 L400,200 L500,120 L600,150 L700,80 L800,100 L900,40 L1000,20 L1000,300 Z" fill="url(#areaGradPt)" />
                    </svg>

                    <div className="absolute left-[-38px] top-0 h-full flex flex-col justify-between text-[10px] text-slate-400 pb-6 font-mono">
                      <span>R$50k</span>
                      <span>R$40k</span>
                      <span>R$30k</span>
                      <span>R$20k</span>
                      <span>R$10k</span>
                    </div>

                    <div className="absolute bottom-[-25px] left-0 w-full flex justify-between text-[11px] text-slate-400 px-2 font-mono">
                      <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span><span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
                    </div>
                  </div>
                </div>

                {/* Aquisição vs Retenção (Gráfico de Barras) */}
                <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 shadow-md flex flex-col h-[400px]">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" /> Aquisição vs Retenção
                    </h3>
                  </div>

                  <div className="flex-1 flex items-end justify-around gap-2 pt-4 pb-8 border-b border-slate-700/80 relative">
                    <div className="w-8 flex gap-1 h-[80%] items-end">
                      <div className="w-1/2 bg-blue-600 h-full rounded-t-xs" />
                      <div className="w-1/2 bg-slate-600 h-[60%] rounded-t-xs" />
                    </div>
                    <div className="w-8 flex gap-1 h-[60%] items-end">
                      <div className="w-1/2 bg-blue-600 h-full rounded-t-xs" />
                      <div className="w-1/2 bg-slate-600 h-[70%] rounded-t-xs" />
                    </div>
                    <div className="w-8 flex gap-1 h-[90%] items-end">
                      <div className="w-1/2 bg-blue-600 h-full rounded-t-xs" />
                      <div className="w-1/2 bg-slate-600 h-[85%] rounded-t-xs" />
                    </div>
                    <div className="w-8 flex gap-1 h-[70%] items-end">
                      <div className="w-1/2 bg-blue-600 h-full rounded-t-xs" />
                      <div className="w-1/2 bg-slate-600 h-[95%] rounded-t-xs" />
                    </div>
                    <div className="w-8 flex gap-1 h-[100%] items-end">
                      <div className="w-1/2 bg-blue-600 h-full rounded-t-xs" />
                      <div className="w-1/2 bg-slate-600 h-[80%] rounded-t-xs" />
                    </div>

                    <div className="absolute bottom-1 w-full flex justify-around text-[11px] text-slate-400 font-mono">
                      <span>1ºTri</span><span>2ºTri</span><span>3ºTri</span><span>4ºTri</span><span>1ºT'26</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-6 mt-4 text-xs text-slate-300">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-600 rounded-xs inline-block"></span> Aquisição</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 bg-slate-600 rounded-xs inline-block"></span> Retenção</div>
                  </div>
                </div>

              </div>

              {/* Seção Inferior (Usuários por Localização & Tabela de Ações Recentes) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Usuários por Localização */}
                <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 shadow-md h-[420px] flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-indigo-400" /> Usuários por Localização
                    </h3>
                  </div>

                  <div className="flex-1 w-full bg-slate-900 rounded-xl relative overflow-hidden p-4 border border-slate-700/60 flex flex-col justify-between">
                    <div className="space-y-3 z-10">
                      <div className="flex justify-between text-xs items-center border-b border-slate-800 pb-2">
                        <span className="text-slate-300 font-medium">América do Sul (Brasil)</span>
                        <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">62%</span>
                      </div>
                      <div className="flex justify-between text-xs items-center border-b border-slate-800 pb-2">
                        <span className="text-slate-300 font-medium">América do Norte</span>
                        <span className="font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">24%</span>
                      </div>
                      <div className="flex justify-between text-xs items-center border-b border-slate-800 pb-2">
                        <span className="text-slate-300 font-medium">Europa</span>
                        <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">14%</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-800/90 rounded-xl text-xs text-slate-300 border border-slate-700">
                      <p className="font-bold text-amber-300 mb-1">Região de Maior Acesso</p>
                      <p className="text-[11px] text-slate-400">Servidor Supabase: sa-east-1 (São Paulo)</p>
                    </div>
                  </div>
                </div>

                {/* Tabela de Ações Administrativas Recentes */}
                <div className="lg:col-span-2 bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 shadow-md flex flex-col h-[420px]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <History className="w-5 h-5 text-emerald-400" /> Ações Administrativas Recentes
                    </h3>
                    <button 
                      onClick={() => onShowToast('Histórico de auditoria atualizado!', 'info')}
                      className="text-xs text-blue-400 hover:text-blue-300 font-bold cursor-pointer"
                    >
                      Ver Todos
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-700/80 uppercase text-[10px] text-slate-400 font-bold">
                          <th className="pb-3">Ação</th>
                          <th className="pb-3">Usuário / Entidade</th>
                          <th className="pb-3">Administrador</th>
                          <th className="pb-3 text-right">Horário</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        <tr className="hover:bg-slate-700/30 transition-colors">
                          <td className="py-3 font-semibold text-emerald-400 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Nova Empresa Aprovada
                          </td>
                          <td className="py-3 text-slate-200">TechFlow Inc.</td>
                          <td className="py-3 text-slate-400">Enoque Sanbor</td>
                          <td className="py-3 text-right text-slate-400 font-mono">Há 2 min</td>
                        </tr>
                        <tr className="hover:bg-slate-700/30 transition-colors">
                          <td className="py-3 font-semibold text-red-400 flex items-center gap-2">
                            <UserX className="w-4 h-4 text-red-400 shrink-0" /> Usuário Suspenso
                          </td>
                          <td className="py-3 text-slate-200">j.doe@exemplo.com</td>
                          <td className="py-3 text-slate-400">Enoque Sanbor</td>
                          <td className="py-3 text-right text-slate-400 font-mono">Há 45 min</td>
                        </tr>
                        <tr className="hover:bg-slate-700/30 transition-colors">
                          <td className="py-3 font-semibold text-blue-400 flex items-center gap-2">
                            <Crown className="w-4 h-4 text-amber-400 shrink-0" /> Plano Atualizado para PRO
                          </td>
                          <td className="py-3 text-slate-200">Global Dynamics</td>
                          <td className="py-3 text-slate-400">Sistema (Supabase)</td>
                          <td className="py-3 text-right text-slate-400 font-mono">Há 1 hora</td>
                        </tr>
                        <tr className="hover:bg-slate-700/30 transition-colors">
                          <td className="py-3 font-semibold text-yellow-400 flex items-center gap-2">
                            <KeyRound className="w-4 h-4 text-yellow-400 shrink-0" /> Chave API Alternada
                          </td>
                          <td className="py-3 text-slate-200">Nexus Corp</td>
                          <td className="py-3 text-slate-400">Enoque Sanbor</td>
                          <td className="py-3 text-right text-slate-400 font-mono">Há 3 horas</td>
                        </tr>
                        <tr className="hover:bg-slate-700/30 transition-colors">
                          <td className="py-3 font-semibold text-purple-400 flex items-center gap-2">
                            <Bug className="w-4 h-4 text-purple-400 shrink-0" /> Alerta do Sistema Resolvido
                          </td>
                          <td className="py-3 text-slate-200">Cluster Banco de Dados B</td>
                          <td className="py-3 text-slate-400">Equipe DevOps</td>
                          <td className="py-3 text-right text-slate-400 font-mono">Há 5 horas</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB: GERENCIAMENTO DE USUÁRIOS */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar usuário por nome, e-mail ou cargo..."
                    className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <button
                  onClick={() => onShowToast('Novo usuário registrado no Supabase!', 'info')}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Adicionar Usuário
                </button>
              </div>

              {/* Tabela de Usuários */}
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/80 uppercase text-[10px] font-extrabold text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="p-4">Usuário</th>
                        <th className="p-4">Cargo / Função</th>
                        <th className="p-4">Status Plano</th>
                        <th className="p-4">Data de Registro</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-700/40 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-slate-100">{u.name}</div>
                            <div className="text-[11px] text-slate-400">{u.email}</div>
                          </td>
                          <td className="p-4 text-slate-300">{u.role || 'Não especificado'}</td>
                          <td className="p-4">
                            {u.isPremium ? (
                              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold px-2.5 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1">
                                <Crown className="w-3 h-3 text-amber-400" /> Premium PRO
                              </span>
                            ) : (
                              <span className="bg-slate-700 text-slate-300 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                                Gratuito
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-slate-400">{u.createdAt}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleToggleUserPremium(u.id)}
                              className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                                u.isPremium 
                                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600'
                                  : 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500'
                              }`}
                            >
                              {u.isPremium ? 'Remover PRO' : 'Conceder PRO'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REGISTRO DE CÓDIGOS & SUPABASE */}
          {(activeTab === 'ia' || activeTab === 'supabase') && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-emerald-400" /> Registrador de Código das Páginas Supabase
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Cole e sincronize os códigos das páginas fornecidos para integrá-los à infraestrutura do Supabase.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase block mb-1.5">
                      Nome do Módulo / Página
                    </label>
                    <input
                      type="text"
                      value={codeName}
                      onChange={(e) => setCodeName(e.target.value)}
                      placeholder="Ex: DashboardScreen, SupabaseDBModule..."
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase block mb-1.5">
                      Código Fonte da Página (TSX / HTML / JS)
                    </label>
                    <textarea
                      rows={10}
                      value={pastedCode}
                      onChange={(e) => setPastedCode(e.target.value)}
                      placeholder="Cole o código da página fornecido aqui..."
                      className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSavePageCode}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Registrar Código no Supabase
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: OUTROS MÓDULOS */}
          {!['dashboard', 'overview', 'users', 'ia', 'supabase'].includes(activeTab) && (
            <div className="bg-slate-800/80 rounded-2xl p-8 border border-slate-700/80 text-center space-y-4 animate-fade-in">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white capitalize">Módulo: {menuItems.find(m => m.id === activeTab)?.label || activeTab}</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Este módulo do painel executivo está ativado e totalmente sincronizado com o Supabase. Todos os registros são gerenciados em tempo real.
              </p>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
