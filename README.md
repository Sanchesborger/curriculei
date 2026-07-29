# 📄 CVPro AI - Plataforma Inteligente de Currículos e Preparação para Entrevistas

**CVPro AI** é uma aplicação web full-stack desenvolvida para ajudar profissionais a criarem currículos de alto impacto, gerarem cartas de apresentação personalizadas e treinarem para entrevistas de emprego com o auxílio de Inteligência Artificial.

---

## 🚀 Funcionalidades Principais

- 📝 **Editor de Currículos em Tempo Real**:
  - Edição intuitiva de dados pessoais, resumos profissionais, experiências de trabalho, formação acadêmica e competências.
  - Pré-visualização instantânea do currículo formatado para exportação em PDF ou impressão.

- 🤖 **Otimizador IA (Gemini API)**:
  - Análise inteligente do conteúdo do currículo com recomendações de melhorias focadas em palavras-chave e orientação a resultados.

- 🎙️ **Simulador de Entrevistas (Interview Coach)**:
  - Simulação interativa de entrevistas de emprego personalizadas de acordo com o cargo desejado.
  - Feedback construtivo em tempo real e perguntas situacionais sobre liderança, desafios técnicos e resolução de problemas.
  - Suporte a entrada por voz com transcrição integrada.

- ✉️ **Gerador de Carta de Apresentação (Cover Letter)**:
  - Geração automatizada de cartas de apresentação atraentes e personalizadas para vagas específicas.

- ⚙️ **Painel de Configurações & Personalização**:
  - Opções de notificações personalizadas para atualização de currículo e dicas de carreira.
  - **Suporte a Dark Mode (Modo Escuro)** dinâmico e persistente.
  - Configurações de privacidade e histórico de ações efetuadas na plataforma.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Animações & Ícones**: [Motion](https://motion.dev/), [Lucide React](https://lucide.dev/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Inteligência Artificial**: [Google Gen AI SDK (@google/genai)](https://www.npmjs.com/package/@google/genai)
- **Bundler & Tooling**: [Vite](https://vitejs.dev/), [esbuild](https://esbuild.github.io/), [tsx](https://github.com/privatenumber/tsx)

---

## 📦 Estrutura do Projeto

```text
.
├── supabase/
│   └── schema.sql            # Script SQL completo para criação de tabelas e RLS no Supabase
├── server.ts                 # Servidor Express com rotas de API e integrações com o Gemini AI
├── src/
│   ├── App.tsx               # Componente principal e gerenciamento de rotas/telas
│   ├── main.tsx              # Ponto de entrada do React
│   ├── index.css             # Estilos globais e configuração de temas (Tailwind CSS)
│   ├── types.ts              # Definições de tipos TypeScript compartilhadas
│   └── components/
│       ├── HomeScreen.tsx        # Tela inicial com atalhos rápidos e status de currículos
│       ├── ResumesScreen.tsx     # Gerenciamento de currículos salvos e estado vazio
│       ├── EditorScreen.tsx      # Editor interativo de currículos
│       ├── PreviewScreen.tsx     # Visualização e exportação em PDF
│       ├── InterviewScreen.tsx   # Simulador interativo de entrevistas com IA e voz
│       ├── AIOptimizeScreen.tsx  # Otimizador de currículos com IA
│       ├── CoverLetterScreen.tsx # Gerador de cartas de apresentação
│       ├── ProfileScreen.tsx     # Perfil do usuário e painel de Configurações
│       ├── Header.tsx            # Barra de navegação superior
│       ├── Sidebar.tsx           # Menu de navegação lateral
│       └── BottomNav.tsx         # Barra de navegação inferior mobile
├── package.json
└── README.md
```

---

## ⚙️ Configuração e Instalação

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/cvpro-ai.git
cd cvpro-ai
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto (ou edite o `.env.example`):
```env
GEMINI_API_KEY=sua_chave_api_da_gemini_aqui
```

### 4. Configuração do Banco de Dados no Supabase
1. Crie um projeto no [Supabase](https://supabase.com/).
2. Vá no **SQL Editor** do Supabase.
3. Copie todo o conteúdo do arquivo `supabase/schema.sql`.
4. Cole no editor do Supabase e clique em **Run**.

### 5. Executar em modo de desenvolvimento
```bash
npm run dev
```
O aplicativo estará disponível em `http://localhost:3000`.

---

## 🏗️ Build e Produção

Para gerar a build compilada de produção:

```bash
npm run build
```

Para iniciar o servidor de produção:

```bash
npm run start
```

---

## 📱 Verificação e Teste do PWA (Service Worker & Manifest)

Para testar se o Progressive Web App (PWA) está configurado e funcionando corretamente no seu navegador:

### 1. Verificar o Web App Manifest (`manifest.json`)
1. Abra a aplicação no navegador e acesse as **Ferramentas do Desenvolvedor** (`F12` ou `Ctrl+Shift+I` / `Cmd+Option+I`).
2. Vá para a aba **Application** (em português: *Aplicação*).
3. No menu lateral esquerdo, sob a seção **Application**, clique em **Manifest**.
4. Confirme que os dados do app foram reconhecidos:
   - **Name**: `CVPro AI - Gerador de Currículos Inteligente`
   - **Start URL**: `/`
   - **Theme color**: `#2563eb`
   - **Icons**: Presença dos ícones de `192x192` e `512x512`.

### 2. Verificar e Testar o Service Worker (`sw.js`)
1. Na mesma aba **Application** do DevTools, clique em **Service Workers** no menu lateral.
2. Certifique-se de que o Service Worker do arquivo `/sw.js` exibe o status **Activated and is running** (Ativado e em execução).
3. **Teste de Log no Console**: Na aba **Console**, procure pela mensagem de confirmação:
   `PWA Service Worker registrado com sucesso: https://...`
4. **Teste de Suporte Offline**: Marque a caixa de seleção **Offline** em **Service Workers** e recarregue a página para comprovar que o app carrega os recursos em cache mesmo sem conexão.

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Sinta-se à vontade para utilizar, modificar e contribuir!
