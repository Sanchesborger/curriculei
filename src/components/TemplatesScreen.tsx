import React, { useState } from 'react';
import { TemplateItem } from '../types';
import { sampleTemplates } from '../data';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

interface TemplatesScreenProps {
  onSelectTemplate: (template: TemplateItem) => void;
}

export const TemplatesScreen: React.FC<TemplatesScreenProps> = ({ onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'ATS Optimized', 'Creative', 'Executive', 'Minimalist', 'Modern'];

  const filteredTemplates = sampleTemplates.filter((t) => {
    if (selectedCategory === 'All') return true;
    return t.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <main className="pt-6 md:pt-8 pb-24 px-5 md:px-8 max-w-7xl mx-auto flex flex-col gap-6 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#191c1e]">Galeria de Templates</h1>
        <p className="text-sm md:text-base text-[#434655] mt-1">
          Modelos desenhados por recrutadores e testados em sistemas ATS.
        </p>
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
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-2xl border border-[#c3c6d7]/60 shadow-sm flex flex-col overflow-hidden group hover:border-[#2563eb] hover:shadow-xl transition-all duration-300"
          >
            {/* Image Preview Container */}
            <div className="relative aspect-[3/4] bg-[#f2f4f6] overflow-hidden border-b border-[#e0e3e5]">
              <img
                src={template.previewUrl}
                alt={template.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />

              {template.isPopular && (
                <div className="absolute top-3 left-3 bg-[#004ac6] text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Popular
                </div>
              )}

              {/* Hover overlay with action button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6 backdrop-blur-[2px]">
                <button
                  onClick={() => onSelectTemplate(template)}
                  className="bg-[#2563eb] hover:bg-[#004ac6] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform"
                >
                  <span>Usar Este Modelo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content info */}
            <div className="p-5 flex justify-between items-center bg-white">
              <div>
                <h3 className="font-bold text-base text-[#191c1e]">{template.name}</h3>
                <p className="text-xs text-[#737686] mt-0.5">{template.tagline}</p>
              </div>

              <span className="px-2.5 py-1 bg-[#2563eb]/10 text-[#004ac6] text-[10px] font-bold uppercase rounded-md">
                {template.category}
              </span>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
};
