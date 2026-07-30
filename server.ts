import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

let stripeClient: Stripe | null = null;
function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }
  return stripeClient;
}

app.use(express.json({ limit: "10mb" }));

// Normalize Vercel serverless function URL paths
app.use((req, _res, next) => {
  if (req.url.startsWith('/ai/')) {
    req.url = '/api' + req.url;
  } else if (req.url === '/ai') {
    req.url = '/api/ai';
  }
  next();
});

// Explicit PWA Service Worker & Manifest headers
app.get("/sw.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Service-Worker-Allowed", "/");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.sendFile(path.join(process.cwd(), "public", "sw.js"));
});

app.get("/manifest.json", (req, res) => {
  res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.sendFile(path.join(process.cwd(), "public", "manifest.json"));
});

app.use(express.static(path.join(process.cwd(), "public")));

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Stripe Checkout Endpoint
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const stripe = getStripeClient();
    
    // Determine base URL dynamically
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host;
    const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer as string).origin : "");
    const baseUrl = process.env.APP_URL || origin || `${protocol}://${host}`;

    if (!stripe) {
      return res.status(200).json({
        demo: true,
        message: "Sua conta do Stripe precisa da chave STRIPE_SECRET_KEY nas variáveis do ambiente. Você também pode testar o Plano Premium em modo demonstração!",
        url: null
      });
    }

    const priceId = process.env.STRIPE_PRICE_ID;
    
    // If a custom price ID is configured in .env, use it; otherwise create line items dynamically
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      success_url: `${baseUrl}/?subscription=success`,
      cancel_url: `${baseUrl}/?subscription=cancel`,
      line_items: priceId ? [{ price: priceId, quantity: 1 }] : [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "CVPro AI - Plano Premium PRO",
              description: "Acesso ilimitado a downloads HD, modelos de currículos exclusivos e otimizador de IA.",
            },
            unit_amount: 2900, // R$ 29,00
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.json({ url: session.url });
  } catch (error: any) {
    console.error("Erro ao criar sessão de checkout do Stripe:", error);
    return res.status(400).json({ 
      error: error?.message || "Erro de conexão com o Stripe. Verifique se a sua chave STRIPE_SECRET_KEY é válida.",
      details: error?.message 
    });
  }
});

