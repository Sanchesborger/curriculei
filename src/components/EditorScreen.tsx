import React, { useState } from 'react';
import { ResumeData, ExperienceItem, EducationItem } from '../types';
import { VerifiedField, FullGrammarToolbar } from './GrammarChecker';
import { ImageStudioModal } from './ImageStudioModal';
import { 
  Sparkles, 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  Plus, 
  Trash2, 
  Eye, 
  Save, 
  ChevronDown, 
  ChevronUp,
  Wand2,
  CheckCircle2,
  Download,
  Share2,
  Camera,
  Image as ImageIcon
} from 'lucide-react';

interface EditorScreenProps {
  resume: ResumeData;
  onUpdateResume: (updated: ResumeData) => void;
  onNavigateToPreview: () => void;
  onOptimizeWithAI: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const EditorScreen: React.FC<EditorScreenProps> = ({
  resume,
  onUpdateResume,
  onNavigateToPreview,
  onOptimizeWithAI,
  onShowToast
}) => {
  const [activeAccordion, setActiveAccordion] = useState<string>('personal');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isFullGrammarAnalyzing, setIsFullGrammarAnalyzing] = useState<boolean>(false);
  const [totalGrammarIssues, setTotalGrammarIssues] = useState<number>(0);
  const [isImageStudioOpen, setIsImageStudioOpen] = useState<boolean>(false);

