export type ScreenView = 
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'signup'
  | 'home'
  | 'resumes'
  | 'templates'
  | 'editor'
  | 'preview'
  | 'ai-optimize'
  | 'interview'
  | 'cover-letter'
  | 'subscription'
  | 'profile';

export type ResumeStatus = 'FINAL' | 'DRAFT' | 'AI OPTIMIZED';

export interface PersonalData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio?: string;
  avatarUrl?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
}

export interface ResumeData {
  id: string;
  title: string;
  status: ResumeStatus;
  updatedAt: string;
  templateId: string;
  categoryTag?: string;
  personalData: PersonalData;
  summary: string;
  summaryIsOptimized?: boolean;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  languages?: string[];
  atsScore?: number;
  coverImage?: string;
}

export interface CoverLetterData {
  id: string;
  recipient: string;
  position: string;
  company: string;
  content: string;
  updatedAt: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  category: 'ATS Optimized' | 'Creative' | 'Executive' | 'Minimalist' | 'Modern';
  tagline: string;
  previewUrl: string;
  isPopular?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  isPremium: boolean;
  role: string;
}

export interface GrammarIssue {
  id: string;
  errorWord: string;
  errorType: 'orthography' | 'grammar' | 'style' | string;
  message: string;
  suggestion: string;
}

export interface GrammarCheckResult {
  originalText: string;
  issues: GrammarIssue[];
  correctedText: string;
  score: number;
}
