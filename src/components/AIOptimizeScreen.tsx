import React, { useState } from 'react';
import { ResumeData } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Wand2, 
  Target, 
  RefreshCw,
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface AIOptimizeScreenProps {
  resume: ResumeData;
  onUpdateResume: (updated: ResumeData) => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AIOptimizeScreen: React.FC<AIOptimizeScreenProps> = ({
  resume,
  onUpdateResume,
  onShowToast
}) => {
  const [targetJob, setTargetJob] = useState<string>(resume.personalData.title || 'Engenheiro de Software Sênior');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // State for AI Analysis Results
  const [analysis, setAnalysis] = useState({
    score: resume.atsScore || 68,
    potentialScore: 92,
    missingKeywords: ['CI/CD', 'Mentoria', 'Agile', 'Arquitetura Cloud', 'Métricas de Performance'],
    summaryFeedback: 'Seu resumo atual é passivo. A IA sugere focar em especializações e quantificar resultados numéricos.',
    suggestedSummary: 'Engenheiro de Software Sênior com 8 anos de experiência focados em arquitetura escalável e liderança técnica de microsserviços. Reduzi em 40% custos de infraestrutura AWS.',
    highImpactSuggestions: [
      {
        id: 'sug-1',
        title: 'Impacto em Experiência Profissional',
        original: 'Trabalhei em projetos de migração para cloud e ajudei a equipe.',
        suggestion: 'Liderei a migração de 3 sistemas legados para AWS, reduzindo custos operacionais em 20% e orientando uma equipe de 4 desenvolvedores.',
        tags: ['Liderança', 'Métricas', 'AWS'],
        applied: false
      },
      {
        id: 'sug-2',
        title: 'Palavras-chave de Tecnologia',
        original: 'Desenvolvi microsserviços e APIs em TypeScript.',
        suggestion: 'Projetei e mantive microsserviços em TypeScript e Node.js com integração contínua (CI/CD) e cobertura de testes de 95%.',
        tags: ['TypeScript', 'CI/CD', 'Testes'],
        applied: false
      }
    ]
  });

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/ats-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: resume,
          targetJob
        })
      });
      const data = await res.json();
      if (data.score) {
        setAnalysis({
          score: data.score,
          potentialScore: data.potentialScore || 95,
          missingKeywords: data.missingKeywords || ['Agile', 'CI/CD', 'Liderança'],
          summaryFeedback: data.summaryFeedback || 'Diagnóstico concluído.',
          suggestedSummary: data.suggestedSummary || resume.summary,
          highImpactSuggestions: (data.highImpactSuggestions || []).map((s: any, i: number) => ({
            id: 'sug-' + i,
            title: s.title || 'Melhoria de Impacto',
            original: s.original || '',
            suggestion: s.suggestion || '',
            tags: s.tags || [],
            applied: false
          }))
        });
        onShowToast('Análise ATS concluída com sucesso!');
      }
    } catch (err) {
      console.error(err);
      onShowToast('Erro ao executar análise de IA.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySummary = () => {
    onUpdateResume({
      ...resume,
      summary: analysis.suggestedSummary,
      summaryIsOptimized: true,
      atsScore: analysis.potentialScore
    });
    onShowToast('Resumo atualizado no currículo!');
  };

  const handleApplySuggestion = (id: string, newSuggestionText: string) => {
    // Update suggestion status
    const updatedSuggestions = analysis.highImpactSuggestions.map(s => 
      s.id === id ? { ...s, applied: true } : s
    );
    setAnalysis({ ...analysis, highImpactSuggestions: updatedSuggestions });

    // Update resume experience
    if (resume.experiences.length > 0) {
      const updatedExperiences = [...resume.experiences];
      updatedExperiences[0].description = newSuggestionText;
      onUpdateResume({
        ...resume,
        experiences: updatedExperiences,
        atsScore: Math.min(98, (resume.atsScore || 68) + 12)
      });
    }

    onShowToast('Sugestão de alto impacto aplicada com sucesso!');
  };

  return (
    <main className="pt-20 md:pt-24 pb-28 px-4 md:px-8 max-w-5xl mx-auto flex flex-col gap-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-6 h-6 text-[#2563eb]" />
            <h1 className="text-3xl font-bold text-[#191c1e]">Otimizador de Currículo IA</h1>
          </div>
          <p className="text-sm text-[#434655]">
            Análise em tempo real compatível com sistemas ATS de grandes empresas.
          </p>
        </div>

        {/* Target Job Input & Trigger */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Target className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]" />
            <input
              type="text"
              value={targetJob}
              onChange={(e) => setTargetJob(e.target.value)}
              placeholder="Vaga Desejada..."
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-[#c3c6d7] text-xs font-semibold text-[#191c1e] focus:outline-none focus:border-[#2563eb]"
            />
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isLoading}
            className="h-11 px-5 bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Analisando...' : 'Analisar'}</span>
          </button>
        </div>
      </div>

      {/* Score Diagnosis Banner */}
      <div className="bg-gradient-to-br from-[#004ac6] to-[#1d3989] rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10 text-center md:text-left">
          <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider">
            Pontuação ATS
          </span>
          <h2 className="text-2xl md:text-3xl font-bold">
            Seu currículo está <span className="text-amber-300">{analysis.score}%</span> otimizado
          </h2>
          <p className="text-xs md:text-sm text-white/80 max-w-lg">
            Aplicando as sugestões da IA, seu perfil pode alcançar <span className="font-bold text-emerald-300">{analysis.potentialScore}%</span> de compatibilidade para a vaga de {targetJob}.
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 min-w-[160px]">
          <div className="text-4xl font-extrabold text-amber-300">{analysis.score}%</div>
          <div className="text-[10px] uppercase font-bold text-white/70 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Potencial: {analysis.potentialScore}%
          </div>
        </div>
      </div>

      {/* Missing Keywords Section */}
      <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/50 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-base text-[#191c1e]">Palavras-chave Ausentes Identificadas</h3>
        </div>
        <p className="text-xs text-[#434655]">
          O robô ATS procura estas palavras para ranquear seu currículo para {targetJob}:
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {analysis.missingKeywords.map((kw) => (
            <span
              key={kw}
              className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"
            >
              + {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Optimized Summary Proposal */}
      <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/50 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-[#2563eb]" />
            <h3 className="font-bold text-base text-[#191c1e]">Resumo Profissional Sugerido</h3>
          </div>
          <button
            onClick={handleApplySummary}
            className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Aplicar no Currículo</span>
          </button>
        </div>

        <p className="text-xs text-[#737686]">{analysis.summaryFeedback}</p>

        <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#2563eb]/30 text-sm text-[#191c1e] leading-relaxed">
          {analysis.suggestedSummary}
        </div>
      </div>

      {/* High-Impact Experience Suggestions */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-[#191c1e]">Sugestões de Alto Impacto para Experiências</h3>

        {analysis.highImpactSuggestions.map((sug) => (
          <div
            key={sug.id}
            className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/50 shadow-sm flex flex-col gap-4 hover:border-[#2563eb] transition-all"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#004ac6] bg-[#2563eb]/10 px-3 py-1 rounded-full">
                {sug.title}
              </span>

              {sug.applied ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Aplicada
                </span>
              ) : (
                <button
                  onClick={() => handleApplySuggestion(sug.id, sug.suggestion)}
                  className="bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Aplicar Sugestão</span>
                </button>
              )}
            </div>

            {/* Before / After Diff */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-[#f2f4f6] border border-[#c3c6d7]">
                <span className="text-[10px] font-bold uppercase text-[#737686] block mb-1">Antes (Original)</span>
                <p className="text-xs text-[#434655] line-through">{sug.original}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <span className="text-[10px] font-bold uppercase text-emerald-700 block mb-1">Depois (Otimizado por IA)</span>
                <p className="text-xs text-emerald-950 font-medium">{sug.suggestion}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 pt-1">
              {sug.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-bold uppercase bg-[#e0e3e5] text-[#434655] px-2.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </main>
  );
};
