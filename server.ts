import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));
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
    console.error("Error searching jobs with Gemini:", error);
    const targetRole = req.body?.role || "Engenheiro de Software";
    const targetLocation = req.body?.location || "Brasil / Remoto";
    return res.json({
      queryUsed: `${targetRole} vagas ${targetLocation}`,
      totalResultsCount: 3,
      locationFilter: targetLocation,
      jobs: [
        {
          id: "job-fallback-1",
          title: `${targetRole} Sênior`,
          company: "Empresa em Expansão",
          location: targetLocation,
          type: "Remoto",
          salary: "Faixa de mercado competitiva",
          postedDate: "Recente",
          description: `Oportunidade para atuar como ${targetRole}. Procuramos candidato proativo com foco em inovação e boas práticas de desenvolvimento.`,
          skillsRequired: ["Comunicação", "Resolução de Problemas", "Liderança Técnica"],
          matchPercentage: 90,
          url: "https://www.google.com/search?q=" + encodeURIComponent(`${targetRole} vagas ${targetLocation}`),
          source: "Google Jobs"
        }
      ],
      marketInsights: `A vaga de ${targetRole} apresenta excelente demanda no mercado. Dica: personalize seu resumo profissional e destaque conquistas quantificáveis.`
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
    console.error("Error optimizing text:", error);
    return res.status(500).json({ error: error.message || "Erro ao otimizar texto com IA" });
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
    console.error("Error generating ATS analysis:", error);
    return res.status(500).json({ error: error.message || "Erro na análise ATS" });
  }
});

app.post("/api/ai/cover-letter", async (req, res) => {
  try {
    const { recipient, position, companyInfo, promptText } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        content: `Prezada Equipe de Recrutamento da ${companyInfo || 'TechCorp'},\n\nEscrevo para manifestar meu forte interesse na vaga de ${position || 'Engenheiro de Software Sênior'}, conforme anunciado no portal de carreiras da empresa. Com mais de 8 anos de experiência no desenvolvimento de soluções escaláveis em nuvem e liderança técnica de equipes ágeis, acredito que minhas habilidades estão perfeitamente alinhadas com as necessidades de inovação contínua da TechCorp.\n\nEm minha posição anterior na DataFlow Systems, liderei a migração de um sistema monolítico legado para uma arquitetura de microserviços baseada em Kubernetes, resultando em uma redução de 40% nos custos de infraestrutura e melhorando o tempo de atividade do sistema para 99,99%. Além do impacto técnico, dediquei-me a mentorar engenheiros juniores, estabelecendo uma cultura de revisão de código rigorosa e colaborativa.\n\nAdmiro profundamente o compromisso da TechCorp com o desenvolvimento de produtos centrados no usuário e a recente expansão para soluções baseadas em inteligência artificial. Estou entusiasmado com a oportunidade de contribuir com minha expertise em sistemas distribuídos e minha paixão por resolver problemas complexos para impulsionar a próxima geração de produtos de vocês.\n\nAgradeço antecipadamente pelo tempo e consideração dedicados à análise do meu currículo, em anexo. Estou à disposição para uma entrevista, onde poderei detalhar como minhas experiências passadas podem agregar valor imediato à equipe.\n\nAtenciosamente,\nAlex Sterling`
      });
    }

    const prompt = promptText || `Escreva uma carta de apresentação em português, extremamente profissional e elegante.
Destinatário: ${recipient || 'Equipe de Recrutamento da TechCorp'}
Cargo: ${position || 'Engenheiro de Software Sênior'}
Empresa: ${companyInfo || 'TechCorp'}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return res.json({ content: response.text });
  } catch (error: any) {
    console.error("Error generating cover letter:", error);
    return res.status(500).json({ error: error.message || "Erro ao gerar carta de apresentação" });
  }
});

app.post("/api/ai/interview", async (req, res) => {
  try {
    const { messages, role } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: "Ótima resposta! Demonstrou boa capacidade técnica e orientação a resultados. Para se destacar ainda mais, que tal citar como mediu o sucesso dessa iniciativa através de métricas de usuário ou de negócios?"
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
    console.error("Error in interview simulation:", error);
    return res.status(500).json({ error: error.message || "Erro no simulador de entrevista" });
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

startServer();
