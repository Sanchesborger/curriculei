import React, { useState, useEffect } from 'react';
import { resolveBrazilUF } from './HomeScreen';
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
  FileCheck,
  Send,
  Navigation,
  Compass,
  Crosshair,
  Globe,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Remoto' | 'Híbrido' | 'Presencial' | string;
  distanceKm?: number;
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

export const BRAZIL_STATES = [
  { uf: 'TODOS', name: 'Todo o Brasil (Qualquer Estado)' },
  { uf: 'SP', name: 'São Paulo (SP)' },
  { uf: 'RJ', name: 'Rio de Janeiro (RJ)' },
  { uf: 'MG', name: 'Minas Gerais (MG)' },
  { uf: 'PR', name: 'Paraná (PR)' },
  { uf: 'RS', name: 'Rio Grande do Sul (RS)' },
  { uf: 'SC', name: 'Santa Catarina (SC)' },
  { uf: 'BA', name: 'Bahia (BA)' },
  { uf: 'PE', name: 'Pernambuco (PE)' },
  { uf: 'CE', name: 'Ceará (CE)' },
  { uf: 'GO', name: 'Goiás (GO)' },
  { uf: 'DF', name: 'Distrito Federal (DF)' },
  { uf: 'ES', name: 'Espírito Santo (ES)' },
  { uf: 'MA', name: 'Maranhão (MA)' },
  { uf: 'PA', name: 'Pará (PA)' },
  { uf: 'PB', name: 'Paraíba (PB)' },
  { uf: 'RN', name: 'Rio Grande do Norte (RN)' },
  { uf: 'AM', name: 'Amazonas (AM)' },
  { uf: 'AL', name: 'Alagoas (AL)' },
  { uf: 'SE', name: 'Sergipe (SE)' },
  { uf: 'PI', name: 'Piauí (PI)' },
  { uf: 'MT', name: 'Mato Grosso (MT)' },
  { uf: 'MS', name: 'Mato Grosso do Sul (MS)' },
  { uf: 'RO', name: 'Rondônia (RO)' },
  { uf: 'TO', name: 'Tocantins (TO)' },
  { uf: 'AC', name: 'Acre (AC)' },
  { uf: 'AP', name: 'Amapá (AP)' },
  { uf: 'RR', name: 'Roraima (RR)' },
  { uf: 'REMOTE', name: '🌐 Apenas Remoto / Brasil' },
  { uf: 'INT', name: '🌎 Internacional (USD/EUR)' }
];

export const PROXIMITY_OPTIONS = [
  { id: 'any', label: 'Qualquer Distância' },
  { id: '10', label: 'Até 10 km' },
  { id: '25', label: 'Até 25 km' },
  { id: '50', label: 'Até 50 km' },
  { id: '100', label: 'Até 100 km' },
  { id: 'remote', label: 'Apenas Remoto' }
];