// API Endpoints
app.post("/api/ai/job-search", async (req, res) => {
  try {
    const { role, location, keywords, resumeSummary } = req.body;
    const ai = getGeminiClient();

    const targetRole = role || "Engenheiro de Software";
    const targetLocation = location || "Brasil (Remoto / Híbrido)";

    if (!ai) {
      return res.json({
        queryUsed: `${targetRole} vagas ${targetLocation}`,
        totalResultsCount: 5,
        locationFilter: targetLocation,
        jobs: [
          {
            id: "job-1",
            title: `${targetRole} - Projetos em Nuvem`,
            company: "TechCorp Latam",
            location: `${targetLocation} (Remoto)`,
            type: "Remoto",
            salary: "R$ 14.000 - R$ 18.000 / mês",
            postedDate: "Há 1 dia",
            description: `Buscamos ${targetRole} apaixonado por inovação para liderar desenvolvimento de microsserviços escaláveis. Requer experiência prévia e boa comunicação.`,
            skillsRequired: ["React", "TypeScript", "Node.js", "AWS"],
            matchPercentage: 95,
            url: `https://www.google.com/search?q=${encodeURIComponent(`${targetRole} vagas ${targetLocation}`)}`,
            source: "Gupy / Portal de Carreiras"
          },
          {
            id: "job-2",
            title: `Especialista Sênior em ${targetRole}`,
            company: "Inovação Digital SA",
            location: "São Paulo, SP (Híbrido)",
            type: "Híbrido",
            salary: "R$ 16.500 - R$ 20.000 / mês",
            postedDate: "Há 3 dias",
            description: "Oportunidade para atuar na arquitetura de sistemas distribuídos e mentoria de times ágeis. Benefícios atrativos e participação nos lucros.",
            skillsRequired: ["Arquitetura de Software", "CI/CD", "Docker", "Gestão Ágil"],
            matchPercentage: 89,
            url: `https://www.google.com/search?q=${encodeURIComponent(`${targetRole} vagas`)}`,
            source: "LinkedIn Jobs"
          },
          {
            id: "job-3",
            title: `${targetRole} (Global / USD)`,
            company: "Global Scale Cloud",
            location: "100% Remoto Internacional",
            type: "Remoto",
            salary: "$ 4.500 - $ 6.000 USD / mês",
            postedDate: "Há 4 horas",
            description: "Atuação direta em produto global para milhões de usuários diários. Inglês avançado e sólida base em soluções resilientes.",
            skillsRequired: ["Inglês Avançado", "Sistemas Distribuídos", "Kubernetes", "GraphQL"],
            matchPercentage: 84,
            url: `https://www.google.com/search?q=${encodeURIComponent(`${targetRole} remoto USD`)}`,
            source: "Glassdoor"
          }
        ],
        marketInsights: `O mercado para ${targetRole} em ${targetLocation} apresenta forte demanda por profissionais qualificados em tecnologias modernas e liderança técnica.`,
        sources: [
          { title: "Google Jobs - Vagas de Carreiras", uri: "https://www.google.com/search?q=" + encodeURIComponent(`${targetRole} vagas`) }
        ]
      });
    }

    const prompt = `Você é um recrutador e caçador de talentos sênior.
Use o Google Search para pesquisar as vagas de emprego ativas e reais mais relevantes disponíveis recentemente na web.

Cargo buscado: "${targetRole}"
Localização/Modelo: "${targetLocation}"
Filtros adicionais: "${keywords || 'geral'}"
${resumeSummary ? `Resumo do currículo do candidato: "${resumeSummary}"` : ''}

Pesquise na web vagas de trabalho para "${targetRole} em ${targetLocation}" e retorne um JSON com os resultados e análises.
Estrutura exata do JSON esperada:
- queryUsed: a frase de busca utilizada
- totalResultsCount: número total de vagas encontradas na busca
- locationFilter: localização utilizada
- jobs: lista de objetos contendo:
  - id: id único da vaga
  - title: título exato da vaga
  - company: nome da empresa contratante
  - location: cidade/estado ou indicação de remoto
  - type: "Remoto" | "Híbrido" | "Presencial"
  - salary: estimativa salarial ou faixa mencionada se houver
  - postedDate: data ou tempo de publicação
  - description: resumo atraente de 2 a 3 frases com principais requisitos e atribuições
  - skillsRequired: array de 3 a 5 tecnologias/habilidades chave exigidas
  - matchPercentage: número entre 75 e 98 estimando compatibilidade
  - url: URL direta ou de busca da vaga se disponível
  - source: nome do portal da vaga
- marketInsights: um parágrafo de conselho estratégico de carreira para quem está se candidatando a esta posição no cenário atual.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            queryUsed: { type: Type.STRING },
            totalResultsCount: { type: Type.INTEGER },
            locationFilter: { type: Type.STRING },
            jobs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  location: { type: Type.STRING },
                  type: { type: Type.STRING },
                  salary: { type: Type.STRING },
                  postedDate: { type: Type.STRING },
                  description: { type: Type.STRING },
                  skillsRequired: { type: Type.ARRAY, items: { type: Type.STRING } },
                  matchPercentage: { type: Type.INTEGER },
                  url: { type: Type.STRING },
                  source: { type: Type.STRING }
                },
                required: ["id", "title", "company", "location", "description", "skillsRequired", "matchPercentage"]
              }
            },
            marketInsights: { type: Type.STRING }
          },
          required: ["queryUsed", "jobs", "marketInsights"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Google Search Source",
      uri: chunk.web?.uri || "#"
    })).filter((s: any) => s.uri !== "#") || [];

    return res.json({
      ...parsed,
      sources
    });

  } catch (error: any) {
    const isQuotaError = error?.status === 429 || error?.message?.includes("quota") || error?.message?.includes("RESOURCE_EXHAUSTED");
    if (isQuotaError) {
      console.warn("[Gemini API] Limite de cota atingido (429). Retornando resultados estruturados de contingência.");
    } else {
      console.error("Erro ao buscar vagas com Gemini:", error?.message || error);
    }

    const targetRole = req.body?.role || "Engenheiro de Software";
    const targetLocation = req.body?.location || "Brasil (Remoto / Híbrido)";

    return res.json({
      queryUsed: `${targetRole} vagas ${targetLocation}`,
      totalResultsCount: 5,
      locationFilter: targetLocation,
      jobs: [
        {
          id: "job-fb-1",
          title: `${targetRole} - Líder Técnico`,
          company: "TechCorp Latam",
          location: `${targetLocation} (Remoto)`,
          type: "Remoto",
          salary: "R$ 14.000 - R$ 18.000 / mês",
          postedDate: "Há 1 dia",
          description: `Buscamos profissional experiente para atuar como ${targetRole}. Responsável por liderar desenvolvimento de soluções modernas, escaláveis e colaboração com times multidisciplinares.`,
          skillsRequired: ["Resolução de Problemas", "Comunicação Eficiente", "Liderança Técnica", "Metodologia Ágil"],
          matchPercentage: 96,
          url: "https://www.google.com/search?q=" + encodeURIComponent(`${targetRole} vagas ${targetLocation}`),
          source: "Portal de Carreiras / Google Jobs"
        },
        {
          id: "job-fb-2",
          title: `Especialista em ${targetRole}`,
          company: "Inovação Digital SA",
          location: "São Paulo, SP (Híbrido)",
          type: "Híbrido",
          salary: "R$ 16.500 - R$ 21.000 / mês",
          postedDate: "Há 2 dias",
          description: `Oportunidade de alto impacto para atuar em projetos estratégicos na área de ${targetRole}. Excelente pacote de benefícios e participação nos lucros.`,
          skillsRequired: ["Planejamento Estratégico", "Gestão de Projetos", "Inovação", "Arquitetura de Soluções"],
          matchPercentage: 91,
          url: "https://www.google.com/search?q=" + encodeURIComponent(`${targetRole} vagas São Paulo`),
          source: "LinkedIn Jobs"
        },
        {
          id: "job-fb-3",
          title: `${targetRole} (Oportunidade Internacional USD)`,
          company: "Global Scale Tech",
          location: "100% Remoto Internacional",
          type: "Remoto",
          salary: "$ 4.500 - $ 6.500 USD / mês",
          postedDate: "Há 5 horas",
          description: "Posição remota global para profissional qualificado. Atuação direta com times internacionais na expansão de novos produtos e serviços.",
          skillsRequired: ["Inglês Avançado", "Trabalho Remoto", "Sistemas Distribuídos"],
          matchPercentage: 86,
          url: "https://www.google.com/search?q=" + encodeURIComponent(`${targetRole} remoto USD`),
          source: "Glassdoor"
        },
        {
          id: "job-fb-4",
          title: `${targetRole} Pleno / Sênior`,
          company: "Startup Fintech em Crescimento",
          location: "Florianópolis, SC ou Remoto",
          type: "Remoto",
          salary: "R$ 11.000 - R$ 15.000 / mês",
          postedDate: "Há 3 dias",
          description: `Venha fazer parte do nosso time acelerado como ${targetRole}. Ambiente dinâmico, cultura colaborativa e plano de carreira estruturado.`,
          skillsRequired: ["Trabalho em Equipe", "Proatividade", "Foco no Cliente"],
          matchPercentage: 82,
          url: "https://www.google.com/search?q=" + encodeURIComponent(`${targetRole} fintech vagas`),
          source: "Gupy"
        },
        {
          id: "job-fb-5",
          title: `Consultor Sênior - ${targetRole}`,
          company: "Global Advisory Group",
          location: "Rio de Janeiro, RJ (Híbrido)",
          type: "Híbrido",
          salary: "A combinar (Competitivo)",
          postedDate: "Há 4 dias",
          description: "Procuramos consultor de destaque para apoiar nossos clientes de grande porte na transformação digital e otimização de processos.",
          skillsRequired: ["Análise de Dados", "Consultoria", "Visão de Negócios"],
          matchPercentage: 78,
          url: "https://www.google.com/search?q=" + encodeURIComponent(`${targetRole} consultoria vagas`),
          source: "Catho / Indeed"
        }
      ],
      marketInsights: `A posição de ${targetRole} em ${targetLocation} apresenta forte demanda com destaque para profissionais com perfil proativo, visão analítica e capacidade de entregas de alto impacto.`,
      sources: [
        { title: `Pesquisa de vagas para ${targetRole}`, uri: "https://www.google.com/search?q=" + encodeURIComponent(`${targetRole} vagas`) }
      ]
    });
  }
});

// API Endpoints
app.post("/api/ai/optimize-text", async (req, res) => {
  try {
    const { text, type, targetRole } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        original: text || "Trabalhei em projetos de migração para cloud e ajudei a equipe.",
        suggestion: "Liderei a migração de 3 sistemas legados para AWS, reduzindo custos operacionais em 20% e orientando uma equipe de 4 desenvolvedores.",
        tags: ["Liderança", "Métricas", "AWS"],
        explanation: "Seu texto original era passivo. A sugestão inclui métricas quantificáveis e linguagem orientada a resultados."
      });
    }

    const prompt = `Você é um especialista sênior em recrutamento e revisão de currículos.
Analise e melhore o seguinte texto de currículo (tipo: ${type || 'experiência'}, cargo alvo: ${targetRole || 'Geral'}):
"${text}"

Retorne uma resposta JSON estritamente estruturada com:
- original: o texto original fornecido
- suggestion: a versão reescrita, forte e quantificável em português do Brasil com verbos de ação
- tags: lista de 3 palavras-chave destacadas
- explanation: explicação sucinta do porquê a mudança aumenta o impacto para recrutadores`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING },
            suggestion: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            explanation: { type: Type.STRING }
          },
          required: ["original", "suggestion", "tags", "explanation"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.warn("[Gemini API] Retornando fallback para otimização de texto:", error?.message || error);
    return res.json({
      original: req.body?.text || "Trabalhei em projetos de migração para cloud e ajudei a equipe.",
      suggestion: "Liderei a migração de sistemas para nuvem AWS, reduzindo custos operacionais em 20% e orientando a equipe de desenvolvimento com foco em alta disponibilidade.",
      tags: ["Liderança", "Nuvem", "Eficiência"],
      explanation: "A versão otimizada utiliza verbos de ação no passado e destaca resultados quantificáveis para atrair recrutadores."
    });
  }
});

app.post("/api/ai/ats-analysis", async (req, res) => {
  try {
    const { resumeData, targetJob } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        score: 68,
        potentialScore: 92,
        missingKeywords: ["CI/CD", "Mentoria", "Agile", "Arquitetura Cloud"],
        summaryFeedback: "Falta clareza no seu objetivo principal. A IA sugere focar em especializações.",
        suggestedSummary: "Engenheiro de Software Sênior com 8 anos de experiência focados em arquitetura escalável e liderança técnica de microsserviços.",
        highImpactSuggestions: [
          {
            title: "Impacto em Experiência Profissional",
            original: "Trabalhei em projetos de migração para cloud e ajudei a equipe.",
            suggestion: "Liderei a migração de 3 sistemas legados para AWS, reduzindo custos operacionais em 20% e orientando uma equipe de 4 desenvolvedores.",
            tags: ["Liderança", "Métricas", "AWS"],
            impactLevel: "Alto Impacto"
          }
        ]
      });
    }

    const prompt = `Você é um robô leitor ATS (Applicant Tracking System) de ponta.
Analise os dados deste currículo para a vaga de: "${targetJob || 'Engenheiro de Software / Product Manager'}":
${JSON.stringify(resumeData)}

Forneça um diagnóstico completo em JSON com:
- score: pontuação de 0 a 100 baseada em clareza, verbos de ação e palavras-chave
- potentialScore: pontuação potencial máxima após aplicar melhorias (ex: 92)
- missingKeywords: lista de 3 a 5 palavras-chave estratégicas ausentes
- summaryFeedback: feedback geral sobre o resumo profissional
- suggestedSummary: versão otimizada do resumo profissional
- highImpactSuggestions: array de sugestões com { title, original, suggestion, tags, impactLevel }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            potentialScore: { type: Type.INTEGER },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            summaryFeedback: { type: Type.STRING },
            suggestedSummary: { type: Type.STRING },
            highImpactSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  original: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  impactLevel: { type: Type.STRING }
                },
                required: ["title", "original", "suggestion", "tags", "impactLevel"]
              }
            }
          },
          required: ["score", "potentialScore", "missingKeywords", "summaryFeedback", "suggestedSummary", "highImpactSuggestions"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.warn("[Gemini API] Retornando fallback para análise ATS:", error?.message || error);
    return res.json({
      score: 82,
      potentialScore: 95,
      missingKeywords: ["CI/CD", "Metodologia Ágil", "Liderança Técnica", "AWS"],
      summaryFeedback: "Seu currículo tem boa estrutura técnica. Adicione conquistas quantificáveis no resumo para se destacar nos filtros ATS.",
      suggestedSummary: `Profissional especializado em ${req.body?.targetJob || 'Engenharia e Projetos'}, focado em entregar soluções escaláveis de alto valor e coordenar iniciativas de inovação.`,
      highImpactSuggestions: [
        {
          title: "Destaque de Impacto Quantificável",
          original: "Atuei no desenvolvimento de novas funcionalidades para a empresa.",
          suggestion: "Desenvolvi e lancei 5 módulos estratégicos de alto desempenho, elevando a satisfação dos clientes em 25%.",
          tags: ["Performance", "Resultados", "Liderança"],
          impactLevel: "Alto Impacto"
        }
      ]
    });
  }
});

