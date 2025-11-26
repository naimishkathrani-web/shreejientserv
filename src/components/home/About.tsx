"use client";

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
    const { t } = useLanguage();

    return (
        <section id="about" className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {t('about.heading')}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {t('about.tagline')}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-purple-600">
                            {t('about.who_we_are')}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            {t('about.para1')}
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            With our extensive network and industry expertise, we specialize in three key sectors: delivery and logistics personnel, BPO and BFSI staffing, and IT recruitment. Our commitment to quality and client satisfaction has made us a trusted partner for businesses seeking reliable workforce solutions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-purple-50 p-5 rounded-xl text-center hover:shadow-md transition-shadow">
                            <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
                            <div className="text-sm text-gray-600">{t('about.stats.candidates')}</div>
                        </div>
                        <div className="bg-purple-50 p-5 rounded-xl text-center hover:shadow-md transition-shadow">
                            <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                            <div className="text-sm text-gray-600">{t('about.stats.partners')}</div>
                        </div>
                        <div className="bg-purple-50 p-5 rounded-xl text-center hover:shadow-md transition-shadow">
                            <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
                            <div className="text-sm text-gray-600">{t('about.stats.sectors')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
