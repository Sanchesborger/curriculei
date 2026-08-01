import { UserProfile, ResumeData, TemplateItem, CoverLetterData } from './types';

export const initialUser: UserProfile = {
  name: 'Alex Sterling',
  email: 'alex.sterling@exemplo.com',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwDffx-x5G51fYydYSMJcFvkw5h8rAtR-eeqQ-oax_6mTVwoRW0e8SAasOihK6tm_8pgwv_Xr90G-7iMG9P_kNudB1xvWCx_ea2SZXZ0vZJGxFNvt1flPBlvrz0_1xsN1pjrIt6YtAz15dDfnSe8iH56kEsI4tiyReWrkMJ_Xkmsj6BuOD6X2ybPDzn-G9EODk6NUdSpdqXBnggN1bg10Hxye00V-C6wGNrjvbmtpuT86bzgMeJewwLEqmSrWA2DTjN78Dcljx4RM',
  isPremium: true,
  role: 'Desenvolvedor UI / Product Manager'
};

export const sampleResumes: ResumeData[] = [
  {
    id: 'resume-1',
    title: 'Senior Product Manager - Google',
    status: 'FINAL',
    updatedAt: 'Há 2 dias',
    templateId: 'moderno',
    categoryTag: 'Tech',
    atsScore: 92,
    personalData: {
      fullName: 'Alex Sterling',
      title: 'Senior Product Manager',
      email: 'alex@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexsterling',
      portfolio: 'alexsterling.design'
    },
    summary: 'Product Manager e Líder Técnico focado em escalar soluções com inteligência artificial, impulsionando retenção de usuários e arquiteturas modernas.',
    summaryIsOptimized: true,
    experiences: [
      {
        id: 'exp-1',
        role: 'Lead UX Designer & PM',
        company: 'TechFlow Inc.',
        period: '2021 - Presente',
        description: 'Liderei equipe de 4 designers no redesenho do dashboard corporativo, aumentando retenção de usuários em 25%.'
      },
      {
        id: 'exp-2',
        role: 'Frontend Engineer',
        company: 'WebSolutions',
        period: '2018 - 2021',
        description: 'Desenvolvi microsserviços em React e TypeScript padronizando componentes entre 3 linhas de produtos.'
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Bacharelado em Ciência da Computação',
        institution: 'Universidade de São Paulo',
        period: '2014 - 2018'
      }
    ],
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Gestão de Produto', 'IA / LLMs', 'Scrum & Agile'],
    languages: ['Português (Nativo)', 'Inglês (Fluente)', 'Espanhol (Intermediário)']
  },
  {
    id: 'resume-2',
    title: 'UX Designer - Tech Startup',
    status: 'DRAFT',
    updatedAt: 'Há 1 semana',
    templateId: 'minimalista',
    categoryTag: 'Design',
    atsScore: 74,
    personalData: {
      fullName: 'Alex Sterling',
      title: 'UX / UI Designer',
      email: 'alex@example.com',
      phone: '+55 11 98765-4321',
      location: 'São Paulo, SP',
      linkedin: 'linkedin.com/in/alexsterling'
    },
    summary: 'Designer focado na criação de interfaces centradas no usuário para web e mobile com prototipagem rápida.',
    summaryIsOptimized: false,
    experiences: [
      {
        id: 'exp-201',
        role: 'Senior UI Developer',
        company: 'TechCorp Inc.',
        period: '2021 - Presente',
        description: 'Liderei a implementação do Design System corporativo utilizando React e Tailwind CSS.'
      },
      {
        id: 'exp-202',
        role: 'Frontend Engineer',
        company: 'WebSolutions',
        period: '2018 - 2021',
        description: 'Criei páginas responsivas para clientes de grande porte.'
      }
    ],
    education: [
      {
        id: 'edu-201',
        degree: 'Design de Interação',
        institution: 'FIAP',
        period: '2016 - 2020'
      }
    ],
    skills: ['Figma', 'UI/UX Design', 'Prototipagem', 'Design Systems', 'HTML/CSS'],
    languages: ['Português', 'Inglês']
  },
  {
    id: 'resume-3',
    title: 'Marketing Director Base',
    status: 'AI OPTIMIZED',
    updatedAt: 'Há 2 semanas',
    templateId: 'ats-standard',
    categoryTag: 'Gestão',
    atsScore: 88,
    personalData: {
      fullName: 'Alex Sterling',
      title: 'Diretor de Marketing & Growth',
      email: 'alex@example.com',
      phone: '+55 11 98765-4321',
      location: 'São Paulo, SP',
      linkedin: 'linkedin.com/in/alexsterling'
    },
    summary: 'Estrategista de Growth Marketing focado em aquisição B2B, retenção e campanhas orientadas a dados e otimização por IA.',
    summaryIsOptimized: true,
    experiences: [
      {
        id: 'exp-301',
        role: 'Diretor de Marketing',
        company: 'GrowthCorp',
        period: '2020 - Presente',
        description: 'Aumentei o ROI das campanhas digitais em 45% reestruturando estratégias de tráfego pago.'
      }
    ],
    education: [
      {
        id: 'edu-301',
        degree: 'Pós em Marketing Digital',
        institution: 'FGV',
        period: '2019 - 2020'
      }
    ],
    skills: ['SEO/SEM', 'Growth Hacking', 'Google Analytics', 'Otimização ATS', 'CRM'],
    languages: ['Português', 'Inglês']
  }
];

