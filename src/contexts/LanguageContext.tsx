"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'gu' | 'mr' | 'ta' | 'te' | 'kn' | 'ml' | 'bn' | 'pa';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    supportedLanguages: Record<Language, string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

import { translations } from './translations';

const supportedLanguages: Record<Language, string> = {
    'en': 'English', 'hi': 'हिंदी', 'gu': 'ગુજરાતી', 'mr': 'मराठी', 'ta': 'தமிழ்',
    'te': 'తెలుగు', 'kn': 'ಕನ್ನಡ', 'ml': 'മലയാളം', 'bn': 'বাংলা', 'pa': 'ਪੰਜਾਬੀ'
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        const manualSelection = localStorage.getItem('languageManuallySelected');
        const savedLang = localStorage.getItem('preferredLanguage') as Language;

        if (manualSelection === 'true' && savedLang && supportedLanguages[savedLang]) {
            console.log('Using manually selected language:', savedLang);
            setLanguage(savedLang);
            return;
        }

        const detectedLang = detectLanguage();
        console.log('Auto-detected language:', detectedLang);
        setLanguage(detectedLang);
        localStorage.setItem('preferredLanguage', detectedLang);
        localStorage.setItem('languageManuallySelected', 'false');
    }, []);

    const detectLanguage = (): Language => {
        const browserLang = navigator.language || (navigator as any).userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        console.log('Browser Language:', browserLang);
        console.log('Timezone:', timezone);

        // If browser language is one of our supported Indian languages, use it
        if (supportedLanguages[langCode as Language] && langCode !== 'en') {
            return langCode as Language;
        }

        // If user is in India (based on timezone)
        if (timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta')) {
            // Check if any of the preferred languages are Indian
            if (navigator.languages && navigator.languages.length > 0) {
                const localeMap: Record<string, Language> = {
                    'gu': 'gu', 'hi': 'hi', 'mr': 'mr', 'ta': 'ta',
                    'te': 'te', 'kn': 'kn', 'ml': 'ml', 'bn': 'bn', 'pa': 'pa'
                };

                for (let lang of navigator.languages) {
                    const code = lang.split('-')[0].toLowerCase();
                    if (localeMap[code]) return localeMap[code];
                }
            }

            // Default to Gujarati for Gujarat-based company if in India and no other specific Indian language detected
            console.log('Defaulting to Gujarati for India timezone');
            return 'gu';
        }

        return 'en';
    };

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('preferredLanguage', lang);
        localStorage.setItem('languageManuallySelected', 'true');
        document.documentElement.lang = lang;
    };

    const t = (key: string): string => {
        const translation = translations[key as keyof typeof translations] as Record<Language, string> | undefined;
        if (!translation) return key;
        return translation[language] || translation['en'] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, supportedLanguages }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
