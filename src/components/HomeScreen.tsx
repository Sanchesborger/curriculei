import React from 'react';
import { ScreenView, ResumeData, UserProfile } from '../types';
import { 
  Plus, 
  Eye, 
  Download, 
  TrendingUp, 
  Crown, 
  Edit3, 
  BrainCircuit, 
  MessageSquare, 
  Mail, 
  MoreVertical, 
  Clock,
  Sparkles,
  ArrowRight,
  Briefcase,
  Search
} from 'lucide-react';

interface HomeScreenProps {
  user: UserProfile;
  resumes: ResumeData[];
  onNavigate: (screen: ScreenView) => void;
  onSelectResume: (resume: ResumeData) => void;
  onCreateNewResume: () => void;
  onOpenJobSearch?: () => void;
  onOpenPWAInstall?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  resumes,
  onNavigate,
  onSelectResume,
  onCreateNewResume,
  onOpenJobSearch,
  onOpenPWAInstall
}) => {
  return (
    <main className="pt-6 md:pt-8 pb-24 px-5 max-w-5xl mx-auto space-y-8 font-sans">
      
      {/* Greeting & Primary Action */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#191c1e]">
            Olá, {user.name.split(' ')[0]}
          </h2>
          <p className="text-sm md:text-base text-[#434655] mt-1">
            Pronto para impressionar o mercado hoje?
          </p>
        </div>
        
        <button
          onClick={onCreateNewResume}
          className="bg-[#004ac6] hover:bg-[#2563eb] text-white font-semibold px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 w-full md:w-auto active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Criar Currículo</span>
        </button>
      </section>

      {/* Stats & Upgrade Bento Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#c3c6d7]/40 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-[#2563eb] transition-colors">
          <div className="p-2 bg-[#2563eb]/10 rounded-xl text-[#004ac6] w-fit mb-2">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#737686]">Visualizações</span>
            <div className="text-2xl font-bold text-[#191c1e] mt-0.5">1.248</div>
            <span className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12% esta semana
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#c3c6d7]/40 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-[#2563eb] transition-colors">
          <div className="p-2 bg-[#8fa7fe]/20 rounded-xl text-[#1d3989] w-fit mb-2">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#737686]">Downloads</span>
            <div className="text-2xl font-bold text-[#191c1e] mt-0.5">342</div>
            <span className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +5% esta semana
            </span>
          </div>
        </div>

        {/* Premium Banner */}
        <div 
          onClick={() => onNavigate('subscription')}
          className="col-span-2 bg-gradient-to-br from-[#dbe1ff] via-[#b6c4ff]/50 to-[#dce1ff] border border-[#2563eb]/30 rounded-2xl p-5 shadow-sm relative overflow-hidden group cursor-pointer flex flex-col justify-between"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-1">
              <Crown className="w-4 h-4 text-[#004ac6]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#004ac6]">PREMIUM</span>
            </div>
            <h3 className="font-bold text-lg text-[#00174b]">Desbloqueie o poder total da IA</h3>
            <p className="text-xs text-[#00174b]/80 mt-1 max-w-[260px]">
              Análise avançada, cartas de apresentação infinitas e temas exclusivos.
            </p>
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onNavigate('subscription'); }}
            className="mt-4 self-start bg-[#004ac6] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl hover:bg-[#2563eb] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Fazer Upgrade</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* AI Tools Quick Access */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-base text-[#191c1e]">Recursos de IA</h3>
          <button 
            onClick={() => onNavigate('ai-optimize')}
            className="text-xs font-bold uppercase tracking-wider text-[#004ac6] hover:underline"
          >
            Ver Todos
          </button>
        </div>

        {/* PWA App Install Banner */}
        {onOpenPWAInstall && (
          <div 
            onClick={onOpenPWAInstall}
            className="mb-4 bg-gradient-to-r from-[#111827] via-[#1e293b] to-[#0f172a] text-white rounded-2xl p-4 md:p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:shadow-lg transition-all group relative border border-white/10"
          >
            <div className="space-y-1.5 z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-[#2563eb] text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">smartphone</span> App PWA
                </span>
                <span className="text-xs text-white/70">Instalação direta sem loja</span>
              </div>
              <h4 className="font-bold text-lg md:text-xl text-white group-hover:translate-x-0.5 transition-transform flex items-center gap-2">
                Instale o aplicativo CVPro AI no seu celular ou computador
              </h4>
              <p className="text-xs text-white/80 max-w-xl">
                Acesse seus currículos e ferramentas de IA instantaneamente direto da sua tela inicial com carregamento ultrarrápido.
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onOpenPWAInstall(); }}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md transition-colors flex items-center gap-2 flex-shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
              <span>Instalar Aplicativo</span>
            </button>
          </div>
        )}

        {/* Job Search Banner Feature */}
        {onOpenJobSearch && (
          <div 
            onClick={onOpenJobSearch}
            className="mb-4 bg-gradient-to-r from-[#004ac6] via-[#2563eb] to-[#1d3989] text-white rounded-2xl p-4 md:p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden"
          >
            <div className="space-y-1 z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-2.5 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> Google Search Real-Time
                </span>
              </div>
              <h4 className="font-bold text-lg md:text-xl text-white group-hover:translate-x-0.5 transition-transform">
                Busca de Vagas para {user.role || 'seu cargo'}
              </h4>
              <p className="text-xs text-white/85 max-w-xl">
                Encontre oportunidades ativas em tempo real no Google e compare instantaneamente com a compatibilidade do seu currículo.
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onOpenJobSearch(); }}
              className="bg-white text-[#004ac6] hover:bg-blue-50 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2 flex-shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#2563eb]" />
              <span>Abrir Painel de Vagas</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <button
            onClick={() => onNavigate('ai-optimize')}
            className="bg-white border border-[#c3c6d7]/40 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 shadow-sm hover:border-[#2563eb] hover:shadow-md transition-all group text-left"
          >
            <div className="w-11 h-11 rounded-full bg-[#f2f4f6] flex items-center justify-center group-hover:bg-[#2563eb]/10 group-hover:text-[#2563eb] transition-colors text-[#434655]">
              <Edit3 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-center text-[#191c1e]">Revisar Texto</span>
          </button>

          <button
            onClick={() => onNavigate('ai-optimize')}
            className="bg-white border border-[#c3c6d7]/40 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 shadow-sm hover:border-[#2563eb] hover:shadow-md transition-all group text-left"
          >
            <div className="w-11 h-11 rounded-full bg-[#f2f4f6] flex items-center justify-center group-hover:bg-[#2563eb]/10 group-hover:text-[#2563eb] transition-colors text-[#434655]">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-center text-[#191c1e]">Análise de Perfil</span>
          </button>

          <button
            onClick={() => onNavigate('interview')}
            className="bg-white border border-[#c3c6d7]/40 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 shadow-sm hover:border-[#2563eb] hover:shadow-md transition-all group text-left"
          >
            <div className="w-11 h-11 rounded-full bg-[#f2f4f6] flex items-center justify-center group-hover:bg-[#2563eb]/10 group-hover:text-[#2563eb] transition-colors text-[#434655]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-center text-[#191c1e]">Pre Entrevista</span>
          </button>

          <button
            onClick={() => onNavigate('cover-letter')}
            className="bg-white border border-[#c3c6d7]/40 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 shadow-sm hover:border-[#2563eb] hover:shadow-md transition-all group text-left"
          >
            <div className="w-11 h-11 rounded-full bg-[#f2f4f6] flex items-center justify-center group-hover:bg-[#2563eb]/10 group-hover:text-[#2563eb] transition-colors text-[#434655]">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-center text-[#191c1e]">Carta de Apres.</span>
          </button>
        </div>
      </section>

      {/* Recent Resumes */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-base text-[#191c1e]">Currículos Recentes</h3>
          <button 
            onClick={() => onNavigate('resumes')}
            className="text-xs font-bold uppercase tracking-wider text-[#004ac6] hover:underline"
          >
            Ver Lista
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              onClick={() => onSelectResume(resume)}
              className="bg-white border border-[#c3c6d7]/40 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-[#2563eb] transition-all cursor-pointer group"
            >
              <div>
                <div className="w-full h-28 bg-[#f2f4f6] rounded-xl mb-3 relative overflow-hidden border border-[#e0e3e5] p-3 flex flex-col gap-1.5">
                  <div className="w-3/4 h-2 bg-[#c3c6d7] rounded-full" />
                  <div className="w-1/2 h-1.5 bg-[#c3c6d7] rounded-full" />
                  <div className="w-full h-px bg-[#c3c6d7]/50 my-1" />
                  <div className="w-full h-1.5 bg-[#c3c6d7] rounded-full" />
                  <div className="w-full h-1.5 bg-[#c3c6d7] rounded-full" />
                  <div className="w-2/3 h-1.5 bg-[#c3c6d7] rounded-full" />

                  {resume.status === 'AI OPTIMIZED' && (
                    <div className="absolute top-2 right-2 bg-[#2563eb]/10 text-[#2563eb] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Otimizado
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                    <span className="bg-white text-[#191c1e] text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      Editar
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-[#191c1e] truncate">{resume.title}</h4>
                <p className="text-xs text-[#434655] mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#737686]" /> {resume.updatedAt}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#e0e3e5] flex justify-between items-center">
                <span className="px-2 py-0.5 bg-[#8fa7fe]/20 text-[#1d3989] rounded text-[10px] font-bold uppercase">
                  {resume.categoryTag || 'Geral'}
                </span>
                <button className="text-[#737686] hover:text-[#004ac6] transition-colors p-1">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* New Resume Placeholder Card */}
          <div
            onClick={onCreateNewResume}
            className="bg-[#f7f9fb] border-2 border-dashed border-[#c3c6d7] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:border-[#2563eb] hover:bg-[#2563eb]/5 transition-all cursor-pointer min-h-[190px] text-[#434655] hover:text-[#2563eb]"
          >
            <div className="w-12 h-12 rounded-full bg-[#eceef0] flex items-center justify-center mb-1">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm">Novo Documento</span>
            <span className="text-xs text-center opacity-80 max-w-[160px]">
              Comece um currículo do zero ou escolha um modelo
            </span>
          </div>
        </div>
      </section>

    </main>
  );
};
