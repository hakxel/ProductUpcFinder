import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
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
        setInstallPrompt(null);
      }
    }
  };

  return (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-icons text-2xl">qr_code_scanner</span>
            <h1 className="text-xl font-medium">UPC Finder</h1>
          </div>
          {installPrompt && (
            <Button 
              onClick={handleInstall}
              size="sm"
              className="bg-secondary text-primary hover:bg-secondary/90 px-3 py-1 text-sm font-medium"
            >
              <span className="material-icons text-sm mr-1">get_app</span>
              Install
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
