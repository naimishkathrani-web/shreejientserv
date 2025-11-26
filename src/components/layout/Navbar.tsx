"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
    const { t, language, setLanguage, supportedLanguages } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [langOpen, setLangOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleLang = () => setLangOpen(!langOpen);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/">
                            <img
                                src="/images/logo.jpg"
                                alt="Shreeji Enterprise Services"
                                className="h-12 sm:h-16 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/#home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            {t('nav.home')}
                        </Link>
                        <Link href="/#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            {t('nav.about')}
                        </Link>
                        <Link href="/#services" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            {t('nav.services')}
                        </Link>
                        <Link href="/#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                            {t('nav.contact')}
                        </Link>

                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={toggleLang}
                                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium focus:outline-none"
                            >
                                <span>🌐</span>
                                <span>{supportedLanguages[language]}</span>
                                <svg className={`w-4 h-4 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {langOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 max-h-96 overflow-y-auto">
                                    {Object.entries(supportedLanguages).map(([code, name]) => (
                                        <button
                                            key={code}
                                            onClick={() => {
                                                setLanguage(code as any);
                                                setLangOpen(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm ${language === code ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/#home" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                            {t('nav.home')}
                        </Link>
                        <Link href="/#about" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                            {t('nav.about')}
                        </Link>
                        <Link href="/#services" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                            {t('nav.services')}
                        </Link>
                        <Link href="/#contact" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                            {t('nav.contact')}
                        </Link>

                        <div className="border-t border-gray-200 pt-4 pb-2">
                            <div className="px-3 text-sm font-medium text-gray-500 mb-2">Select Language</div>
                            <div className="grid grid-cols-2 gap-2 px-3">
                                {Object.entries(supportedLanguages).map(([code, name]) => (
                                    <button
                                        key={code}
                                        onClick={() => {
                                            setLanguage(code as any);
                                            toggleMenu();
                                        }}
                                        className={`text-left px-2 py-1 rounded text-sm ${language === code ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