export const sampleCoverLetter: CoverLetterData = {
  id: 'cl-1',
  recipient: 'Para: Equipe de Recrutamento da TechCorp',
  position: 'Vaga: Engenheiro de Software Sênior',
  company: 'TechCorp',
  updatedAt: 'Hoje',
  content: `Prezada Equipe de Recrutamento da TechCorp,

Escrevo para manifestar meu forte interesse na vaga de Engenheiro de Software Sênior, conforme anunciado no portal de carreiras da empresa. Com mais de 8 anos de experiência no desenvolvimento de soluções escaláveis em nuvem e liderança técnica de equipes ágeis, acredito que minhas habilidades estão perfeitamente alinhadas com as necessidades de inovação contínua da TechCorp.

Em minha posição anterior na DataFlow Systems, liderei a migração de um sistema monolítico legado para uma arquitetura de microserviços baseada em Kubernetes, resultando em uma redução de 40% nos custos de infraestrutura e melhorando o tempo de atividade do sistema para 99,99%. Além do impacto técnico, dediquei-me a mentorar engenheiros juniores, estabelecendo uma cultura de revisão de código rigorosa e colaborativa.

Admiro profundamente o compromisso da TechCorp com o desenvolvimento de produtos centrados no usuário e a recente expansão para soluções baseadas em inteligência artificial. Estou entusiasmado com a oportunidade de contribuir com minha expertise em sistemas distribuídos e minha paixão por resolver problemas complexos para impulsionar a próxima geração de produtos de vocês.

Agradeço antecipadamente pelo tempo e consideração dedicados à análise do meu currículo, em anexo. Estou à disposição para uma entrevista, onde poderei detalhar como minhas experiências passadas podem agregar valor imediato à equipe.

Atenciosamente,

Alex Sterling`
};

