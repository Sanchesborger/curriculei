import React, { useState } from 'react';
import { ResumeData } from '../types';
import { 
  Sparkles, 
  Camera, 
  Image as ImageIcon, 
  Wand2, 
  Check, 
  RefreshCw, 
  X, 
  User, 
  Sliders, 
  Download,
  Palette,
  Briefcase,
  Layers,
  Upload,
  Trash2,
  Eye
} from 'lucide-react';

interface ImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  onUpdateResume: (updated: ResumeData) => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({
  isOpen,
  onClose,
  resume,
  onUpdateResume,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'avatar' | 'cover'>('avatar');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Avatar Generator State
  const [avatarVibe, setAvatarVibe] = useState<string>('Corporativo Executivo');
  const [avatarBg, setAvatarBg] = useState<string>('Estúdio Neutro Suave');
  const [avatarAttire, setAvatarAttire] = useState<string>('Terno / Blazer');
  const [avatarGender, setAvatarGender] = useState<string>('neutro');
  const [generatedAvatarUrl, setGeneratedAvatarUrl] = useState<string>(
    resume.personalData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  );
  const [avatarPromptDesc, setAvatarPromptDesc] = useState<string>('');

  // Cover Generator State
  const [coverStyle, setCoverStyle] = useState<string>('Minimalista Geométrico');
  const [coverColor, setCoverColor] = useState<string>('Azul Corporativo');
  const [generatedCoverUrl, setGeneratedCoverUrl] = useState<string>(
    resume.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  );

  if (!isOpen) return null;

  // Preset Avatars
  const presetAvatars = [
    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', label: 'Executiva' },
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', label: 'Executivo' },
    { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', label: 'Tech Lead' },
    { url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80', label: 'Diretor' },
    { url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80', label: 'Designer' },
    { url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80', label: 'Consultor' }
  ];

  // Preset Covers
  const presetCovers = [
    { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', label: 'Onda Azul Tech' },
    { url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80', label: 'Gradiente Moderno' },
    { url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80', label: 'Corporativo Púrpura' },
    { url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80', label: 'Geométrico Escuro' },
    { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', label: 'Minimalista Neutro' }
  ];

  // Handle Generate Avatar with AI
  const handleGenerateAvatar = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/generate-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: resume.personalData.fullName,
          role: resume.personalData.title,
          genderStyle: avatarGender,
          backgroundStyle: avatarBg,
          professionalVibe: avatarVibe,
          attire: avatarAttire,
          seed: Math.floor(Math.random() * 99999)
        })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedAvatarUrl(data.imageUrl);
        setAvatarPromptDesc(data.promptDescription || '');
        onShowToast('Avatar profissional gerado com sucesso!', 'success');
      }
    } catch (err) {
      console.error(err);
      onShowToast('Erro ao gerar avatar. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Generate Cover with AI
  const handleGenerateCover = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/generate-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: resume.personalData.title,
          themeColor: coverColor,
          style: coverStyle,
          seed: Math.floor(Math.random() * 99999)
        })
      });
      const data = await res.json();
      if (data.coverUrl) {
        setGeneratedCoverUrl(data.coverUrl);
        onShowToast('Capa de currículo gerada com sucesso!', 'success');
      }
    } catch (err) {
      console.error(err);
      onShowToast('Erro ao gerar capa.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply Selected Avatar to Resume
  const handleApplyAvatar = () => {
    onUpdateResume({
      ...resume,
      personalData: {
        ...resume.personalData,
        avatarUrl: generatedAvatarUrl
      }
    });
    onShowToast('Avatar retocado e aplicado ao currículo!', 'success');
    onClose();
  };

  // Remove Avatar from Resume
  const handleRemoveAvatar = () => {
    onUpdateResume({
      ...resume,
      personalData: {
        ...resume.personalData,
        avatarUrl: undefined
      }
    });
    onShowToast('Foto removida do currículo.');
  };

  // Apply Selected Cover to Resume
  const handleApplyCover = () => {
    onUpdateResume({
      ...resume,
      coverImage: generatedCoverUrl
    });
    onShowToast('Capa personalizada aplicada ao topo do currículo!', 'success');
    onClose();
  };

  // Remove Cover from Resume
  const handleRemoveCover = () => {
    onUpdateResume({
      ...resume,
      coverImage: undefined
    });
    onShowToast('Capa do currículo removida.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#c3c6d7]/50 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 md:p-6 bg-[#004ac6] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl">
              <Sparkles className="w-6 h-6 text-[#93c5fd]" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-extrabold tracking-tight">Estúdio Visual de IA (Imagens)</h2>
              <p className="text-xs text-blue-100">Gere fotos de perfil corporativo ou capas elegantes para destacar seu currículo.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/15 rounded-xl transition-colors cursor-pointer text-white"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex border-b border-[#e0e3e5] bg-[#f8fafc] px-6">
          <button
            onClick={() => setActiveTab('avatar')}
            className={`py-3.5 px-5 text-xs font-extrabold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'avatar'
                ? 'border-[#004ac6] text-[#004ac6] bg-white'
                : 'border-transparent text-[#737686] hover:text-[#191c1e]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Avatar Profissional (IA)</span>
          </button>
          <button
            onClick={() => setActiveTab('cover')}
            className={`py-3.5 px-5 text-xs font-extrabold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cover'
                ? 'border-[#004ac6] text-[#004ac6] bg-white'
                : 'border-transparent text-[#737686] hover:text-[#191c1e]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Capa do Currículo (IA)</span>
          </button>
        </div>

        {/* Studio Content Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          
          {/* TAB 1: AVATAR STUDIO */}
          {activeTab === 'avatar' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Preview Box */}
                <div className="md:col-span-5 flex flex-col items-center gap-3 bg-[#f8fafc] p-6 rounded-2xl border border-[#e2e8f0]">
                  <div className="relative group">
                    <img
                      src={generatedAvatarUrl}
                      alt="Avatar Profissional Gerado"
                      referrerPolicy="no-referrer"
                      className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md transition-all group-hover:scale-105"
                    />
                    <div className="absolute bottom-1 right-1 bg-[#004ac6] text-white p-2 rounded-full shadow-md">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="font-extrabold text-sm text-[#191c1e]">
                      {resume.personalData.fullName || 'Seu Nome'}
                    </p>
                    <p className="text-xs text-[#004ac6] font-semibold">
                      {resume.personalData.title || 'Cargo Profissional'}
                    </p>
                  </div>

                  {avatarPromptDesc && (
                    <p className="text-[11px] text-[#434655] italic text-center bg-white p-2.5 rounded-xl border border-[#e0e3e5]">
                      "{avatarPromptDesc}"
                    </p>
                  )}

                  <div className="flex items-center gap-2 w-full pt-2">
                    <button
                      type="button"
                      onClick={handleApplyAvatar}
                      className="flex-1 bg-[#004ac6] hover:bg-[#2563eb] text-white py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Aplicar Foto</span>
                    </button>
                    {resume.personalData.avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="bg-[#ffdad6] hover:bg-[#ba1a1a] text-[#ba1a1a] hover:text-white p-2.5 rounded-xl transition-all cursor-pointer"
                        title="Remover Foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Configuration Controls */}
                <div className="md:col-span-7 flex flex-col gap-4">
                  <h3 className="font-bold text-sm text-[#191c1e] flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#004ac6]" />
                    <span>Ajustar Parâmetros do Retrato Profissional</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                    <div>
                      <label className="text-[#434655] uppercase text-[10px] block mb-1">Estilo Profissional</label>
                      <select
                        value={avatarVibe}
                        onChange={(e) => setAvatarVibe(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#c3c6d7] text-sm text-[#191c1e] bg-white focus:outline-none focus:border-[#2563eb]"
                      >
                        <option value="Corporativo Executivo">Corporativo Executivo</option>
                        <option value="Tech & Inovação">Tech & Inovação</option>
                        <option value="Criativo & Designer">Criativo & Designer</option>
                        <option value="Direito & Consultoria">Direito & Consultoria</option>
                        <option value="Saúde & Ciências">Saúde & Ciências</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#434655] uppercase text-[10px] block mb-1">Fundo da Foto</label>
                      <select
                        value={avatarBg}
                        onChange={(e) => setAvatarBg(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#c3c6d7] text-sm text-[#191c1e] bg-white focus:outline-none focus:border-[#2563eb]"
                      >
                        <option value="Estúdio Neutro Suave">Estúdio Neutro Suave</option>
                        <option value="Escritório Desfocado (Bokeh)">Escritório Desfocado</option>
                        <option value="Gradiente Azul Corporativo">Gradiente Azul</option>
                        <option value="Cinza Minimalista Studio">Cinza Minimalista</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#434655] uppercase text-[10px] block mb-1">Traje & Vestuário</label>
                      <select
                        value={avatarAttire}
                        onChange={(e) => setAvatarAttire(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#c3c6d7] text-sm text-[#191c1e] bg-white focus:outline-none focus:border-[#2563eb]"
                      >
                        <option value="Terno / Blazer">Terno / Blazer</option>
                        <option value="Camisa Social Clean">Camisa Social Clean</option>
                        <option value="Casual Elegante Tech">Casual Elegante Tech</option>
                        <option value="Blazer Minimalista">Blazer Minimalista</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#434655] uppercase text-[10px] block mb-1">Perfil / Apresentação</label>
                      <select
                        value={avatarGender}
                        onChange={(e) => setAvatarGender(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#c3c6d7] text-sm text-[#191c1e] bg-white focus:outline-none focus:border-[#2563eb]"
                      >
                        <option value="feminino">Feminino</option>
                        <option value="masculino">Masculino</option>
                        <option value="neutro">Neutro / Ilustrado</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateAvatar}
                    disabled={isLoading}
                    className="mt-2 w-full bg-[#004ac6] hover:bg-[#2563eb] text-white py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Wand2 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>{isLoading ? 'Gerando Avatar...' : 'Gerar Novo Avatar com IA'}</span>
                  </button>
                </div>
              </div>

              {/* Preset Gallery */}
              <div className="flex flex-col gap-3 pt-2 border-t border-[#f2f4f6]">
                <span className="text-xs font-bold text-[#434655] uppercase">
                  Galeria de Estilos Rápidos (Clique para selecionar)
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {presetAvatars.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setGeneratedAvatarUrl(item.url)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all cursor-pointer hover:border-[#004ac6] ${
                        generatedAvatarUrl === item.url ? 'border-[#004ac6] bg-[#004ac6]/5 ring-2 ring-[#004ac6]/20' : 'border-[#e2e8f0]'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.label}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover shadow-xs"
                      />
                      <span className="text-[10px] font-bold text-[#434655] truncate max-w-full">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COVER STUDIO */}
          {activeTab === 'cover' && (
            <div className="flex flex-col gap-6">
              {/* Cover Preview */}
              <div className="flex flex-col gap-3 bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0]">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[#434655] uppercase">Prévia do Cabeçalho de Capa</span>
                  {resume.coverImage && (
                    <button
                      onClick={handleRemoveCover}
                      className="text-[#ba1a1a] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover Capa Ativa</span>
                    </button>
                  )}
                </div>

                <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-[#c3c6d7] shadow-sm group">
                  <img
                    src={generatedCoverUrl}
                    alt="Capa do Currículo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                    <p className="font-extrabold text-base leading-tight drop-shadow-sm">
                      {resume.personalData.fullName || 'Seu Nome no Currículo'}
                    </p>
                    <p className="text-xs font-medium text-blue-200">
                      {resume.personalData.title || 'Cargo em Destaque'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleApplyCover}
                    className="bg-[#004ac6] hover:bg-[#2563eb] text-white py-2.5 px-5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Aplicar Capa no Currículo</span>
                  </button>
                </div>
              </div>

              {/* Cover Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#434655] uppercase text-[10px] font-bold block mb-1">
                    Estilo Artístico da Capa
                  </label>
                  <select
                    value={coverStyle}
                    onChange={(e) => setCoverStyle(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#c3c6d7] text-sm text-[#191c1e] bg-white focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="Minimalista Geométrico">Minimalista Geométrico</option>
                    <option value="Gradiente Fluido Tech">Gradiente Fluido Tech</option>
                    <option value="Textura Mármore Luxo">Textura Mármore Luxo</option>
                    <option value="Dark Mode Neon Lines">Dark Mode Neon Lines</option>
                    <option value="Abstrato Executivo">Abstrato Executivo</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#434655] uppercase text-[10px] font-bold block mb-1">
                    Tom de Cor Principal
                  </label>
                  <select
                    value={coverColor}
                    onChange={(e) => setCoverColor(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#c3c6d7] text-sm text-[#191c1e] bg-white focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="Azul Corporativo">Azul Corporativo</option>
                    <option value="Púrpura Criativo">Púrpura Criativo</option>
                    <option value="Esmeralda & Verde">Esmeralda & Verde</option>
                    <option value="Grafite & Ouro">Grafite & Ouro</option>
                    <option value="Coral Dinâmico">Coral Dinâmico</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateCover}
                disabled={isLoading}
                className="w-full bg-[#004ac6] hover:bg-[#2563eb] text-white py-3.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Wand2 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Gerando Capa...' : 'Gerar Nova Capa com IA'}</span>
              </button>

              {/* Cover Presets */}
              <div className="flex flex-col gap-3 pt-2 border-t border-[#f2f4f6]">
                <span className="text-xs font-bold text-[#434655] uppercase">
                  Capas Recomendadas para Seleção Direta
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {presetCovers.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setGeneratedCoverUrl(item.url)}
                      className={`flex flex-col rounded-xl overflow-hidden border transition-all cursor-pointer hover:opacity-90 ${
                        generatedCoverUrl === item.url ? 'border-2 border-[#004ac6] ring-2 ring-[#004ac6]/20' : 'border-[#e2e8f0]'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-16 object-cover"
                      />
                      <span className="p-1.5 text-[10px] font-bold text-[#434655] bg-white truncate text-center">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
