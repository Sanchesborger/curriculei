import React, { useState } from 'react';
import { ResumeData, ExperienceItem, EducationItem } from '../types';
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
  CheckCircle2
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
          text: summary,
          type: 'resumo',
          targetRole: personalData.title
        })
      });
      const data = await res.json();
      if (data.suggestion) {
        setSummary(data.suggestion);
        onShowToast('Resumo otimizado pela IA com sucesso!');
      }
    } catch (err) {
      console.error(err);
      onShowToast('Erro ao otimizar resumo.', 'error');
    } finally {
      setIsAiLoading(false);
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

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={onOptimizeWithAI}
            className="bg-[#2563eb]/10 text-[#004ac6] hover:bg-[#2563eb]/20 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#2563eb]" />
            <span>Score ATS</span>
          </button>

          <button
            onClick={onNavigateToPreview}
            className="bg-[#191c1e] text-white hover:bg-black px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Visualizar PDF</span>
          </button>

          <button
            onClick={handleSave}
            className="bg-[#004ac6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Salvar</span>
          </button>
        </div>
      </div>

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
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#434655] uppercase">Nome Completo</label>
              <input
                type="text"
                value={personalData.fullName}
                onChange={(e) => setPersonalData({ ...personalData, fullName: e.target.value })}
                className="h-11 px-3.5 rounded-xl border border-[#c3c6d7] text-sm text-[#191c1e] focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#434655] uppercase">Cargo Desejado</label>
              <input
                type="text"
                value={personalData.title}
                onChange={(e) => setPersonalData({ ...personalData, title: e.target.value })}
                className="h-11 px-3.5 rounded-xl border border-[#c3c6d7] text-sm text-[#191c1e] focus:outline-none focus:border-[#2563eb]"
              />
            </div>

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

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#434655] uppercase">Localização</label>
              <input
                type="text"
                value={personalData.location}
                onChange={(e) => setPersonalData({ ...personalData, location: e.target.value })}
                className="h-11 px-3.5 rounded-xl border border-[#c3c6d7] text-sm text-[#191c1e] focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#434655] uppercase">LinkedIn</label>
              <input
                type="text"
                value={personalData.linkedin}
                onChange={(e) => setPersonalData({ ...personalData, linkedin: e.target.value })}
                className="h-11 px-3.5 rounded-xl border border-[#c3c6d7] text-sm text-[#191c1e] focus:outline-none focus:border-[#2563eb]"
              />
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
              <label className="text-xs font-bold text-[#434655] uppercase">Texto do Resumo</label>
              <button
                onClick={handleAiOptimizeSummary}
                disabled={isAiLoading}
                className="bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{isAiLoading ? 'Otimizando...' : 'Melhorar com IA'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#c3c6d7] text-sm text-[#191c1e] focus:outline-none focus:border-[#2563eb] leading-relaxed"
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
                  className="absolute top-3 right-3 text-[#ba1a1a] hover:bg-[#ffdad6] p-1.5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                  <div>
                    <label className="text-[11px] font-bold text-[#434655] uppercase">Cargo</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const newExps = [...experiences];
                        newExps[idx].role = e.target.value;
                        setExperiences(newExps);
                      }}
                      className="w-full h-10 px-3 rounded-lg border border-[#c3c6d7] text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#434655] uppercase">Empresa</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const newExps = [...experiences];
                        newExps[idx].company = e.target.value;
                        setExperiences(newExps);
                      }}
                      className="w-full h-10 px-3 rounded-lg border border-[#c3c6d7] text-sm bg-white"
                    />
                  </div>

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
                  <label className="text-[11px] font-bold text-[#434655] uppercase">Descrição e Resultados</label>
                  <textarea
                    rows={3}
                    value={exp.description}
                    onChange={(e) => {
                      const newExps = [...experiences];
                      newExps[idx].description = e.target.value;
                      setExperiences(newExps);
                    }}
                    className="w-full p-3 rounded-lg border border-[#c3c6d7] text-sm bg-white mt-1"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={handleAddExperience}
              className="py-3 border-2 border-dashed border-[#2563eb] text-[#004ac6] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#2563eb]/5 transition-colors flex items-center justify-center gap-2"
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
                  className="absolute top-2 right-2 text-[#ba1a1a] p-1.5 hover:bg-[#ffdad6] rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div>
                  <label className="text-[11px] font-bold text-[#434655] uppercase">Curso/Grau</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdus = [...education];
                      newEdus[idx].degree = e.target.value;
                      setEducation(newEdus);
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-[#c3c6d7] text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#434655] uppercase">Instituição</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const newEdus = [...education];
                      newEdus[idx].institution = e.target.value;
                      setEducation(newEdus);
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-[#c3c6d7] text-sm bg-white"
                  />
                </div>

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
              className="py-3 border-2 border-dashed border-[#2563eb] text-[#004ac6] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#2563eb]/5 transition-colors flex items-center justify-center gap-2"
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
                className="bg-[#2563eb] hover:bg-[#004ac6] text-white font-bold text-xs px-4 rounded-xl flex items-center gap-1"
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
                    className="text-[#737686] hover:text-[#ba1a1a]"
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
          className="flex-1 border-2 border-[#191c1e] text-[#191c1e] bg-white hover:bg-[#f2f4f6] py-3.5 px-6 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Eye className="w-4 h-4" />
          <span>Prévia</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="flex-1 bg-[#004ac6] hover:bg-[#2563eb] text-white py-3.5 px-6 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Salvar</span>
        </button>
      </div>

    </main>
  );
};
