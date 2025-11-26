'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function DeliveryPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white pt-24 pb-12 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        🚀 {t('delivery.hero.title')}
                    </h1>
                    <p className="text-xl max-w-3xl mx-auto">
                        {t('delivery.hero.subtitle')}
                    </p>
                </div>
            </section>

            {/* Career Progression Path */}
            <section className="py-8 px-4">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
                        {t('delivery.journey.title')}
                    </h2>

                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Phase 1: Trial Period */}
                        <div className="bg-white rounded-xl p-8 shadow-lg border-t-4 border-purple-600 hover:shadow-xl transition-shadow">
                            <span className="inline-block bg-purple-100 text-purple-600 px-4 py-1 rounded-full font-semibold mb-4">
                                {t('delivery.phase1.label')}
                            </span>
                            <h3 className="text-2xl font-bold mb-2 text-purple-600">{t('delivery.phase1.title')}</h3>
                            <p className="font-semibold mb-4 text-gray-700">{t('delivery.phase1.subtitle')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase1.point1')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase1.point2')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase1.point3')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase1.point4')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase1.point5')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase1.point6')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase1.point7')}</span>
                                </li>
                            </ul>
                        </div>

                        {/* Phase 2: Fixed Contract */}
                        <div className="bg-white rounded-xl p-8 shadow-lg border-t-4 border-purple-600 hover:shadow-xl transition-shadow">
                            <span className="inline-block bg-purple-100 text-purple-600 px-4 py-1 rounded-full font-semibold mb-4">
                                {t('delivery.phase2.label')}
                            </span>
                            <h3 className="text-2xl font-bold mb-2 text-purple-600">{t('delivery.phase2.title')}</h3>
                            <p className="font-semibold mb-4 text-gray-700">{t('delivery.phase2.subtitle')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase2.point1')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase2.point2')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase2.point3')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase2.point4')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase2.point5')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase2.point6')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase2.point7')}</span>
                                </li>
                            </ul>
                        </div>

                        {/* Phase 3: Permanent Employee */}
                        <div className="bg-white rounded-xl p-8 shadow-lg border-t-4 border-purple-600 hover:shadow-xl transition-shadow">
                            <span className="inline-block bg-purple-100 text-purple-600 px-4 py-1 rounded-full font-semibold mb-4">
                                {t('delivery.phase3.label')}
                            </span>
                            <h3 className="text-2xl font-bold mb-2 text-purple-600">{t('delivery.phase3.title')}</h3>
                            <p className="font-semibold mb-4 text-gray-700">{t('delivery.phase3.subtitle')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase3.point1')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase3.point2')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase3.point3')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase3.point4')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase3.point5')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase3.point6')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase3.point7')}</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 font-bold mr-2">✓</span>
                                    <span className="text-gray-600">{t('delivery.phase3.point8')}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="bg-gray-50 py-8 px-4">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
                        {t('delivery.benefits.title')}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                            <div className="text-5xl mb-4">💰</div>
                            <h4 className="font-bold text-xl mb-2 text-gray-800">{t('delivery.benefits.earn.title')}</h4>
                            <p className="text-gray-600">{t('delivery.benefits.earn.desc')}</p>
                        </div>

                        <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                            <div className="text-5xl mb-4">🏥</div>
                            <h4 className="font-bold text-xl mb-2 text-gray-800">{t('delivery.benefits.medical.title')}</h4>
                            <p className="text-gray-600">{t('delivery.benefits.medical.desc')}</p>
                        </div>

                        <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                            <div className="text-5xl mb-4">📈</div>
                            <h4 className="font-bold text-xl mb-2 text-gray-800">{t('delivery.benefits.growth.title')}</h4>
                            <p className="text-gray-600">{t('delivery.benefits.growth.desc')}</p>
                        </div>

                        <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                            <div className="text-5xl mb-4">🎓</div>
                            <h4 className="font-bold text-xl mb-2 text-gray-800">{t('delivery.benefits.edu.title')}</h4>
                            <p className="text-gray-600">{t('delivery.benefits.edu.desc')}</p>
                        </div>

                        <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                            <div className="text-5xl mb-4">🏦</div>
                            <h4 className="font-bold text-xl mb-2 text-gray-800">{t('delivery.benefits.salary.title')}</h4>
                            <p className="text-gray-600">{t('delivery.benefits.salary.desc')}</p>
                        </div>

                        <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                            <div className="text-5xl mb-4">🛡️</div>
                            <h4 className="font-bold text-xl mb-2 text-gray-800">{t('delivery.benefits.security.title')}</h4>
                            <p className="text-gray-600">{t('delivery.benefits.security.desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Education Program */}
            <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-8 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        🎓 {t('delivery.edu.title')}
                    </h2>
                    <p className="text-lg mb-6">
                        {t('delivery.edu.desc')}
                    </p>

                    <div className="grid md:grid-cols-4 gap-6 mt-10">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <h4 className="font-bold text-lg mb-2">📚 {t('delivery.edu.feat1.title')}</h4>
                            <p className="text-sm">{t('delivery.edu.feat1.desc')}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <h4 className="font-bold text-lg mb-2">💻 {t('delivery.edu.feat2.title')}</h4>
                            <p className="text-sm">{t('delivery.edu.feat2.desc')}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <h4 className="font-bold text-lg mb-2">🎯 {t('delivery.edu.feat3.title')}</h4>
                            <p className="text-sm">{t('delivery.edu.feat3.desc')}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <h4 className="font-bold text-lg mb-2">🏆 {t('delivery.edu.feat4.title')}</h4>
                            <p className="text-sm">{t('delivery.edu.feat4.desc')}</p>
                        </div>
                    </div>

                    <p className="text-sm mt-8 opacity-90">
                        {t('delivery.edu.note')}
                    </p>
                </div>
            </section>

            {/* Eligibility Section */}
            <section className="py-8 px-4">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
                        {t('delivery.eligibility.title')}
                    </h2>
                    <ul className="space-y-3 max-w-2xl mx-auto">
                        <li className="flex items-start">
                            <span className="text-purple-600 font-bold mr-2">✓</span>
                            <span className="text-gray-700">{t('delivery.eligibility.point1')}</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-purple-600 font-bold mr-2">✓</span>
                            <span className="text-gray-700">{t('delivery.eligibility.point2')}</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-purple-600 font-bold mr-2">✓</span>
                            <span className="text-gray-700">{t('delivery.eligibility.point3')}</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-purple-600 font-bold mr-2">✓</span>
                            <span className="text-gray-700">{t('delivery.eligibility.point4')}</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-purple-600 font-bold mr-2">✓</span>
                            <span className="text-gray-700">{t('delivery.eligibility.point5')}</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-purple-600 font-bold mr-2">✓</span>
                            <span className="text-gray-700">{t('delivery.eligibility.point6')}</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-purple-600 font-bold mr-2">✓</span>
                            <span className="text-gray-700">{t('delivery.eligibility.point7')}</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-purple-600 font-bold mr-2">✓</span>
                            <span className="text-gray-700">{t('delivery.eligibility.point8')}</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-8 px-4">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {t('delivery.cta.title')}
                    </h2>
                    <p className="text-lg mb-8">
                        {t('delivery.cta.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/new-rider-contract" className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                            {t('delivery.cta.btn.new')}
                        </a>
                        <a href="/contract" className="bg-purple-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-800 transition-colors border-2 border-white">
                            {t('delivery.cta.btn.existing')}
                        </a>
                    </div>
                </div>
            </section>
        </div >
    );
}
