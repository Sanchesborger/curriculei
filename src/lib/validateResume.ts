import { ResumeData, PersonalData, ExperienceItem, EducationItem } from '../types';

export interface ResumeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedResume: ResumeData;
  sanitizedTargetRole: string;
}

/**
 * Valida e sanitiza os dados do currículo antes do envio para as APIs de IA.
 * Garante que campos vazios ou mal formatados sejam tratados ou corrigidos.
 */
export function validateResumeForAI(
  resume: Partial<ResumeData> | null | undefined,
  targetRole?: string
): ResumeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Verificação do objeto principal
  if (!resume || typeof resume !== 'object') {
    return {
      isValid: false,
      errors: ['Nenhum currículo válido foi selecionado para otimização.'],
      warnings: [],
      sanitizedResume: createDefaultResume(),
      sanitizedTargetRole: 'Profissional'
    };
  }

  // 2. PersonalData Sanitization & Validation
  const rawPersonal: Partial<PersonalData> = resume.personalData || {};
  const sanitizedPersonal: PersonalData = {
    fullName: (rawPersonal.fullName || '').toString().trim(),
    title: (rawPersonal.title || '').toString().trim(),
    email: (rawPersonal.email || '').toString().trim(),
    phone: (rawPersonal.phone || '').toString().trim(),
    location: (rawPersonal.location || '').toString().trim(),
    linkedin: (rawPersonal.linkedin || '').toString().trim(),
    portfolio: (rawPersonal.portfolio || '').toString().trim(),
    avatarUrl: rawPersonal.avatarUrl ? rawPersonal.avatarUrl.toString().trim() : undefined
  };

  // 3. Determinação do Cargo Alvo (Target Role)
  let cleanTargetRole = (targetRole || '').toString().trim();
  if (!cleanTargetRole) {
    cleanTargetRole = sanitizedPersonal.title || (resume.title || '').toString().trim() || 'Profissional';
  }

  // Se personalData.title for vazio, preenchemos com o targetRole para consistência
  if (!sanitizedPersonal.title) {
    sanitizedPersonal.title = cleanTargetRole;
  }

  // Se personalData.fullName for totalmente vazio e também não houver título do currículo
  if (!sanitizedPersonal.fullName && !sanitizedPersonal.title && !(resume.title || '').trim()) {
    errors.push('Preencha ao menos o seu nome ou o cargo desejado antes de otimizar com IA.');
  }

  // 4. Sanitização de Experiências Profissionais
  const rawExperiences = Array.isArray(resume.experiences) ? resume.experiences : [];
  const sanitizedExperiences: ExperienceItem[] = rawExperiences
    .map((exp, index) => ({
      id: exp.id || `exp-${index}-${Date.now()}`,
      role: (exp.role || '').toString().trim(),
      company: (exp.company || '').toString().trim(),
      period: (exp.period || '').toString().trim(),
      description: (exp.description || '').toString().trim()
    }))
    .filter(exp => exp.role || exp.company || exp.description); // Remove entradas totalmente vazias

  // 5. Sanitização de Formação Acadêmica
  const rawEducation = Array.isArray(resume.education) ? resume.education : [];
  const sanitizedEducation: EducationItem[] = rawEducation
    .map((edu, index) => ({
      id: edu.id || `edu-${index}-${Date.now()}`,
      degree: (edu.degree || '').toString().trim(),
      institution: (edu.institution || '').toString().trim(),
      period: (edu.period || '').toString().trim()
    }))
    .filter(edu => edu.degree || edu.institution);

  // 6. Sanitização de Habilidades
  const rawSkills = Array.isArray(resume.skills) ? resume.skills : [];
  const sanitizedSkills: string[] = rawSkills
    .map(skill => (skill || '').toString().trim())
    .filter(skill => skill.length > 0);

  // 7. Sanitização do Resumo Profissional
  const sanitizedSummary = (resume.summary || '').toString().trim();

  // Alertas/Avisos úteis
  if (!sanitizedSummary) {
    warnings.push('O resumo atual está vazio. A IA irá criar um novo resumo baseado no seu cargo.');
  }
  if (sanitizedExperiences.length === 0) {
    warnings.push('Nenhuma experiência profissional informada. A IA irá focar no resumo e habilidades.');
  }

  const sanitizedResume: ResumeData = {
    id: resume.id || `resume-${Date.now()}`,
    title: (resume.title || sanitizedPersonal.title || 'Meu Currículo').toString().trim(),
    status: resume.status || 'DRAFT',
    updatedAt: resume.updatedAt || new Date().toISOString(),
    templateId: resume.templateId || 'moderno',
    categoryTag: resume.categoryTag || 'Geral',
    personalData: sanitizedPersonal,
    summary: sanitizedSummary,
    summaryIsOptimized: Boolean(resume.summaryIsOptimized),
    experiences: sanitizedExperiences,
    education: sanitizedEducation,
    skills: sanitizedSkills,
    languages: Array.isArray(resume.languages) ? resume.languages.filter(Boolean) : [],
    atsScore: typeof resume.atsScore === 'number' ? resume.atsScore : 70,
    coverImage: resume.coverImage
  };

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedResume,
    sanitizedTargetRole: cleanTargetRole
  };
}

function createDefaultResume(): ResumeData {
  return {
    id: `resume-${Date.now()}`,
    title: 'Novo Currículo',
    status: 'DRAFT',
    updatedAt: new Date().toISOString(),
    templateId: 'moderno',
    personalData: {
      fullName: 'Candidato',
      title: 'Profissional',
      email: '',
      phone: '',
      location: '',
      linkedin: ''
    },
    summary: '',
    experiences: [],
    education: [],
    skills: [],
    atsScore: 70
  };
}
