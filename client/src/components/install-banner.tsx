import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function InstallBanner() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed
    const dismissed = localStorage.getItem('install-banner-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setShowBanner(false);
        setInstallPrompt(null);
      }
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setIsDismissed(true);
    localStorage.setItem('install-banner-dismissed', 'true');
  };

  if (!showBanner || !installPrompt || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto bg-card rounded-xl shadow-lg p-4 border-l-4 border-primary z-30 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="material-icons text-white text-sm">get_app</span>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">Install UPC Finder</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Get the full app experience</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Button 
            onClick={handleInstall}
            size="sm"
            className="text-sm font-medium"
          >
            Install
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
