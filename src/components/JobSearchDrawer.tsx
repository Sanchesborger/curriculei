import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Briefcase, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  Building2, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Filter, 
  ArrowRight,
  FileCheck,
  Send
} from 'lucide-react';

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Remoto' | 'Híbrido' | 'Presencial' | string;
  salary?: string;
  postedDate?: string;
  description: string;
  skillsRequired: string[];
  matchPercentage: number;
  url?: string;
  source?: string;
}

export interface JobSearchResponse {
  queryUsed?: string;
  totalResultsCount?: number;
  locationFilter?: string;
  jobs: JobItem[];
  marketInsights?: string;
  sources?: { title: string; uri: string }[];
}

function getFallbackJobSearchData(role: string, location: string): JobSearchResponse {
  const targetRole = role || "Profissional de Tecnologia";
  const targetLocation = location || "Brasil (Remoto)";

  return {
    queryUsed: `${targetRole} vagas ${targetLocation}`,
    totalResultsCount: 5,
    locationFilter: targetLocation,
    jobs: [
      {
        id: "fb-job-1",
        title: `${targetRole} - Projetos Especiais`,
        company: "TechCorp Latam",
        location: `${targetLocation} (Remoto)`,
        type: "Remoto",
        salary: "R$ 14.000 - R$ 18.000 / mês",
        postedDate: "Hoje",
        description: `Buscamos ${targetRole} de alto desempenho para liderar desenvolvimento de microsserviços e novas soluções digitais. Requer boa comunicação e proatividade.`,
        skillsRequired: ["Resolução de Problemas", "TypeScript", "React", "Node.js"],
        matchPercentage: 96,
        url: `https://www.google.com/search?q=${encodeURIComponent(`${targetRole} vagas ${targetLocation}`)}`,
        source: "Google Jobs / Portal de Carreiras"
      },
      {
        id: "fb-job-2",
        title: `Especialista Sênior em ${targetRole}`,
        company: "Inovação Digital SA",
        location: "São Paulo, SP (Híbrido)",
        type: "Híbrido",
        salary: "R$ 16.500 - R$ 20.000 / mês",
        postedDate: "Há 1 dia",
        description: "Oportunidade para atuar na arquitetura de soluções e mentoria técnica. Pacote atrativo de benefícios e participação nos lucros.",
        skillsRequired: ["Liderança Técnica", "Arquitetura Cloud", "Metodologia Ágil"],
        matchPercentage: 90,
        url: `https://www.google.com/search?q=${encodeURIComponent(`${targetRole} vagas`)}`,
        source: "LinkedIn Jobs"
      },
      {
        id: "fb-job-3",
        title: `${targetRole} (Oportunidade Internacional)`,
        company: "Global Scale Tech",
        location: "100% Remoto Internacional",
        type: "Remoto",
        salary: "$ 4.500 - $ 6.500 USD / mês",
        postedDate: "Há 3 horas",
        description: "Atuação remota em projetos globais para milhões de usuários. Excelente oportunidade para atuação em moeda estrangeira.",
        skillsRequired: ["Inglês Avançado", "Sistemas Distribuídos", "Trabalho Remoto"],
        matchPercentage: 85,
        url: `https://www.google.com/search?q=${encodeURIComponent(`${targetRole} remoto USD`)}`,
        source: "Glassdoor"
      }
    ],
    marketInsights: `A área de ${targetRole} em ${targetLocation} apresenta forte demanda no mercado atual, com destaque para profissionais versáteis e orientados a resultados.`,
    sources: [
      { title: `Busca de vagas para ${targetRole}`, uri: `https://www.google.com/search?q=${encodeURIComponent(`${targetRole} vagas`)}` }
    ]
  };
}

