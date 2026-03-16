'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useState } from 'react';

export default function CalculatorPage() {
    const tTools = useTranslations('Tools');
    const tUI = useTranslations('CalcUI');
    const tHub = useTranslations('CalculatorsHub');
    const tDesc = useTranslations('CalcDesc');
    const tFAQ = useTranslations('CalcFAQ');
    const [inputs, setInputs] = useState<any>({});
    const [result, setResult] = useState<any>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setInputs({...inputs, [id]: e.target.type === 'number' ? Number(e.target.value) : e.target.value});
    };

    const handleReset = () => {
        setInputs({});
        setResult(null);
    };

    const calculate = () => {
        const total_visits = Number(inputs['total_visits']);
        const deviations = Number(inputs['deviations']);
        
        if (total_visits && deviations >= 0) { 
            const rate = (deviations / total_visits) * 100;
            
            let status = tUI('excellent');
            let color = 'text-emerald-400';
            let score = 100 - (rate * 5); // Simple penalty score
            
            if (rate > 10) { status = tUI('critical'); color = 'text-red-500'; }
            else if (rate > 5) { status = tUI('warning'); color = 'text-orange-400'; }
            else if (rate > 2) { status = tUI('good'); color = 'text-blue-400'; }

            setResult({
                rate: rate.toFixed(2),
                status: status,
                color: color,
                score: Math.max(0, Math.min(100, score)).toFixed(0)
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header & Description */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{tTools('protocol-deviation_title')}</h1>
                <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-left leading-relaxed border border-slate-100 shadow-sm">
                    {tDesc('protocol-deviation_desc')}
                </div>
            </div>

            {/* Tool Interface */}
            <Card className="mb-12 shadow-lg border-none bg-white rounded-3xl overflow-hidden">
                <CardContent className="space-y-8 pt-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('total_visits')}</Label>
                            <Input 
                                type="number" 
                                value={inputs['total_visits'] || ''}
                                placeholder={tUI('ex_100')} 
                                onChange={(e) => handleInputChange(e, 'total_visits')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('deviations')}</Label>
                            <Input 
                                type="number" 
                                value={inputs['deviations'] || ''}
                                placeholder={tUI('ex_4')} 
                                onChange={(e) => handleInputChange(e, 'deviations')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <Button 
                            variant="outline" 
                            onClick={handleReset} 
                            className="h-14 px-8 border-2 border-slate-100 rounded-xl font-bold text-slate-500 hover:bg-slate-50"
                        >
                            {tUI('reset_btn')}
                        </Button>
                        <Button onClick={calculate} size="lg" className="flex-1 h-14 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl transition-all active:scale-[0.98]">
                            {tUI('quality_analysis')}
                        </Button>
                    </div>

                    {result && typeof result === 'object' && (
                        <div className="mt-10 animate-in fade-in slide-in-from-top-4">
                            <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div>
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">{tUI('deviation_rate')}</p>
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <span className={`text-6xl font-black ${result.color}`}>{result.rate}</span>
                                            <span className="text-xl text-slate-400 font-bold">%</span>
                                        </div>
                                        <p className={`text-xl font-bold ${result.color}`}>{tUI('status')}: {result.status}</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-32 h-32 rounded-full border-8 border-slate-800 flex items-center justify-center relative shadow-inner">
                                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                {/* Background Circle */}
                                                <circle 
                                                    cx="64" cy="64" r="56" fill="transparent" 
                                                    stroke="rgba(255,255,255,0.05)" strokeWidth="8" 
                                                />
                                                <circle 
                                                    cx="64" cy="64" r="56" fill="transparent" 
                                                    stroke="currentColor" strokeWidth="8" 
                                                    className="text-blue-500 transition-all duration-1000"
                                                    strokeDasharray="351.8"
                                                    strokeDashoffset={351.8 - (351.8 * Number(result.score) / 100)}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <span className="text-3xl font-black">{result.score}</span>
                                        </div>
                                        <p className="mt-2 text-slate-500 text-xs font-bold uppercase tracking-widest">{tUI('score')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* FAQ Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="text-amber-500">💡</span> {tHub('faqHeader').replace('💡 ', '')}
                </h2>
                <Accordion type="single" collapsible className="w-full bg-white rounded-xl border border-slate-200 px-4 shadow-sm">
                    
                    <AccordionItem value="item-0">
                        <AccordionTrigger className="text-left font-semibold text-slate-800 hover:text-blue-600 transition-colors py-4">
                            {tFAQ('protocol-deviation_faq_q0')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {tFAQ('protocol-deviation_faq_a0')}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
