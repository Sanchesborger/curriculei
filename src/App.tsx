import React, { useState } from 'react';
import { ScreenView, ResumeData, UserProfile, TemplateItem } from './types';
import { initialUser, sampleResumes } from './data';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AuthScreen } from './components/AuthScreen';
import { HomeScreen } from './components/HomeScreen';
import { ResumesScreen } from './components/ResumesScreen';
import { TemplatesScreen } from './components/TemplatesScreen';
import { EditorScreen } from './components/EditorScreen';
import { PreviewScreen } from './components/PreviewScreen';
import { AIOptimizeScreen } from './components/AIOptimizeScreen';
import { InterviewScreen } from './components/InterviewScreen';
import { CoverLetterScreen } from './components/CoverLetterScreen';
import { SubscriptionScreen } from './components/SubscriptionScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { Toast } from './components/Toast';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('onboarding');
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [resumes, setResumes] = useState<ResumeData[]>(sampleResumes);
  const [activeResume, setActiveResume] = useState<ResumeData>(sampleResumes[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [postSplashTarget, setPostSplashTarget] = useState<ScreenView>('editor');
  const [splashConfig, setSplashConfig] = useState<{ title?: string; subtitle?: string }>({
    title: 'Gerando seu Currículo com IA',
    subtitle: 'Estruturando layout profissional e otimizando dados para ATS...'
  });

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const handleNavigate = (screen: ScreenView) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectResume = (resume: ResumeData) => {
    setActiveResume(resume);
    handleNavigate('editor');
  };

  const handleCreateNewResume = () => {
    const newDoc: ResumeData = {
      id: 'resume-' + Date.now(),
      title: 'Novo Currículo Profissional',
      status: 'DRAFT',
      updatedAt: 'Agora',
      templateId: 'moderno',
      categoryTag: 'Geral',
      atsScore: 65,
      personalData: {
        fullName: user.name,
        title: user.role,
        email: user.email,
        phone: '+55 11 99999-8888',
        location: 'São Paulo, SP',
        linkedin: 'linkedin.com/in/alexsterling'
      },
      summary: 'Profissional focado em inovação, resultados mensuráveis e liderança.',
      experiences: [
        {
          id: 'exp-1',
          role: 'Cargo Atual / Recente',
          company: 'Empresa Principal',
          period: '2022 - Presente',
          description: 'Descreva suas principais atribuições e conquistas.'
        }
      ],
      education: [
        {
          id: 'edu-1',
          degree: 'Ensino Superior / Graduação',
          institution: 'Universidade',
          period: '2018 - 2022'
        }
      ],
      skills: ['Comunicação', 'Resolução de Problemas', 'Gestão de Projetos']
    };

    setResumes([newDoc, ...resumes]);
    setActiveResume(newDoc);
    handleNavigate('editor');
  };

  const handleUpdateResume = (updated: ResumeData) => {
    setResumes(resumes.map(r => r.id === updated.id ? updated : r));
    setActiveResume(updated);
  };

  const handleDeleteResume = (id: string) => {
    const filtered = resumes.filter(r => r.id !== id);
    setResumes(filtered);
    if (activeResume.id === id && filtered.length > 0) {
      setActiveResume(filtered[0]);
    }
    showToast('Currículo excluído.');
  };

  const handleSelectTemplate = (template: TemplateItem) => {
    const updated = {
      ...activeResume,
      templateId: template.id
    };
    handleUpdateResume(updated);
    showToast(`Modelo "${template.name}" aplicado!`);
    handleNavigate('preview');
  };

  const handleAuthSuccess = (name: string, email: string) => {
    setUser({
      ...user,
      name,
      email
    });
    showToast(`Bem-vindo, ${name.split(' ')[0]}!`);
    handleNavigate('home');
  };

  return (
    <div className="min-[#191c1e] bg-[#f7f9fb] min-h-screen flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        user={user}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex w-full max-w-full">
        {/* Sidebar for Desktop */}
        {!['splash', 'onboarding', 'login', 'signup'].includes(currentScreen) && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            user={user}
          />
        )}

        {/* Screen Content Viewport */}
        <div className="flex-1 w-full min-w-0">
          {currentScreen === 'splash' && (
            <SplashScreen 
              onComplete={() => handleNavigate(postSplashTarget)} 
              title={splashConfig.title}
              subtitle={splashConfig.subtitle}
            />
          )}

          {currentScreen === 'onboarding' && (
            <OnboardingScreen onFinish={() => handleNavigate('login')} />
          )}

          {currentScreen === 'login' && (
            <AuthScreen initialMode="login" onAuthSuccess={handleAuthSuccess} />
          )}

          {currentScreen === 'signup' && (
            <AuthScreen initialMode="signup" onAuthSuccess={handleAuthSuccess} />
          )}

          {currentScreen === 'home' && (
            <HomeScreen
              user={user}
              resumes={resumes}
              onNavigate={handleNavigate}
              onSelectResume={handleSelectResume}
              onCreateNewResume={handleCreateNewResume}
            />
          )}

          {currentScreen === 'resumes' && (
            <ResumesScreen
              resumes={resumes}
              onSelectResume={handleSelectResume}
              onCreateNewResume={handleCreateNewResume}
              onDeleteResume={handleDeleteResume}
              onShareResume={(r) => {
                navigator.clipboard.writeText(window.location.href);
                showToast(`Link de ${r.title} copiado!`);
              }}
            />
          )}

          {currentScreen === 'templates' && (
            <TemplatesScreen onSelectTemplate={handleSelectTemplate} />
          )}

          {currentScreen === 'editor' && (
            <EditorScreen
              resume={activeResume}
              onUpdateResume={handleUpdateResume}
              onNavigateToPreview={() => handleNavigate('preview')}
              onOptimizeWithAI={() => handleNavigate('ai-optimize')}
              onShowToast={showToast}
            />
          )}

          {currentScreen === 'preview' && (
            <PreviewScreen
              resume={activeResume}
              onNavigateToEditor={() => handleNavigate('editor')}
              onNavigateToAIOptimize={() => handleNavigate('ai-optimize')}
              onShowToast={showToast}
            />
          )}

          {currentScreen === 'ai-optimize' && (
            <AIOptimizeScreen
              resume={activeResume}
              onUpdateResume={handleUpdateResume}
              onShowToast={showToast}
            />
          )}

          {currentScreen === 'interview' && (
            <InterviewScreen
              user={user}
              onNavigate={handleNavigate}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              onShowToast={showToast}
            />
          )}

          {currentScreen === 'cover-letter' && (
            <CoverLetterScreen
              user={user}
              onShowToast={showToast}
            />
          )}

          {currentScreen === 'subscription' && (
            <SubscriptionScreen onShowToast={showToast} />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              user={user}
              onUpdateUser={setUser}
              onNavigate={handleNavigate}
              onLogout={() => {
                showToast('Você saiu da sua conta.');
                handleNavigate('login');
              }}
              onShowToast={showToast}
            />
          )}
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />

      {/* Global Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}

export default App;
