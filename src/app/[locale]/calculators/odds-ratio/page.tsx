'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AdSlot from '@/components/ads/AdSlot';
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
        const a = Number(inputs['ae']);
        const b = Number(inputs['be']);
        const c = Number(inputs['ce']);
        const d = Number(inputs['de']);
        
        if (a >= 0 && b >= 0 && c >= 0 && d >= 0 && (b*c !== 0)) { 
            const or = (a * d) / (b * c); 
            
            // Standard Error of ln(OR)
            const seLnOR = Math.sqrt(1/a + 1/b + 1/c + 1/d);
            const z = 1.96; // 95% CI
            
            const lowerCI = Math.exp(Math.log(or) - z * seLnOR);
            const upperCI = Math.exp(Math.log(or) + z * seLnOR);

            setResult({
                or: or.toFixed(3),
                lower: lowerCI.toFixed(3),
                upper: upperCI.toFixed(3),
                interpretation: or > 1 ? tUI('increased_risk') : or < 1 ? tUI('reduced_risk') : tUI('no_diff')
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header & Description */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{tTools('odds-ratio_title')}</h1>
                <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-left leading-relaxed border border-slate-100 shadow-sm">
                    {tDesc('odds-ratio_desc')}
                </div>
            </div>

            {/* Tool Interface */}
            <Card className="mb-12 shadow-lg border-none bg-white rounded-3xl overflow-hidden">
                <CardContent className="space-y-8 pt-10">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-end justify-center pb-3 text-xs font-black text-slate-400 uppercase">{tUI('classification')}</div>
                        <div className="bg-blue-50/50 p-3 rounded-t-xl text-center text-sm font-bold text-blue-700 border-x border-t border-blue-100">{tUI('cases')}</div>
                        <div className="bg-slate-50 p-3 rounded-t-xl text-center text-sm font-bold text-slate-600 border-x border-t border-slate-100">{tUI('controls')}</div>
                        
                        <div className="flex items-center font-bold text-slate-700 text-sm">{tUI('exposed')}</div>
                        <Input 
                            type="number" 
                            placeholder="A" 
                            onChange={(e) => handleInputChange(e, 'ae')} 
                            className="h-14 border-2 border-slate-100 focus:border-blue-500 rounded-xl text-center text-lg font-bold"
                        />
                        <Input 
                            type="number" 
                            placeholder="B" 
                            onChange={(e) => handleInputChange(e, 'be')} 
                            className="h-14 border-2 border-slate-100 focus:border-blue-500 rounded-xl text-center text-lg font-bold"
                        />

                        <div className="flex items-center font-bold text-slate-700 text-sm">{tUI('non_exposed')}</div>
                        <Input 
                            type="number" 
                            placeholder="C" 
                            onChange={(e) => handleInputChange(e, 'ce')} 
                            className="h-14 border-2 border-slate-100 focus:border-blue-500 rounded-xl text-center text-lg font-bold"
                        />
                        <Input 
                            type="number" 
                            placeholder="D" 
                            onChange={(e) => handleInputChange(e, 'de')} 
                            className="h-14 border-2 border-slate-100 focus:border-blue-500 rounded-xl text-center text-lg font-bold"
                        />
                    </div>
                    
                    <Button onClick={calculate} size="lg" className="w-full h-14 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl transition-all active:scale-[0.98]">
                        {tUI('calc_or')}
                    </Button>

                    {result && typeof result === 'object' && (
                        <div className="mt-10 animate-in fade-in slide-in-from-top-4">
                            <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">{tUI('odds_ratio_calc')}</p>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-6xl font-black text-blue-400">{result.or}</span>
                                    </div>
                                    <p className="text-xl font-bold text-slate-400 mb-6">{result.interpretation}</p>
                                    
                                    <div className="flex items-center gap-8 border-t border-slate-800 pt-6">
                                        <div>
                                            <p className="text-slate-500 text-[10px] font-black uppercase mb-1">{tUI('ci_95')}</p>
                                            <p className="text-xl font-bold text-slate-200">{result.lower} ~ {result.upper}</p>
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
                            {tFAQ('odds-ratio_faq_q0')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {tFAQ('odds-ratio_faq_a0')}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            
            <AdSlot slot="tool-bottom" />
        </div>
    );
}
