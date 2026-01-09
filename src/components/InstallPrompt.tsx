import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export function InstallPrompt() {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
            || (window.navigator as any).standalone === true;

        if (isStandalone) {
            return; // Already installed, don't show prompt
        }

        // Check if dismissed recently (within 3 days)
        const dismissedAt = localStorage.getItem('installPromptDismissed');
        if (dismissedAt) {
            const dismissedTime = parseInt(dismissedAt, 10);
            const threeDays = 3 * 24 * 60 * 60 * 1000;
            if (Date.now() - dismissedTime < threeDays) {
                return; // Dismissed recently, don't show
            }
        }

        // Check if iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIOSDevice);

        if (isIOSDevice) {
            // iOS doesn't support beforeinstallprompt, show manual instructions
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }

        // Android/Desktop - Listen for beforeinstallprompt
        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
            setTimeout(() => setIsVisible(true), 1500);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        };
    }, []);

    const handleInstall = async () => {
        if (!installPrompt) return;

        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsVisible(false);
        }
        setInstallPrompt(null);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('installPromptDismissed', Date.now().toString());
    };

    if (!isVisible) return null;

    return (
        <div className="install-prompt-overlay">
            <div className="install-prompt-modal glass-card animate-scale-in">
                {/* Close Button */}
                <button
                    className="install-prompt-close"
                    onClick={handleDismiss}
                    aria-label="Kapat"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                {/* Icon */}
                <div className="install-prompt-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <rect x="4" y="2" width="16" height="20" rx="3" stroke="url(#grad1)" strokeWidth="2" />
                        <path d="M12 8v6m0 0l-2-2m2 2l2-2" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="18" r="1" fill="url(#grad1)" />
                        <defs>
                            <linearGradient id="grad1" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#8b5cf6" />
                                <stop offset="1" stopColor="#ec4899" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Content */}
                <h2 className="install-prompt-title">Uygulamayı Yükle</h2>
                <p className="install-prompt-description">
                    KPSS Çalışma Asistanı'nı ana ekranına ekleyerek
                    daha hızlı erişim sağlayabilirsin!
                </p>

                {/* Benefits */}
                <div className="install-prompt-benefits">
                    <div className="benefit-item">
                        <span className="benefit-icon">⚡</span>
                        <span>Hızlı erişim</span>
                    </div>
                    <div className="benefit-item">
                        <span className="benefit-icon">📱</span>
                        <span>Tam ekran deneyimi</span>
                    </div>
                    <div className="benefit-item">
                        <span className="benefit-icon">🔔</span>
                        <span>Çevrimdışı kullanım</span>
                    </div>
                </div>

                {isIOS ? (
                    /* iOS Instructions */
                    <div className="ios-instructions">
                        <p className="ios-step">
                            <span className="step-number">1</span>
                            <span>
                                Paylaş butonuna{' '}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', verticalAlign: 'middle' }}>
                                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                                </svg>
                                {' '}tıkla
                            </span>
                        </p>
                        <p className="ios-step">
                            <span className="step-number">2</span>
                            <span>"Ana Ekrana Ekle" seçeneğine tıkla</span>
                        </p>
                    </div>
                ) : (
                    /* Install Button for Android/Desktop */
                    <button className="btn-glow install-btn" onClick={handleInstall}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        Ana Ekrana Ekle
                    </button>
                )}

                {/* Later Button */}
                <button className="install-prompt-later" onClick={handleDismiss}>
                    Daha sonra
                </button>
            </div>
        </div>
    );
}
