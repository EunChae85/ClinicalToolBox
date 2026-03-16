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
    const tDesc = useTranslations('CalcDesc');
    const tFAQ = useTranslations('CalcFAQ');
    const tHub = useTranslations('CalculatorsHub');
    const [inputs, setInputs] = useState<any>({});
    const [result, setResult] = useState<any>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setInputs({...inputs, [id]: e.target.type === 'number' ? Number(e.target.value) : e.target.value});
    };

    const calculate = () => {
        const alpha = Number(inputs['alpha']) || 0.05;
        const power = Number(inputs['power']) || 80;
        const effect = Number(inputs['effect']) || 0.5; // Cohen's d (Standardized effect size)
        
        if (effect > 0) { 
            // Simplified formula for 2-sample t-test (two-sided)
            // n = 2 * (Z_alpha/2 + Z_beta)^2 / d^2
            // Z_0.05/2 = 1.96, Z_0.2 (80% power) = 0.841
            const z_alpha = 1.96;
            const z_beta = power === 90 ? 1.282 : 0.841; // Common power values
            
            const n_per_group = Math.ceil((2 * Math.pow(z_alpha + z_beta, 2)) / Math.pow(effect, 2));
            
            setResult({
                n_per_group: n_per_group,
                total_n: n_per_group * 2,
                alpha: alpha,
                power: power,
                effect: effect
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header & Description */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{tTools('sample-size_title')}</h1>
                <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-left leading-relaxed border border-slate-100 shadow-sm">
                    {tDesc('sample-size_desc')}
                </div>
            </div>

            {/* Tool Interface */}
            <Card className="mb-12 shadow-lg border-none bg-white rounded-3xl overflow-hidden">
                <CardContent className="space-y-8 pt-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tHub('sampleSizeAlpha')}</Label>
                            <select 
                                onChange={(e) => handleInputChange(e as any, 'alpha')}
                                className="w-full h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl px-3 bg-white font-medium"
                                defaultValue="0.05"
                            >
                                <option value="0.01">0.01 (1%)</option>
                                <option value="0.05">0.05 (5%)</option>
                                <option value="0.1">0.1 (10%)</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tHub('sampleSizePower')}</Label>
                            <select 
                                onChange={(e) => handleInputChange(e as any, 'power')}
                                className="w-full h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl px-3 bg-white font-medium"
                                defaultValue="80"
                            >
                                <option value="80">80%</option>
                                <option value="90">90%</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tHub('sampleSizeEffect')}</Label>
                            <Input 
                                type="number" 
                                placeholder={tHub('sampleSizeEffectHint')} 
                                step="0.1"
                                onChange={(e) => handleInputChange(e, 'effect')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                            <p className="text-[10px] text-slate-400">{tHub('sampleSizeEffectHint')}</p>
                        </div>
                    </div>
                    
                    <Button onClick={calculate} size="lg" className="w-full h-14 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl transition-all active:scale-[0.98]">
                        {tHub('sampleSizeButton')}
                    </Button>

                    {result && typeof result === 'object' && (
                        <div className="mt-10 animate-in fade-in slide-in-from-top-4">
                            <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">{tHub('sampleSizeResultPerGroup')}</p>
                                    <div className="flex items-baseline gap-2 mb-6">
                                        <span className="text-6xl font-black text-blue-400">{result.n_per_group}</span>
                                        <span className="text-xl text-slate-400 font-bold">{tHub('sampleSizeResultSuffix')}</span>
                                    </div>
                                    <div className="flex items-center gap-8 border-t border-slate-800 pt-6">
                                        <div>
                                            <p className="text-slate-500 text-[10px] font-black uppercase mb-1">{tHub('sampleSizeResultTotal')}</p>
                                            <p className="text-xl font-bold">{result.total_n}{tHub('sampleSizeResultSuffix')}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-[10px] font-black uppercase mb-1">{tHub('sampleSizeResultEffect')}</p>
                                            <p className="text-xl font-bold">{result.effect}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-[10px] font-black uppercase mb-1">{tHub('sampleSizeResultPower')}</p>
                                            <p className="text-xl font-bold">{result.power}%</p>
                                        </div>
                                    </div>
                                    <p className="mt-6 text-slate-500 text-xs italic">{tHub('sampleSizeResultDisclaimer')}</p>
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
                            {tFAQ('sample-size_faq_q0')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {tFAQ('sample-size_faq_a0')}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