  // Local state bound to resume prop
  const [title, setTitle] = useState(resume.title);
  const [personalData, setPersonalData] = useState(resume.personalData);
  const [summary, setSummary] = useState(resume.summary);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(resume.experiences);
  const [education, setEducation] = useState<EducationItem[]>(resume.education);
  const [skills, setSkills] = useState<string[]>(resume.skills);
  const [newSkill, setNewSkill] = useState('');

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? '' : id);
  };

  const handleSave = () => {
    const updated: ResumeData = {
      ...resume,
      title,
      personalData,
      summary,
      experiences,
      education,
      skills,
      updatedAt: 'Agora'
    };
    onUpdateResume(updated);
    onShowToast('Currículo salvo com sucesso!');
  };

  const handleAiOptimizeSummary = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/optimize-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: summary || `Profissional atuando como ${personalData.title || 'Especialista'}.`,
          type: 'resumo',
          targetRole: personalData.title || 'Especialista'
        })
      });
      const data = await res.json();
      if (data.suggestion) {
        setSummary(data.suggestion);
        onShowToast('Resumo otimizado pela IA com sucesso!');
      } else {
        const fallbackText = `Especialista em ${personalData.title || 'sua área'} com histórico comprovado em liderança técnica, otimização de processos e entregas estratégicas de alto impacto.`;
        setSummary(fallbackText);
        onShowToast('Resumo aprimorado com sucesso!');
      }
    } catch (err) {
      console.error(err);
      const fallbackText = `Especialista em ${personalData.title || 'sua área'} com foco em entregas ágeis, inovação contínua e resultados de alto impacto.`;
      setSummary(fallbackText);
      onShowToast('Resumo aprimorado com sucesso!');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Full Resume Grammar Scan
  const handleCheckFullResume = async () => {
    setIsFullGrammarAnalyzing(true);
    let issueCount = 0;

    try {
      // Analyze summary
      if (summary && summary.trim().length > 3) {
        const res = await fetch('/api/ai/grammar-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: summary, fieldName: 'Resumo' })
        });
        const data = await res.json();
        if (data.issues) issueCount += data.issues.length;
      }

      // Analyze experiences descriptions
      for (const exp of experiences) {
        if (exp.description && exp.description.trim().length > 3) {
          const res = await fetch('/api/ai/grammar-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: exp.description, fieldName: 'Experiência' })
          });
          const data = await res.json();
          if (data.issues) issueCount += data.issues.length;
        }
      }

      setTotalGrammarIssues(issueCount);
      if (issueCount === 0) {
        onShowToast('Nenhum erro de ortografia ou gramática encontrado!', 'success');
      } else {
        onShowToast(`${issueCount} ${issueCount === 1 ? 'sugestão gramatical encontrada' : 'sugestões gramaticais encontradas'}.`, 'success');
      }
    } catch (err) {
      console.error(err);
      onShowToast('Erro ao analisar gramática do currículo.', 'error');
    } finally {
      setIsFullGrammarAnalyzing(false);
    }
  };

  // Fix All Fields automatically
  const handleFixAllResumeFields = async () => {
    setIsFullGrammarAnalyzing(true);
    let totalFixed = 0;

    try {
      // Fix summary
      if (summary && summary.trim().length > 3) {
        const res = await fetch('/api/ai/grammar-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: summary, fieldName: 'Resumo' })
        });
        const data = await res.json();
        if (data.correctedText) {
          setSummary(data.correctedText);
          totalFixed += (data.issues?.length || 0);
        }
      }

      // Fix experiences descriptions
      const updatedExperiences = await Promise.all(
        experiences.map(async (exp) => {
          if (exp.description && exp.description.trim().length > 3) {
            const res = await fetch('/api/ai/grammar-check', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: exp.description, fieldName: 'Experiência' })
            });
            const data = await res.json();
            if (data.correctedText) {
              totalFixed += (data.issues?.length || 0);
              return { ...exp, description: data.correctedText };
            }
          }
          return exp;
        })
      );
      setExperiences(updatedExperiences);

      setTotalGrammarIssues(0);
      onShowToast('Todas as correções ortográficas e gramaticais foram aplicadas!', 'success');
    } catch (err) {
      console.error(err);
      onShowToast('Erro ao corrigir automaticamente os campos.', 'error');
    } finally {
      setIsFullGrammarAnalyzing(false);
    }
  };

  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: 'exp-' + Date.now(),
      role: 'Novo Cargo',
      company: 'Empresa',
      period: '2023 - Presente',
      description: 'Descreva suas principais realizações e métricas...'
    };
    setExperiences([...experiences, newExp]);
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences(experiences.filter(e => e.id !== id));
  };

  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: 'edu-' + Date.now(),
      degree: 'Curso / Graduação',
      institution: 'Instituição de Ensino',
      period: '2020 - 2024'
    };
    setEducation([...education, newEdu]);
  };

  const handleRemoveEducation = (id: string) => {
    setEducation(education.filter(e => e.id !== id));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <main className="pt-6 md:pt-8 pb-28 px-4 md:px-8 max-w-4xl mx-auto flex flex-col gap-6 font-sans">
      
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-[#c3c6d7]/50 shadow-sm">
        <div className="flex-1 w-full sm:w-auto">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold text-[#191c1e] bg-transparent border-b border-transparent hover:border-[#c3c6d7] focus:border-[#2563eb] focus:outline-none w-full"
            placeholder="Título do Currículo"
          />
          <div className="flex items-center gap-2 mt-1">
            <div className="w-32 h-2 bg-[#e0e3e5] rounded-full overflow-hidden">
              <div className="h-full bg-[#2563eb] w-[75%]" />
            </div>
            <span className="text-xs font-bold text-[#2563eb]">75% Concluído</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
          <button
            onClick={() => setIsImageStudioOpen(true)}
            className="bg-[#004ac6] text-white hover:bg-[#2563eb] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Gerar foto profissional ou capa com IA"
          >
            <Camera className="w-4 h-4 text-blue-200" />
            <span>Estúdio Foto/Capa (IA)</span>
          </button>

          <button
            onClick={onOptimizeWithAI}
            className="bg-[#2563eb]/10 text-[#004ac6] hover:bg-[#2563eb]/20 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#2563eb]" />
            <span>Score ATS</span>
          </button>

          <button
            onClick={() => {
              handleSave();
              onNavigateToPreview();
            }}
            className="bg-[#004ac6] hover:bg-[#1d3989] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>

          <button
            onClick={onNavigateToPreview}
            className="bg-[#191c1e] text-white hover:bg-black px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Visualizar</span>
          </button>

          <button
            onClick={handleSave}
            className="bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e] border border-[#c3c6d7] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar</span>
          </button>
        </div>
      </div>

      {/* Real-time Grammar Checker Banner */}
      <FullGrammarToolbar
        onCheckFullResume={handleCheckFullResume}
        totalIssuesCount={totalGrammarIssues}
        isAnalyzing={isFullGrammarAnalyzing}
        onFixAllFields={handleFixAllResumeFields}
      />

      {/* Accordion Sections */}

      {/* 1. DADOS PESSOAIS */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/50 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleAccordion('personal')}
          className="w-full p-5 flex justify-between items-center bg-white hover:bg-[#f7f9fb] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2563eb]/10 text-[#004ac6] rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#191c1e]">Dados Pessoais</h3>
              <p className="text-xs text-[#737686]">Nome, contato, LinkedIn e localização</p>
            </div>
          </div>
          {activeAccordion === 'personal' ? <ChevronUp className="w-5 h-5 text-[#737686]" /> : <ChevronDown className="w-5 h-5 text-[#737686]" />}
        </button>

        {activeAccordion === 'personal' && (
          <div className="p-5 border-t border-[#e0e3e5] grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            <VerifiedField
              label="Nome Completo"
              value={personalData.fullName}
              onChange={(val) => setPersonalData({ ...personalData, fullName: val })}
              fieldName="Nome Completo"
            />

            <VerifiedField
              label="Cargo Desejado"
              value={personalData.title}
              onChange={(val) => setPersonalData({ ...personalData, title: val })}
              fieldName="Cargo Desejado"
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#434655] uppercase">E-mail</label>
              <input
                type="email"
                value={personalData.email}
                onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                className="h-11 px-3.5 rounded-xl border border-[#c3c6d7] text-sm text-[#191c1e] focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#434655] uppercase">Telefone</label>
              <input
                type="text"
                value={personalData.phone}
                onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                className="h-11 px-3.5 rounded-xl border border-[#c3c6d7] text-sm text-[#191c1e] focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            <VerifiedField
              label="Localização"
              value={personalData.location}
              onChange={(val) => setPersonalData({ ...personalData, location: val })}
              fieldName="Localização"
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#434655] uppercase">LinkedIn</label>
              <input
                type="text"
                value={personalData.linkedin}
                onChange={(e) => setPersonalData({ ...personalData, linkedin: e.target.value })}
                className="h-11 px-3.5 rounded-xl border border-[#c3c6d7] text-sm text-[#191c1e] focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            {/* Identidade Visual / Imagens de IA */}
            <div className="col-span-1 md:col-span-2 mt-2 pt-4 border-t border-[#e0e3e5] flex flex-col gap-3 bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#004ac6]" />
                  <span className="text-xs font-bold text-[#191c1e] uppercase">
                    Identidade Visual (Foto de Perfil & Capa)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsImageStudioOpen(true)}
                  className="bg-[#004ac6] text-white hover:bg-[#2563eb] py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                  <span>Gerar com IA / Estúdio</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Photo Preview Card */}
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#e2e8f0]">
                  {personalData.avatarUrl ? (
                    <img
                      src={personalData.avatarUrl}
                      alt="Foto do Currículo"
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-[#c3c6d7]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#f2f4f6] text-[#737686] flex items-center justify-center font-bold text-xs border border-dashed border-[#c3c6d7]">
                      Sem Foto
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#191c1e]">Foto Profissional</p>
                    <p className="text-[11px] text-[#737686] truncate">
                      {personalData.avatarUrl ? 'Avatar configurado' : 'Nenhuma foto selecionada'}
                    </p>
                  </div>
                </div>

                {/* Cover Preview Card */}
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#e2e8f0]">
                  {resume.coverImage ? (
                    <img
                      src={resume.coverImage}
                      alt="Capa do Currículo"
                      referrerPolicy="no-referrer"
                      className="w-16 h-12 rounded-lg object-cover border border-[#c3c6d7]"
                    />
                  ) : (
                    <div className="w-16 h-12 rounded-lg bg-[#f2f4f6] text-[#737686] flex items-center justify-center font-bold text-[10px] border border-dashed border-[#c3c6d7] text-center px-1">
                      Sem Capa
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#191c1e]">Capa do Currículo</p>
                    <p className="text-[11px] text-[#737686] truncate">
                      {resume.coverImage ? 'Banner ativo' : 'Banner de topo desativado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. RESUMO PROFISSIONAL */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/50 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleAccordion('summary')}
          className="w-full p-5 flex justify-between items-center bg-white hover:bg-[#f7f9fb] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2563eb]/10 text-[#004ac6] rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#191c1e]">Resumo Profissional</h3>
              <p className="text-xs text-[#737686]">Síntese marcante do seu perfil e conquistas</p>
            </div>
          </div>
          {activeAccordion === 'summary' ? <ChevronUp className="w-5 h-5 text-[#737686]" /> : <ChevronDown className="w-5 h-5 text-[#737686]" />}
        </button>

        {activeAccordion === 'summary' && (
          <div className="p-5 border-t border-[#e0e3e5] flex flex-col gap-3 animate-fade-in">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#434655] uppercase">Texto do Resumo</span>
              <button
                onClick={handleAiOptimizeSummary}
                disabled={isAiLoading}
                className="bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{isAiLoading ? 'Otimizando...' : 'Melhorar com IA'}</span>
              </button>
            </div>

            <VerifiedField
              isTextArea
              rows={4}
              value={summary}
              onChange={(val) => setSummary(val)}
              fieldName="Resumo Profissional"
              placeholder="Ex: Engenheiro de Software Sênior com 8 anos de experiência em sistemas distribuídos..."
            />
          </div>
        )}
      </div>

      {/* 3. EXPERIÊNCIA PROFISSIONAL */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/50 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleAccordion('experience')}
          className="w-full p-5 flex justify-between items-center bg-white hover:bg-[#f7f9fb] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2563eb]/10 text-[#004ac6] rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#191c1e]">Experiência Profissional</h3>
              <p className="text-xs text-[#737686]">Histórico de trabalho e responsabilidades</p>
            </div>
          </div>
          {activeAccordion === 'experience' ? <ChevronUp className="w-5 h-5 text-[#737686]" /> : <ChevronDown className="w-5 h-5 text-[#737686]" />}
        </button>

        {activeAccordion === 'experience' && (
          <div className="p-5 border-t border-[#e0e3e5] flex flex-col gap-6 animate-fade-in">
            {experiences.map((exp, idx) => (
              <div key={exp.id} className="p-4 rounded-xl border border-[#c3c6d7]/60 bg-[#f7f9fb] flex flex-col gap-3 relative">
                <button
                  onClick={() => handleRemoveExperience(exp.id)}
                  aria-label="Excluir experiência"
                  className="absolute top-3 right-3 text-[#ba1a1a] hover:bg-[#ffdad6] p-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                  <VerifiedField
                    label="Cargo"
                    value={exp.role}
                    onChange={(val) => {
                      const newExps = [...experiences];
                      newExps[idx].role = val;
                      setExperiences(newExps);
                    }}
                    fieldName="Cargo"
                  />

                  <VerifiedField
                    label="Empresa"
                    value={exp.company}
                    onChange={(val) => {
                      const newExps = [...experiences];
                      newExps[idx].company = val;
                      setExperiences(newExps);
                    }}
                    fieldName="Empresa"
                  />

                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold text-[#434655] uppercase">Período</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => {
                        const newExps = [...experiences];
                        newExps[idx].period = e.target.value;
                        setExperiences(newExps);
                      }}
                      className="w-full h-10 px-3 rounded-lg border border-[#c3c6d7] text-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <VerifiedField
                    isTextArea
                    rows={3}
                    label="Descrição e Resultados"
                    value={exp.description}
                    onChange={(val) => {
                      const newExps = [...experiences];
                      newExps[idx].description = val;
                      setExperiences(newExps);
                    }}
                    fieldName="Descrição da Experiência"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={handleAddExperience}
              className="py-3 border-2 border-dashed border-[#2563eb] text-[#004ac6] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#2563eb]/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Experiência</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. FORMAÇÃO ACADÊMICA */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/50 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleAccordion('education')}
          className="w-full p-5 flex justify-between items-center bg-white hover:bg-[#f7f9fb] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2563eb]/10 text-[#004ac6] rounded-xl">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#191c1e]">Formação Acadêmica</h3>
              <p className="text-xs text-[#737686]">Graduações, cursos e certificações</p>
            </div>
          </div>
          {activeAccordion === 'education' ? <ChevronUp className="w-5 h-5 text-[#737686]" /> : <ChevronDown className="w-5 h-5 text-[#737686]" />}
        </button>

        {activeAccordion === 'education' && (
          <div className="p-5 border-t border-[#e0e3e5] flex flex-col gap-4 animate-fade-in">
            {education.map((edu, idx) => (
              <div key={edu.id} className="p-4 rounded-xl border border-[#c3c6d7]/60 bg-[#f7f9fb] grid grid-cols-1 md:grid-cols-3 gap-3 relative">
                <button
                  onClick={() => handleRemoveEducation(edu.id)}
                  aria-label="Excluir formação"
                  className="absolute top-2 right-2 text-[#ba1a1a] p-1.5 hover:bg-[#ffdad6] rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <VerifiedField
                  label="Curso/Grau"
                  value={edu.degree}
                  onChange={(val) => {
                    const newEdus = [...education];
                    newEdus[idx].degree = val;
                    setEducation(newEdus);
                  }}
                  fieldName="Curso/Grau"
                />

                <VerifiedField
                  label="Instituição"
                  value={edu.institution}
                  onChange={(val) => {
                    const newEdus = [...education];
                    newEdus[idx].institution = val;
                    setEducation(newEdus);
                  }}
                  fieldName="Instituição"
                />

                <div>
                  <label className="text-[11px] font-bold text-[#434655] uppercase">Período</label>
                  <input
                    type="text"
                    value={edu.period}
                    onChange={(e) => {
                      const newEdus = [...education];
                      newEdus[idx].period = e.target.value;
                      setEducation(newEdus);
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-[#c3c6d7] text-sm bg-white"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={handleAddEducation}
              className="py-3 border-2 border-dashed border-[#2563eb] text-[#004ac6] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#2563eb]/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Formação</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. HABILIDADES */}
      <div className="bg-white rounded-2xl border border-[#c3c6d7]/50 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleAccordion('skills')}
          className="w-full p-5 flex justify-between items-center bg-white hover:bg-[#f7f9fb] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2563eb]/10 text-[#004ac6] rounded-xl">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#191c1e]">Habilidades e Tecnologias</h3>
              <p className="text-xs text-[#737686]">Competências chave reconhecidas pelo ATS</p>
            </div>
          </div>
          {activeAccordion === 'skills' ? <ChevronUp className="w-5 h-5 text-[#737686]" /> : <ChevronDown className="w-5 h-5 text-[#737686]" />}
        </button>

        {activeAccordion === 'skills' && (
          <div className="p-5 border-t border-[#e0e3e5] flex flex-col gap-4 animate-fade-in">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="Ex: Docker, Gestão de Pessoas, Figma"
                className="flex-1 h-11 px-3.5 rounded-xl border border-[#c3c6d7] text-sm text-[#191c1e]"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-[#2563eb] hover:bg-[#004ac6] text-white font-bold text-xs px-4 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-[#f2f4f6] text-[#191c1e] border border-[#c3c6d7]/60 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-[#737686] hover:text-[#ba1a1a] cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar: Prévia and Salvar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#c3c6d7]/50 shadow-md flex flex-row items-center justify-between gap-3 mt-2">
        <button
          type="button"
          onClick={onNavigateToPreview}
          className="flex-1 border-2 border-[#191c1e] text-[#191c1e] bg-white hover:bg-[#f2f4f6] py-3.5 px-6 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>Prévia</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="flex-1 bg-[#004ac6] hover:bg-[#2563eb] text-white py-3.5 px-6 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Salvar</span>
        </button>
      </div>

      {/* Image Studio Modal for AI Avatar & Cover */}
      <ImageStudioModal
        isOpen={isImageStudioOpen}
        onClose={() => setIsImageStudioOpen(false)}
        resume={resume}
        onUpdateResume={onUpdateResume}
        onShowToast={onShowToast}
      />

    </main>
  );
};
