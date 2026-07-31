import { Component, ErrorInfo, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: Readonly<ErrorBoundaryProps>;
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col justify-center items-center p-6 text-center font-sans">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold text-2xl">
              !
            </div>
            <h1 className="text-xl font-bold text-slate-900">Algo deu errado ao carregar o aplicativo</h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ocorreu um erro inesperado na renderização. Clique abaixo para reiniciar a sessão do aplicativo.
            </p>
            {this.state.error && (
              <pre className="text-[10px] bg-slate-100 p-3 rounded-lg text-rose-700 w-full text-left overflow-auto max-h-24">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              className="w-full bg-[#004ac6] hover:bg-[#2563eb] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer mt-2"
            >
              Recarregar Aplicativo
            </button>
          </div>
        </div>
      );
    }

    return (this.props as ErrorBoundaryProps).children;
  }
}

// Register Service Worker for PWA
const isInstallableContext = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

if ('serviceWorker' in navigator && isInstallableContext) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.log('PWA Service Worker registrado com sucesso:', reg.scope);

        // Listen for new service worker updates
        reg.addEventListener('update', () => {
          console.log('PWA: Nova versão do Service Worker detectada');
          // Dispatch a custom event so the app can show an update notification
          window.dispatchEvent(new CustomEvent('pwa-update-available', { detail: reg }));
        });

        // Listen for controller change (new SW takes control)
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('PWA: Novo Service Worker assumiu o controle');
            window.dispatchEvent(new CustomEvent('pwa-controller-changed'));
          });
        }
      })
      .catch((err) => console.log('Falha ao registrar PWA Service Worker:', err));
  });
}

// PWA Install Support - capture beforeinstallprompt and store for later use
let deferredPrompt: any = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Dispatch a custom event so React components can react to it
  window.dispatchEvent(new CustomEvent('pwa-beforeinstallprompt', { detail: e }));
  console.log('PWA: beforeinstallprompt capturado com sucesso');
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  window.dispatchEvent(new CustomEvent('pwa-appinstalled'));
  console.log('PWA: aplicativo instalado com sucesso');
});

// Expose deferredPrompt getter for components that need it
(window as any).getDeferredPrompt = () => deferredPrompt;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
