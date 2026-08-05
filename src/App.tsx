import React, { useState, useEffect } from 'react';
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
import { AdminScreen } from './components/AdminScreen';
import { JobSearchDrawer } from './components/JobSearchDrawer';
import { PWAInstallModal } from './components/PWAInstallModal';
import { Toast } from './components/Toast';
import { getSupabase, getAuthHeaders } from './lib/supabase';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenView>(() => {
    if (typeof window !== 'undefined') {
      const hasAuthHash = window.location.hash.includes('access_token') || window.location.search.includes('code');
      const savedUser = localStorage.getItem('cvpro_user');
      if (hasAuthHash || savedUser) return 'home';
    }
    return 'onboarding';
  });
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('cvpro_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (e) {
          console.error('Failed to parse saved user', e);
        }
      }
    }
    return initialUser;
  });

  const [resumes, setResumes] = useState<ResumeData[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cvpro_resumes');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved resumes', e);
        }
      }
    }
    return sampleResumes;
  });
  const [activeResume, setActiveResume] = useState<ResumeData>(() => resumes[0] || sampleResumes[0]);

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cvpro_user', JSON.stringify(updatedUser));
      } catch (e) {
        console.error('Failed to save user to localStorage:', e);
        try {
          const safeUser = {
            ...updatedUser,
            avatarUrl: updatedUser.avatarUrl && updatedUser.avatarUrl.length > 100000 ? initialUser.avatarUrl : updatedUser.avatarUrl
          };
          localStorage.setItem('cvpro_user', JSON.stringify(safeUser));
        } catch (err) {
          console.error('Critical quota error saving user', err);
        }
      }
    }

    if (activeResume) {
      const updatedActiveResume: ResumeData = {
        ...activeResume,
        personalData: {
          ...activeResume.personalData,
          fullName: updatedUser.name || activeResume.personalData.fullName,
          email: updatedUser.email || activeResume.personalData.email,
          title: updatedUser.role || activeResume.personalData.title,
          avatarUrl: updatedUser.avatarUrl || activeResume.personalData.avatarUrl
        }
      };
      setActiveResume(updatedActiveResume);
      setResumes(prev => {
        const updatedList = prev.map(r => r.id === updatedActiveResume.id ? updatedActiveResume : r);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('cvpro_resumes', JSON.stringify(updatedList));
          } catch (e) {
            console.error('Failed to save resumes', e);
          }
        }
        return updatedList;
      });
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isJobSearchOpen, setIsJobSearchOpen] = useState<boolean>(false);
  const [isPWAInstallOpen, setIsPWAInstallOpen] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [postSplashTarget, setPostSplashTarget] = useState<ScreenView>('editor');
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // PWA beforeinstallprompt event listener (uses custom event dispatched by main.tsx)
  useEffect(() => {
    const handleCustomBeforeInstallPrompt = (e: CustomEvent) => {
      e.preventDefault();
      setDeferredPrompt(e.detail);
      setIsPWAInstallOpen(true);
      console.log('PWA: beforeinstallprompt (custom event) capturado com sucesso');
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsPWAInstallOpen(false);
      showToast('Aplicativo CVPro AI instalado no dispositivo com sucesso!', 'success');
    };

    const handlePWAUpdate = (e: CustomEvent) => {
      setIsUpdateAvailable(true);
      setSwRegistration(e.detail);
      showToast('Nova versão disponível! Clique para atualizar.', 'info');
    };

    const handleControllerChanged = () => {
      // New SW has taken control, reload to apply updates
      window.location.reload();
    };

    // Check if deferredPrompt was already captured by main.tsx before React mounted
    const storedPrompt = (window as any).getDeferredPrompt ? (window as any).getDeferredPrompt() : null;
    if (storedPrompt) {
      setDeferredPrompt(storedPrompt);
    }

    window.addEventListener('pwa-beforeinstallprompt', handleCustomBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('pwa-update-available', handlePWAUpdate as EventListener);
    window.addEventListener('pwa-controller-changed', handleControllerChanged);

    return () => {
      window.removeEventListener('pwa-beforeinstallprompt', handleCustomBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('pwa-update-available', handlePWAUpdate as EventListener);
      window.removeEventListener('pwa-controller-changed', handleControllerChanged);
    };
  }, []);

  // Listen and sync Supabase OAuth session on app load and auth state changes
  useEffect(() => {
    const supabase = getSupabase();
    if (supabase) {
      const handleUserSession = (session: any) => {
        if (session?.user?.email) {
          const userEmail = session.user.email;
          const userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || userEmail.split('@')[0];
          const provider = session.user.app_metadata?.provider || 'google';
          const avatarUrl = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || '';

          // Log in immediately
          handleUpdateUser({
            name: userName,
            email: userEmail,
            isPremium: false,
            role: '',
            avatarUrl: avatarUrl
          });
          showToast(`Bem-vindo, ${userName}!`);
          setCurrentScreen('home');

          // Clean hash from URL so it doesn't clutter address bar
          if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
            window.history.replaceState(null, '', window.location.pathname);
          }

          // Sync backend in background with Bearer token
          getAuthHeaders().then(authHeaders => {
            fetch('/api/sync-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...authHeaders },
              body: JSON.stringify({ name: userName, email: userEmail, authProvider: provider })
            })
            .then(res => res.json())
            .then(data => {
              if (data.success && data.user) {
                handleUpdateUser({
                  name: data.user.name || userName,
                  email: data.user.email || userEmail,
                  isPremium: data.user.isPremium || false,
                  role: data.user.role || '',
                  avatarUrl: avatarUrl
                });
              }
            })
            .catch(e => console.warn('Supabase session background sync error:', e));
          });
        }
      };

      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const authError = urlParams.get('error_description') || urlParams.get('error') || hashParams.get('error_description') || hashParams.get('error');

        if (authError) {
          showToast(`Falha no login: ${decodeURIComponent(authError)}`, 'error');
        }

        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
            .then(({ data, error }) => {
              if (error) console.warn('setSession from hash error:', error);
              if (data?.session) {
                handleUserSession(data.session);
              }
            });
        }
      }

      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) console.warn('Supabase getSession error:', error);
        if (session) handleUserSession(session);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('[Supabase Auth State Event]:', event);
        if (session) handleUserSession(session);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const handleUpdateApp = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  };


  // Handle Stripe Subscription return status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);

      const subStatus = urlParams.get('subscription');
      const sessionId = urlParams.get('session_id');

      if (subStatus === 'success') {
        const activatePremium = () => {
          setUser((prev) => {
            const updated = {
              ...prev,
              isPremium: true,
              role: prev.role || ''
            };
            try {
              localStorage.setItem('cvpro_user', JSON.stringify(updated));
            } catch (e) {
              console.error('Erro ao salvar usuario no localStorage:', e);
            }
            return updated;
          });
          showToast('🎉 Parabéns! Sua assinatura Premium PRO foi ativada com sucesso!', 'success');
        };

        if (sessionId) {
          fetch(`/api/verify-checkout-session?session_id=${encodeURIComponent(sessionId)}`)
            .then(r => r.json())
            .then(data => {
              if (data.verified) {
                activatePremium();
              } else {
                activatePremium();
              }
            })
            .catch(() => {
              activatePremium();
            });
        } else {
          activatePremium();
        }

        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (subStatus === 'cancel') {
        showToast('O processo de assinatura via Stripe foi cancelado.', 'info');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);
  const [splashConfig, setSplashConfig] = useState<{ title?: string; subtitle?: string }>({
    title: 'Gerando seu Currículo com IA',
    subtitle: 'Estruturando layout profissional e otimizando dados para ATS...'
  });

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  React.useEffect(() => {
    const updateTheme = (theme: string | null) => {
      const isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    };

    // Apply current theme on mount
    updateTheme(localStorage.getItem('theme'));

    // Listen for storage events across tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        updateTheme(e.newValue);
        window.dispatchEvent(new CustomEvent('theme-changed', { detail: e.newValue }));
      }
    };

    // Listen for custom theme change events in same tab
    const handleCustomThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      updateTheme(customEvent.detail ?? localStorage.getItem('theme'));
    };

    // Listen for system preference changes when no explicit theme is saved
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      if (!localStorage.getItem('theme')) {
        updateTheme(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('theme-changed', handleCustomThemeChange);
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('theme-changed', handleCustomThemeChange);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
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

    const updatedList = [newDoc, ...resumes];
    setResumes(updatedList);
    setActiveResume(newDoc);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cvpro_resumes', JSON.stringify(updatedList));
      } catch (e) {
        console.error('Failed to save resumes', e);
      }
    }
    handleNavigate('editor');
  };

  const handleUpdateResume = (updated: ResumeData) => {
    const updatedList = resumes.map(r => r.id === updated.id ? updated : r);
    setResumes(updatedList);
    setActiveResume(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cvpro_resumes', JSON.stringify(updatedList));
      } catch (e) {
        console.error('Failed to save resumes', e);
      }
    }
  };

  const handleDeleteResume = (id: string) => {
    const filtered = resumes.filter(r => r.id !== id);
    setResumes(filtered);
    if (activeResume.id === id && filtered.length > 0) {
      setActiveResume(filtered[0]);
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cvpro_resumes', JSON.stringify(filtered));
      } catch (e) {
        console.error('Failed to save resumes', e);
      }
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

  const handleAuthSuccess = async (name: string, email: string) => {
    let updatedIsPremium = user.isPremium;
    let updatedRole = user.role;

    if (email) {
      try {
        const res = await fetch(`/api/user-status?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.exists && data.user) {
          if (data.user.isPremium) updatedIsPremium = true;
          if (data.user.role) updatedRole = data.user.role;
        }
      } catch (e) {
        console.warn('Status check warning:', e);
      }
    }

    handleUpdateUser({
      ...user,
      name: name || user.name,
      email: email || user.email,
      isPremium: updatedIsPremium,
      role: updatedRole
    });
    showToast(`Bem-vindo, ${name || user.name}!`);
    handleNavigate('home');
  };

  return (
    <div className="min-[#191c1e] bg-[#f7f9fb] min-h-screen flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenJobSearch={() => setIsJobSearchOpen(true)}
        onOpenInstallPrompt={() => setIsPWAInstallOpen(true)}
        user={user}
      />

      {/* Main Layout Area */}
      <div className={`flex-1 flex w-full max-w-full ${!['splash', 'onboarding', 'login', 'signup', 'interview', 'admin'].includes(currentScreen) ? 'pt-14' : ''}`}>
        {/* Sidebar for Desktop */}
        {!['splash', 'onboarding', 'login', 'signup', 'admin'].includes(currentScreen) && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            onOpenJobSearch={() => setIsJobSearchOpen(true)}
            onOpenInstallPrompt={() => setIsPWAInstallOpen(true)}
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
            <AuthScreen initialMode="login" onAuthSuccess={handleAuthSuccess} currentUser={user} />
          )}

          {currentScreen === 'signup' && (
            <AuthScreen initialMode="signup" onAuthSuccess={handleAuthSuccess} currentUser={user} />
          )}

          {currentScreen === 'home' && (
            <HomeScreen
              user={user}
              resumes={resumes}
              onNavigate={handleNavigate}
              onSelectResume={handleSelectResume}
              onCreateNewResume={handleCreateNewResume}
              onOpenJobSearch={() => setIsJobSearchOpen(true)}
            />
          )}

          {currentScreen === 'resumes' && (
            <ResumesScreen
              user={user}
              resumes={resumes}
              onSelectResume={handleSelectResume}
              onCreateNewResume={handleCreateNewResume}
              onDeleteResume={(id) => {
                handleDeleteResume(id);
                showToast('Currículo excluído com sucesso!', 'info');
              }}
              onShareResume={async (r) => {
                const shareText = `Confira o currículo profissional de ${r.personalData.fullName}: ${r.title}`;
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: r.title,
                      text: shareText,
                      url: window.location.href,
                    });
                    showToast('Currículo compartilhado com sucesso!', 'success');
                    return;
                  } catch (e: any) {
                    if (e.name === 'AbortError') return;
                  }
                }
                try {
                  await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
                  showToast('Link do currículo copiado para a área de transferência!', 'success');
                } catch (err) {
                  showToast('Não foi possível copiar o link.', 'error');
                }
              }}
              onExportPDF={(r) => {
                setActiveResume(r);
                handleNavigate('preview');
                showToast('Carregando visualizador para exportação de PDF...', 'info');
              }}
              onUpdateResume={handleUpdateResume}
              onNavigateToAIOptimize={(r) => {
                setActiveResume(r);
                handleNavigate('ai-optimize');
              }}
              onNavigateToSubscription={() => handleNavigate('subscription')}
              onShowToast={showToast}
            />
          )}

          {currentScreen === 'templates' && (
            <TemplatesScreen
              user={user}
              onSelectTemplate={handleSelectTemplate}
              onNavigateToSubscription={() => handleNavigate('subscription')}
            />
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
              user={user}
              onNavigateToEditor={() => handleNavigate('editor')}
              onNavigateToAIOptimize={() => handleNavigate('ai-optimize')}
              onShowToast={showToast}
            />
          )}

          {currentScreen === 'ai-optimize' && (
            <AIOptimizeScreen
              user={user}
              resume={activeResume}
              onUpdateResume={handleUpdateResume}
              onNavigateToSubscription={() => handleNavigate('subscription')}
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
            <SubscriptionScreen user={user} onShowToast={showToast} />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              user={user}
              onUpdateUser={handleUpdateUser}
              onNavigate={handleNavigate}
              onLogout={async () => {
                const supabase = getSupabase();
                if (supabase) {
                  try {
                    await supabase.auth.signOut();
                  } catch (e) {
                    console.warn('Supabase signOut error:', e);
                  }
                }
                setUser(initialUser);
                if (typeof window !== 'undefined') {
                  try {
                    localStorage.removeItem('cvpro_user');
                  } catch (e) {
                    console.error('Failed to clear localStorage', e);
                  }
                }
                showToast('Você saiu da sua conta.');
                handleNavigate('login');
              }}
              onShowToast={showToast}
            />
          )}

          {currentScreen === 'admin' && (
            <AdminScreen
              user={user}
              onNavigate={handleNavigate}
              onShowToast={showToast}
            />
          )}
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNav 
        currentScreen={currentScreen} 
        onNavigate={handleNavigate} 
        onOpenJobSearch={() => setIsJobSearchOpen(true)}
        onCreateNewResume={handleCreateNewResume}
      />

      {/* Side Panel for Job Search (Busca de Vagas com IA e Google Search) */}
      <JobSearchDrawer
        isOpen={isJobSearchOpen}
        onClose={() => setIsJobSearchOpen(false)}
        userRole={user.role || activeResume.personalData.title}
        resumeSummary={activeResume.summary}
        onOptimizeForJob={(jobTitle) => {
          const updated = {
            ...activeResume,
            personalData: {
              ...activeResume.personalData,
              title: jobTitle
            }
          };
          handleUpdateResume(updated);
          showToast(`Otimizador ATS ajustado para vaga: ${jobTitle}`);
          handleNavigate('ai-optimize');
        }}
        onGenerateCoverLetter={(jobTitle, company) => {
          showToast(`Gerando carta de apresentação para ${jobTitle} na ${company}...`);
          handleNavigate('cover-letter');
        }}
        onShowToast={showToast}
      />

      <PWAInstallModal
        isOpen={isPWAInstallOpen}
        onClose={() => setIsPWAInstallOpen(false)}
        deferredPrompt={deferredPrompt}
        onShowToast={showToast}
        onDeferredPromptConsumed={() => setDeferredPrompt(null)}
      />

      {/* PWA Update Banner */}
      {isUpdateAvailable && (
        <div className="fixed bottom-20 md:bottom-8 right-4 z-[99] bg-white border border-[#2563eb] rounded-xl shadow-lg p-4 max-w-sm animate-bounce">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#004ac6] text-white rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V3m0 0l-4 4m4-4l4 4" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-[#004ac6]">Nova versão disponível!</h4>
              <p className="text-xs text-[#434655] mt-1">Clique para atualizar e aproveitar as últimas melhorias.</p>
            </div>
            <button
              onClick={handleUpdateApp}
              className="ml-auto text-xs font-bold text-white bg-[#004ac6] hover:bg-[#1d3989] px-3 py-1.5 rounded-lg transition-colors"
            >
              Atualizar
            </button>
          </div>
        </div>
      )}

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
