import React, { useState } from 'react';
import { ResumeData } from '../types';
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
  Zap
} from 'lucide-react';

interface ResumesScreenProps {
  resumes: ResumeData[];
  onSelectResume: (resume: ResumeData) => void;
  onCreateNewResume: () => void;
  onDeleteResume: (id: string) => void;
  onShareResume: (resume: ResumeData) => void;
  onExportPDF?: (resume: ResumeData) => void;
  onUpdateResume?: (updated: ResumeData) => void;
  onNavigateToAIOptimize?: (resume: ResumeData) => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ResumesScreen: React.FC<ResumesScreenProps> = ({
  resumes,
  onSelectResume,
  onCreateNewResume,
  onDeleteResume,
  onShareResume,
  onExportPDF,
  onUpdateResume,
  onNavigateToAIOptimize,
  onShowToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [resumeToDelete, setResumeToDelete] = useState<ResumeData | null>(null);
  const [improvingResumeId, setImprovingResumeId] = useState<string | null>(null);

  const handleImproveWithAI = async (resume: ResumeData, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setImprovingResumeId(resume.id);

    try {
      const res = await fetch('/api/ai/optimize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: resume,
          targetRole: resume.personalData.title || 'Profissional'
        })
      });

      const data = await res.json();

      if (data.optimizedResume && onUpdateResume) {
        onUpdateResume(data.optimizedResume);
        if (onShowToast) {
          onShowToast(data.message || 'Currículo aprimorado com sucesso pela IA!', 'success');
        }
      } else if (onNavigateToAIOptimize) {
        onNavigateToAIOptimize(resume);
      }
    } catch (err) {
      console.error(err);
      if (onShowToast) {
        onShowToast('Erro ao otimizar currículo com IA. Tente novamente.', 'error');
      }
      if (onNavigateToAIOptimize) {
        onNavigateToAIOptimize(resume);
      }
    } finally {
      setImprovingResumeId(null);
    }
  };

  const filteredResumes = resumes.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.personalData.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeFilter === 'ALL') return matchesSearch;
    if (activeFilter === 'FINAL') return matchesSearch && r.status === 'FINAL';
    if (activeFilter === 'DRAFT') return matchesSearch && r.status === 'DRAFT';
    if (activeFilter === 'AI OPTIMIZED') return matchesSearch && r.status === 'AI OPTIMIZED';
    return matchesSearch;
  });

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
            onClick={onCreateNewResume}
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
            onClick={onCreateNewResume}
            className="bg-[#2563eb] text-white w-full h-[52px] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#004ac6] transition-colors shadow-sm active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Criar Meu Primeiro Currículo</span>
          </button>

          {/* Secondary Suggestion */}
          <button 
            onClick={onCreateNewResume}
            className="bg-transparent border border-[#c3c6d7] text-[#191c1e] w-full h-[52px] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#f2f4f6] transition-colors active:scale-95"
          >
            <Upload className="w-5 h-5 text-[#434655]" />
            <span>Importar Currículo Existente</span>
          </button>
        </div>
      ) : (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#737686]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar currículos..."
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border border-[#c3c6d7] text-sm text-[#191c1e] placeholder-[#737686] focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`h-12 px-4 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeFilter === 'ALL'
                    ? 'bg-[#2563eb] text-white border-[#2563eb]'
                    : 'bg-white border-[#c3c6d7] text-[#434655] hover:bg-[#f2f4f6]'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Todos</span>
              </button>

              <button
                onClick={() => setActiveFilter('FINAL')}
                className={`h-12 px-4 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  activeFilter === 'FINAL'
                    ? 'bg-[#2563eb] text-white border-[#2563eb]'
                    : 'bg-white border-[#c3c6d7] text-[#434655] hover:bg-[#f2f4f6]'
                }`}
              >
                Final
              </button>

              <button
                onClick={() => setActiveFilter('DRAFT')}
                className={`h-12 px-4 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  activeFilter === 'DRAFT'
                    ? 'bg-[#2563eb] text-white border-[#2563eb]'
                    : 'bg-white border-[#c3c6d7] text-[#434655] hover:bg-[#f2f4f6]'
                }`}
              >
                Rascunho
              </button>

              <button
                onClick={() => setActiveFilter('AI OPTIMIZED')}
                className={`h-12 px-4 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  activeFilter === 'AI OPTIMIZED'
                    ? 'bg-[#2563eb] text-white border-[#2563eb]'
                    : 'bg-white border-[#c3c6d7] text-[#434655] hover:bg-[#f2f4f6]'
                }`}
              >
                Otimizado por IA
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => {
              const atsStyle = getATSScoreStyle(resume.atsScore);

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

                      {/* ATS Score Indicator Bar & Label */}
                      <div className={`mt-3.5 p-2.5 rounded-xl ${atsStyle.bgLight} border flex items-center justify-between gap-3`}>
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

    </main>
  );
};

