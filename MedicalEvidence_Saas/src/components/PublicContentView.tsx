"use client";

import { useState, useRef } from 'react';
import { LayoutTemplate, MessageSquare, FileText, Share2, Copy, Check, Download, ExternalLink, ArrowLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import Link from 'next/link';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

export default function PublicContentView({ asset }: { asset: any }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const slideRef = useRef<HTMLDivElement>(null);
    const evidence = asset.evidence_items;
    const analysis = asset.evidence_structures?.[0] || {};
    const content = asset.content_json;
    const type = asset.content_type;

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
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

        // Very basic highlighter for MVP
        let highlighted = text;
        highlights.forEach(word => {
            if (!word) return;
            // Case-insensitive replace for the exact highlighted word to wrap in a span
            const regex = new RegExp(`(${word.replace(/[.*+?^$\{key}()[\]\\]/g, '\\$&')})`, 'gi');
            highlighted = highlighted.replace(regex, '||$1||');
        });

        return highlighted.split('||').map((part, i) => {
            const isHighlight = highlights.some(h => h.toLowerCase() === part.toLowerCase());
            return isHighlight ? <span key={i} className="bg-white/20 text-white px-1.5 py-0.5 rounded font-black shadow-sm">{part}</span> : part;
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Header / Brand */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-2">
                    <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <Share2 size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">EvidenceFlow</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">의학 논문 콘텐츠 요약</p>
                    </div>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? '링크 복사됨!' : '공유 링크 복사'}
                </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden mb-12">
                <div className="p-1 pr-1 pl-1 bg-slate-50 border-b border-slate-100 flex items-center justify-center py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {type.replace('_', ' ')} 콘텐츠 미리보기
                </div>

                <div className="p-12">
                    {type === 'card_news' && (
                        <div className="flex flex-col items-center gap-10">
                            <div className="aspect-square w-full max-w-lg mx-auto relative group">
                                <div
                                    ref={slideRef}
                                    className="relative aspect-square bg-white rounded-[40px] border-2 border-slate-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-12 flex flex-col justify-between text-slate-900 transition-all duration-500 overflow-hidden"
                                >
                                    {/* Decorative Elements */}
                                    <div className="absolute top-0 right-0 h-48 w-48 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-24 -mt-24"></div>

                                    <div className="z-10 flex items-center justify-between">
                                        <div className="bg-slate-900 text-white px-4 py-1.5 rounded-md text-[11px] font-black uppercase tracking-[0.2em]">
                                            Insight {currentSlide + 1}
                                        </div>
                                        <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></div>
                                    </div>

                                    <div className="z-10 flex-col flex-1 flex justify-center mt-6">
                                        <h3 className="text-3xl font-black mb-8 leading-[1.2] tracking-tight text-slate-900">
                                            {renderHighlightedText(content.slides?.[currentSlide]?.title, content.slides?.[currentSlide]?.highlight_words)}
                                        </h3>

                                        {content.slides?.[currentSlide]?.chart && (
                                            <div className="h-48 w-full bg-slate-50/80 rounded-[24px] p-6 mb-8 border border-slate-100 shadow-inner">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={content.slides[currentSlide].chart.data}>
                                                        <XAxis
                                                            dataKey="label"
                                                            axisLine={false}
                                                            tickLine={false}
                                                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: '800' }}
                                                            dy={10}
                                                        />
                                                        <YAxis hide domain={[0, 'auto']} />
                                                        <Bar dataKey="value" radius={[8, 8, 0, 0]} isAnimationActive={false}>
                                                            {content.slides[currentSlide].chart.data.map((entry: any, index: number) => (
                                                                <Cell key={`cell-${index}`} fill={index === 0 ? '#2563eb' : '#cbd5e1'} />
                                                            ))}
                                                            <LabelList dataKey="value" position="top" fill="#1e293b" fontSize={14} fontWeight="900" dy={-10} />
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}

                                        <p className="text-xl text-slate-600 leading-relaxed font-bold">
                                            {renderHighlightedText(content.slides?.[currentSlide]?.text, content.slides?.[currentSlide]?.highlight_words)}
                                        </p>
                                    </div>

                                    <div className="z-10 flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2.5 w-2.5 rounded-full bg-blue-600"></div>
                                            <span className="text-[11px] font-black tracking-widest uppercase text-slate-400">EvidenceFlow Insight</span>
                                        </div>
                                        <span className="text-[11px] font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-sm">
                                            {String(currentSlide + 1).padStart(2, '0')} / {String(content.slides?.length || 0).padStart(2, '0')}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    disabled={currentSlide === 0}
                                    onClick={() => setCurrentSlide(prev => prev - 1)}
                                    className="absolute left-[-20px] top-1/2 -translate-y-1/2 h-10 w-10 bg-white shadow-xl border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 disabled:opacity-0 transition-all"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <button
                                    disabled={currentSlide === (content.slides?.length || 0) - 1}
                                    onClick={() => setCurrentSlide(prev => prev + 1)}
                                    className="absolute right-[-20px] top-1/2 -translate-y-1/2 h-10 w-10 bg-white shadow-xl border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 disabled:opacity-0 transition-all"
                                >
                                    <ArrowLeft size={18} className="rotate-180" />
                                </button>
                            </div>
                            <div className="flex gap-2">
                                {content.slides?.map((_: any, idx: number) => (
                                    <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1.5 rounded-full transition-all ${currentSlide === idx ? 'w-8 bg-blue-600' : 'w-1.5 bg-slate-200'}`} />
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
                    )}

                    {type === 'sns_thread' && (
                        <div className="w-full max-w-lg mx-auto space-y-4">
                            {content.thread?.map((post: any, i: number) => (
                                <div key={i} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                                    <p className="text-slate-800 text-lg leading-relaxed font-sans whitespace-pre-wrap">{post.content}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {type === 'blog' && (
                        <div className="text-left w-full max-w-2xl mx-auto">
                            <h1 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight">{content.title}</h1>
                            <div className="prose prose-slate prose-lg font-sans text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {content.content}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Study Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-8 rounded-[32px] border border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Original Publication</p>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">{evidence.title}</h4>
                    <p className="text-xs text-slate-500">{evidence.journal}, {evidence.year}</p>
                    <p className="text-[10px] text-slate-400 mt-2">PMID: {evidence.pmid}</p>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 md:col-span-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Study Summary (AI Analyzed)</p>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">대상 (Population)</p>
                            <p className="text-xs text-slate-600 font-sans leading-normal">{analysis.population}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">중재 (Intervention)</p>
                            <p className="text-xs text-slate-600 font-sans leading-normal">{analysis.intervention}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-12 border-t border-slate-200">
                <p className="text-slate-400 text-sm font-bold">Created with <span className="text-blue-600">EvidenceFlow</span></p>
                <div className="mt-4 flex items-center justify-center gap-4">
                    <Link href="/" className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">플랫폼 홈</Link>
                    <Link href="/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">무료로 시작하기</Link>
                </div>
            </div>
        </div>
    );
}
