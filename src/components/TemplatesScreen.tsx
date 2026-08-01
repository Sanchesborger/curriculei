import React, { useState } from 'react';
import { TemplateItem, UserProfile } from '../types';
import { sampleTemplates } from '../data';
import { Sparkles, Crown, Lock, ArrowRight } from 'lucide-react';

interface TemplatesScreenProps {
  user?: UserProfile;
  onSelectTemplate: (template: TemplateItem) => void;
  onNavigateToSubscription?: () => void;
}

export const TemplatesScreen: React.FC<TemplatesScreenProps> = ({
  user,
  onSelectTemplate,
  onNavigateToSubscription
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lockedTemplate, setLockedTemplate] = useState<TemplateItem | null>(null);

  const isUserPremium = Boolean(user?.isPremium || user?.role?.toLowerCase().includes('premium'));

  const categories = ['All', 'ATS Optimized', 'Creative', 'Executive', 'Minimalist', 'Modern'];

  const filteredTemplates = sampleTemplates.filter((t) => {
    if (selectedCategory === 'All') return true;
    return t.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleTemplateClick = (template: TemplateItem) => {
    if (template.isPremium && !isUserPremium) {
      setLockedTemplate(template);
      return;
    }
    onSelectTemplate(template);
  };

  return (
    <main className="pt-6 md:pt-8 pb-24 px-5 md:px-8 max-w-7xl mx-auto flex flex-col gap-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#191c1e]">Galeria de Templates</h1>
          <p className="text-sm md:text-base text-[#434655] mt-1">
            Modelos profissionais testados em leitores ATS e desenhados por recrutadores.
          </p>
        </div>

        {!isUserPremium && (
          <button
            onClick={onNavigateToSubscription}
            className="self-start sm:self-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2"
          >
            <Crown className="w-4 h-4" />
            <span>Desbloquear Todos com PRO</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#e0e3e5]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#2563eb] text-white shadow-sm'
                : 'bg-white border border-[#c3c6d7] text-[#434655] hover:bg-[#f2f4f6]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const isLocked = template.isPremium && !isUserPremium;

          return (
            <div
              key={template.id}
              className={`bg-white rounded-2xl border transition-all duration-300 shadow-sm flex flex-col overflow-hidden group ${
                isLocked
                  ? 'border-amber-300 hover:border-amber-500'
                  : 'border-[#c3c6d7]/60 hover:border-[#2563eb] hover:shadow-xl'
              }`}
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[3/4] bg-[#f2f4f6] overflow-hidden border-b border-[#e0e3e5]">
                <img
                  src={template.previewUrl}
                  alt={template.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />

                {template.isPremium ? (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1.5 z-10">
                    <Crown className="w-3.5 h-3.5" /> PRO
                  </div>
                ) : template.isPopular ? (
                  <div className="absolute top-3 left-3 bg-[#004ac6] text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Popular
                  </div>
                ) : null}

                {/* Hover overlay with action button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6 backdrop-blur-[2px]">
                  <button
                    onClick={() => handleTemplateClick(template)}
                    className={`font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all ${
                      isLocked
                        ? 'bg-amber-400 hover:bg-amber-300 text-black'
                        : 'bg-[#2563eb] hover:bg-[#004ac6] text-white'
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Exclusivo PRO</span>
                      </>
                    ) : (
                      <>
                        <span>Usar Este Modelo</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Content info */}
              <div className="p-5 flex justify-between items-center bg-white">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#191c1e]">{template.name}</h3>
                    {template.isPremium && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded">
                        PRO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#737686] mt-0.5">{template.tagline}</p>
                </div>

                <span className="px-2.5 py-1 bg-[#2563eb]/10 text-[#004ac6] text-[10px] font-bold uppercase rounded-md">
                  {template.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Locked Template Upgrade Modal */}
      {lockedTemplate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
              <Crown className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-[#191c1e]">
                O modelo "{lockedTemplate.name}" é exclusivo do Plano Premium PRO!
              </h3>
              <p className="text-xs md:text-sm text-[#434655] mt-2 leading-relaxed">
                Assine por apenas R$ 29,00/mês para ter acesso ilimitado a todos os modelos profissionais, otimização IA e geração de cartas e entrevistas.
              </p>
            </div>

            <div className="flex flex-col w-full gap-2 mt-2">
              <button
                onClick={() => {
                  setLockedTemplate(null);
                  if (onNavigateToSubscription) onNavigateToSubscription();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Assinar Premium PRO (R$ 29,00/mês)</span>
              </button>

              <button
                onClick={() => setLockedTemplate(null)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-[#737686] hover:bg-[#f2f4f6]"
              >
                Continuar com os modelos gratuitos
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};
