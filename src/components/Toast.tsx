import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === 'success' ? 'bg-[#004ac6]' : type === 'error' ? 'bg-[#ba1a1a]' : 'bg-[#191c1e]';

  return (
    <div className={`fixed bottom-20 md:bottom-8 right-4 z-[99] flex items-center gap-3 ${bgColor} text-white px-5 py-3.5 rounded-xl shadow-lg border border-white/20 animate-bounce transition-all duration-300 max-w-sm`}>
      {type === 'success' && <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />}
      {type === 'error' && <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />}
      {type === 'info' && <Info className="w-5 h-5 text-white flex-shrink-0" />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-auto text-white/80 hover:text-white p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
