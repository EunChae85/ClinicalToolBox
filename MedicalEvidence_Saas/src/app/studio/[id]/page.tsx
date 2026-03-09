"use client";

import { useState, useEffect, use } from 'react';
import { ArrowLeft, Download, LayoutTemplate, ImageIcon, MessageSquare, FileText, Share2, Sparkles, ExternalLink, Loader2, BarChart3, Check } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { useRef } from 'react';

export default function ContentStudio({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    let { id } = unwrappedParams;
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [activeTone, setActiveTone] = useState('professional');
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState<any>(null);
    const [generatedContent, setGeneratedContent] = useState<any>(null);
    const [contentId, setContentId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideRef = useRef<HTMLDivElement>(null);
    const isKorean = id.startsWith('ev_ko_');
    const [activeLanguage, setActiveLanguage] = useState(isKorean ? 'ko' : 'en');

    // Fetch PICO structure on mount
    useEffect(() => {
        const fetchAnalysis = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/evidence/structure', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ evidence_id: id })
                });
                const data = await res.json();
                setAnalysis(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysis();
    }, [id]);

    // Fetch content when tab changes or analysis is ready
    useEffect(() => {
        if (!id || !activeTab) return;

        const fetchContent = async () => {
            setGeneratedContent(null);
            setContentId(null);
            setCurrentSlide(0); // Reset index
            try {
                const res = await fetch('/api/content/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ evidence_id: id, type: activeTab, tone: activeTone, language: activeLanguage })
                });
                const data = await res.json();
                setGeneratedContent(data.content);
                setContentId(data.content_id);
            } catch (err) {
                console.error(err);
            }
        };
        fetchContent();
    }, [id, activeTab]);

    const handleCopyLink = () => {
        if (!contentId) return;
        const url = `${window.location.origin}/p/${contentId}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = async () => {
        if (!slideRef.current) return;
        setDownloading(true);
        try {
            const dataUrl = await htmlToImage.toPng(slideRef.current, { cacheBust: true, pixelRatio: 2 });
            download(dataUrl, `evidenceflow-slide-${currentSlide + 1}.png`);
        } catch (err) {
            console.error('Failed to export image', err);
        } finally {
            setDownloading(false);
        }
    };

    const renderHighlightedText = (text: string, highlights?: string[]) => {
        if (!highlights || highlights.length === 0 || !text) return text;

        let highlighted = text;
        highlights.forEach(word => {
            if (!word) return;
            const regex = new RegExp(`(${word.replace(/[.*+?^$\{key}()[\]\\]/g, '\\$&')})`, 'gi');
            highlighted = highlighted.replace(regex, '||$1||');
        });

        return highlighted.split('||').map((part, i) => {
            const isHighlight = highlights.some(h => h.toLowerCase() === part.toLowerCase());
            return isHighlight ? <span key={i} className="bg-white/20 text-white px-1.5 py-0.5 rounded font-black shadow-sm">{part}</span> : part;
        });
    };

    const contentTypes = [
        { id: 'card_news', label: 'Card News', icon: LayoutTemplate, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { id: 'sns_thread', label: 'SNS Thread', icon: MessageSquare, color: 'text-sky-600', bg: 'bg-sky-50' },
        { id: 'blog', label: 'Blog Post', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-bold animate-pulse">Analyzing Evidence with GPT-4o...</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#f1f5f9] flex flex-col overflow-hidden">
            {/* Top Navigation */}
            <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm font-bold text-slate-900 uppercase tracking-widest leading-none">Content Studio</h1>
                            <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200 uppercase">AI Active</span>
                        </div>
                        <p className="text-xs text-slate-500 font-sans mt-0.5 truncate max-w-[400px]">
                            {analysis?.title || 'Medical Evidence Analysis'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {contentId && (
                        <button
                            onClick={handleCopyLink}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border ${copied ? 'bg-green-50 text-green-600 border-green-200' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-600 hover:text-blue-600'}`}
                        >
                            {copied ? <Check size={16} /> : <Share2 size={16} />}
                            {copied ? '링크 복사됨' : '공유 링크 복사'}
                        </button>
                    )}
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                        <Download size={16} />
                        웹에 퍼블리싱
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Modern Sidebar */}
                <aside className="w-80 bg-white border-r border-slate-200 flex flex-col p-6 shrink-0 overflow-y-auto">
                    <div className="mb-10">
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Output Format 선택</h2>
                        <div className="space-y-2">
                            {contentTypes.map(type => {
                                const Icon = type.icon;
                                const isActive = activeTab === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setActiveTab(type.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 text-left ${isActive
                                            ? `bg-white border-blue-600 shadow-xl shadow-blue-500/5 ring-1 ring-blue-600/20 scale-[1.02]`
                                            : `bg-white border-slate-100 hover:border-slate-300 shadow-sm`
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2.5 rounded-xl ${isActive ? type.bg + ' ' + type.color : 'bg-slate-100 text-slate-400'}`}>
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{type.label}</p>
                                                <p className="text-[10px] text-slate-400 font-sans leading-none mt-1">GPT-4o Managed</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Content Style / Target</h2>
                        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                            {[
                                { id: 'professional', label: 'Pro (전문가)' },
                                { id: 'educational', label: 'Edu (교육용)' },
                                { id: 'social_hook', label: 'Viral (SNS용)' }
                            ].map(tone => (
                                <button
                                    key={tone.id}
                                    onClick={() => setActiveTone(tone.id)}
                                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${activeTone === tone.id ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {tone.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Output Language (출력 언어)</h2>
                        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                            {[
                                { id: 'ko', label: 'Korean (한국어)' },
                                { id: 'en', label: 'English (영어)' }
                            ].map(lang => (
                                <button
                                    key={lang.id}
                                    onClick={() => setActiveLanguage(lang.id)}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeLanguage === lang.id ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                            <h3 className="text-xs font-bold text-slate-900 mb-2">논문 핵심 요약 (PICO)</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">대상 (Population)</p>
                                    <p className="text-[11px] text-slate-700 font-sans line-clamp-2">{analysis?.population || '분석 중...'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">중재 (Intervention)</p>
                                    <p className="text-[11px] text-slate-700 font-sans line-clamp-2">{analysis?.intervention || '분석 중...'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Advanced Preview Area */}
                <main className="flex-1 p-10 overflow-y-auto bg-[#f8fafc] flex flex-col items-center">
                    <div className="w-full max-w-5xl">
                        {/* Rendering Canvas */}
                        <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-2xl shadow-slate-200/40 p-12 min-h-[600px] flex items-center justify-center relative overflow-hidden transform hover:shadow-blue-500/5 transition-all">
                            {!activeTab ? (
                                <div className="text-center w-full max-w-2xl">
                                    <div className="mb-10">
                                        <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <Sparkles size={32} />
                                        </div>
                                        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">AI 콘텐츠 생성을 시작합니다</h2>
                                        <p className="text-slate-500 font-sans">원하는 결과물 형식을 선택해 주세요. GPT-4o가 논문을 분석하여 맞춤형 콘텐츠를 생성합니다.</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-6">
                                        {contentTypes.map(type => {
                                            const Icon = type.icon;
                                            return (
                                                <button
                                                    key={type.id}
                                                    onClick={() => setActiveTab(type.id)}
                                                    className="group p-8 rounded-[32px] border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 text-center"
                                                >
                                                    <div className={`h-14 w-14 rounded-2xl ${type.bg} ${type.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                                                        <Icon size={28} />
                                                    </div>
                                                    <p className="font-bold text-slate-900 break-keep">{type.label}</p>
                                                    <div className="mt-4 flex items-center justify-center text-[10px] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                                                        Select <ExternalLink size={10} className="ml-1" />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : !generatedContent ? (
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">AI 콘텐츠 생성 중...</p>
                                </div>
                            ) : (
                                <div className="w-full max-w-3xl">
                                    {activeTab === 'card_news' && (
                                        <div className="flex flex-col items-center gap-10">
                                            <div className="aspect-square w-full max-w-md mx-auto relative group">
                                                <div
                                                    ref={slideRef}
                                                    className="relative aspect-square bg-white rounded-[32px] border-2 border-slate-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-12 flex flex-col justify-between text-slate-900 transition-all duration-500 overflow-hidden"
                                                >
                                                    {/* Decorative Elements */}
                                                    <div className="absolute top-0 right-0 h-40 w-40 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>

                                                    <div className="z-10 flex items-center justify-between">
                                                        <div className="bg-slate-900 text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.2em]">
                                                            Insight {currentSlide + 1}
                                                        </div>
                                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                                                    </div>

                                                    <div className="z-10 flex-col flex-1 flex justify-center mt-6">
                                                        <h3 className="text-2xl font-black mb-8 leading-[1.2] tracking-tight text-slate-900">
                                                            {renderHighlightedText(generatedContent.slides?.[currentSlide]?.title, generatedContent.slides?.[currentSlide]?.highlight_words)}
                                                        </h3>

                                                        {generatedContent.slides?.[currentSlide]?.chart && (
                                                            <div className="h-44 w-full bg-slate-50/80 rounded-2xl p-6 mb-8 border border-slate-100 shadow-inner">
                                                                <ResponsiveContainer width="100%" height="100%">
                                                                    <BarChart data={generatedContent.slides[currentSlide].chart.data}>
                                                                        <XAxis
                                                                            dataKey="label"
                                                                            axisLine={false}
                                                                            tickLine={false}
                                                                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: '800' }}
                                                                            dy={10}
                                                                        />
                                                                        <YAxis hide domain={[0, 'auto']} />
                                                                        <Tooltip
                                                                            cursor={{ fill: 'rgba(59,130,246,0.05)' }}
                                                                            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                                                        />
                                                                        <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                                                                            {generatedContent.slides[currentSlide].chart.data.map((entry: any, index: number) => (
                                                                                <Cell key={`cell-${index}`} fill={index === 0 ? '#2563eb' : '#cbd5e1'} />
                                                                            ))}
                                                                            <LabelList dataKey="value" position="top" fill="#1e293b" fontSize={12} fontWeight="900" dy={-10} />
                                                                        </Bar>
                                                                    </BarChart>
                                                                </ResponsiveContainer>
                                                            </div>
                                                        )}

                                                        <p className="text-base text-slate-600 leading-relaxed font-bold">
                                                            {renderHighlightedText(generatedContent.slides?.[currentSlide]?.text || generatedContent.slides?.[currentSlide]?.content || 'Content analysis complete.', generatedContent.slides?.[currentSlide]?.highlight_words)}
                                                        </p>
                                                    </div>

                                                    <div className="z-10 flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                                            <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Scientific Evidence</span>
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-sm">
                                                            {String(currentSlide + 1).padStart(2, '0')} / {String(generatedContent.slides?.length || 0).padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="absolute inset-y-0 -left-16 flex items-center">
                                                    <button
                                                        disabled={currentSlide === 0}
                                                        onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                                                        className="h-10 w-10 bg-white shadow-lg border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        <ArrowLeft size={18} />
                                                    </button>
                                                </div>
                                                <div className="absolute inset-y-0 -right-16 flex items-center">
                                                    <button
                                                        disabled={currentSlide === (generatedContent.slides?.length || 0) - 1}
                                                        onClick={() => setCurrentSlide(prev => Math.min((generatedContent.slides?.length || 1) - 1, prev + 1))}
                                                        className="h-10 w-10 bg-white shadow-lg border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        <ArrowLeft size={18} className="rotate-180" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center gap-4">
                                                <div className="flex gap-2">
                                                    {generatedContent.slides?.map((_: any, idx: number) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setCurrentSlide(idx)}
                                                            className={`h-1.5 rounded-full transition-all ${currentSlide === idx ? 'w-8 bg-blue-600' : 'w-1.5 bg-slate-200 hover:bg-slate-300'}`}
                                                        ></button>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={handleDownload}
                                                    disabled={downloading}
                                                    className="flex items-center gap-2 mt-4 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 disabled:animate-pulse"
                                                >
                                                    <Download size={18} />
                                                    {downloading ? '이미지 저장 중...' : 'SNS용 PNG 다운로드'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'sns_thread' && (
                                        <div className="w-full max-w-lg mx-auto space-y-4">
                                            {(generatedContent.thread || [generatedContent]).map((post: any, i: number) => (
                                                <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/20 relative">
                                                    <div className="flex items-start gap-4">
                                                        <div className="h-10 w-10 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
                                                            {i + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5 mb-1">
                                                                <p className="font-bold text-slate-900 truncate">EvidenceFlow AI</p>
                                                                <span className="text-slate-400 text-xs font-sans">@medical_insight</span>
                                                            </div>
                                                            <p className="text-slate-700 text-sm leading-relaxed font-sans mb-3 font-medium whitespace-pre-wrap">
                                                                {post.content || post.text || JSON.stringify(post)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'blog' && (
                                        <div className="text-left w-full max-w-2xl mx-auto">
                                            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
                                                {generatedContent.title || 'Medical Insight Report'}
                                            </h2>
                                            <div className="prose prose-slate prose-lg font-sans text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                {generatedContent.body || generatedContent.content || JSON.stringify(generatedContent)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div >
        </div >
    );
}
