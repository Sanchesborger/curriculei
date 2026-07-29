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
  Upload
} from 'lucide-react';

interface ResumesScreenProps {
  resumes: ResumeData[];
  onSelectResume: (resume: ResumeData) => void;
  onCreateNewResume: () => void;
  onDeleteResume: (id: string) => void;
  onShareResume: (resume: ResumeData) => void;
}

export const ResumesScreen: React.FC<ResumesScreenProps> = ({
  resumes,
  onSelectResume,
  onCreateNewResume,
  onDeleteResume,
  onShareResume
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const filteredResumes = resumes.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.personalData.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeFilter === 'ALL') return matchesSearch;
    if (activeFilter === 'FINAL') return matchesSearch && r.status === 'FINAL';
    if (activeFilter === 'DRAFT') return matchesSearch && r.status === 'DRAFT';
    if (activeFilter === 'AI OPTIMIZED') return matchesSearch && r.status === 'AI OPTIMIZED';
    return matchesSearch;
  });

  return (
    <main className="pt-20 md:pt-24 pb-24 px-5 md:px-8 max-w-7xl mx-auto flex flex-col gap-6 font-sans">
      
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
            {filteredResumes.map((resume) => (
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

                  {/* Status Badge */}
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
                </div>

                {/* Bottom Details */}
                <div className="p-5 flex flex-col gap-2 flex-1 justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#191c1e] line-clamp-1">{resume.title}</h3>
                    <p className="text-xs text-[#434655] flex items-center gap-1.5 mt-1">
                      <Clock className="w-3.5 h-3.5 text-[#737686]" />
                      <span>Atualizado {resume.updatedAt}</span>
                    </p>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#e0e3e5]">
                    <button
                      onClick={() => onSelectResume(resume)}
                      className="flex-1 py-2 text-[#2563eb] text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-1.5 hover:bg-[#2563eb]/10 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" /> Editar
                    </button>
                    <button
                      onClick={() => onShareResume(resume)}
                      aria-label="Compartilhar"
                      className="p-2 text-[#434655] hover:bg-[#f2f4f6] rounded-lg transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteResume(resume.id)}
                      aria-label="Excluir"
                      className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Create New Card */}
            <button
              onClick={onCreateNewResume}
              className="bg-white rounded-2xl border-2 border-dashed border-[#c3c6d7] flex flex-col items-center justify-center p-8 hover:border-[#2563eb] hover:bg-[#f2f4f6]/50 transition-all duration-300 min-h-[320px] group"
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

    </main>
  );
};

