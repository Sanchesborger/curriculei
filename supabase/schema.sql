-- ====================================================================
-- CVPro AI - Estrutura de Banco de Dados PostgreSQL para Supabase
-- ====================================================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Perfis de Usuários (Sincronizada com Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  role TEXT DEFAULT 'Profissional',
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Configurações do Usuário
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  notify_resume BOOLEAN DEFAULT TRUE,
  notify_interview BOOLEAN DEFAULT FALSE,
  dark_mode BOOLEAN DEFAULT FALSE,
  public_profile BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela Principal de Currículos
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Novo Currículo',
  status TEXT NOT NULL CHECK (status IN ('FINAL', 'DRAFT', 'AI OPTIMIZED')) DEFAULT 'DRAFT',
  template_id TEXT NOT NULL DEFAULT 'modern-1',
  category_tag TEXT,
  summary TEXT DEFAULT '',
  summary_is_optimized BOOLEAN DEFAULT FALSE,
  ats_score INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Dados Pessoais do Currículo
CREATE TABLE IF NOT EXISTS public.resume_personal_data (
  resume_id UUID PRIMARY KEY REFERENCES public.resumes(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  linkedin TEXT,
  portfolio TEXT,
  avatar_url TEXT
);

-- 6. Experiências Profissionais
CREATE TABLE IF NOT EXISTS public.resume_experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Formação Acadêmica
CREATE TABLE IF NOT EXISTS public.resume_education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  period TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Habilidades (Skills)
CREATE TABLE IF NOT EXISTS public.resume_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- 9. Idiomas
CREATE TABLE IF NOT EXISTS public.resume_languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  language_name TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- 10. Cartas de Apresentação (Cover Letters)
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient TEXT NOT NULL,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Sessões de Treino de Entrevista
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Mensagens da Entrevista
CREATE TABLE IF NOT EXISTS public.interview_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Histórico de Notificações / Atividades
CREATE TABLE IF NOT EXISTS public.user_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_text TEXT NOT NULL,
  action_type TEXT NOT NULL DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- HABILITAR ROW LEVEL SECURITY (RLS) PARA SEGURANÇA
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_personal_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_history ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS (Cada usuário acessa somente os seus próprios dados)

-- Profiles
CREATE POLICY "Usuários podem ver o próprio perfil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuários podem atualizar o próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Settings
CREATE POLICY "Usuários gerenciam suas configurações" ON public.user_settings FOR ALL USING (auth.uid() = user_id);

-- Resumes
CREATE POLICY "Usuários gerenciam seus currículos" ON public.resumes FOR ALL USING (auth.uid() = user_id);

-- Resume Details (Personal Data, Experiences, Education, Skills, Languages)
CREATE POLICY "Acesso aos dados pessoais do currículo" ON public.resume_personal_data FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.resumes WHERE resumes.id = resume_personal_data.resume_id AND resumes.user_id = auth.uid()));

CREATE POLICY "Acesso às experiências do currículo" ON public.resume_experiences FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.resumes WHERE resumes.id = resume_experiences.resume_id AND resumes.user_id = auth.uid()));

CREATE POLICY "Acesso às formações do currículo" ON public.resume_education FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.resumes WHERE resumes.id = resume_education.resume_id AND resumes.user_id = auth.uid()));

CREATE POLICY "Acesso às habilidades do currículo" ON public.resume_skills FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.resumes WHERE resumes.id = resume_skills.resume_id AND resumes.user_id = auth.uid()));

CREATE POLICY "Acesso aos idiomas do currículo" ON public.resume_languages FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.resumes WHERE resumes.id = resume_languages.resume_id AND resumes.user_id = auth.uid()));

-- Cover Letters
CREATE POLICY "Usuários gerenciam suas cartas de apresentação" ON public.cover_letters FOR ALL USING (auth.uid() = user_id);

-- Interviews
CREATE POLICY "Usuários gerenciam suas sessões de entrevista" ON public.interview_sessions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Acesso às mensagens de entrevista" ON public.interview_messages FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.interview_sessions WHERE interview_sessions.id = interview_messages.session_id AND interview_sessions.user_id = auth.uid()));

-- User History
CREATE POLICY "Usuários veem seu histórico" ON public.user_history FOR ALL USING (auth.uid() = user_id);

-- ====================================================================
-- TRIGGER AUTOMÁTICO: Cria Perfil e Configurações ao cadastrar usuário
-- ====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Novo Usuário'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