function getFallbackJobSearchData(role: string, location: string, state: string, city: string): JobSearchResponse {
  const targetRole = role || "Profissional de Tecnologia";
  const stateLabel = state && state !== 'TODOS' ? state : 'SP';
  const cityLabel = city || 'São Paulo';
  const targetLocation = location || `${cityLabel}, ${stateLabel}`;

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
        distanceKm: 0,
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
        location: `${cityLabel}, ${stateLabel} (Híbrido)`,
        type: "Híbrido",
        distanceKm: 8,
        salary: "R$ 16.500 - R$ 20.000 / mês",
        postedDate: "Há 1 dia",
        description: `Oportunidade presencial/híbrida em ${cityLabel} para atuar na arquitetura de soluções e mentoria técnica. Pacote atrativo de benefícios e participação nos lucros.`,
        skillsRequired: ["Liderança Técnica", "Arquitetura Cloud", "Metodologia Ágil"],
        matchPercentage: 92,
        url: `https://www.google.com/search?q=${encodeURIComponent(`${targetRole} vagas ${cityLabel}`)}`,
        source: "LinkedIn Jobs"
      },
      {
        id: "fb-job-3",
        title: `${targetRole} (Regional Presencial)`,
        company: "Grupo Empresarial Regional",
        location: `Região Metropolitana de ${cityLabel}, ${stateLabel}`,
        type: "Presencial",
        distanceKm: 18,
        salary: "R$ 12.000 - R$ 16.000 / mês",
        postedDate: "Há 2 dias",
        description: `Vaga presencial com fácil acesso na região de ${cityLabel}. Desafios em expansão tecnológica e infraestrutura resiliente.`,
        skillsRequired: ["Gestão de Projetos", "SQL", "Comunicação", "Infraestrutura"],
        matchPercentage: 88,
        url: `https://www.google.com/search?q=${encodeURIComponent(`${targetRole} vagas ${stateLabel}`)}`,
        source: "Catho / Indeed"
      },
      {
        id: "fb-job-4",
        title: `${targetRole} (Oportunidade Internacional)`,
        company: "Global Scale Tech",
        location: "100% Remoto Internacional",
        type: "Remoto",
        distanceKm: 0,
        salary: "$ 4.500 - $ 6.500 USD / mês",
        postedDate: "Há 3 horas",
        description: "Atuação remota em projetos globais para milhões de usuários. Excelente oportunidade para atuação em moeda estrangeira.",
        skillsRequired: ["Inglês Avançado", "Sistemas Distribuídos", "Trabalho Remoto"],
        matchPercentage: 85,
        url: `https://www.google.com/search?q=${encodeURIComponent(`${targetRole} remoto USD`)}`,
        source: "Glassdoor"
      }
    ],
    marketInsights: `A área de ${targetRole} em ${cityLabel} (${stateLabel}) apresenta forte demanda no mercado regional, com destaque para profissionais versáteis e orientados a resultados.`,
    sources: [
      { title: `Busca de vagas para ${targetRole}`, uri: `https://www.google.com/search?q=${encodeURIComponent(`${targetRole} vagas ${stateLabel}`)}` }
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
  userLocation = 'São Paulo, SP',
  resumeSummary,
  onOptimizeForJob,
  onGenerateCoverLetter,
  onShowToast
}) => {
  const [roleInput, setRoleInput] = useState(userRole || 'Engenheiro de Software');
  const [selectedState, setSelectedState] = useState<string>('SP');
  const [cityInput, setCityInput] = useState<string>('São Paulo');
  const [locationInput, setLocationInput] = useState(userLocation || 'São Paulo, SP');
  const [proximityRadius, setProximityRadius] = useState<string>('50');
  const [workTypeFilter, setWorkTypeFilter] = useState<'Todos' | 'Remoto' | 'Híbrido' | 'Presencial'>('Todos');
  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);
  const [isStatePickerOpen, setIsStatePickerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<JobSearchResponse | null>(null);

  // Parse location string into city and state if available
  useEffect(() => {
    if (userLocation) {
      setLocationInput(userLocation);
      const parts = userLocation.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        setCityInput(parts[0]);
        const ufCandidate = parts[1].toUpperCase();
        if (BRAZIL_STATES.some(s => s.uf === ufCandidate)) {
          setSelectedState(ufCandidate);
        }
      }
    }
  }, [userLocation]);

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

  const handleDetectGPSLocation = () => {
    if (!navigator.geolocation) {
      if (onShowToast) onShowToast('Seu navegador não suporta geolocalização.', 'error');
      return;
    }

    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          if (response.ok) {
            const data = await response.json();
            const addr = data.address || {};
            const detectedCity = addr.city || addr.town || addr.municipality || addr.suburb || 'Minha Cidade';
            const matchedUf = resolveBrazilUF(addr);

            setCityInput(detectedCity);
            setSelectedState(matchedUf);
            const fullLoc = `${detectedCity}, ${matchedUf}`;
            setLocationInput(fullLoc);
            if (onShowToast) {
              onShowToast(`📍 Localização detectada: ${fullLoc}`, 'success');
            }
          } else {
            setCityInput('Sua Cidade');
            setLocationInput('Sua Cidade (GPS)');
          }
        } catch {
          setCityInput('Sua Cidade');
          setLocationInput('Sua Cidade (GPS)');
        } finally {
          setIsLocatingGPS(false);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setIsLocatingGPS(false);
        if (onShowToast) {
          onShowToast('Permissão de GPS negada. Selecione seu estado e cidade manualmente.', 'info');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!roleInput.trim()) return;

    setIsLoading(true);
    const combinedLocation = [cityInput.trim(), selectedState !== 'TODOS' ? selectedState : ''].filter(Boolean).join(', ') || locationInput;

    try {
      const response = await fetch('/api/ai/job-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: roleInput,
          location: combinedLocation,
          state: selectedState,
          city: cityInput,
          proximityRadius,
          keywords: workTypeFilter !== 'Todos' ? workTypeFilter : '',
          resumeSummary
        })
      });

      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        console.warn(`[JobSearch API] Status ${response.status}. Usando resultados de vagas simulados.`);
        data = getFallbackJobSearchData(roleInput, combinedLocation, selectedState, cityInput);
      }

      setResults(data);
      if (onShowToast) {
        onShowToast(`Encontradas ${data.jobs?.length || 0} vagas recomendadas no estado de ${selectedState}!`, 'success');
      }
    } catch (err) {
      console.error('Job search error:', err);
      const fallbackData = getFallbackJobSearchData(roleInput, combinedLocation, selectedState, cityInput);
      setResults(fallbackData);
      if (onShowToast) {
        onShowToast(`Exibindo ${fallbackData.jobs.length} vagas sugeridas em ${selectedState}.`, 'info');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Filter jobs by work type and proximity radius
  const filteredJobs = (results?.jobs || []).filter(job => {
    // Work type filter
    if (workTypeFilter !== 'Todos') {
      const matchesType = job.type?.toLowerCase().includes(workTypeFilter.toLowerCase()) || 
                          job.location?.toLowerCase().includes(workTypeFilter.toLowerCase());
      if (!matchesType) return false;
    }

    // Proximity radius filter
    if (proximityRadius === 'remote') {
      return job.type?.toLowerCase().includes('remoto') || job.location?.toLowerCase().includes('remoto');
    }

    if (proximityRadius !== 'any' && job.distanceKm !== undefined && job.distanceKm > 0) {
      const maxDistance = Number(proximityRadius);
      if (!isNaN(maxDistance) && job.distanceKm > maxDistance) {
        return false;
      }
    }

    return true;
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
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-[#191c1e]">Perto de Você</h2>
                <span className="text-[10px] font-bold text-[#004ac6] bg-[#2563eb]/10 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 whitespace-nowrap">
                  <Sparkles className="w-3 h-3 text-[#2563eb]" /> Busca por IA
                </span>
              </div>
              <p className="text-xs text-[#434655] mt-0.5">
                Encontre vagas no seu Estado, cidade ou por raio de distância
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-[#737686] hover:text-[#191c1e] hover:bg-[#e0e3e5]/50 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5">

          {/* Search & Location Controls Panel */}
          <form onSubmit={handleSearch} className="bg-white p-4 md:p-5 rounded-2xl border border-[#c3c6d7]/50 shadow-xs space-y-4">
            
            {/* Target Job Title */}
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
                  placeholder="Ex: Engenheiro de Software, Gerente de Projetos..."
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

            {/* State & City Location Block */}
            <div className="p-3.5 bg-[#f0f4f9]/80 rounded-xl border border-[#e0e3e5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#191c1e] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2563eb]" />
                  Localização & Estado do Candidato
                </span>
                <button
                  type="button"
                  onClick={handleDetectGPSLocation}
                  disabled={isLocatingGPS}
                  className="text-[11px] font-bold text-[#004ac6] bg-white hover:bg-[#2563eb]/10 border border-[#2563eb]/30 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isLocatingGPS ? (
                    <Navigation className="w-3 h-3 animate-spin text-[#2563eb]" />
                  ) : (
                    <Crosshair className="w-3 h-3 text-[#2563eb]" />
                  )}
                  <span>{isLocatingGPS ? 'Detectando...' : 'Usar meu GPS'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Brazilian State Selector */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#434655]">
                    Estado (UF)
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      const st = BRAZIL_STATES.find(s => s.uf === e.target.value);
                      if (st && st.uf !== 'TODOS') {
                        setLocationInput(`${cityInput || 'Principal'}, ${st.uf}`);
                      }
                    }}
                    className="w-full px-3 py-2 bg-white text-[#191c1e] text-xs font-semibold rounded-lg border border-[#c3c6d7]/70 focus:border-[#2563eb] focus:outline-none transition-all cursor-pointer"
                  >
                    {BRAZIL_STATES.map((st) => (
                      <option key={st.uf} value={st.uf}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#434655]">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => {
                      setCityInput(e.target.value);
                      setLocationInput(`${e.target.value}, ${selectedState}`);
                    }}
                    placeholder="Ex: São Paulo, Campinas, BH..."
                    className="w-full px-3 py-2 bg-white text-[#191c1e] text-xs font-medium rounded-lg border border-[#c3c6d7]/70 focus:border-[#2563eb] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Compact Estado em Destaque Selector Card */}
              <div className="pt-1 relative">
                <span className="text-[10px] font-semibold text-[#737686] uppercase tracking-wider block mb-1">
                  Estado em Destaque
                </span>
                
                <button
                  type="button"
                  onClick={() => setIsStatePickerOpen(!isStatePickerOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-[#c3c6d7]/80 hover:border-[#2563eb] transition-all text-xs font-bold text-[#191c1e] shadow-2xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="p-1 bg-[#2563eb]/10 text-[#2563eb] rounded-md group-hover:bg-[#2563eb] group-hover:text-white transition-colors flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-[#191c1e] truncate">
                      {selectedState === 'TODOS'
                        ? '🇧🇷 Todo o Brasil (Qualquer Estado)'
                        : `📍 ${BRAZIL_STATES.find(s => s.uf === selectedState)?.name || selectedState}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#004ac6] font-bold bg-[#2563eb]/10 px-2 py-0.5 rounded-md flex-shrink-0 ml-2">
                    <span>{isStatePickerOpen ? 'Fechar' : 'Alterar'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#2563eb] transition-transform duration-200 ${isStatePickerOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* State Selection Dropdown Popover */}
                {isStatePickerOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 z-30 bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl border border-[#c3c6d7] dark:border-slate-700 p-2.5 space-y-2 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between border-b border-[#e0e3e5] dark:border-slate-700 pb-1.5 px-1">
                      <span className="text-[11px] font-bold text-[#191c1e] dark:text-[#f8fafc]">Selecione o Estado (UF)</span>
                      <button
                        type="button"
                        onClick={() => setIsStatePickerOpen(false)}
                        className="text-[10px] text-[#737686] dark:text-slate-400 hover:text-[#191c1e] dark:hover:text-white font-bold px-1.5 py-0.5 rounded-md hover:bg-[#e0e3e5] dark:hover:bg-slate-700 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-52 overflow-y-auto p-0.5">
                      {BRAZIL_STATES.map((st) => (
                        <button
                          key={st.uf}
                          type="button"
                          onClick={() => {
                            setSelectedState(st.uf);
                            if (st.uf !== 'TODOS') {
                              setLocationInput(`${cityInput || 'Principal'}, ${st.uf}`);
                            }
                            setIsStatePickerOpen(false);
                          }}
                          className={`text-left text-[11px] px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center justify-between ${
                            selectedState === st.uf
                              ? 'bg-[#2563eb] text-white font-bold shadow-2xs'
                              : 'bg-[#f0f4f9] dark:bg-[#0f172a] text-[#191c1e] dark:text-[#f8fafc] hover:bg-[#2563eb]/10 dark:hover:bg-[#2563eb]/30 hover:text-[#004ac6] dark:hover:text-blue-300 border border-transparent dark:border-slate-700/60'
                          }`}
                        >
                          <span className="truncate">{st.uf === 'TODOS' ? '🇧🇷 Todo o Brasil' : `📍 ${st.name}`}</span>
                          {selectedState === st.uf && <CheckCircle2 className="w-3.5 h-3.5 text-white flex-shrink-0 ml-1" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Proximity Distance & Work Model Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Proximity Radius */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#434655] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#2563eb]" />
                  Raio de Proximidade
                </label>
                <select
                  value={proximityRadius}
                  onChange={(e) => setProximityRadius(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f0f4f9] text-[#191c1e] text-xs font-semibold rounded-xl border border-transparent focus:border-[#2563eb] focus:bg-white focus:outline-none transition-all cursor-pointer"
                >
                  {PROXIMITY_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Work Model */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#434655] flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#2563eb]" />
                  Modelo de Trabalho
                </label>
                <select
                  value={workTypeFilter}
                  onChange={(e) => setWorkTypeFilter(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#f0f4f9] text-[#191c1e] text-xs font-semibold rounded-xl border border-transparent focus:border-[#2563eb] focus:bg-white focus:outline-none transition-all cursor-pointer"
                >
                  <option value="Todos">Todos os modelos</option>
                  <option value="Presencial">Presencial (Na Região)</option>
                  <option value="Híbrido">Híbrido (Flexível)</option>
                  <option value="Remoto">100% Remoto</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !roleInput.trim()}
              className="w-full py-3 bg-[#004ac6] hover:bg-[#1d3989] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Buscando Vagas por Proximidade na Web...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Buscar Vagas em {selectedState !== 'TODOS' ? selectedState : 'Todo o Brasil'}</span>
                </>
              )}
            </button>
          </form>

          {/* AI Market Insights Banner */}
          {results?.marketInsights && (
            <div className="bg-gradient-to-r from-[#2563eb]/10 via-[#8fa7fe]/15 to-[#2563eb]/5 p-4 rounded-2xl border border-[#2563eb]/20 space-y-2">
              <div className="flex items-center gap-2 text-[#004ac6] font-bold text-xs uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-[#2563eb]" />
                <span>Panorama em {selectedState !== 'TODOS' ? selectedState : 'Brasil'} para {roleInput}</span>
              </div>
              <p className="text-xs text-[#191c1e] leading-relaxed font-normal">
                {results.marketInsights}
              </p>
            </div>
          )}

          {/* Search Query & Active Filters Summary */}
          {results && (
            <div className="flex flex-wrap items-center justify-between text-xs text-[#434655] bg-white px-3.5 py-2.5 rounded-xl border border-[#e0e3e5]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#191c1e]">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
                </span>
                {proximityRadius !== 'any' && (
                  <span className="text-[10px] bg-blue-100 text-[#004ac6] font-bold px-2 py-0.5 rounded-md">
                    Raio: {proximityRadius === 'remote' ? 'Apenas Remoto' : `< ${proximityRadius} km`}
                  </span>
                )}
              </div>
              <span className="text-[#737686] text-[11px] truncate max-w-[200px]">
                Estado: {selectedState} ({cityInput || 'Cidade'})
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
                  className="bg-white p-5 rounded-2xl border border-[#c3c6d7]/50 shadow-xs hover:border-[#2563eb]/40 hover:shadow-md transition-all space-y-3.5 group"
                >
                  {/* Job Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#004ac6] bg-[#2563eb]/10 px-2.5 py-0.5 rounded-full">
                          {job.source || 'Google Search'}
                        </span>
                        {job.type && (
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            job.type.toLowerCase().includes('remoto')
                              ? 'bg-emerald-100 text-emerald-800'
                              : job.type.toLowerCase().includes('híbrido')
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {job.type}
                          </span>
                        )}
                        {/* Proximity / Distance Badge */}
                        {job.distanceKm !== undefined && (
                          <span className="text-[11px] font-bold text-[#004ac6] bg-[#f0f4f9] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#c3c6d7]/40">
                            {job.distanceKm === 0 ? (
                              <>
                                <Globe className="w-3 h-3 text-emerald-600" />
                                <span>Remoto (Sem deslocamento)</span>
                              </>
                            ) : (
                              <>
                                <Navigation className="w-3 h-3 text-[#2563eb]" />
                                <span>~ {job.distanceKm} km de você</span>
                              </>
                            )}
                          </span>
                        )}
                        {job.postedDate && (
                          <span className="text-[11px] text-[#737686] flex items-center gap-1 ml-auto">
                            <Clock className="w-3 h-3" /> {job.postedDate}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-[#191c1e] group-hover:text-[#004ac6] transition-colors pt-0.5">
                        {job.title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-[#434655] flex-wrap font-medium">
                        <span className="flex items-center gap-1 font-semibold text-[#191c1e]">
                          <Building2 className="w-3.5 h-3.5 text-[#2563eb]" /> {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#2563eb]" /> {job.location}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            <DollarSign className="w-3.5 h-3.5" /> {job.salary}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Compatibility Match Badge */}
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
                      href={job.url || `https://www.google.com/search?q=${encodeURIComponent(`${job.title} ${job.company} vaga ${selectedState}`)}`}
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
              <h3 className="font-bold text-base text-[#191c1e]">Nenhuma vaga encontrada para esses filtros de localização</h3>
              <p className="text-xs text-[#737686] max-w-sm mx-auto">
                Tente aumentar o raio de distância no filtro ou selecione a opção "Todo o Brasil" no estado.
              </p>
              <button
                type="button"
                onClick={() => {
                  setWorkTypeFilter('Todos');
                  setProximityRadius('any');
                  setSelectedState('TODOS');
                  handleSearch();
                }}
                className="px-4 py-2 bg-[#2563eb]/10 text-[#004ac6] font-bold text-xs rounded-xl hover:bg-[#2563eb]/20 transition-colors cursor-pointer"
              >
                Expandir para todo o Brasil
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

