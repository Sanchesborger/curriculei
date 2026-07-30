import React, { useState } from 'react';
import { ResumeData, UserProfile } from '../types';
import { sampleTemplates } from '../data';
import { 
  Download, 
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
  user?: UserProfile;
  onNavigateToEditor: () => void;
  onNavigateToAIOptimize: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({
  resume,
  user,
  onNavigateToEditor,
  onNavigateToAIOptimize,
  onShowToast
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(resume.templateId || 'moderno');
  const [zoom, setZoom] = useState<number>(100);

  const avatarUrl = resume.personalData.avatarUrl || user?.avatarUrl;

  const handlePrintOrDownload = () => {
    // Directly trigger native print dialog without overlaying toast messages
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Currículo - ${resume.title}`,
      text: `Confira o currículo profissional de ${resume.personalData.fullName}: ${resume.personalData.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onShowToast('Currículo compartilhado com sucesso!', 'success');
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      onShowToast('Link e resumo copiados para a área de transferência!', 'success');
    } catch (err) {
      onShowToast('Não foi possível copiar o link.', 'error');
    }
  };

  return (
    <main className="pt-6 md:pt-8 pb-24 px-4 md:px-8 max-w-5xl mx-auto flex flex-col gap-6 font-sans">
      
      {/* Top Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-[#c3c6d7]/50 shadow-sm print:hidden no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToEditor}
            className="p-2 text-[#434655] hover:text-[#2563eb] hover:bg-[#f2f4f6] rounded-xl transition-colors cursor-pointer"
            title="Voltar ao editor"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg text-[#191c1e]">{resume.title}</h1>
            <p className="text-xs text-[#737686]">Pronto para baixar em PDF formato A4</p>
          </div>
        </div>

        {/* Template Selector & Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="h-10 px-3 rounded-xl border border-[#c3c6d7] text-xs font-bold text-[#191c1e] bg-white focus:outline-none focus:border-[#2563eb] cursor-pointer"
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
              className="p-2 hover:bg-[#f2f4f6] text-[#434655] cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold px-2 text-[#191c1e]">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(130, zoom + 10))}
              aria-label="Aumentar zoom"
              className="p-2 hover:bg-[#f2f4f6] text-[#434655] cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onNavigateToAIOptimize}
            className="bg-[#2563eb]/10 text-[#004ac6] hover:bg-[#2563eb]/20 h-10 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#2563eb]" />
            <span>Score ATS</span>
          </button>

          <button
            onClick={handleShare}
            aria-label="Compartilhar"
            className="bg-white border border-[#c3c6d7] text-[#191c1e] hover:bg-[#f2f4f6] h-10 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrintOrDownload}
            className="bg-[#004ac6] hover:bg-[#2563eb] text-white h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Baixar PDF</span>
          </button>
        </div>
      </div>

      {/* A4 Document Paper Canvas Wrapper */}
      <div className="w-full flex justify-center overflow-x-auto p-0 md:p-2 bg-transparent">
        <div
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="print-area w-[210mm] min-h-[297mm] bg-white text-[#191c1e] font-sans shadow-xl rounded-sm p-[16mm] md:p-[18mm] border border-slate-200 transition-all duration-200 print:shadow-none print:m-0 print:border-none print:p-0 print:w-full print:bg-white"
        >
          {/* TEMPLATE 1: MODERNO (Like Natalia Pereira example) */}
          {(selectedTemplateId === 'moderno' || selectedTemplateId === 'criativo') && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start gap-6 border-b-2 border-[#2563eb] pb-5">
                <div className="space-y-2 flex-1">
                  <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight uppercase leading-none">
                    {resume.personalData.fullName}
                  </h1>
                  {resume.personalData.title && (
                    <div className="inline-block bg-[#2563eb]/10 text-[#004ac6] px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                      {resume.personalData.title}
                    </div>
                  )}
                  
                  {/* Contact row */}
                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 pt-1 text-xs text-slate-600">
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
                    {resume.personalData.portfolio && (
                      <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-[#2563eb]" /> {resume.personalData.portfolio}
                      </span>
                    )}
                  </div>
                </div>

                {/* Profile Photo */}
                {avatarUrl && (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#2563eb] shadow-sm flex-shrink-0">
                    <img src={avatarUrl} alt={resume.personalData.fullName} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Summary */}
              {resume.summary && (
                <div className="cv-section">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#004ac6] border-b border-slate-200 pb-1 mb-2">
                    Resumo Profissional
                  </h2>
                  <p className="text-xs leading-relaxed text-slate-700">
                    {resume.summary}
                  </p>
                </div>
              )}

              {/* Grid 2 Columns for Experience and Education/Skills */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Col: Experiência */}
                <div className="md:col-span-7 space-y-6">
                  {resume.experiences && resume.experiences.length > 0 && (
                    <div className="cv-section">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-[#004ac6] border-b border-slate-200 pb-1 mb-3">
                        Experiência Profissional
                      </h2>
                      <div className="space-y-4">
                        {resume.experiences.map((exp) => (
                          <div key={exp.id} className="space-y-1">
                            <div className="flex justify-between items-baseline flex-wrap gap-1">
                              <h3 className="text-xs font-bold text-slate-900">
                                {exp.role} <span className="font-normal text-slate-600">| {exp.company}</span>
                              </h3>
                              <span className="text-[11px] font-medium text-slate-500">{exp.period}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-600">
                              {exp.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Col: Education, Skills, Languages */}
                <div className="md:col-span-5 space-y-6">
                  {resume.education && resume.education.length > 0 && (
                    <div className="cv-section">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-[#004ac6] border-b border-slate-200 pb-1 mb-3">
                        Formação Acadêmica
                      </h2>
                      <div className="space-y-3">
                        {resume.education.map((edu) => (
                          <div key={edu.id} className="space-y-0.5">
                            <h3 className="text-xs font-bold text-slate-900">{edu.degree}</h3>
                            <p className="text-[11px] text-slate-600">{edu.institution} • <span className="text-slate-500">{edu.period}</span></p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {resume.skills && resume.skills.length > 0 && (
                    <div className="cv-section">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-[#004ac6] border-b border-slate-200 pb-1 mb-2">
                        Habilidades Técnicas
                      </h2>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {resume.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {resume.languages && resume.languages.length > 0 && (
                    <div className="cv-section">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-[#004ac6] border-b border-slate-200 pb-1 mb-2">
                        Idiomas
                      </h2>
                      <ul className="text-xs text-slate-700 space-y-1">
                        {resume.languages.map((lang, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]"></span>
                            <span>{lang}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 2: EXECUTIVO (Like Sergio da Costa example with dark header) */}
          {selectedTemplateId === 'executivo' && (
            <div className="space-y-6">
              {/* Dark Header Banner */}
              <div className="bg-[#1e293b] text-white p-6 -mx-[16mm] md:-mx-[18mm] -mt-[16mm] md:-mt-[18mm] mb-6 flex flex-col sm:flex-row items-center gap-6">
                {avatarUrl && (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                    <img src={avatarUrl} alt={resume.personalData.fullName} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-1 text-center sm:text-left flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-wider uppercase">
                    {resume.personalData.fullName}
                  </h1>
                  <p className="text-sm font-semibold text-slate-300 tracking-wide uppercase">
                    {resume.personalData.title}
                  </p>
                </div>
              </div>

              {/* Contact Info Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-700 pb-4 border-b border-slate-200">
                {resume.personalData.email && <div><span className="font-bold block text-slate-900">E-mail:</span> {resume.personalData.email}</div>}
                {resume.personalData.phone && <div><span className="font-bold block text-slate-900">Telefone:</span> {resume.personalData.phone}</div>}
                {resume.personalData.location && <div><span className="font-bold block text-slate-900">Endereço:</span> {resume.personalData.location}</div>}
                {resume.personalData.linkedin && <div><span className="font-bold block text-slate-900">LinkedIn:</span> {resume.personalData.linkedin}</div>}
              </div>

              {/* Summary */}
              {resume.summary && (
                <div className="cv-section">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
                    Resumo Profissional
                  </h2>
                  <p className="text-xs leading-relaxed text-slate-700">
                    {resume.summary}
                  </p>
                </div>
              )}

              {/* Experiência */}
              {resume.experiences && resume.experiences.length > 0 && (
                <div className="cv-section">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-3">
                    Experiência Profissional
                  </h2>
                  <div className="space-y-4">
                    {resume.experiences.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-xs font-bold text-slate-900">
                            {exp.role} | <span className="font-normal text-slate-700">{exp.company}</span>
                          </h3>
                          <span className="text-[11px] font-semibold text-slate-600">{exp.period}</span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-600">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formação e Habilidades em 2 colunas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resume.education && resume.education.length > 0 && (
                  <div className="cv-section">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-3">
                      Formação
                    </h2>
                    <div className="space-y-2">
                      {resume.education.map((edu) => (
                        <div key={edu.id}>
                          <h3 className="text-xs font-bold text-slate-900">{edu.degree}</h3>
                          <p className="text-[11px] text-slate-600">{edu.institution} ({edu.period})</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {resume.skills && resume.skills.length > 0 && (
                  <div className="cv-section">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-3">
                      Habilidades
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                      {resume.skills.map((skill) => (
                        <span key={skill} className="bg-slate-100 border border-slate-300 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TEMPLATE 3: MINIMALISTA (Like Alex Rodrigues example with side border titles) */}
          {selectedTemplateId === 'minimalista' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start gap-6 border-b border-slate-200 pb-5">
                <div className="space-y-1">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {resume.personalData.fullName}
                  </h1>
                  <p className="text-base font-medium text-slate-600">
                    {resume.personalData.title}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-2">
                    {resume.personalData.email && <span>Email: {resume.personalData.email}</span>}
                    {resume.personalData.phone && <span>Tel: {resume.personalData.phone}</span>}
                    {resume.personalData.location && <span>Local: {resume.personalData.location}</span>}
                  </div>
                </div>

                {avatarUrl && (
                  <div className="w-22 h-22 rounded-full overflow-hidden border border-slate-300 shadow-xs flex-shrink-0">
                    <img src={avatarUrl} alt={resume.personalData.fullName} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Summary */}
              {resume.summary && (
                <div className="cv-section">
                  <h2 className="text-xs font-bold uppercase text-slate-900 border-l-4 border-[#2563eb] pl-3 py-0.5 mb-2">
                    Resumo do Perfil
                  </h2>
                  <p className="text-xs leading-relaxed text-slate-700 pl-4">
                    {resume.summary}
                  </p>
                </div>
              )}

              {/* Experience */}
              {resume.experiences && resume.experiences.length > 0 && (
                <div className="cv-section">
                  <h2 className="text-xs font-bold uppercase text-slate-900 border-l-4 border-[#2563eb] pl-3 py-0.5 mb-3">
                    Experiência Profissional
                  </h2>
                  <div className="space-y-4 pl-4">
                    {resume.experiences.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-xs font-bold text-slate-900">
                            {exp.role} <span className="font-normal text-slate-500">| {exp.period}</span>
                          </h3>
                          <span className="text-[11px] text-slate-500">{exp.company}</span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-600">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education & Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resume.education && resume.education.length > 0 && (
                  <div className="cv-section">
                    <h2 className="text-xs font-bold uppercase text-slate-900 border-l-4 border-[#2563eb] pl-3 py-0.5 mb-3">
                      Educação
                    </h2>
                    <div className="space-y-2 pl-4">
                      {resume.education.map((edu) => (
                        <div key={edu.id}>
                          <h3 className="text-xs font-bold text-slate-900">{edu.degree}</h3>
                          <p className="text-[11px] text-slate-500">{edu.institution} | {edu.period}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {resume.skills && resume.skills.length > 0 && (
                  <div className="cv-section">
                    <h2 className="text-xs font-bold uppercase text-slate-900 border-l-4 border-[#2563eb] pl-3 py-0.5 mb-3">
                      Habilidades
                    </h2>
                    <div className="flex flex-wrap gap-1.5 pl-4">
                      {resume.skills.map((skill) => (
                        <span key={skill} className="bg-slate-100 text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TEMPLATE 4: ATS STANDARD (Pure text layout for automated ATS scanners) */}
          {selectedTemplateId === 'ats-standard' && (
            <div className="space-y-5 font-sans">
              <div className="text-center space-y-1 border-b border-slate-300 pb-4">
                <h1 className="text-2xl font-bold uppercase text-slate-900 tracking-wide">
                  {resume.personalData.fullName}
                </h1>
                <p className="text-xs font-semibold text-slate-700">
                  {resume.personalData.title}
                </p>
                <p className="text-[11px] text-slate-600">
                  {[
                    resume.personalData.email,
                    resume.personalData.phone,
                    resume.personalData.location,
                    resume.personalData.linkedin
                  ].filter(Boolean).join(' | ')}
                </p>
              </div>

              {resume.summary && (
                <div className="cv-section">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                    Resumo Profissional
                  </h2>
                  <p className="text-xs leading-relaxed text-slate-800">
                    {resume.summary}
                  </p>
                </div>
              )}

              {resume.experiences && resume.experiences.length > 0 && (
                <div className="cv-section">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Experiência Profissional
                  </h2>
                  <div className="space-y-3">
                    {resume.experiences.map((exp) => (
                      <div key={exp.id} className="space-y-0.5">
                        <div className="flex justify-between text-xs font-bold text-slate-900">
                          <span>{exp.role} - {exp.company}</span>
                          <span>{exp.period}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resume.education && resume.education.length > 0 && (
                <div className="cv-section">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
                    Formação Acadêmica
                  </h2>
                  <div className="space-y-1.5">
                    {resume.education.map((edu) => (
                      <div key={edu.id} className="flex justify-between text-xs text-slate-800">
                        <span><strong>{edu.degree}</strong>, {edu.institution}</span>
                        <span>{edu.period}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resume.skills && resume.skills.length > 0 && (
                <div className="cv-section">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                    Habilidades
                  </h2>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    {resume.skills.join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

    </main>
  );
};
