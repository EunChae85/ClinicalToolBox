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
    const [mode, setMode] = useState<string>('mean');

    const handleModeChange = (newMode: string) => {
        setMode(newMode);
        setResult(null);
        setInputs({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setInputs({...inputs, [id]: e.target.type === 'number' ? Number(e.target.value) : e.target.value});
    };

    const calculate = () => {
        const n = Number(inputs['n']);
        const z = 1.96; // 95% CI
        
        if (mode === 'mean') {
            const mean = Number(inputs['mean']);
            const std = Number(inputs['std']);
            if (mean && std && n > 0) {
                const margin = z * (std / Math.sqrt(n));
                setResult({
                    lower: (mean - margin).toFixed(3),
                    upper: (mean + margin).toFixed(3),
                    margin: margin.toFixed(3),
                    type: 'Mean'
                });
            }
        } else {
            const p = Number(inputs['p']) / 100; // Expected proportion in %
            if (p > 0 && p < 1 && n > 0) {
                const margin = z * Math.sqrt((p * (1 - p)) / n);
                setResult({
                    lower: ((p - margin) * 100).toFixed(2),
                    upper: ((p + margin) * 100).toFixed(2),
                    margin: (margin * 100).toFixed(2),
                    type: 'Proportion (%)'
                });
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header & Description */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{tTools('confidence-interval_title')}</h1>
                <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-left leading-relaxed border border-slate-100 shadow-sm">
                    {tDesc('confidence-interval_desc')}
                </div>
            </div>

            {/* Tool Interface */}
            <Card className="mb-12 shadow-lg border-none bg-white rounded-3xl overflow-hidden">
                <CardContent className="space-y-8 pt-10">
                    <div className="flex bg-slate-100 p-1 rounded-xl h-12 w-full md:w-80">
                        <button 
                            onClick={() => handleModeChange('mean')}
                            className={`flex-1 rounded-lg text-sm font-bold transition-all ${mode === 'mean' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            {tUI('mean')}
                        </button>
                        <button 
                            onClick={() => handleModeChange('prop')}
                            className={`flex-1 rounded-lg text-sm font-bold transition-all ${mode === 'prop' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            {tUI('proportion')}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {mode === 'mean' ? (
                            <>
                                <div className="space-y-3">
                                    <Label className="font-bold text-slate-700">{tUI('sample_mean')}</Label>
                                    <Input 
                                        type="number" 
                                        value={inputs['mean'] || ''}
                                        placeholder={tUI('ex_70')} 
                                        onChange={(e) => handleInputChange(e, 'mean')} 
                                        className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-bold text-slate-700">{tUI('sample_sd')}</Label>
                                    <Input 
                                        type="number" 
                                        value={inputs['std'] || ''}
                                        placeholder={tUI('ex_12')} 
                                        onChange={(e) => handleInputChange(e, 'std')} 
                                        className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="space-y-3">
                                <Label className="font-bold text-slate-700">{tUI('proportion')} (%)</Label>
                                <Input 
                                    type="number" 
                                    value={inputs['p'] || ''}
                                    placeholder="45"
                                    onChange={(e) => handleInputChange(e, 'p')} 
                                    className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                                />
                            </div>
                        )}
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('sample_size_n')}</Label>
                            <Input 
                                type="number" 
                                value={inputs['n'] || ''}
                                placeholder={tUI('ex_100')} 
                                onChange={(e) => handleInputChange(e, 'n')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                    </div>
                    
                    <Button onClick={calculate} size="lg" className="w-full h-14 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl transition-all active:scale-[0.98]">
                        {tUI('calc_btn')}
                    </Button>

                    {result && typeof result === 'object' && (
                        <div className="mt-10 animate-in fade-in slide-in-from-top-4">
                            <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">{tUI('ci_95')} - {result.type === 'Mean' ? tUI('mean') : tUI('proportion')}</p>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-5xl font-black text-blue-400">{result.lower} ~ {result.upper}</span>
                                    </div>
                                    <p className="text-xl font-bold text-slate-500">{tUI('margin_of_error')}: ±{result.margin}</p>
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
                            {tFAQ('confidence-interval_faq_q0')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {tFAQ('confidence-interval_faq_a0')}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
