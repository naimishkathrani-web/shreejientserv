'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function ITPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50">
            <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white pt-24 pb-12 px-4">
                <div className="container mx-auto text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('it.hero.title')}</h1>
                    <p className="text-xl">{t('it.hero.subtitle')}</p>
                </div>
            </section>

            <section className="py-8 px-4 bg-white">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">{t('it.overview.heading')}</h2>
                    <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">
                        {t('it.overview.desc')}
                    </p>
                </div>
            </section>

            <section className="py-8 px-4">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">{t('it.methodology.heading')}</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="text-3xl font-bold text-purple-600 mb-3">01</div>
                            <h3 className="text-xl font-bold mb-2 text-gray-800">{t('it.methodology.step1.title')}</h3>
                            <p className="text-gray-600 text-sm">{t('it.methodology.step1.desc')}</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="text-3xl font-bold text-purple-600 mb-3">02</div>
                            <h3 className="text-xl font-bold mb-2 text-gray-800">{t('it.methodology.step2.title')}</h3>
                            <p className="text-gray-600 text-sm">{t('it.methodology.step2.desc')}</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="text-3xl font-bold text-purple-600 mb-3">03</div>
                            <h3 className="text-xl font-bold mb-2 text-gray-800">{t('it.methodology.step3.title')}</h3>
                            <p className="text-gray-600 text-sm">{t('it.methodology.step3.desc')}</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="text-3xl font-bold text-purple-600 mb-3">04</div>
                            <h3 className="text-xl font-bold mb-2 text-gray-800">{t('it.methodology.step4.title')}</h3>
                            <p className="text-gray-600 text-sm">{t('it.methodology.step4.desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-8 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">{t('it.staffing.heading')}</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-xl p-6 border-t-4 border-purple-600">
                            <h3 className="text-lg font-bold mb-3 text-gray-800">{t('it.staffing.dev.title')}</h3>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• {t('it.staffing.dev.point1')}</li>
                                <li>• {t('it.staffing.dev.point2')}</li>
                                <li>• {t('it.staffing.dev.point3')}</li>
                                <li>• {t('it.staffing.dev.point4')}</li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 border-t-4 border-purple-600">
                            <h3 className="text-lg font-bold mb-3 text-gray-800">{t('it.staffing.infra.title')}</h3>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• {t('it.staffing.infra.point1')}</li>
                                <li>• {t('it.staffing.infra.point2')}</li>
                                <li>• {t('it.staffing.infra.point3')}</li>
                                <li>• {t('it.staffing.infra.point4')}</li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 border-t-4 border-purple-600">
                            <h3 className="text-lg font-bold mb-3 text-gray-800">{t('it.staffing.emerging.title')}</h3>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• {t('it.staffing.emerging.point1')}</li>
                                <li>• {t('it.staffing.emerging.point2')}</li>
                                <li>• {t('it.staffing.emerging.point3')}</li>
                                <li>• {t('it.staffing.emerging.point4')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-12 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('contact.tagline')}</h2>
                    <p className="text-xl mb-6">{t('contact.heading')}</p>
                    <a href="/#contact" className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold text-lg hover:shadow-xl transition-all">{t('hero.btn_contact')}</a>
                </div>
            </section>
        </div>
    );
}
