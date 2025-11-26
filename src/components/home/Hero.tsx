"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Hero() {
    const { t } = useLanguage();

    return (
        <section id="home" className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-12 lg:py-16 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight animate-fade-in-up">
                        {t('hero.title')}
                    </h1>
                    <p className="text-lg md:text-xl mb-6 text-purple-100 animate-fade-in-up delay-100">
                        {t('hero.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up delay-200">
                        <Link
                            href="#services"
                            className="px-6 py-3 bg-white text-purple-700 rounded-lg font-semibold text-base hover:bg-purple-50 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                        >
                            {t('hero.btn_services')}
                        </Link>
                        <Link
                            href="#contact"
                            className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-base hover:bg-white/10 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                        >
                            {t('hero.btn_contact')}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
