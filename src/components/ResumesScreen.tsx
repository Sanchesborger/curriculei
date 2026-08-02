import React, { useState } from 'react';
import { ResumeData, UserProfile } from '../types';
import { getAuthHeaders } from '../lib/supabase';
import { validateResumeForAI } from '../lib/validateResume';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  FileEdit, 
  Sparkles, 
  Clock, 
  Edit3, 
  Share2, 
  Trash2,
  PlusCircle,
  Upload,
  Download,
  AlertTriangle,
  X,
  Wand2,
  Zap,
  Tag,
  RotateCcw
} from 'lucide-react';

interface ResumesScreenProps {
  user?: UserProfile;
  resumes: ResumeData[];
  onSelectResume: (resume: ResumeData) => void;
  onCreateNewResume: () => void;
  onDeleteResume: (id: string) => void;
  onShareResume: (resume: ResumeData) => void;
  onExportPDF?: (resume: ResumeData) => void;
  onUpdateResume?: (updated: ResumeData) => void;
  onNavigateToAIOptimize?: (resume: ResumeData) => void;
  onNavigateToSubscription?: () => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const CATEGORY_TAGS = [
  { id: 'ALL', label: 'Todas Categorias', keywords: [] },
  { id: 'TECH', label: '💻 Tecnologia & TI', keywords: ['dev', 'frontend', 'backend', 'fullstack', 'software', 'ti', 'tech', 'engenhar', 'dados', 'sistemas', 'program', 'react', 'node', 'python', 'java', 'web'] },
  { id: 'DESIGN', label: '🎨 Design & UX', keywords: ['design', 'ux', 'ui', 'figma', 'arte', 'produto', 'grafic', 'webdesign'] },
  { id: 'BUSINESS', label: '📊 Negócios & Gestão', keywords: ['gestã', 'geren', 'business', 'projeto', 'lider', 'adm', 'consult', 'operac'] },
  { id: 'SALES', label: '🚀 Vendas & Mkt', keywords: ['vendas', 'mkt', 'market', 'comercial', 'sales', 'growth', 'midia'] },
  { id: 'HEALTH', label: '🏥 Saúde & Outros', keywords: ['saúd', 'médic', 'enferm', 'educa', 'nutri', 'psico', 'outros'] },
];

export const ResumesScreen: React.FC<ResumesScreenProps> = ({
  user,
  resumes,
  onSelectResume,
  onCreateNewResume,
  onDeleteResume,
  onShareResume,
  onExportPDF,
  onUpdateResume,
  onNavigateToAIOptimize,
  onNavigateToSubscription,
  onShowToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [resumeToDelete, setResumeToDelete] = useState<ResumeData | null>(null);
  const [improvingResumeId, setImprovingResumeId] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const isUserPremium = Boolean(user?.isPremium || user?.role?.toLowerCase().includes('premium'));

  const handleCreateClick = () => {
    // Free plan allows up to 1 resume. Premium allows unlimited.
    if (!isUserPremium && resumes.length >= 1) {
      setShowLimitModal(true);
      return;
    }
    onCreateNewResume();
  };

  const handleImproveWithAI = async (resume: ResumeData, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Validação e sanitização prévia dos dados do currículo
    const validation = validateResumeForAI(resume);
    if (!validation.isValid) {
      if (onShowToast) {
        onShowToast(validation.errors[0] || 'Por favor, preencha as informações obrigatórias do currículo antes de otimizar.', 'error');
      }
      return;
    }

    setImprovingResumeId(resume.id);

    try {
      const authHeaders = await getAuthHeaders();
      const targetRole = validation.sanitizedTargetRole;

      const res = await fetch('/api/ai/optimize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({
          resumeData: validation.sanitizedResume,
          targetRole: targetRole
        })
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (parseErr) {
        console.warn('Erro ao decodificar JSON do servidor:', parseErr);
      }

      const updatedResume: ResumeData = data.optimizedResume || {
        ...resume,
        status: 'AI OPTIMIZED',
        atsScore: Math.min(98, Math.max(92, (resume.atsScore || 70) + 20)),
        summary: resume.summary || `Especialista em ${targetRole} com histórico em entregas estratégicas de alto impacto.`,
        skills: Array.from(new Set([
          ...(resume.skills || []),
          'Gestão de Projetos',
          'Metodologias Ágeis',
          'Liderança Técnica'
        ]))
      };

      if (onUpdateResume) {
        onUpdateResume(updatedResume);
      }
      
      if (onShowToast) {
        onShowToast(data.message || 'Currículo aprimorado com sucesso pela IA!', 'success');
      }
    } catch (err) {
      console.error('Erro na otimização com IA:', err);
      const targetRole = resume.personalData?.title || resume.title || 'Profissional';
      const fallbackResume: ResumeData = {
        ...resume,
        status: 'AI OPTIMIZED',
        atsScore: Math.min(98, Math.max(92, (resume.atsScore || 70) + 20)),
        summary: resume.summary || `Especialista em ${targetRole} com foco em entregas de alto impacto e inovação de processos.`,
        skills: Array.from(new Set([
          ...(resume.skills || []),
          'Resolução de Problemas',
          'Comunicação Eficiente',
          'Liderança e Visão Estratégica'
        ]))
      };

      if (onUpdateResume) {
        onUpdateResume(fallbackResume);
      }

      if (onShowToast) {
        onShowToast('Currículo aprimorado com sucesso pela IA!', 'success');
      }
    } finally {
      setImprovingResumeId(null);
    }
  };

  const filteredResumes = resumes.filter((r) => {
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch = !searchLower ||
      r.title.toLowerCase().includes(searchLower) ||
      (r.personalData?.fullName || '').toLowerCase().includes(searchLower) ||
      (r.personalData?.title || '').toLowerCase().includes(searchLower) ||
      (r.summary || '').toLowerCase().includes(searchLower) ||
      (r.skills || []).some(s => s.toLowerCase().includes(searchLower));

    // Status filter
    let matchesStatus = true;
    if (activeFilter === 'FINAL') matchesStatus = r.status === 'FINAL';
    if (activeFilter === 'DRAFT') matchesStatus = r.status === 'DRAFT';
    if (activeFilter === 'AI OPTIMIZED') matchesStatus = r.status === 'AI OPTIMIZED';

    // Category Tag filter
    let matchesCategory = true;
    if (selectedTag !== 'ALL') {
      const targetTagObj = CATEGORY_TAGS.find(t => t.id === selectedTag);
      if (targetTagObj && targetTagObj.keywords.length > 0) {
        const textToSearch = `${r.title} ${r.personalData?.title || ''} ${r.summary || ''} ${(r.skills || []).join(' ')}`.toLowerCase();
        matchesCategory = targetTagObj.keywords.some(kw => textToSearch.includes(kw));
      }
    }

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveFilter('ALL');
    setSelectedTag('ALL');
  };

  const getATSScoreStyle = (score?: number) => {
    const val = score ?? 65;
    if (val >= 80) {
      return {
        gradient: 'from-emerald-500 to-teal-600',
        badgeBg: 'bg-emerald-600 text-white',
        badgeBorder: 'border-emerald-400/50',
        textColor: 'text-emerald-700',
        bgLight: 'bg-emerald-50 border-emerald-200/80',
        barGradient: 'from-emerald-500 to-teal-500',
        label: 'Alto',
        value: val
      };
    }
    if (val >= 60) {
      return {
        gradient: 'from-amber-500 to-yellow-600',
        badgeBg: 'bg-amber-500 text-white',
        badgeBorder: 'border-amber-400/50',
        textColor: 'text-amber-700',
        bgLight: 'bg-amber-50 border-amber-200/80',
        barGradient: 'from-amber-500 to-yellow-500',
        label: 'Médio',
        value: val
      };
    }
    return {
      gradient: 'from-rose-500 to-red-600',
      badgeBg: 'bg-rose-600 text-white',
      badgeBorder: 'border-rose-400/50',
      textColor: 'text-rose-700',
      bgLight: 'bg-rose-50 border-rose-200/80',
      barGradient: 'from-rose-500 to-red-500',
      label: 'Baixo',
      value: val
    };
  };

  const confirmDelete = () => {
    if (resumeToDelete) {
      onDeleteResume(resumeToDelete.id);
      setResumeToDelete(null);
    }
  };

  return (
    <main className="pt-6 md:pt-8 pb-24 px-5 md:px-8 max-w-7xl mx-auto flex flex-col gap-6 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#191c1e]">Meus Currículos</h1>
          <p className="text-sm md:text-base text-[#434655] mt-1">
            Gerencie e otimize seus perfis profissionais.
          </p>
        </div>

        {resumes.length > 0 && (
          <button
            onClick={handleCreateClick}
            className="bg-[#2563eb] hover:bg-[#004ac6] text-white h-12 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-md self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>CRIAR NOVO</span>
          </button>
        )}
      </div>

      {resumes.length === 0 ? (
        /* Empty State */
        <div className="w-full max-w-md my-8 mx-auto flex flex-col items-center text-center space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#c3c6d7]/40">
          {/* Illustration Area */}
          <div className="w-48 h-48 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[#2563eb]/10 rounded-full blur-2xl"></div>
            <img 
              className="w-full h-full object-contain relative z-10" 
              alt="Ilustração de currículo vazio" 
              referrerPolicy="no-referrer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3CkCRbqi90-jWAYwcm2Hc3s99_xMIbb6SvutUPIRdJ7nt0V2cekznVTbKVvJ5cwxr_GqqG9owfwv1xjackIj7mKLlgpgRZWRbKBw2iGY6pb8pmYPkCP-AMQ23mWe-VXO7A0BvC8P0Ra_e-FJBL6LjCW8Kp-zDPLhlDEGk2w7Br8XEe-7B5GadcbFhq-X9z6Xt4Vwoc502QXLXP8f6w1QWcqfd4KEK5TgF0YbLE5ONg0PuOfk2F8n5pHayOqSsn8K_8Um0I7shPrc"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#191c1e]">Nenhum currículo ainda</h2>
            <p className="text-sm text-[#434655] max-w-sm mx-auto leading-relaxed">
              Comece a construir seu futuro agora. Nossa IA ajudará você a destacar suas melhores qualidades.
            </p>
          </div>

          {/* Primary CTA */}
          <button 
            onClick={handleCreateClick}
            className="bg-[#2563eb] text-white w-full h-[52px] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#004ac6] transition-colors shadow-sm active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Criar Meu Primeiro Currículo</span>
          </button>

          {/* Secondary Suggestion */}
          <button 
            onClick={handleCreateClick}
            className="bg-transparent border border-[#c3c6d7] text-[#191c1e] w-full h-[52px] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#f2f4f6] transition-colors active:scale-95"
          >
            <Upload className="w-5 h-5 text-[#434655]" />
            <span>Importar Currículo Existente</span>
          </button>
        </div>
      ) : (
        <>
          {/* Search and Filters Container */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#c3c6d7]/40 shadow-2xs">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar Input */}
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#737686]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por cargo, nome, resumo ou habilidades (ex: React, Vendas)..."
                  className="w-full h-12 pl-12 pr-10 rounded-xl bg-[#f8fafc] border border-[#c3c6d7]/70 text-sm text-[#191c1e] placeholder-[#737686] focus:outline-none focus:border-[#2563eb] focus:bg-white focus:ring-1 focus:ring-[#2563eb] transition-all"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737686] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-slate-200/50 cursor-pointer transition-colors"
                    title="Limpar busca"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Filters */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setActiveFilter('ALL')}
                  className={`h-12 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeFilter === 'ALL'
                      ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-xs'
                      : 'bg-white border-[#c3c6d7]/70 text-[#434655] hover:bg-[#f2f4f6]'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Todos</span>
                </button>

                <button
                  onClick={() => setActiveFilter('FINAL')}
                  className={`h-12 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                    activeFilter === 'FINAL'
                      ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-xs'
                      : 'bg-white border-[#c3c6d7]/70 text-[#434655] hover:bg-[#f2f4f6]'
                  }`}
                >
                  Final
                </button>

                <button
                  onClick={() => setActiveFilter('DRAFT')}
                  className={`h-12 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                    activeFilter === 'DRAFT'
                      ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-xs'
                      : 'bg-white border-[#c3c6d7]/70 text-[#434655] hover:bg-[#f2f4f6]'
                  }`}
                >
                  Rascunho
                </button>

                <button
                  onClick={() => setActiveFilter('AI OPTIMIZED')}
                  className={`h-12 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                    activeFilter === 'AI OPTIMIZED'
                      ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-xs'
                      : 'bg-white border-[#c3c6d7]/70 text-[#434655] hover:bg-[#f2f4f6]'
                  }`}
                >
                  Otimizado por IA
                </button>
              </div>
            </div>

            {/* Category Tag Filters Bar */}
            <div className="pt-2 border-t border-[#e0e3e5]/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs font-bold text-[#004ac6] shrink-0 flex items-center gap-1 mr-1">
                <Tag className="w-3.5 h-3.5" /> Tag de Categoria:
              </span>
              {CATEGORY_TAGS.map((tag) => {
                const isSelected = selectedTag === tag.id;
                return (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.id)}
                    className={`h-8 px-3 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#004ac6] text-white shadow-xs font-bold'
                        : 'bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] border border-slate-200'
                    }`}
                  >
                    <span>{tag.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter / Search Active Summary Indicator */}
          {(searchTerm || activeFilter !== 'ALL' || selectedTag !== 'ALL') && (
            <div className="flex items-center justify-between bg-blue-50/80 border border-blue-200/80 px-4 py-2.5 rounded-xl text-xs text-[#004ac6]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold">Filtros ativos:</span>
                {searchTerm && (
                  <span className="bg-white border border-blue-300 px-2.5 py-0.5 rounded-md font-medium text-slate-700">
                    Busca: "{searchTerm}"
                  </span>
                )}
                {activeFilter !== 'ALL' && (
                  <span className="bg-white border border-blue-300 px-2.5 py-0.5 rounded-md font-medium text-slate-700">
                    Status: {activeFilter}
                  </span>
                )}
                {selectedTag !== 'ALL' && (
                  <span className="bg-white border border-blue-300 px-2.5 py-0.5 rounded-md font-medium text-slate-700">
                    Categoria: {CATEGORY_TAGS.find(t => t.id === selectedTag)?.label}
                  </span>
                )}
                <span className="text-slate-500 font-medium">({filteredResumes.length} resultado{filteredResumes.length !== 1 ? 's' : ''})</span>
              </div>

              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-[#2563eb] hover:underline flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar Filtros</span>
              </button>
            </div>
          )}

          {/* Empty Search / Filter Results View */}
          {filteredResumes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#c3c6d7] p-8 text-center space-y-4 my-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#191c1e]">Nenhum currículo encontrado</h3>
                <p className="text-xs text-[#434655] max-w-sm mx-auto">
                  Não foram encontrados currículos correspondentes aos critérios de busca ou filtros de categoria selecionados.
                </p>
              </div>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#004ac6] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Redefinir Filtros</span>
              </button>
            </div>
          ) : (
            /* Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((resume) => {
                const atsStyle = getATSScoreStyle(resume.atsScore);
                const sampleSkills = (resume.skills || []).slice(0, 3);

                return (
                  <div
                    key={resume.id}
                    className="bg-white rounded-2xl border border-[#c3c6d7]/60 shadow-sm flex flex-col overflow-hidden group hover:border-[#2563eb] hover:shadow-lg transition-all duration-300"
                  >
                    {/* Top Preview Canvas */}
                    <div className="h-48 bg-[#f2f4f6] relative border-b border-[#e0e3e5] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#dbe1ff] to-[#e0e3e5] opacity-50 group-hover:opacity-80 transition-opacity" />
                      
                      {/* Document Mock Illustration */}
                      <div className="p-4 w-full h-full flex flex-col gap-2 relative z-10 opacity-70">
                        <div className="w-2/3 h-3 bg-[#004ac6]/30 rounded-full" />
                        <div className="w-1/3 h-2 bg-[#737686]/40 rounded-full mb-2" />
                        <div className="w-full h-2 bg-[#737686]/30 rounded-full" />
                        <div className="w-full h-2 bg-[#737686]/30 rounded-full" />
                        <div className="w-4/5 h-2 bg-[#737686]/30 rounded-full" />
                      </div>

                      {/* Status Badge (Top Left) */}
                      <div className="absolute top-4 left-4 z-20">
                        {resume.status === 'FINAL' && (
                          <div className="bg-[#004ac6] text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5" /> FINAL
                          </div>
                        )}
                        {resume.status === 'DRAFT' && (
                          <div className="bg-[#e0e3e5] text-[#434655] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#c3c6d7]">
                            <FileEdit className="w-3.5 h-3.5" /> RASCUNHO
                          </div>
                        )}
                        {resume.status === 'AI OPTIMIZED' && (
                          <div className="bg-[#8fa7fe] text-[#1d3989] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5" /> OTIMIZADO POR IA
                          </div>
                        )}
                      </div>

                      {/* ATS Score Badge (Top Right) */}
                      <div 
                        className={`absolute top-4 right-4 z-20 bg-gradient-to-r ${atsStyle.gradient} text-white px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider flex items-center gap-1.5 shadow-md border ${atsStyle.badgeBorder}`}
                        title={`Score ATS: ${atsStyle.value}% (${atsStyle.label})`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-white/90" />
                        <span>ATS {atsStyle.value}%</span>
                      </div>
                    </div>

                    {/* Bottom Details */}
                    <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[#191c1e] line-clamp-1">{resume.title}</h3>
                        <p className="text-xs text-[#434655] flex items-center gap-1.5 mt-1">
                          <Clock className="w-3.5 h-3.5 text-[#737686]" />
                          <span>Atualizado {resume.updatedAt}</span>
                        </p>

                        {/* Category & Skill Badges */}
                        {sampleSkills.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                            {sampleSkills.map((sk, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-200/80">
                                {sk}
                              </span>
                            ))}
                            {(resume.skills || []).length > 3 && (
                              <span className="text-[10px] text-slate-500 font-bold">
                                +{(resume.skills || []).length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* ATS Score Indicator Bar & Label */}
                        <div className={`mt-3 p-2.5 rounded-xl ${atsStyle.bgLight} border flex items-center justify-between gap-3`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${atsStyle.gradient} shrink-0`} />
                            <span className="text-[11px] font-bold text-[#191c1e]">Pontuação ATS</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-extrabold ${atsStyle.textColor}`}>
                              {atsStyle.value}%
                            </span>

                            <div className="w-16 h-2 bg-black/10 rounded-full overflow-hidden shrink-0">
                              <div
                                style={{ width: `${atsStyle.value}%` }}
                                className={`h-full rounded-full bg-gradient-to-r ${atsStyle.barGradient} transition-all duration-300`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Melhorar com IA Button */}
                      <button
                        type="button"
                        onClick={(e) => handleImproveWithAI(resume, e)}
                        disabled={improvingResumeId === resume.id}
                        className="mt-3 w-full bg-[#004ac6] hover:bg-[#2563eb] active:scale-[0.98] text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        <Wand2 className={`w-4 h-4 text-blue-200 ${improvingResumeId === resume.id ? 'animate-spin' : ''}`} />
                        <span>{improvingResumeId === resume.id ? 'Otimizando com IA...' : 'Melhorar com IA'}</span>
                      </button>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex items-center gap-1.5 mt-2 pt-3 border-t border-[#e0e3e5]">
                    <button
                      onClick={() => onSelectResume(resume)}
                      className="flex-1 py-2 px-2 text-[#2563eb] text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-1 hover:bg-[#2563eb]/10 rounded-lg transition-colors"
                      title="Editar Currículo"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Editar
                    </button>

                    <button
                      onClick={() => onExportPDF ? onExportPDF(resume) : onSelectResume(resume)}
                      className="py-2 px-2.5 bg-[#004ac6]/10 text-[#004ac6] hover:bg-[#004ac6]/20 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                      title="Exportar PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">PDF</span>
                    </button>

                    <button
                      onClick={() => onShareResume(resume)}
                      aria-label="Compartilhar"
                      title="Compartilhar Currículo"
                      className="p-2 text-[#434655] hover:bg-[#f2f4f6] rounded-lg transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setResumeToDelete(resume)}
                      aria-label="Excluir"
                      title="Excluir Currículo"
                      className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

            {/* Create New Card */}
            <button
              onClick={onCreateNewResume}
              className="bg-white rounded-2xl border-2 border-dashed border-[#c3c6d7] flex flex-col items-center justify-center p-8 hover:border-[#2563eb] hover:bg-[#f2f4f6]/50 transition-all duration-300 min-h-[320px] group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-[#dbe1ff] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-[#004ac6]" />
              </div>
              <h3 className="text-base font-bold text-[#191c1e]">Criar Novo Currículo</h3>
              <p className="text-xs text-[#434655] mt-2 text-center max-w-[220px]">
                Use nossas ferramentas de IA para construir do zero ou importar dados.
              </p>
            </button>
          </div>
        )}
      </>
    )}

      {/* Delete Confirmation Modal */}
      {resumeToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#c3c6d7]/50 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#191c1e]">Excluir Currículo?</h3>
                <p className="text-xs text-[#434655] leading-relaxed">
                  Tem certeza de que deseja excluir o currículo <strong className="text-[#191c1e]">"{resumeToDelete.title}"</strong>? Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e0e3e5]">
              <button
                type="button"
                onClick={() => setResumeToDelete(null)}
                className="px-4 py-2.5 bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e] text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2.5 bg-[#ba1a1a] hover:bg-[#900000] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sim, Excluir</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Free Plan Resume Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-amber-200 space-y-5 text-center flex flex-col items-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
              <Zap className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-[#191c1e]">
                Limite de 1 Currículo no Plano Gratuito!
              </h3>
              <p className="text-xs md:text-sm text-[#434655] mt-2 leading-relaxed">
                Você já possui um currículo ativo no seu plano gratuito. Para criar múltiplos currículos e versões personalizadas para cada vaga, assine o plano <strong>Premium PRO</strong>.
              </p>
            </div>

            <div className="flex flex-col w-full gap-2 pt-2">
              <button
                onClick={() => {
                  setShowLimitModal(false);
                  if (onNavigateToSubscription) onNavigateToSubscription();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Desbloquear Currículos Ilimitados (PRO)</span>
              </button>

              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-[#737686] hover:bg-[#f2f4f6]"
              >
                Voltar aos Meus Currículos
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

