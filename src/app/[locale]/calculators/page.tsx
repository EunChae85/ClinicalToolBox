import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import AdSlot from '@/components/ads/AdSlot';

export default function CalculatorsPage() {
    const tTools = useTranslations('Tools');
    const tUI = useTranslations('CalcUI');
    const tHub = useTranslations('CalculatorsHub');

    return (
        <div className="container mx-auto px-4 py-16 max-w-7xl">
            {/* Hero Section */}
            <div className="mb-20 text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -z-10"></div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-800 bg-clip-text text-transparent">
                    {tHub('heroTitle')}
                </h1>
                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed whitespace-pre-line">
                    {tHub('heroDesc')}
                </p>
                <div className="mt-8 flex justify-center gap-3">
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                        {tHub('heroBadge')}
                    </span>
                    <span className="px-4 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-full border border-slate-100 italic">
                        {tHub('heroVerified')}
                    </span>
                </div>
            </div>

            {/* Hub Introduction - More unique content for AdSense */}
            <div className="mb-20 grid md:grid-cols-2 gap-8 bg-slate-50/50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800">{tHub('ValueProp.title')}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm font-medium">
                        {tHub('ValueProp.p1')}
                    </p>
                </div>
                <div className="space-y-4">
                    <div className="h-1 w-12 bg-blue-600/20 rounded-full mb-6"></div>
                    <p className="text-slate-600 leading-relaxed text-sm font-medium">
                        {tHub('ValueProp.p2')}
                    </p>
                </div>
            </div>

            <div className="space-y-24">
                {/* Clinical Section */}
                <div id="clinical">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-200">🚀</div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{tHub('sectionOperations')}</h2>
                            <p className="text-sm text-slate-400 font-medium">{tHub('sectionOperationsDesc')}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Link key="schedule" href="/schedule" className="group p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-100 transition-all flex flex-col items-start space-y-4 text-slate-800 text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -z-10 opacity-50 transition-transform group-hover:scale-110"></div>
                            <div className="flex w-full justify-between items-start">
                                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-6">🗓️</div>
                                <div className="flex gap-1">
                                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black rounded-md border border-red-100">PDF</span>
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-md border border-emerald-100">EXCEL</span>
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md border border-blue-100">CSV</span>
                                </div>
                            </div>
                            <div className="z-10">
                                <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">{tTools('schedule_title')}</h3>
                                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tTools('schedule_subtitle')}</p>
                            </div>
                        </Link>

                        {[
                            { id: 'visit-window', icon: '📅' },
                            { id: 'enrollment-rate', icon: '📈' },
                            { id: 'study-duration', icon: '⏳' },
                            { id: 'dropout-rate', icon: '📉' },
                            { id: 'screening-failure', icon: '❌' },
                            { id: 'protocol-deviation', icon: '⚠️' },
                            { id: 'randomization', icon: '🎲' }
                        ].map(tool => (
                            <Link key={tool.id} href={`/calculators/${tool.id}`} className="group p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-100 transition-all flex flex-col items-start space-y-4 text-slate-800 text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -z-10 opacity-50 transition-transform group-hover:scale-110"></div>
                                <div className="flex w-full justify-between items-start pt-1">
                                    <div className="w-12 h-12 bg-slate-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-6">{tool.icon}</div>
                                </div>
                                <div className="z-10">
                                    <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">{tTools(`${tool.id}_title`)}</h3>
                                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tTools(`${tool.id}_subtitle`)}</p>
                                </div>
                            </Link>
                        ))}

                        <Link key="compliance" href="/compliance" className="group p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-100 transition-all flex flex-col items-start space-y-4 text-slate-800 text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -z-10 opacity-50 transition-transform group-hover:scale-110"></div>
                            <div className="flex w-full justify-between items-start pb-1">
                                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-6">💊</div>
                                <div className="flex gap-1">
                                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-black rounded-md border border-red-100">PDF</span>
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-md border border-emerald-100">EXCEL</span>
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md border border-blue-100">CSV</span>
                                </div>
                            </div>
                            <div className="z-10">
                                <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">{tTools('compliance_title')}</h3>
                                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tTools('compliance_subtitle')}</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Medical Section */}
                <div id="medical">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-200">🩺</div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{tHub('sectionMedical')}</h2>
                            <p className="text-sm text-slate-400 font-medium">{tHub('sectionMedicalDesc')}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { id: 'bmi', icon: '⚖️' },
                            { id: 'bsa', icon: '🧍' },
                            { id: 'dose', icon: '💊' },
                            { id: 'egfr', icon: '🔬' },
                            { id: 'creatinine-clearance', icon: '🩸' },
                            { id: 'infusion-rate', icon: '💧' },
                            { id: 'unit-converter', icon: '📏' }
                        ].map(tool => (
                            <Link key={tool.id} href={`/calculators/${tool.id}`} className="group p-6 bg-white border border-slate-200 rounded-3xl hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-100 transition-all flex flex-col items-start space-y-4 text-slate-800 text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-bl-full -z-10 opacity-50 transition-transform group-hover:scale-110"></div>
                                <div className="w-12 h-12 bg-slate-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-6">{tool.icon}</div>
                                <div className="z-10">
                                    <h3 className="text-lg font-bold group-hover:text-emerald-600 transition-colors">{tTools(`${tool.id}_title`)}</h3>
                                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tTools(`${tool.id}_subtitle`)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Statistical Section */}
                <div id="statistical">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-amber-200">📊</div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{tHub('sectionStatistical')}</h2>
                            <p className="text-sm text-slate-400 font-medium">{tHub('sectionStatisticalDesc')}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { id: 'sample-size', icon: '📉' },
                            { id: 'confidence-interval', icon: '📈' },
                            { id: 'odds-ratio', icon: '⚖️' },
                            { id: 'hazard-ratio', icon: '⏳' },
                            { id: 'p-value', icon: '📉' }
                        ].map(tool => (
                            <Link key={tool.id} href={`/calculators/${tool.id}`} className="group p-6 bg-white border border-slate-200 rounded-3xl hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-100 transition-all flex flex-col items-start space-y-4 text-slate-800 text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/50 rounded-bl-full -z-10 opacity-50 transition-transform group-hover:scale-110"></div>
                                <div className="w-12 h-12 bg-slate-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-amber-600 group-hover:text-white transition-all transform group-hover:rotate-6">{tool.icon}</div>
                                <div className="z-10">
                                    <h3 className="text-lg font-bold group-hover:text-amber-600 transition-colors">{tTools(`${tool.id}_title`)}</h3>
                                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tTools(`${tool.id}_subtitle`)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <AdSlot slot="calculators-hub-footer" />
        </div>
    );
}
