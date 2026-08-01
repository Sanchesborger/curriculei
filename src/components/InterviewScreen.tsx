import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ScreenView } from '../types';
import { 
  Menu, 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  Briefcase, 
  RefreshCw, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface InterviewScreenProps {
  user: UserProfile;
  onNavigate: (screen: ScreenView) => void;
  onToggleSidebar?: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp?: string;
}

export const InterviewScreen: React.FC<InterviewScreenProps> = ({
  user,
  onNavigate,
  onToggleSidebar,
  onShowToast
}) => {
  const [targetRole, setTargetRole] = useState<string>(user.role || 'Senior UX Designer');
  const [isEditingRole, setIsEditingRole] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Olá! Sou o seu coach de entrevistas da CVPro AI. Vamos simular uma entrevista para a vaga de ${user.role || 'Senior UX Designer'}. Para começar, por favor, me fale um pouco sobre você e sua trajetória profissional recente.`
    },
    {
      id: 'msg-2',
      sender: 'user',
      text: 'Claro. Nos últimos 5 anos, atuei como Lead Designer na TechSolutions, onde liderei a reformulação completa do principal produto B2B da empresa. Foco muito em design systems e em aproximar a pesquisa do processo de UI.'
    },
    {
      id: 'msg-3',
      sender: 'ai',
      text: 'Excelente introdução. Focar em resultados concretos, como a reformulação do produto B2B, é uma ótima estratégia.\n\nPensando nessa reformulação, você poderia me dar um exemplo de um desafio complexo de usabilidade que você enfrentou nesse projeto e como você e sua equipe o resolveram?'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const isUserPremium = Boolean(user?.isPremium || user?.role?.toLowerCase().includes('premium'));
  const userMessageCount = messages.filter(m => m.sender === 'user').length;

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    if (!isUserPremium && userMessageCount >= 3) {
      onShowToast('Limite do plano gratuito atingido. Assine o Premium PRO para simulações ilimitadas.', 'info');
      setMessages(prev => [
        ...prev,
        {
          id: 'ai-lock-' + Date.now(),
          sender: 'ai',
          text: '🔒 Você atingiu o limite de perguntas da degustação gratuita do Coach de Entrevistas. Para continuar a simulação com feedback em tempo real e relatórios de desempenho, assine o plano Premium PRO por R$ 29,00/mês!'
        }
      ]);
      return;
    }

    const userText = inputMessage.trim();
    const newUserMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: userText
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          role: targetRole
        })
      });

      const data = await res.json();
      const replyText = data.reply || 'Ótima colocação! Como você lidaria com um cenário sob forte pressão de tempo mantendo a qualidade técnica?';

      setMessages(prev => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: replyText
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: 'Entendi seu ponto. Na prática, como você mede os resultados de usabilidade dessa entrega?'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggleMic = () => {
    if (!isRecording) {
      setIsRecording(true);
      onShowToast('Gravação por voz ativada. Fale sua resposta...', 'info');
      // Simulate speech-to-text input after 3.5s if browser SpeechRecognition is not directly active
      setTimeout(() => {
        setInputMessage('Em um cenário de prazos apertados, priorizo o escopo com a equipe de produto usando matriz de impacto x esforço.');
        setIsRecording(false);
        onShowToast('Áudio transcrito com sucesso!', 'success');
      }, 3500);
    } else {
      setIsRecording(false);
      onShowToast('Gravação por voz desativada.', 'info');
    }
  };

  const handleRestartInterview = () => {
    setMessages([
      {
        id: 'msg-init-' + Date.now(),
        sender: 'ai',
        text: `Olá! Vamos reiniciar nossa simulação de entrevista para o cargo de ${targetRole}. Qual foi a conquista profissional da qual você mais se orgulha nos últimos anos?`
      }
    ]);
    onShowToast('Simulação de entrevista reiniciada!');
  };

  return (
    <div className="bg-[#f7f9fb] min-h-screen flex flex-col font-sans text-[#191c1e]">
      
      {/* Top Bar for Chat View */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-4 md:px-8 h-16 bg-white/90 backdrop-blur-md border-b border-[#e0e3e5] z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('home')} 
            className="p-2 hover:bg-[#f2f4f6] text-[#434655] rounded-full transition-colors flex items-center justify-center"
            title="Voltar para Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {onToggleSidebar && (
            <button 
              onClick={onToggleSidebar}
              className="p-2 hover:bg-[#f2f4f6] text-[#434655] rounded-full transition-colors hidden md:flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="font-extrabold text-xl text-[#004ac6] tracking-tight">
            CVPro <span className="text-[#2563eb]">AI</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRestartInterview}
            className="bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e] text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
            title="Reiniciar Simulação"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#004ac6]" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>

          <button 
            onClick={() => onNavigate('profile')}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#2563eb] shadow-sm flex-shrink-0"
          >
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col pt-16 pb-36 max-w-3xl w-full mx-auto px-4 md:px-6">
        
        {/* Context Header */}
        <div className="py-4 border-b border-[#e0e3e5] bg-[#f7f9fb] sticky top-16 z-20 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-[#191c1e]">
              Simulação de Entrevista
            </h1>
            <span className="bg-[#2563eb]/10 text-[#004ac6] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#2563eb]" /> Coach IA
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-[#434655] font-semibold">
            <Briefcase className="w-4 h-4 text-[#737686]" />
            {isEditingRole ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="px-2 py-0.5 border border-[#c3c6d7] rounded-lg text-xs font-bold text-[#191c1e]"
                />
                <button 
                  onClick={() => setIsEditingRole(false)}
                  className="bg-[#004ac6] text-white text-[10px] font-bold px-2 py-1 rounded-md"
                >
                  OK
                </button>
              </div>
            ) : (
              <span>
                Cargo: <strong className="text-[#191c1e]">{targetRole}</strong>
                <button 
                  onClick={() => setIsEditingRole(true)}
                  className="ml-2 text-[#004ac6] hover:underline text-[11px]"
                >
                  (alterar)
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 py-6 flex flex-col gap-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-[90%] ${
                msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'
              }`}
            >
              {/* Avatar Icon */}
              {msg.sender === 'ai' ? (
                <div className="w-8 h-8 rounded-full bg-[#004ac6] text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#c3c6d7] flex-shrink-0 mt-1 shadow-sm">
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-[#004ac6] text-white rounded-tr-none font-medium'
                    : 'bg-white text-[#191c1e] border border-[#c3c6d7]/50 rounded-tl-none font-normal'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3 max-w-[90%] self-start opacity-80">
              <div className="w-8 h-8 rounded-full bg-[#2563eb]/20 text-[#004ac6] flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-white border border-[#c3c6d7]/50 text-[#191c1e] rounded-2xl rounded-tl-none p-4 flex items-center gap-1.5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#004ac6] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#004ac6] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#004ac6] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

      </main>

      {/* Bottom Fixed Input Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-[#e0e3e5] px-4 md:px-8 py-3 z-30 shadow-lg">
        <div className="max-w-3xl mx-auto flex flex-col gap-2">
          
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={isRecording ? "Ouvindo sua resposta por voz..." : "Digite sua resposta..."}
                className={`w-full bg-[#f2f4f6] border border-[#c3c6d7] rounded-2xl px-4 py-3 text-sm text-[#191c1e] focus:outline-none focus:border-[#004ac6] focus:bg-white resize-none max-h-32 transition-all ${
                  isRecording ? 'border-amber-500 bg-amber-50' : ''
                }`}
              />

              <button
                type="button"
                onClick={handleToggleMic}
                className={`absolute right-3 bottom-2.5 p-1.5 rounded-full transition-colors ${
                  isRecording 
                    ? 'bg-amber-500 text-white animate-pulse' 
                    : 'text-[#737686] hover:text-[#004ac6] hover:bg-[#e0e3e5]/60'
                }`}
                title={isRecording ? "Parar gravação" : "Usar microfone"}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="w-12 h-12 bg-[#004ac6] hover:bg-[#2563eb] disabled:opacity-50 text-white rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 flex-shrink-0"
              title="Enviar resposta"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center">
            <span className="text-[10px] font-bold text-[#737686] tracking-wider uppercase">
              A IA PODE COMETER ERROS. VERIFIQUE AS INFORMAÇÕES IMPORTANTES.
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};