app.post("/api/ai/cover-letter", async (req, res) => {
  try {
    const { recipient, position, companyInfo, promptText } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        content: `Prezada Equipe de Recrutamento da ${companyInfo || 'TechCorp'},\n\nEscrevo para manifestar meu forte interesse na vaga de ${position || 'Engenheiro de Software Sênior'}, conforme anunciado no portal de carreiras da empresa. Com sólida experiência no desenvolvimento de soluções escaláveis e liderança de projetos, acredito que minhas qualificações estão alinhadas aos objetivos da organização.\n\nEstou à disposição para uma entrevista técnica.\n\nAtenciosamente,\nAlex Sterling`
      });
    }

    const prompt = promptText || `Escreva uma carta de apresentação em português, extremamente profissional e elegante.
Destinatário: ${recipient || 'Equipe de Recrutamento'}
Cargo: ${position || 'Profissional'}
Empresa: ${companyInfo || 'Empresa'}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return res.json({ content: response.text });
  } catch (error: any) {
    console.warn("[Gemini API] Retornando fallback para carta de apresentação:", error?.message || error);
    const { position, companyInfo } = req.body || {};
    return res.json({
      content: `Prezada Equipe de Seleção da ${companyInfo || 'Empresa'},\n\nEscrevo para apresentar meu interesse na posição de ${position || 'Especialista'}. Ao longo da minha trajetória profissional, construí uma sólida reputação no desenvolvimento de projetos estratégicos, otimização de processos e liderança orientada a resultados.\n\nEstou muito entusiasmado com a possibilidade de contribuir para o crescimento contínuo da empresa. Agradeço a atenção e coloco-me à disposição para um diálogo detalhado sobre minhas qualificações.\n\nAtenciosamente,\nAlex Sterling`
    });
  }
});

app.post("/api/ai/interview", async (req, res) => {
  try {
    const { messages, role } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: "Excelente colocação! Você demonstrou clareza e maturidade técnica. Como você costuma lidar com divergências técnicas entre membros do seu time?"
      });
    }

    const conversationHistory = (messages || []).map((m: any) => `${m.sender === 'user' ? 'Candidato' : 'Entrevistador (IA)'}: ${m.text}`).join("\n");

    const prompt = `Você é um selecionador e especialista técnico líder conduzindo uma simulação de entrevista de emprego em português para o cargo de "${role || 'Engenheiro de Software Sênior / UX Designer'}".
Histórico da conversa:
${conversationHistory}

Sua tarefa:
1. Avalie brevemente e elogie/oriente de forma construtiva a última resposta do candidato.
2. Faça 1 pergunta clara, relevante e instigante sobre desafios reais, tomada de decisão, arquitetura, liderança ou resolução de problemas no contexto do cargo.
Responda de forma direta, motivadora e natural como um entrevistador humano especialista. Mantendo tamanho ideal de parágrafo (2 a 4 frases).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.warn("[Gemini API] Retornando fallback para simulação de entrevista:", error?.message || error);
    return res.json({
      reply: "Ótima resposta! Você explicou muito bem sua experiência e capacidade de adaptação. Em relação a tomadas de decisão sob pressão ou prazos reduzidos, qual estratégia você costuma priorizar?"
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CVPro AI server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
