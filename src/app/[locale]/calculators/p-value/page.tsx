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
        setInputs({ ...inputs, [id]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });
    };

    // Standard Normal CDF approximation
    const normalCDF = (z: number) => {
        const t = 1 / (1 + 0.2316419 * Math.abs(z));
        const d = 0.3989423 * Math.exp(-z * z / 2);
        const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.821256 + t * 1.330274))));
        return z > 0 ? 1 - p : p;
    };

    const calculate = () => {
        const z = Number(inputs['z']);
        if (!isNaN(z)) {
            const pTwoTail = (1 - normalCDF(Math.abs(z))) * 2;
            const pOneTail = 1 - normalCDF(Math.abs(z));

            setResult({
                twoTail: pTwoTail.toFixed(4),
                oneTail: pOneTail.toFixed(4),
                isSignificant: pTwoTail < 0.05,
                zScore: z.toFixed(2)
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header & Description */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{tTools('p-value_title')}</h1>
                <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-left leading-relaxed border border-slate-100 shadow-sm">
                    {tDesc('p-value_desc')}
                </div>
            </div>

            {/* Tool Interface */}
            <Card className="mb-12 shadow-lg border-none bg-white rounded-3xl overflow-hidden">
                <CardContent className="space-y-8 pt-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">Z-Score (Standardized Test Statistic)</Label>
                            <Input
                                type="number"
                                placeholder={tUI('ex_z_score')}
                                step="0.01"
                                onChange={(e) => handleInputChange(e, 'z')}
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                    </div>

                    <Button onClick={calculate} size="lg" className="w-full h-14 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl transition-all active:scale-[0.98]">
                        {tUI('calculate_p_value')}
                    </Button>

                    {result && typeof result === 'object' && (
                        <div className="mt-10 animate-in fade-in slide-in-from-top-4">
                            <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div>
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">{tUI('two_tailed_p_value')}</p>
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <span className={`text-6xl font-black ${result.isSignificant ? 'text-emerald-400' : 'text-slate-200'}`}>{result.twoTail}</span>
                                        </div>
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${result.isSignificant ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                            {result.isSignificant ? tUI('significant_p') : tUI('not_significant')}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 border-l border-slate-800 pl-8">
                                        <div>
                                            <p className="text-slate-500 text-[10px] font-black uppercase mb-1 tracking-tighter">{tUI('one_tailed_p_value')}</p>
                                            <p className="text-xl font-bold">{result.oneTail}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-[10px] font-black uppercase mb-1 tracking-tighter">Z-Score</p>
                                            <p className="text-xl font-bold text-blue-400">{result.zScore}</p>
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
                            {tFAQ('p-value_faq_q0')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {tFAQ('p-value_faq_a0')}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
