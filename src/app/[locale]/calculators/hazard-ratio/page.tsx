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

    const calculate = () => {
        const hr = Number(inputs['hr']);
        const lower = Number(inputs['lower']);
        const upper = Number(inputs['upper']);
        
        if (hr > 0 && lower > 0 && upper > 0) { 
            const isSignificant = (lower > 1) || (upper < 1);
            const riskReduction = hr < 1 ? ((1 - hr) * 100).toFixed(1) : ((hr - 1) * 100).toFixed(1);
            
            setResult({
                hr: hr.toFixed(2),
                lower: lower.toFixed(2),
                upper: upper.toFixed(2),
                isSignificant,
                riskReduction,
                benefit: hr < 1 ? tUI('benefit') : tUI('harm'),
                color: hr < 1 ? 'text-emerald-400' : 'text-red-400'
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header & Description */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{tTools('hazard-ratio_title')}</h1>
                <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-left leading-relaxed border border-slate-100 shadow-sm">
                    {tDesc('hazard-ratio_desc')}
                </div>
            </div>

            {/* Tool Interface */}
            <Card className="mb-12 shadow-lg border-none bg-white rounded-3xl overflow-hidden">
                <CardContent className="space-y-8 pt-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">Hazard Ratio (HR)</Label>
                            <Input 
                                type="number" 
                                placeholder={tUI('ex_0_75')} 
                                step="0.01"
                                onChange={(e) => handleInputChange(e, 'hr')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">95% CI (Lower)</Label>
                            <Input 
                                type="number" 
                                placeholder={tUI('ex_0_61')} 
                                step="0.01"
                                onChange={(e) => handleInputChange(e, 'lower')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">95% CI (Upper)</Label>
                            <Input 
                                type="number" 
                                placeholder={tUI('ex_0_92')} 
                                step="0.01"
                                onChange={(e) => handleInputChange(e, 'upper')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                    </div>
                    
                    <Button onClick={calculate} size="lg" className="w-full h-14 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl transition-all active:scale-[0.98]">
                        {tUI('interpret_result')}
                    </Button>

                    {result && typeof result === 'object' && (
                        <div className="mt-10 animate-in fade-in slide-in-from-top-4">
                            <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">{tUI('hazard_ratio_interpret')}</p>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className={`text-6xl font-black ${result.color}`}>{result.hr}</span>
                                        <span className="text-xl text-slate-400 font-bold">HR</span>
                                    </div>
                                    <p className={`text-xl font-bold ${result.isSignificant ? 'text-blue-400' : 'text-amber-400'}`}>
                                        {result.isSignificant ? tUI('significant') : tUI('not_significant')}
                                    </p>
                                    
                                    <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-6">
                                        <div>
                                            <p className="text-slate-500 text-[10px] font-black uppercase mb-1">{tUI('ci_95')}</p>
                                            <p className="text-lg font-bold text-slate-200">{result.lower} - {result.upper}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-500 text-[10px] font-black uppercase mb-1">{tUI('risk_change')}</p>
                                            <p className={`text-lg font-bold ${result.color}`}>{result.benefit} {result.riskReduction}%</p>
                                        </div>
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
                            {tFAQ('hazard-ratio_faq_q0')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {tFAQ('hazard-ratio_faq_a0')}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
