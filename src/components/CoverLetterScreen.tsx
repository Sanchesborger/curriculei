import React, { useState } from 'react';
import { CoverLetterData, UserProfile } from '../types';
import { sampleCoverLetter } from '../data';
import { 
  Wand2, 
  Copy, 
  Download, 
  Send, 
  Sparkles, 
  Building2, 
  User, 
  Briefcase,
  Check
} from 'lucide-react';

interface CoverLetterScreenProps {
  user: UserProfile;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const CoverLetterScreen: React.FC<CoverLetterScreenProps> = ({ user, onShowToast }) => {
  const [data, setData] = useState<CoverLetterData>(sampleCoverLetter);
  const [recipient, setRecipient] = useState('Equipe de Recrutamento');
  const [position, setPosition] = useState('Engenheiro de Software Sênior');
  const [company, setCompany] = useState('TechCorp');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateAI = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient,
          position,
          companyInfo: company,
          candidateInfo: {
            name: user.name,
            role: user.role
          }
        })
      });
      const result = await res.json();
      if (result.content) {
        setData({
          ...data,
          content: result.content,
          recipient,
          position,
          company
        });
        onShowToast('Carta de apresentação gerada com sucesso pela IA!');
      }
    } catch (err) {
      console.error(err);
      onShowToast('Erro ao gerar carta com IA.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.content);
    onShowToast('Texto copiado para a área de transferência!');
  };

  const handleDownload = () => {
    onShowToast('Gerando PDF da Carta de Apresentação...');
    setTimeout(() => {
      window.print();
    }, 800);
  };

  return (
    <main className="pt-6 md:pt-8 pb-28 px-4 md:px-8 max-w-4xl mx-auto flex flex-col gap-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#191c1e]">Carta de Apresentação</h1>
          <p className="text-sm text-[#434655] mt-1">
            Gere cartas impactantes e personalizadas para cada vaga com auxílio da IA.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="bg-white border border-[#c3c6d7] text-[#191c1e] hover:bg-[#f2f4f6] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Copiar</span>
          </button>

          <button
            onClick={handleDownload}
            className="bg-[#004ac6] hover:bg-[#2563eb] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Target Details Form */}
      <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/50 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#434655] uppercase">Empresa Alvo</label>
          <div className="relative">
            <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]" />
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-[#c3c6d7] text-xs font-semibold text-[#191c1e]"
              placeholder="Ex: Google, Nubank..."
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#434655] uppercase">Cargo Alvo</label>
          <div className="relative">
            <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]" />
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-[#c3c6d7] text-xs font-semibold text-[#191c1e]"
              placeholder="Ex: Product Manager"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#434655] uppercase">Destinatário</label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#737686]" />
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-[#c3c6d7] text-xs font-semibold text-[#191c1e]"
              placeholder="Ex: Equipe de RH"
            />
          </div>
        </div>
      </div>

      {/* Editor & Floating AI Button */}
      <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/50 shadow-sm relative flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-[#e0e3e5] pb-3">
          <span className="text-xs font-bold uppercase text-[#737686]">Conteúdo da Carta</span>
          
          <button
            onClick={handleGenerateAI}
            disabled={isLoading}
            className="bg-[#2563eb] hover:bg-[#004ac6] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Gerando com IA...' : 'Reescrever com IA'}</span>
          </button>
        </div>

        <textarea
          rows={14}
          value={data.content}
          onChange={(e) => setData({ ...data, content: e.target.value })}
          className="w-full p-4 rounded-xl border border-[#c3c6d7] text-sm text-[#191c1e] leading-relaxed focus:outline-none focus:border-[#2563eb] font-sans"
        />
      </div>

    </main>
  );
};
