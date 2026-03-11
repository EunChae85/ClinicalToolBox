import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { 
    Pill, 
    CalendarDays, 
    Calculator, 
    ShieldCheck, 
    Download, 
    ArrowRight, 
    CheckCircle2, 
    Zap,
    ClipboardList,
    Stethoscope,
    LineChart,
    PieChart
} from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Guides' });
    return {
        title: t('metaTitle'),
        description: t('metaDesc'),
    };
}

export default function GuidesPage({ params: { locale } }: { params: { locale: string } }) {
    const t = useTranslations('Guides');

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200 overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:20px_20px]" />
                <div className="max-w-5xl mx-auto px-6 py-20 md:py-32 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-6 border border-blue-100">
                        <Zap className="w-4 h-4" />
                        {t('hero_badge')}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-slate-900">
                        {t('title')}
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-16 space-y-24">

                {/* Section 1: Operations */}
                <section className="scroll-mt-24" id="operations">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
                                {t('sections.operations.tag')}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                                {t('sections.operations.title')}
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {t('sections.operations.desc')}
                            </p>
                            <ul className="space-y-4 pt-4">
                                {[1, 2, 3].map((num) => (
                                    <li key={num} className="flex gap-3 text-slate-700">
                                        <CheckCircle2 className="w-6 h-6 text-indigo-500 shrink-0" />
                                        <span>{t(`sections.operations.point${num}`)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-6">
                                <Link href="/calculators" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30">
                                    {t('sections.operations.action')} <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1 w-full rounded-[2rem] shadow-xl border border-slate-100 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-transparent transition-colors z-10" />
                            <Image 
                                src="/images/guide_operations_v2.png" 
                                alt="Operations Guide Demo" 
                                width={800} 
                                height={800} 
                                className="w-full object-cover aspect-square md:aspect-auto md:h-[500px] object-center group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 2: Medical */}
                <section className="scroll-mt-24" id="medical">
                    <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-2">
                                {t('sections.medical.tag')}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                                {t('sections.medical.title')}
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {t('sections.medical.desc')}
                            </p>
                            <ul className="space-y-4 pt-4">
                                {[1, 2, 3].map((num) => (
                                    <li key={num} className="flex gap-3 text-slate-700">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                                        <span>{t(`sections.medical.point${num}`)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-6">
                                <Link href="/calculators" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/30">
                                    {t('sections.medical.action')} <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1 w-full rounded-[2rem] shadow-2xl relative overflow-hidden group border border-slate-100">
                            <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-transparent transition-colors z-10" />
                            <Image 
                                src="/images/guide_medical_v2.png" 
                                alt="Medical Guide Demo" 
                                width={800} 
                                height={800} 
                                className="w-full object-cover aspect-square md:aspect-auto md:h-[500px] object-center group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 3: Statistical */}
                <section className="scroll-mt-24" id="statistical">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">
                                {t('sections.statistical.tag')}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                                {t('sections.statistical.title')}
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {t('sections.statistical.desc')}
                            </p>
                            <ul className="space-y-4 pt-4">
                                {[1, 2, 3].map((num) => (
                                    <li key={num} className="flex gap-3 text-slate-700">
                                        <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                                        <span>{t(`sections.statistical.point${num}`)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-6">
                                <Link href="/calculators" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30">
                                    {t('sections.statistical.action')} <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1 w-full rounded-[2rem] shadow-xl border border-slate-100 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors z-10" />
                            <Image 
                                src="/images/guide_statistical_v2.png" 
                                alt="Statistical Guide Demo" 
                                width={800} 
                                height={800} 
                                className="w-full object-cover aspect-square md:aspect-auto md:h-[500px] object-center group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 4: Pro Features */}
                <section className="pt-16 border-t border-slate-200">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 font-bold text-xs uppercase tracking-widest mb-6">
                            {t('sections.features.tag')}
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{t('sections.features.title')}</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">{t('sections.features.desc')}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
                                <Download className="w-7 h-7 text-rose-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('sections.features.exportTitle')}</h3>
                            <p className="text-slate-600 leading-relaxed">{t('sections.features.exportDesc')}</p>
                        </div>
                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
                                <ShieldCheck className="w-7 h-7 text-teal-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('sections.features.privacyTitle')}</h3>
                            <p className="text-slate-600 leading-relaxed">{t('sections.features.privacyDesc')}</p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-slate-900 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl mt-12">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] -mr-40 -mt-40" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] -ml-40 -mb-40" />
                    
                    <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-5xl font-black text-white">{t('cta.title')}</h2>
                        <p className="text-xl text-slate-300">{t('cta.desc')}</p>
                        <Link href="/calculators" className="inline-block px-8 py-4 bg-white text-slate-900 hover:bg-slate-50 font-bold rounded-2xl text-lg transition-all shadow-xl hover:shadow-white/20 active:scale-95">
                                {t('cta.button')}
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
}