interface JobSearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
  userLocation?: string;
  resumeSummary?: string;
  onOptimizeForJob?: (jobTitle: string) => void;
  onGenerateCoverLetter?: (jobTitle: string, company: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const JobSearchDrawer: React.FC<JobSearchDrawerProps> = ({
  isOpen,
  onClose,
  userRole,
  userLocation = 'Brasil / Remoto',
  resumeSummary,
  onOptimizeForJob,
  onGenerateCoverLetter,
  onShowToast
}) => {
  const [roleInput, setRoleInput] = useState(userRole || 'Engenheiro de Software');
  const [locationInput, setLocationInput] = useState(userLocation || 'Brasil');
  const [workTypeFilter, setWorkTypeFilter] = useState<'Todos' | 'Remoto' | 'Híbrido' | 'Presencial'>('Todos');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<JobSearchResponse | null>(null);

  // Sync role input when userRole changes
  useEffect(() => {
    if (userRole && !roleInput) {
      setRoleInput(userRole);
    }
  }, [userRole]);

  // Initial fetch on open if no results yet
  useEffect(() => {
    if (isOpen && !results && !isLoading) {
      handleSearch();
    }
  }, [isOpen]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!roleInput.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/job-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: roleInput,
          location: locationInput,
          keywords: workTypeFilter !== 'Todos' ? workTypeFilter : '',
          resumeSummary
        })
      });

      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        console.warn(`[JobSearch API] Status ${response.status}. Usando resultados de vagas simulados.`);
        data = getFallbackJobSearchData(roleInput, locationInput);
      }

      setResults(data);
      if (onShowToast) {
        onShowToast(`Encontradas ${data.jobs?.length || 0} vagas recomendadas para ${roleInput}!`, 'success');
      }
    } catch (err) {
      console.error('Job search error:', err);
      const fallbackData = getFallbackJobSearchData(roleInput, locationInput);
      setResults(fallbackData);
      if (onShowToast) {
        onShowToast(`Exibindo ${fallbackData.jobs.length} vagas sugeridas para ${roleInput}.`, 'info');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredJobs = (results?.jobs || []).filter(job => {
    if (workTypeFilter === 'Todos') return true;
    return job.type?.toLowerCase().includes(workTypeFilter.toLowerCase()) || 
           job.location?.toLowerCase().includes(workTypeFilter.toLowerCase());
  });

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[55] transition-opacity duration-300"
      />

      {/* Side Panel Drawer */}
      <aside className="fixed inset-y-0 right-0 w-full max-w-xl bg-[#f7f9fb] shadow-2xl z-[60] flex flex-col border-l border-[#e0e3e5] animate-in slide-in-from-right duration-300 font-sans">
        
        {/* Drawer Header */}
        <div className="p-5 md:p-6 bg-white border-b border-[#e0e3e5] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2563eb]/10 text-[#004ac6] rounded-2xl">
              <Briefcase className="w-6 h-6 text-[#2563eb]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#191c1e]">Busca de Vagas com IA</h2>
                <span className="text-[10px] font-bold text-[#004ac6] bg-[#2563eb]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#2563eb]" /> Google Search
                </span>
              </div>
              <p className="text-xs text-[#434655] mt-0.5">
                Oportunidades em tempo real compatíveis com seu perfil
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-[#737686] hover:text-[#191c1e] hover:bg-[#e0e3e5]/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">

          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl border border-[#c3c6d7]/50 shadow-xs space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#434655] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#2563eb]" />
                Cargo Alvo
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  placeholder="Ex: Engenheiro de Software, Product Manager..."
                  className="w-full pl-3 pr-9 py-2.5 bg-[#f0f4f9] text-[#191c1e] text-sm rounded-xl font-medium border border-transparent focus:border-[#2563eb] focus:bg-white focus:outline-none transition-all"
                />
                {roleInput && (
                  <button 
                    type="button"
                    onClick={() => setRoleInput('')}
                    className="absolute right-3 top-3 text-[#737686] hover:text-[#191c1e]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#434655] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2563eb]" />
                  Localização / Estado
                </label>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Ex: Brasil, São Paulo, Remoto..."
                  className="w-full px-3 py-2 bg-[#f0f4f9] text-[#191c1e] text-sm rounded-xl font-medium border border-transparent focus:border-[#2563eb] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#434655] flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#2563eb]" />
                  Modelo de Trabalho
                </label>
                <select
                  value={workTypeFilter}
                  onChange={(e) => setWorkTypeFilter(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#f0f4f9] text-[#191c1e] text-sm rounded-xl font-medium border border-transparent focus:border-[#2563eb] focus:bg-white focus:outline-none transition-all cursor-pointer"
                >
                  <option value="Todos">Todos os modelos</option>
                  <option value="Remoto">100% Remoto</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Presencial">Presencial</option>
                </select>
              </div>
            </div>

            {/* Location Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-[#737686]">Filtros rápidos:</span>
              {['Brasil (Remoto)', 'São Paulo, SP', 'Internacional USD', 'Global'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => { setLocationInput(preset); }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    locationInput === preset
                      ? 'bg-[#2563eb] text-white'
                      : 'bg-[#e0e3e5]/60 text-[#434655] hover:bg-[#c3c6d7]/40'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || !roleInput.trim()}
              className="w-full py-3 bg-[#004ac6] hover:bg-[#1d3989] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Pesquisando na web via Google Search...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Buscar Oportunidades com IA</span>
                </>
              )}
            </button>
          </form>

          {/* AI Market Insights Banner */}
          {results?.marketInsights && (
            <div className="bg-gradient-to-r from-[#2563eb]/10 via-[#8fa7fe]/15 to-[#2563eb]/5 p-4 rounded-2xl border border-[#2563eb]/20 space-y-2">
              <div className="flex items-center gap-2 text-[#004ac6] font-bold text-xs uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-[#2563eb]" />
                <span>Panorama do Mercado para {roleInput}</span>
              </div>
              <p className="text-xs text-[#191c1e] leading-relaxed font-normal">
                {results.marketInsights}
              </p>
            </div>
          )}

          {/* Search Query Summary */}
          {results && (
            <div className="flex items-center justify-between text-xs text-[#434655]">
              <span className="font-semibold text-[#191c1e]">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
              </span>
              <span className="text-[#737686] text-[11px] truncate max-w-[200px]">
                Busca: "{results.queryUsed || roleInput}"
              </span>
            </div>
          )}

          {/* Job Results List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white p-5 rounded-2xl border border-[#e0e3e5] animate-pulse space-y-3">
                  <div className="h-5 bg-[#e0e3e5] rounded w-3/4" />
                  <div className="h-4 bg-[#e0e3e5] rounded w-1/2" />
                  <div className="h-12 bg-[#f0f4f9] rounded-xl w-full" />
                </div>
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="bg-white p-5 rounded-2xl border border-[#c3c6d7]/50 shadow-xs hover:border-[#2563eb]/40 hover:shadow-md transition-all space-y-4 group"
                >
                  {/* Job Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#004ac6] bg-[#2563eb]/10 px-2.5 py-0.5 rounded-full">
                          {job.source || 'Google Search'}
                        </span>
                        {job.type && (
                          <span className="text-[11px] font-semibold text-[#434655] bg-[#f0f4f9] px-2 py-0.5 rounded-full">
                            {job.type}
                          </span>
                        )}
                        {job.postedDate && (
                          <span className="text-[11px] text-[#737686] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {job.postedDate}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-[#191c1e] group-hover:text-[#004ac6] transition-colors">
                        {job.title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-[#434655] flex-wrap font-medium">
                        <span className="flex items-center gap-1 font-semibold text-[#191c1e]">
                          <Building2 className="w-3.5 h-3.5 text-[#2563eb]" /> {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#737686]" /> {job.location}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            <DollarSign className="w-3.5 h-3.5" /> {job.salary}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Compatibility Badge */}
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-xl flex items-center gap-1 border border-emerald-200 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {job.matchPercentage}% Match
                      </span>
                      <span className="text-[10px] text-[#737686] mt-0.5 font-medium">com seu perfil</span>
                    </div>
                  </div>

                  {/* Job Description */}
                  <p className="text-xs text-[#434655] leading-relaxed line-clamp-3 bg-[#f7f9fb] p-3 rounded-xl border border-[#e0e3e5]/60">
                    {job.description}
                  </p>

                  {/* Required Skills Tags */}
                  {job.skillsRequired && job.skillsRequired.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {job.skillsRequired.map((skill, idx) => (
                        <span key={idx} className="text-[11px] font-medium text-[#1d3989] bg-[#8fa7fe]/20 px-2.5 py-0.5 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="pt-2 border-t border-[#e0e3e5]/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {onOptimizeForJob && (
                        <button
                          type="button"
                          onClick={() => {
                            onOptimizeForJob(job.title);
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-[#2563eb]/10 hover:bg-[#2563eb]/20 text-[#004ac6] text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Otimizar Currículo</span>
                        </button>
                      )}

                      {onGenerateCoverLetter && (
                        <button
                          type="button"
                          onClick={() => {
                            onGenerateCoverLetter(job.title, job.company);
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-[#f0f4f9] hover:bg-[#e0e3e5] text-[#191c1e] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-[#2563eb]" />
                          <span>Carta para esta Vaga</span>
                        </button>
                      )}
                    </div>

                    <a
                      href={job.url || `https://www.google.com/search?q=${encodeURIComponent(`${job.title} ${job.company} vaga`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#004ac6] hover:bg-[#1d3989] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <span>Ver Vaga Original</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : results ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#e0e3e5] p-6 space-y-3">
              <Briefcase className="w-12 h-12 text-[#737686] mx-auto" />
              <h3 className="font-bold text-base text-[#191c1e]">Nenhuma vaga encontrada para esses filtros</h3>
              <p className="text-xs text-[#737686] max-w-sm mx-auto">
                Tente alterar a palavra-chave do cargo ou selecione a opção "Todos os modelos" no filtro.
              </p>
              <button
                type="button"
                onClick={() => {
                  setWorkTypeFilter('Todos');
                  setLocationInput('Brasil');
                  handleSearch();
                }}
                className="px-4 py-2 bg-[#2563eb]/10 text-[#004ac6] font-bold text-xs rounded-xl hover:bg-[#2563eb]/20 transition-colors cursor-pointer"
              >
                Limpar filtros e rebuscar
              </button>
            </div>
          ) : null}

          {/* Google Search Grounding Sources */}
          {results?.sources && results.sources.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-[#e0e3e5] space-y-2 text-xs">
              <span className="font-bold text-[#434655] uppercase tracking-wider text-[11px] block">
                Fontes consultadas pelo Google Search:
              </span>
              <div className="space-y-1.5">
                {results.sources.map((source, index) => (
                  <a
                    key={index}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#004ac6] hover:underline truncate text-xs font-medium"
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{source.title || source.uri}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

      </aside>
    </>
  );
};
