'use client';

import { BookOpen, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function QuickBanner() {
    const t = useTranslations('Feedback');

    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
            <a 
                href="https://buildstudio2026.github.io/RA/" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-5 bg-white/90 backdrop-blur-xl border border-slate-200/50 p-4 pr-12 rounded-l-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.25)] hover:-translate-x-3 transition-all duration-500 ease-out"
            >
                {/* Floating Shadow Decoration */}
                <div className="absolute -z-10 bg-blue-600/10 blur-3xl w-24 h-24 rounded-full -left-12 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                {/* Main Icon Container - Modern Squircle */}
                <div className="relative">
                    <div className="w-16 h-16 bg-slate-950 rounded-[1.5rem] flex items-center justify-center transform group-hover:rotate-[15deg] transition-all duration-500 shadow-2xl shadow-slate-400/20 group-hover:bg-blue-600">
                        <BookOpen className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                    </div>
                    {/* Decorative Sparkle Badge */}
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 p-2 rounded-xl shadow-lg group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500 border-2 border-white">
                        <Sparkles className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="inline-flex items-center gap-2 mb-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-full w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 group-hover:bg-white"></span>
                        </span>
                        Library
                    </div>
                    <span className="text-[16px] font-black text-slate-800 leading-tight whitespace-pre-line tracking-tight group-hover:text-blue-700 transition-colors">
                        {t('quickBanner')}
                    </span>
                </div>
                
                {/* Visual Hint / Accent line */}
                <div className="absolute right-4 w-1.5 h-12 bg-slate-100 rounded-full group-hover:bg-blue-200 transition-colors"></div>
            </a>
        </div>
    );
}