export const sampleTemplates: TemplateItem[] = [
  {
    id: 'ats-standard',
    name: 'ATS Standard',
    category: 'ATS Optimized',
    tagline: '100% Leitura de Robôs & Pontuação Alta',
    previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7dTJQLn7YNnbgmt7ubnfcKFOJLAlN42C6jymYKdHnfE5k4BytRTkCEXCdBDK3Hqex_6-FMNwIRYZPWLWgOf9vvC0SxOxldWmS-AU7rNTv0cu88Hk0lsdGu7Muo-C_kQpec4OZ3Geiuo8G79Cyd8Gs9wksZp0D44AaiVC2U7gMV5M44L20v6Cg7c3OUDlAjM9-aq7GaEQA0fwPqukbYB6zKFlx0iWYJkV74WRtXwWe8nqyTBkE8tJX4kpW9Oq6YkaMy1mOdBHo1Ls',
    isPopular: true,
    isPremium: false
  },
  {
    id: 'minimalista',
    name: 'Minimalista',
    category: 'Minimalist',
    tagline: 'Foco Total no Conteúdo e Clareza',
    previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2n8lhJKT8ZdeyRc3zH1qO3b3k-ecXgQCGjyMzNSe5zCbQw3HIyW5C9_BH3Dvxv-TMypndnqJ1rPXdhM7J0t0p0n3onSHM9Z31e8F7jqJX-T33ine65775T1aI60PVyxl0TLpW0WpbQROEMR35IamxMbYAip8YJErBusKDb_-g_NJVdMav8Jq2WKFevb4fSiYefKh1w95gmWNZwedPINZTPgmxE-yo889k5cM_EtH-mViXaPdvcTE0Q8Ie-oGknOoaz99xs_3g6a0',
    isPremium: false
  },
  {
    id: 'moderno',
    name: 'Moderno Tech PRO',
    category: 'Modern',
    tagline: 'Clean, Versátil e Alto Impacto Visual',
    previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9L3RNBgJB-_L0WoLYCDfJQGIo19lBDpmuZ9z445GYENYHnZWQzZ2Ry8TheV4qjdjcc3F_Hykrl2zmrX-eZX0SkyRf00V5fjTF2Nat5SK51aVFq8jc1bzy25ZUQmPRHUxJOVeLlGLin_HW9whR8pds1wZxUNMrmldukau0JFNZDBJBzz63-ozSfNtgumL-7j7I_KVdHP0zc4yJHTkrTOcxZAxL-kFZ9Vetqb-VZhyuJA0LYyZoHTG6w8KXLmry7IGcDtjgX9WYiVg',
    isPopular: true,
    isPremium: true
  },
  {
    id: 'executivo',
    name: 'Executivo Leadership PRO',
    category: 'Executive',
    tagline: 'Design Nobre para Cargos de Liderança',
    previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmg7-m8kH6IJIupD3dOE8x5_KjhqJ9ETmtCGrhswPbql8_mmYUQhzBTH0Uvjn83ibpKfzAqfDgPZh66-hQHIPu4QAtFmI4x7EX70U_BLSux8x-ZGMjLIukrR5HKOL_KsAiwim1Y77RCc_qAmhhOl6i_trzQna9wtSp6unPqzwQnpjbc-DqxSHrfuLDC3Rb5n4fbKzY6ekEyRvvcaJJ3NHcUq91YVV5VXvzSUduH-Z1-u9Sg3sMLjZ_OLKmd9orI2TDouK5b8Asz1Q',
    isPremium: true
  },
  {
    id: 'criativo',
    name: 'Criativo Premium PRO',
    category: 'Creative',
    tagline: 'Design Inovador & Destaque Absoluto',
    previewUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcji8s9EIl9wp88p7N422ygXiJh9HFzGg_scN4da0_4RR82kYFOIepqrV7_J04fazQwvirGRe3FE1B30CAxOmxgHjG0rTyHDn5W6VCpiBM4JJH93Fewn_Rp6LpUMA9ZkjdbpfkDOKDq_pmIQ_04pm-RuMGq4kNp1CPHJKDlO3qctpsvDFKCbBFuexkSvdDyQvn1SpaTjrqA-IOl2aSY7hN8lJ20HdxnmUJpjMOxewFxqgGWuviUtwEF1KtWmU9Yy8N6JJPdtVe2es',
    isPremium: true
  }
];
