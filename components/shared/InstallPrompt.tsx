'use client';

import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after 30 seconds
      setTimeout(() => {
        const hasDeclined = localStorage.getItem('pwa-install-declined');
        if (!hasDeclined) {
          setShowPrompt(true);
        }
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-declined', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-slate-100 rounded-lg"
      >
        <X className="w-4 h-4 text-slate-400" />
      </button>

      <div className="flex gap-4">
        <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🍜</span>
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 mb-1">Install Indo Foods</h3>
          <p className="text-sm text-slate-600 mb-3">
            Add to your home screen for quick access!
          </p>
          
          <button
            onClick={handleInstall}
            className="flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold px-4 py-2 rounded-lg transition w-full justify-center"
          >
            <Download className="w-4 h-4" />
            <span>Install App</span>
          </button>
        </div>
      </div>
    </div>
  );
}
