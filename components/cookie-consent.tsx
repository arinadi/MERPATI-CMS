"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";

declare global {
    interface Window {
        gtag?: (command: string, action: string, params: Record<string, unknown>) => void;
    }
}

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    const updateConsent = useCallback((value: "granted" | "denied") => {
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("consent", "update", {
                analytics_storage: value,
                ad_storage: value,
                ad_user_data: value,
                ad_personalization: value,
            });
        }
    }, []);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            // Use requestAnimationFrame to avoid "synchronous setState in effect" lint error
            requestAnimationFrame(() => setIsVisible(true));
        } else if (consent === "granted") {
            updateConsent("granted");
        }
    }, [updateConsent]);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "granted");
        updateConsent("granted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookie-consent", "denied");
        updateConsent("denied");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Cookie className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-white">
                                Izin Cookie & Privasi
                            </h3>
                            <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            Kami menggunakan Google Analytics untuk meningkatkan pengalaman Anda. 
                            Dengan menyetujui, Anda membantu kami menyajikan konten yang lebih relevan.
                        </p>
                        <div className="flex gap-3">
                            <Button 
                                onClick={handleAccept}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold"
                            >
                                Setujui
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={handleDecline}
                                className="flex-1 border-white/10 hover:bg-white/5 text-gray-300 rounded-lg"
                            >
                                Tolak
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
