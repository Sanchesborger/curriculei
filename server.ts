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
