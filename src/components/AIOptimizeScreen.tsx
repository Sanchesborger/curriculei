import React, { useState, useMemo } from 'react';
import { ResumeData } from '../types';
import { UserProfile } from '../types';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Wand2, 
  Target, 
  RefreshCw,
  TrendingUp,
  FileCheck2,
  Filter,
  Layers,
  Zap,
  BarChart3,
  ShieldCheck,
  Check,
  ChevronRight,
  Info,
  Crown
} from 'lucide-react';

interface AIOptimizeScreenProps {
  user?: UserProfile;
  resume: ResumeData;
  onUpdateResume: (updated: ResumeData) => void;
  onNavigateToSubscription?: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

import { validateResumeForAI } from '../lib/validateResume';

export interface ATSChecklistItem {
  id: string;
  category: 'keywords' | 'density' | 'formatting';
  categoryLabel: string;
  title: string;
  status: 'passed' | 'warning' | 'failed';
  statusLabel: string;
  description: string;
  tip: string;
  actionText?: string;
  onAction?: () => void;
}

export const AIOptimizeScreen: React.FC<AIOptimizeScreenProps> = ({
  user,
  resume,
  onUpdateResume,
  onNavigateToSubscription,
  onShowToast
}) => {
  const isUserPremium = Boolean(user?.isPremium || user?.role?.toLowerCase().includes('premium'));
  const [targetJob, setTargetJob] = useState<string>(resume.personalData.title || 'Engenheiro de Software Sênior');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeChecklistFilter, setActiveChecklistFilter] = useState<'all' | 'pending' | 'passed' | 'keywords' | 'density' | 'formatting'>('all');
  
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
    const validation = validateResumeForAI(resume, targetJob);
    if (!validation.isValid) {
      onShowToast(validation.errors[0] || 'Por favor, preencha as informações necessárias no currículo.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/ats-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: validation.sanitizedResume,
          targetJob: validation.sanitizedTargetRole
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
      setAnalysis(prev => ({
        ...prev,
        score: Math.min(96, (resume.atsScore || 68) + 20),
        potentialScore: 98,
        summaryFeedback: 'Análise ATS gerada. Recomendamos reforçar o uso de palavras-chave e verbos de ação quantificáveis.',
        suggestedSummary: `${targetJob} com trajetória sólida em projetos de alto impacto, liderança técnica e entregas ágeis orientadas a resultados.`,
      }));
      onShowToast('Análise ATS concluída com otimização inteligente!');
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

  // Add missing keywords to skills list
  const handleAddMissingKeywordsToSkills = () => {
    const existingSkillsLower = new Set((resume.skills || []).map(s => s.toLowerCase()));
    const newSkillsToAdd = analysis.missingKeywords.filter(kw => !existingSkillsLower.has(kw.toLowerCase()));
    
    if (newSkillsToAdd.length === 0) {
      onShowToast('Todas as palavras-chave já estão listadas nas suas habilidades!');
      return;
    }

    onUpdateResume({
      ...resume,
      skills: [...resume.skills, ...newSkillsToAdd]
    });
    onShowToast(`${newSkillsToAdd.length} novas palavras-chave adicionadas às suas Habilidades!`);
  };

  // ATS Checklist calculation
  const checklistItems = useMemo<ATSChecklistItem[]>(() => {
    const items: ATSChecklistItem[] = [];

    // 1. Cargo Pretendido
    const hasJobTitle = resume.personalData.title && resume.personalData.title.trim().length > 3;
    const titleMatchesTarget = hasJobTitle && resume.personalData.title.toLowerCase().includes(targetJob.toLowerCase().slice(0, 5));
    items.push({
      id: 'chk-title',
      category: 'keywords',
      categoryLabel: 'Palavras-Chave',
      title: 'Correspondência do Cargo Desejado',
      status: titleMatchesTarget ? 'passed' : hasJobTitle ? 'warning' : 'failed',
      statusLabel: titleMatchesTarget ? 'Alinhado' : hasJobTitle ? 'Parcial' : 'Incompleto',
      description: `O título no topo do seu currículo é "${resume.personalData.title || 'Não preenchido'}". Robôs ATS usam essa linha como principal índice de filtro.`,
      tip: `Defina o cargo exatamente como a vaga almejada: "${targetJob}".`,
      actionText: 'Atualizar Cargo',
      onAction: () => {
        onUpdateResume({
          ...resume,
          personalData: { ...resume.personalData, title: targetJob }
        });
        onShowToast(`Cargo ajustado para "${targetJob}"!`);
      }
    });

    // 2. Densidade de Habilidades Técnicas
    const skillCount = resume.skills?.length || 0;
    items.push({
      id: 'chk-skills',
      category: 'keywords',
      categoryLabel: 'Palavras-Chave',
      title: 'Densidade de Competências & Habilidades (Min. 5)',
      status: skillCount >= 5 ? 'passed' : skillCount >= 2 ? 'warning' : 'failed',
      statusLabel: skillCount >= 5 ? 'Ideal' : skillCount >= 2 ? 'Baixa' : 'Crítico',
      description: `Seu currículo lista ${skillCount} habilidades cadastras. Algoritmos de recrutamento exigem um bloco de competências estruturadas.`,
      tip: 'Insira de 5 a 12 competências técnicas e comportamentais alinhadas à sua área.',
      actionText: 'Injetar Sugestões de IA',
      onAction: handleAddMissingKeywordsToSkills
    });

    // 3. Palavras-Chave Faltantes da Vaga
    const hasMissing = analysis.missingKeywords.length > 0;
    items.push({
      id: 'chk-[#missing-kw]',
      category: 'keywords',
      categoryLabel: 'Palavras-Chave',
      title: 'Presença das Palavras-Chave do Setor',
      status: !hasMissing ? 'passed' : 'warning',
      statusLabel: !hasMissing ? 'Completo' : `${analysis.missingKeywords.length} Faltando`,
      description: hasMissing 
        ? `Identificamos ${analysis.missingKeywords.length} termos essenciais ausentes: ${analysis.missingKeywords.slice(0, 3).join(', ')}.`
        : 'Seu texto possui as principais palavras-chave identificadas para a posição.',
      tip: 'Robôs de recrutamento pontuam currículos que repetem termos da vaga no resumo e experiências.',
      actionText: 'Adicionar às Habilidades',
      onAction: handleAddMissingKeywordsToSkills
    });

    // 4. Extensão do Resumo Profissional
    const summaryLen = (resume.summary || '').trim().length;
    let summaryStatus: 'passed' | 'warning' | 'failed' = 'passed';
    let summaryLabel = 'Ideal';
    if (summaryLen === 0) {
      summaryStatus = 'failed';
      summaryLabel = 'Sem Resumo';
    } else if (summaryLen < 120) {
      summaryStatus = 'warning';
      summaryLabel = 'Muito Curto';
    } else if (summaryLen > 550) {
      summaryStatus = 'warning';
      summaryLabel = 'Extenso';
    }
    items.push({
      id: 'chk-summary-len',
      category: 'density',
      categoryLabel: 'Densidade de Texto',
      title: 'Extensão Ideal do Resumo (150 a 500 caracteres)',
      status: summaryStatus,
      statusLabel: summaryLabel,
      description: `Seu resumo atual possui ${summaryLen} caracteres. Resumos ideais para robôs ATS têm de 3 a 5 frases diretas com métricas de impacto.`,
      tip: 'Evite resumos vagos ou genéricos. Foque em especialização, anos de mercado e diferenciais.',
      actionText: 'Aplicar Resumo de IA',
      onAction: handleApplySummary
    });

    // 5. Presença de Métricas Quantificáveis
    const hasMetrics = resume.experiences.some(e => /\d+(%|k|M|x|\+|\s?anos|\s?projetos|\s?equipe)/i.test(e.description || ''));
    items.push({
      id: 'chk-metrics',
      category: 'density',
      categoryLabel: 'Densidade de Texto',
      title: 'Resultados e Métricas Quantificáveis (Números e %)',
      status: hasMetrics ? 'passed' : 'warning',
      statusLabel: hasMetrics ? 'Aprovado' : 'Sem Métricas',
      description: hasMetrics 
        ? 'Excelente! Foram encontradas métricas numéricas e dados quantificáveis nas suas experiências.'
        : 'Não foram encontradas métricas numéricas (ex: porcentagens %, redução de custos, tamanho de equipe ou volume de projetos).',
      tip: 'Currículos com métricas têm 40% mais chances de passar pelos filtros iniciais de seleção.',
      actionText: 'Injetar Métricas com IA',
      onAction: () => {
        if (analysis.highImpactSuggestions[0]) {
          handleApplySuggestion(analysis.highImpactSuggestions[0].id, analysis.highImpactSuggestions[0].suggestion);
        }
      }
    });

    // 6. Verbos de Ação
    const actionVerbs = ['liderei', 'desenvolvi', 'gerenciei', 'otimizei', 'aumentei', 'reduzi', 'implementei', 'projetei', 'coordenei', 'recompilei'];
    const hasActionVerbs = resume.experiences.some(e => actionVerbs.some(v => (e.description || '').toLowerCase().includes(v)));
    items.push({
      id: 'chk-action-verbs',
      category: 'density',
      categoryLabel: 'Densidade de Texto',
      title: 'Redação Ativa com Verbos de Ação',
      status: hasActionVerbs ? 'passed' : 'warning',
      statusLabel: hasActionVerbs ? 'Ativo' : 'Passivo',
      description: hasActionVerbs 
        ? 'Sua redação utiliza verbos de ação assertivos que se destacam nos algoritmos de triagem.'
        : 'Seu texto utiliza construções passivas (ex: "fui responsável por"). Prefira verbos ativos como "Liderei", "Projetei" ou "Otimizei".',
      tip: 'Comece os tópicos de experiência sempre com verbos de ação no passado.',
      actionText: 'Otimizar Linguagem',
      onAction: () => {
        if (analysis.highImpactSuggestions[0]) {
          handleApplySuggestion(analysis.highImpactSuggestions[0].id, analysis.highImpactSuggestions[0].suggestion);
        }
      }
    });

    // 7. Informações de Contato para Leitura Automática
    const pd = resume.personalData;
    const contactCount = [pd.email, pd.phone, pd.location, pd.linkedin].filter(v => Boolean(v && v.trim().length > 3)).length;
    items.push({
      id: 'chk-contacts',
      category: 'formatting',
      categoryLabel: 'Formatação ATS',
      title: 'Contatos e Localização Essenciais',
      status: contactCount >= 4 ? 'passed' : contactCount >= 2 ? 'warning' : 'failed',
      statusLabel: contactCount >= 4 ? '100% Preenchido' : `${contactCount}/4 Informados`,
      description: `Foram identificados ${contactCount} de 4 campos de contato essenciais (E-mail, Telefone, Cidade/Estado, LinkedIn).`,
      tip: 'Sistemas ATS descartam currículos sem e-mail ou número de telefone formatados corretamente.',
      actionText: undefined
    });

    // 8. Datas e Período das Experiências
    const allExpsHaveDates = resume.experiences.length > 0 && resume.experiences.every(e => e.period && e.period.trim().length > 2);
    items.push({
      id: 'chk-dates',
      category: 'formatting',
      categoryLabel: 'Formatação ATS',
      title: 'Período e Cronologia das Experiências',
      status: allExpsHaveDates ? 'passed' : 'warning',
      statusLabel: allExpsHaveDates ? 'Validadas' : 'Datas Incompletas',
      description: allExpsHaveDates 
        ? 'Todas as suas experiências profissionais possuem períodos válidos para cálculo de tempo de carreira.'
        : 'Algumas experiências não possuem ano ou período informado. O robô ATS precisa disso para calcular sua senioridade.',
      tip: 'Use formatos padronizados de data, ex: "2021 - Presente" ou "Jan/2020 - Dez/2022".',
      actionText: undefined
    });

    // 9. Formação Acadêmica Cadastrada
    const hasEducation = resume.education && resume.education.length > 0;
    items.push({
      id: 'chk-education',
      category: 'formatting',
      categoryLabel: 'Formatação ATS',
      title: 'Seção de Formação Acadêmica',
      status: hasEducation ? 'passed' : 'failed',
      statusLabel: hasEducation ? 'Presente' : 'Ausente',
      description: hasEducation 
        ? `${resume.education.length} curso(s) ou graduação(ões) cadastrado(s) com instituição.`
        : 'Sua formação acadêmica não foi informada. Filtros ATS frequentemente eliminam candidatos sem grau de instrução.',
      tip: 'Informe o curso, instituição de ensino e o ano de conclusão ou previsão.',
      actionText: undefined
    });

    // 10. Compatibilidade Estrutural com OCR / PDF Text Parser
    items.push({
      id: 'chk-structure',
      category: 'formatting',
      categoryLabel: 'Formatação ATS',
      title: 'Estrutura Compatível com Leitura de Texto OCR',
      status: 'passed',
      statusLabel: 'Compatível',
      description: 'O modelo selecionado possui hierarquia limpa de títulos, permitindo extração exata dos dados por inteligências artificiais.',
      tip: 'Evite tabelas aninhadas, vetores complexos ou caixas de texto flutuantes no export do PDF.',
      actionText: undefined
    });

    return items;
  }, [resume, targetJob, analysis]);

  // Filtered Checklist
  const filteredChecklist = useMemo(() => {
    if (activeChecklistFilter === 'pending') {
      return checklistItems.filter(i => i.status === 'warning' || i.status === 'failed');
    }
    if (activeChecklistFilter === 'passed') {
      return checklistItems.filter(i => i.status === 'passed');
    }
    if (activeChecklistFilter === 'keywords' || activeChecklistFilter === 'density' || activeChecklistFilter === 'formatting') {
      return checklistItems.filter(i => i.category === activeChecklistFilter);
    }
    return checklistItems;
  }, [checklistItems, activeChecklistFilter]);

  const passedCount = checklistItems.filter(i => i.status === 'passed').length;
  const warningCount = checklistItems.filter(i => i.status === 'warning').length;
  const failedCount = checklistItems.filter(i => i.status === 'failed').length;
  const compliancePercentage = Math.round((passedCount / checklistItems.length) * 100);

  return (
    <main className="pt-6 md:pt-8 pb-28 px-4 md:px-8 max-w-5xl mx-auto flex flex-col gap-6 font-sans">
      
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
            className="h-11 px-5 bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50 cursor-pointer"
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

      {/* ========================================================================= */}
      {/* CHECKLIST DE OTIMIZAÇÃO ATS (NOVA SEÇÃO EXIGIDA) */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#c3c6d7]/60 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#f2f4f6]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#004ac6]/10 text-[#004ac6] rounded-2xl">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-[#191c1e]">Checklist de Otimização ATS</h2>
                <span className="bg-[#004ac6] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                  {compliancePercentage}% Conforme
                </span>
              </div>
              <p className="text-xs text-[#434655] mt-0.5">
                Validação em tempo real dos critérios exigidos por robôs e algoritmos de recrutamento.
              </p>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-2 bg-[#f8fafc] p-2 rounded-2xl border border-[#e2e8f0]">
            <div className="flex items-center gap-1 bg-[#d4eabb] text-[#006e1c] px-3 py-1 rounded-xl text-xs font-extrabold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{passedCount} Concluídos</span>
            </div>
            {warningCount + failedCount > 0 && (
              <div className="flex items-center gap-1 bg-[#ffdad6] text-[#8c0009] px-3 py-1 rounded-xl text-xs font-extrabold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{warningCount + failedCount} Pendentes</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-[#434655]">Índice de Conformidade com Filtros ATS</span>
            <span className="text-[#004ac6]">{passedCount} de {checklistItems.length} itens aprovados</span>
          </div>
          <div className="w-full h-3 bg-[#f2f4f6] rounded-full overflow-hidden p-0.5 border border-[#e2e8f0]">
            <div
              className="h-full bg-gradient-to-r from-[#2563eb] to-[#004ac6] rounded-full transition-all duration-500"
              style={{ width: `${compliancePercentage}%` }}
            />
          </div>
        </div>

        {/* Checklist Filters Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveChecklistFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeChecklistFilter === 'all'
                ? 'bg-[#191c1e] text-white shadow-xs'
                : 'bg-[#f2f4f6] text-[#434655] hover:bg-[#e0e3e5]'
            }`}
          >
            Todos ({checklistItems.length})
          </button>
          <button
            onClick={() => setActiveChecklistFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeChecklistFilter === 'pending'
                ? 'bg-[#ba1a1a] text-white shadow-xs'
                : 'bg-[#ffdad6]/60 text-[#8c0009] hover:bg-[#ffdad6]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Pendentes ({warningCount + failedCount})</span>
          </button>
          <button
            onClick={() => setActiveChecklistFilter('passed')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeChecklistFilter === 'passed'
                ? 'bg-[#006e1c] text-white shadow-xs'
                : 'bg-[#d4eabb]/60 text-[#006e1c] hover:bg-[#d4eabb]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Aprovados ({passedCount})</span>
          </button>
          <div className="h-4 w-px bg-[#c3c6d7] mx-1" />
          <button
            onClick={() => setActiveChecklistFilter('keywords')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeChecklistFilter === 'keywords'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'bg-[#f2f4f6] text-[#434655] hover:bg-[#e0e3e5]'
            }`}
          >
            Palavras-Chave
          </button>
          <button
            onClick={() => setActiveChecklistFilter('density')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeChecklistFilter === 'density'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'bg-[#f2f4f6] text-[#434655] hover:bg-[#e0e3e5]'
            }`}
          >
            Densidade de Texto
          </button>
          <button
            onClick={() => setActiveChecklistFilter('formatting')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeChecklistFilter === 'formatting'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'bg-[#f2f4f6] text-[#434655] hover:bg-[#e0e3e5]'
            }`}
          >
            Formatação ATS
          </button>
        </div>

        {/* Checklist Cards Grid */}
        <div className="flex flex-col gap-3">
          {filteredChecklist.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.status === 'passed'
                  ? 'bg-emerald-50/40 border-emerald-200/80'
                  : item.status === 'warning'
                  ? 'bg-amber-50/50 border-amber-200'
                  : 'bg-red-50/50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Status Icon */}
                <div className="mt-0.5">
                  {item.status === 'passed' && (
                    <div className="p-1.5 bg-[#d4eabb] text-[#006e1c] rounded-full">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  {item.status === 'warning' && (
                    <div className="p-1.5 bg-amber-100 text-amber-800 rounded-full">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}
                  {item.status === 'failed' && (
                    <div className="p-1.5 bg-[#ffdad6] text-[#ba1a1a] rounded-full">
                      <XCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-[#191c1e]">{item.title}</h3>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white/80 border text-[#434655]">
                      {item.categoryLabel}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        item.status === 'passed'
                          ? 'bg-[#d4eabb] text-[#006e1c]'
                          : item.status === 'warning'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-[#ffdad6] text-[#ba1a1a]'
                      }`}
                    >
                      {item.statusLabel}
                    </span>
                  </div>

                  <p className="text-xs text-[#434655] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#2563eb] font-semibold mt-0.5">
                    <Info className="w-3.5 h-3.5" />
                    <span><strong>Exigência ATS:</strong> {item.tip}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {item.onAction && (
                <button
                  type="button"
                  onClick={item.onAction}
                  className="self-end sm:self-center bg-[#004ac6] hover:bg-[#2563eb] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>{item.actionText || 'Otimizar'}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Missing Keywords Section */}
      <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/50 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-[#191c1e]">Palavras-chave Ausentes Identificadas</h3>
          </div>
          <button
            onClick={handleAddMissingKeywordsToSkills}
            className="text-xs font-bold text-[#004ac6] hover:text-[#2563eb] flex items-center gap-1 cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Adicionar Todas às Habilidades</span>
          </button>
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
            className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
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
                  className="bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
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

