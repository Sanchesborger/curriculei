-- ====================================================================
-- ESQUEMA SQL DO BANCO DE DADOS SUPABASE PARA CVPRO AI
-- ====================================================================
-- Cole este código diretamente no SQL Editor do seu Dashboard Supabase:
-- https://supabase.com/dashboard/project/_/sql/new
-- ====================================================================

-- 1. Habilitar extensão UUID (se não estiver habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Usuários (Perfis e Assinaturas)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Usuário CVPro',
  avatar_url TEXT DEFAULT '',
  role TEXT DEFAULT 'Candidato PRO',
  is_premium BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Transações e Histórico de Assinaturas Stripe
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL REFERENCES public.users(email) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  plan_name TEXT DEFAULT 'Assinante Premium PRO',
  amount_cents INT DEFAULT 2900,
  currency TEXT DEFAULT 'brl',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Currículos
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL REFERENCES public.users(email) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Meu Currículo',
  status TEXT NOT NULL DEFAULT 'FINAL', -- 'FINAL' | 'DRAFT' | 'AI OPTIMIZED'
  template_id TEXT NOT NULL DEFAULT 'ats-clean',
  category_tag TEXT DEFAULT 'ATS Optimized',
  summary TEXT,
  summary_is_optimized BOOLEAN DEFAULT FALSE,
  ats_score INT DEFAULT 85,
  cover_image TEXT,
  personal_data JSONB DEFAULT '{}'::jsonb,
  experiences JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  languages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de Cartas de Apresentação
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL REFERENCES public.users(email) ON DELETE CASCADE,
  recipient TEXT NOT NULL,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- ÍNDICES PARA ALTA PERFORMANCE NAS CONSULTAS
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_email ON public.subscriptions(user_email);
CREATE INDEX IF NOT EXISTS idx_resumes_user_email ON public.resumes(user_email);
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_email ON public.cover_letters(user_email);

-- ====================================================================
-- DADOS INICIAIS DE TESTE / SEED
-- ====================================================================
INSERT INTO public.users (email, name, role, is_premium)
VALUES ('Enoquesanbor@gmail.com', 'Enoque Santos', 'Senior UX Designer (Assinante Premium PRO)', TRUE)
ON CONFLICT (email) DO UPDATE 
SET is_premium = EXCLUDED.is_premium,
    role = EXCLUDED.role,
    updated_at = NOW();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) & PERMISSÕES
-- ====================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso Público para Leitura/Escrita via API Server-side
CREATE POLICY "Permitir leitura pública" ON public.users FOR SELECT USING (true);
CREATE POLICY "Permitir inserção e atualização" ON public.users FOR ALL USING (true);

CREATE POLICY "Permitir leitura subscriptions" ON public.subscriptions FOR SELECT USING (true);
CREATE POLICY "Permitir inserção subscriptions" ON public.subscriptions FOR ALL USING (true);

CREATE POLICY "Permitir leitura resumes" ON public.resumes FOR SELECT USING (true);
CREATE POLICY "Permitir gestão de resumes" ON public.resumes FOR ALL USING (true);

CREATE POLICY "Permitir leitura cover_letters" ON public.cover_letters FOR SELECT USING (true);
CREATE POLICY "Permitir gestão de cover_letters" ON public.cover_letters FOR ALL USING (true);

-- Concluído com Sucesso!
