import React, { useState } from 'react';
import { ResumeData, TemplateItem } from '../types';
import { sampleTemplates } from '../data';
import { 
  Download, 
  Printer, 
  Share2, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe
} from 'lucide-react';

interface PreviewScreenProps {
  resume: ResumeData;
  onNavigateToEditor: () => void;
  onNavigateToAIOptimize: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({
  resume,
  onNavigateToEditor,
  onNavigateToAIOptimize,
  onShowToast
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(resume.templateId || 'moderno');
  const [zoom, setZoom] = useState<number>(100);

  const handlePrintOrDownload = () => {
    onShowToast('Iniciando geração do PDF profissional...');
    setTimeout(() => {
      window.print();
    }, 800);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    onShowToast('Link de compartilhamento copiado!');
  };

  return (
    <main className="pt-6 md:pt-8 pb-24 px-4 md:px-8 max-w-5xl mx-auto flex flex-col gap-6 font-sans">
      
      {/* Top Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-[#c3c6d7]/50 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToEditor}
            className="p-2 text-[#434655] hover:text-[#2563eb] hover:bg-[#f2f4f6] rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg text-[#191c1e]">{resume.title}</h1>
            <p className="text-xs text-[#737686]">Pré-visualização da impressão PDF</p>
          </div>
        </div>

        {/* Template Selector & Zoom */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="h-10 px-3 rounded-xl border border-[#c3c6d7] text-xs font-bold text-[#191c1e] bg-white focus:outline-none focus:border-[#2563eb]"
          >
            {sampleTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                Modelo: {t.name}
              </option>
            ))}
          </select>

          <div className="flex items-center border border-[#c3c6d7] rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => setZoom(Math.max(70, zoom - 10))}
              aria-label="Diminuir zoom"
              className="p-2 hover:bg-[#f2f4f6] text-[#434655]"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold px-2 text-[#191c1e]">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(130, zoom + 10))}
              aria-label="Aumentar zoom"
              className="p-2 hover:bg-[#f2f4f6] text-[#434655]"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onNavigateToAIOptimize}
            className="bg-[#2563eb]/10 text-[#004ac6] hover:bg-[#2563eb]/20 h-10 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#2563eb]" />
            <span>Score ATS</span>
          </button>

          <button
            onClick={handleShare}
            aria-label="Compartilhar"
            className="bg-white border border-[#c3c6d7] text-[#191c1e] hover:bg-[#f2f4f6] h-10 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrintOrDownload}
            className="bg-[#004ac6] hover:bg-[#2563eb] text-white h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* A4 Document Paper Canvas */}
      <div className="w-full flex justify-center overflow-x-auto p-2">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="w-[210mm] min-h-[297mm] bg-white shadow-2xl rounded-sm p-[18mm] font-sans text-[#191c1e] border border-[#c3c6d7]/30 transition-transform duration-200 print:shadow-none print:m-0 print:border-none"
        >
          {/* Header of CV */}
          <div className="border-b-2 border-[#2563eb] pb-5 mb-6">
            <h1 className="text-3xl font-extrabold text-[#004ac6] tracking-tight uppercase">
              {resume.personalData.fullName}
            </h1>
            <p className="text-lg font-semibold text-[#191c1e] mt-1">
              {resume.personalData.title}
            </p>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-xs text-[#434655]">
              {resume.personalData.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#2563eb]" /> {resume.personalData.email}
                </span>
              )}
              {resume.personalData.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#2563eb]" /> {resume.personalData.phone}
                </span>
              )}
              {resume.personalData.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#2563eb]" /> {resume.personalData.location}
                </span>
              )}
              {resume.personalData.linkedin && (
                <span className="flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5 text-[#2563eb]" /> {resume.personalData.linkedin}
                </span>
              )}
            </div>
          </div>

          {/* Resumo Profissional */}
          {resume.summary && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#004ac6] border-b border-[#e0e3e5] pb-1 mb-2">
                Resumo Profissional
              </h2>
              <p className="text-xs leading-relaxed text-[#191c1e]">
                {resume.summary}
              </p>
            </div>
          )}

          {/* Experiência Profissional */}
          {resume.experiences && resume.experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#004ac6] border-b border-[#e0e3e5] pb-1 mb-3">
                Experiência Profissional
              </h2>
              <div className="space-y-4">
                {resume.experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-bold text-[#191c1e]">
                        {exp.role} <span className="font-normal text-[#434655]">| {exp.company}</span>
                      </h3>
                      <span className="text-[11px] font-semibold text-[#737686]">{exp.period}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#434655] mt-1">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formação Acadêmica */}
          {resume.education && resume.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#004ac6] border-b border-[#e0e3e5] pb-1 mb-3">
                Formação Acadêmica
              </h2>
              <div className="space-y-3">
                {resume.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <h3 className="text-xs font-bold text-[#191c1e]">{edu.degree}</h3>
                      <p className="text-[11px] text-[#434655]">{edu.institution}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-[#737686]">{edu.period}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Habilidades */}
          {resume.skills && resume.skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#004ac6] border-b border-[#e0e3e5] pb-1 mb-2">
                Habilidades
              </h2>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-[#f2f4f6] text-[#191c1e] border border-[#c3c6d7]/60 text-[11px] font-semibold px-2.5 py-0.5 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </main>
  );
};
