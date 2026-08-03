import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  X, 
  Edit3, 
  Sliders, 
  MapPin, 
  Calendar, 
  Mail, 
  Brain, 
  FileText, 
  MoreVertical,
  Check,
  ChevronRight,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  plan: string;
  billingFrequency: string;
  activeUsers: number;
  maxUsers: number;
  aiQueriesUsed: number;
  aiQueriesLimit: number;
  resumesParsed: number;
  status: 'active' | 'pending' | 'suspended';
  city: string;
  joinDate: string;
  logoText: string;
  recentUsers: { name: string; role: string; avatarBg: string }[];
}

interface CompanyManagementModuleProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CompanyManagementModule: React.FC<CompanyManagementModuleProps> = ({ onShowToast }) => {
  const [subTab, setSubTab] = useState<'active' | 'pending' | 'suspended'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Lista de empresas com dados simulados completos
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: 'comp-1',
      name: 'TechCorp Solutions',
      cnpj: '12.345.678/0001-90',
      email: 'contato@techcorp.com.br',
      plan: 'Enterprise IA',
      billingFrequency: 'Anual',
      activeUsers: 145,
      maxUsers: 500,
      aiQueriesUsed: 45200,
      aiQueriesLimit: 100000,
      resumesParsed: 8900,
      status: 'active',
      city: 'São Paulo, SP',
      joinDate: '12/10/2023',
      logoText: 'TC',
      recentUsers: [
        { name: 'Ana Silva', role: 'Administrador HR', avatarBg: 'bg-blue-600' },
        { name: 'João Pereira', role: 'Recrutador Senior', avatarBg: 'bg-indigo-600' },
        { name: 'Mariana Costa', role: 'Gerente de Talentos', avatarBg: 'bg-emerald-600' }
      ]
    },
    {
      id: 'comp-2',
      name: 'Global Logística S.A.',
      cnpj: '98.765.432/0001-10',
      email: 'rh@globallogistics.com.br',
      plan: 'Profissional PRO',
      billingFrequency: 'Mensal',
      activeUsers: 42,
      maxUsers: 50,
      aiQueriesUsed: 18400,
      aiQueriesLimit: 30000,
      resumesParsed: 3100,
      status: 'active',
      city: 'Curitiba, PR',
      joinDate: '05/03/2024',
      logoText: 'GL',
      recentUsers: [
        { name: 'Carlos Eduardo', role: 'Gestor de RH', avatarBg: 'bg-amber-600' },
        { name: 'Fernanda Lima', role: 'Analista de Seleção', avatarBg: 'bg-purple-600' }
      ]
    },
    {
      id: 'comp-3',
      name: 'Nexus Inovação LTDA',
      cnpj: '45.890.123/0001-55',
      email: 'admin@nexusinovacao.com',
      plan: 'Enterprise IA',
      billingFrequency: 'Anual',
      activeUsers: 210,
      maxUsers: 300,
      aiQueriesUsed: 82100,
      aiQueriesLimit: 150000,
      resumesParsed: 14200,
      status: 'active',
      city: 'Florianópolis, SC',
      joinDate: '18/11/2024',
      logoText: 'NX',
      recentUsers: [
        { name: 'Roberto Fonseca', role: 'Diretor de Gente', avatarBg: 'bg-teal-600' },
        { name: 'Beatriz Ramos', role: 'Recrutadora Tech', avatarBg: 'bg-rose-600' }
      ]
    },
    {
      id: 'comp-4',
      name: 'Inova Tech Brasil',
      cnpj: '33.111.222/0001-44',
      email: 'contato@inovatechbr.com',
      plan: 'Startup',
      billingFrequency: 'Mensal',
      activeUsers: 12,
      maxUsers: 20,
      aiQueriesUsed: 4100,
      aiQueriesLimit: 10000,
      resumesParsed: 650,
      status: 'pending',
      city: 'Belo Horizonte, MG',
      joinDate: '28/01/2026',
      logoText: 'IT',
      recentUsers: [
        { name: 'Lucas Mendes', role: 'Fundador / CEO', avatarBg: 'bg-cyan-600' }
      ]
    },
    {
      id: 'comp-5',
      name: 'Vanguard Engenharia',
      cnpj: '77.888.999/0001-33',
      email: 'rh@vanguardeng.com',
      plan: 'Profissional PRO',
      billingFrequency: 'Anual',
      activeUsers: 88,
      maxUsers: 100,
      aiQueriesUsed: 29800,
      aiQueriesLimit: 50000,
      resumesParsed: 5200,
      status: 'suspended',
      city: 'Rio de Janeiro, RJ',
      joinDate: '14/06/2023',
      logoText: 'VE',
      recentUsers: [
        { name: 'Patricia Souza', role: 'Coordenadora RH', avatarBg: 'bg-slate-600' }
      ]
    }
  ]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('comp-1');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLimitsModal, setShowLimitsModal] = useState(false);

  // Form states para nova empresa
  const [newCompName, setNewCompName] = useState('');
  const [newCompCNPJ, setNewCompCNPJ] = useState('');
  const [newCompEmail, setNewCompEmail] = useState('');
  const [newCompPlan, setNewCompPlan] = useState('Enterprise IA');
  const [newCompCity, setNewCompCity] = useState('');

  // Form states para limites da empresa selecionada
  const [editMaxUsers, setEditMaxUsers] = useState<number>(500);
  const [editAiLimit, setEditAiLimit] = useState<number>(100000);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  const filteredCompanies = companies.filter(c => {
    const matchesTab = c.status === subTab;
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cnpj.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const activeCount = companies.filter(c => c.status === 'active').length;
  const pendingCount = companies.filter(c => c.status === 'pending').length;
  const suspendedCount = companies.filter(c => c.status === 'suspended').length;

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim() || !newCompCNPJ.trim() || !newCompEmail.trim()) {
      onShowToast('Preencha os campos obrigatórios da empresa.', 'error');
      return;
    }

    const newComp: Company = {
      id: `comp-${Date.now()}`,
      name: newCompName,
      cnpj: newCompCNPJ,
      email: newCompEmail,
      plan: newCompPlan,
      billingFrequency: 'Anual',
      activeUsers: 1,
      maxUsers: 100,
      aiQueriesUsed: 0,
      aiQueriesLimit: 50000,
      resumesParsed: 0,
      status: 'active',
      city: newCompCity || 'São Paulo, SP',
      joinDate: new Date().toLocaleDateString('pt-BR'),
      logoText: newCompName.substring(0, 2).toUpperCase(),
      recentUsers: [{ name: 'Admin da Empresa', role: 'Administrador Principal', avatarBg: 'bg-blue-600' }]
    };

    setCompanies(prev => [newComp, ...prev]);
    setSelectedCompanyId(newComp.id);
    setShowAddModal(false);
    setNewCompName('');
    setNewCompCNPJ('');
    setNewCompEmail('');
    setNewCompCity('');
    onShowToast(`Empresa "${newComp.name}" cadastrada com sucesso!`, 'success');
  };

  const handleOpenLimitsModal = (comp: Company) => {
    setSelectedCompanyId(comp.id);
    setEditMaxUsers(comp.maxUsers);
    setEditAiLimit(comp.aiQueriesLimit);
    setShowLimitsModal(true);
  };

  const handleSaveLimits = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanies(prev => prev.map(c => {
      if (c.id === selectedCompanyId) {
        return {
          ...c,
          maxUsers: editMaxUsers,
          aiQueriesLimit: editAiLimit
        };
      }
      return c;
    }));
    setShowLimitsModal(false);
    onShowToast(`Limites atualizados para ${selectedCompany.name}`, 'success');
  };

  const handleApproveCompany = (id: string) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: 'active' } : c));
    onShowToast('Empresa aprovada e ativada com sucesso!', 'success');
  };

  const handleSuspendCompany = (id: string) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: 'suspended' } : c));
    onShowToast('Status da empresa alterado para suspensa.', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in w-full">
      
      {/* Cabeçalho da Página e Botão de Ação Principal */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-500" /> Gestão de Empresas (B2B)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie contas empresariais, contratos, licenças e limites de inteligência artificial.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Cadastrar Empresa
        </button>
      </div>

      {/* Abas de Navegação Sub-Status */}
      <div className="flex border-b border-slate-800 gap-6 text-xs font-bold">
        <button
          onClick={() => setSubTab('active')}
          className={`pb-3 transition-colors cursor-pointer flex items-center gap-2 ${
            subTab === 'active'
              ? 'text-blue-400 border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Empresas Ativas ({activeCount})
        </button>

        <button
          onClick={() => setSubTab('pending')}
          className={`pb-3 transition-colors cursor-pointer flex items-center gap-2 ${
            subTab === 'pending'
              ? 'text-amber-400 border-b-2 border-amber-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" /> Pendentes de Aprovação
          {pendingCount > 0 && (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('suspended')}
          className={`pb-3 transition-colors cursor-pointer flex items-center gap-2 ${
            subTab === 'suspended'
              ? 'text-red-400 border-b-2 border-red-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-red-400" /> Suspensas ({suspendedCount})
        </button>
      </div>

      {/* Grid Principal: Tabela da Esquerda + Painel Lateral de Detalhes da Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Tabela de Empresas (8 Cols no Desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-slate-800/90 rounded-2xl border border-slate-700/80 shadow-xl overflow-hidden flex flex-col">
          
          {/* Barra de Ferramentas e Busca */}
          <div className="p-4 border-b border-slate-700/80 bg-slate-900/60 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome, CNPJ ou e-mail..."
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              <span>Exibindo {filteredCompanies.length} empresas</span>
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto min-h-[350px]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 uppercase text-[10px] font-extrabold text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="p-4">Empresa</th>
                  <th className="p-4">CNPJ</th>
                  <th className="p-4">Plano</th>
                  <th className="p-4">Usuários</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      Nenhuma empresa encontrada nesta categoria.
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((comp) => {
                    const isSelected = comp.id === selectedCompanyId;
                    return (
                      <tr 
                        key={comp.id}
                        onClick={() => setSelectedCompanyId(comp.id)}
                        className={`hover:bg-slate-700/40 transition-colors cursor-pointer relative ${
                          isSelected ? 'bg-blue-900/20 border-l-4 border-blue-500' : ''
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 border border-blue-400/30">
                              {comp.logoText}
                            </div>
                            <div>
                              <div className="font-bold text-slate-100 flex items-center gap-1.5">
                                {comp.name}
                              </div>
                              <div className="text-[11px] text-slate-400">{comp.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-mono text-slate-300 text-[11px]">
                          {comp.cnpj}
                        </td>

                        <td className="p-4">
                          <div className="font-semibold text-slate-200">{comp.plan}</div>
                          <div className="text-[10px] text-slate-400">{comp.billingFrequency}</div>
                        </td>

                        <td className="p-4 text-slate-300">
                          <div className="flex items-center gap-1 font-mono text-[11px]">
                            <Users className="w-3.5 h-3.5 text-blue-400" />
                            <span>{comp.activeUsers} / {comp.maxUsers}</span>
                          </div>
                        </td>

                        <td className="p-4">
                          {comp.status === 'active' && (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Ativa
                            </span>
                          )}
                          {comp.status === 'pending' && (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-400" /> Pendente
                            </span>
                          )}
                          {comp.status === 'suspended' && (
                            <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-red-400" /> Suspensa
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenLimitsModal(comp);
                            }}
                            className="bg-slate-700 hover:bg-slate-600 text-blue-300 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-slate-600 transition-colors cursor-pointer"
                          >
                            Ajustar Limites
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Painel Lateral de Detalhes da Empresa Selecionada (4 Cols no Desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-slate-800/90 rounded-2xl border border-slate-700/80 shadow-xl overflow-hidden p-6 space-y-6">
          
          {/* Header do Detalhe */}
          <div className="flex items-start justify-between border-b border-slate-700/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center border border-blue-400/30 shadow-md">
                {selectedCompany.logoText}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {selectedCompany.name}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 inline-block mt-1">
                  Cliente {selectedCompany.status === 'active' ? 'Ativo' : selectedCompany.status === 'pending' ? 'Pendente' : 'Suspenso'}
                </span>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOpenLimitsModal(selectedCompany)}
              className="py-2 px-3 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl border border-slate-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-blue-400" /> Ajustar Limites
            </button>

            {selectedCompany.status === 'pending' ? (
              <button
                onClick={() => handleApproveCompany(selectedCompany.id)}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Aprovar Empresa
              </button>
            ) : selectedCompany.status === 'active' ? (
              <button
                onClick={() => handleSuspendCompany(selectedCompany.id)}
                className="py-2 px-3 bg-red-900/50 hover:bg-red-800/80 text-red-200 border border-red-700/80 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-red-400" /> Suspender
              </button>
            ) : (
              <button
                onClick={() => handleApproveCompany(selectedCompany.id)}
                className="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Reativar
              </button>
            )}
          </div>

          {/* Informações da Empresa */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">CNPJ</span>
              <span className="font-mono text-slate-200 font-semibold">{selectedCompany.cnpj}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Contato Principal</span>
              <span className="text-slate-200 truncate block font-medium" title={selectedCompany.email}>
                {selectedCompany.email}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Localização</span>
              <span className="text-slate-200 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> {selectedCompany.city}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Data de Entrada</span>
              <span className="text-slate-200 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {selectedCompany.joinDate}
              </span>
            </div>
          </div>

          {/* Métricas de Uso e Limites */}
          <div className="space-y-4 pt-2 border-t border-slate-700/80">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" /> Consumo & Limites Atribuidos
            </h4>

            {/* Licenças de Usuários */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Usuários Ativos / Licenças</span>
                <span className="text-slate-100 font-mono font-bold">
                  {selectedCompany.activeUsers} / <span className="text-blue-400">{selectedCompany.maxUsers}</span>
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (selectedCompany.activeUsers / selectedCompany.maxUsers) * 100)}%` }}
                />
              </div>
            </div>

            {/* Consultas IA Mês */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Consultas IA (Este Mês)</span>
                <span className="text-slate-100 font-mono font-bold">
                  {selectedCompany.aiQueriesUsed.toLocaleString('pt-BR')} / <span className="text-purple-400">{selectedCompany.aiQueriesLimit.toLocaleString('pt-BR')}</span>
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (selectedCompany.aiQueriesUsed / selectedCompany.aiQueriesLimit) * 100)}%` }}
                />
              </div>
            </div>

            {/* Currículos Analisados */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Currículos Processados</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {selectedCompany.resumesParsed.toLocaleString('pt-BR')} (Ilimitado)
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700">
                <div className="bg-emerald-500 h-2 rounded-full w-full" />
              </div>
            </div>
          </div>

          {/* Usuários Recentes Vinculados */}
          <div className="space-y-3 pt-2 border-t border-slate-700/80">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Usuários Recentes
              </h4>
              <span className="text-[11px] text-blue-400 font-bold">{selectedCompany.recentUsers.length} vinculados</span>
            </div>

            <div className="space-y-2">
              {selectedCompany.recentUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-slate-900/50 rounded-xl border border-slate-800">
                  <div className={`w-8 h-8 rounded-full ${u.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                    {u.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-100 leading-tight">{u.name}</p>
                    <p className="text-[10px] text-slate-400">{u.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* MODAL: CADASTRO DE NOVA EMPRESA */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" /> Cadastrar Nova Empresa
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">Nome da Empresa</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: TechCorp Solutions"
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">CNPJ</label>
                <input
                  type="text"
                  required
                  placeholder="00.000.000/0001-00"
                  value={newCompCNPJ}
                  onChange={(e) => setNewCompCNPJ(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">E-mail de Contato Principal</label>
                <input
                  type="email"
                  required
                  placeholder="contato@empresa.com.br"
                  value={newCompEmail}
                  onChange={(e) => setNewCompEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">Plano Inicial</label>
                  <select
                    value={newCompPlan}
                    onChange={(e) => setNewCompPlan(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="Enterprise IA">Enterprise IA</option>
                    <option value="Profissional PRO">Profissional PRO</option>
                    <option value="Startup">Startup</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">Cidade / Estado</label>
                  <input
                    type="text"
                    placeholder="São Paulo, SP"
                    value={newCompCity}
                    onChange={(e) => setNewCompCity(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Salvar Empresa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AJUSTAR LIMITES DA EMPRESA */}
      {showLimitsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" /> Ajustar Limites - {selectedCompany.name}
              </h3>
              <button onClick={() => setShowLimitsModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLimits} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Limite Máximo de Licenças / Usuários
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editMaxUsers}
                  onChange={(e) => setEditMaxUsers(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Limite Mensal de Consultas IA
                </label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  required
                  value={editAiLimit}
                  onChange={(e) => setEditAiLimit(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl text-[11px] text-blue-300">
                Os novos limites aplicam-se imediatamente no Supabase e na API de autenticação da empresa.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLimitsModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Salvar Limites
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
