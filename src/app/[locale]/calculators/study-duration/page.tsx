'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { addDays, format, parseISO } from 'date-fns';
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
        const startDate = inputs['start_date'];
        const enroll_months = Number(inputs['enroll_months']);
        const follow_up = Number(inputs['follow_up']);
        const db_lock = Number(inputs['db_lock'] || 0);

        if (!enroll_months || !follow_up) return;

        const totalMonthsToLPLV = enroll_months + follow_up;
        const totalMonthsToFinish = totalMonthsToLPLV + db_lock;

        if (startDate) {
            try {
                const start = parseISO(startDate);
                const lplvDate = addDays(start, Math.round(totalMonthsToLPLV * 30.44));
                const finishDate = addDays(start, Math.round(totalMonthsToFinish * 30.44));

                setResult({
                    monthsToLPLV: totalMonthsToLPLV,
                    monthsToFinish: totalMonthsToFinish,
                    lplvDate: format(lplvDate, tUI('date_format')),
                    finishDate: format(finishDate, tUI('date_format'))
                });
            } catch (e) {
                setResult({ monthsToLPLV: totalMonthsToLPLV, monthsToFinish: totalMonthsToFinish });
            }
        } else {
            setResult({ monthsToLPLV: totalMonthsToLPLV, monthsToFinish: totalMonthsToFinish });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header & Description */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{tTools('study-duration_title')}</h1>
                <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-left leading-relaxed border border-slate-100 shadow-sm">
                    {tDesc('study-duration_desc')}
                </div>
            </div>

            {/* Tool Interface */}
            <Card className="mb-12 shadow-lg border-none bg-white rounded-3xl overflow-hidden">
                <CardContent className="space-y-8 pt-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('fpfv')}</Label>
                            <Input 
                                type="date" 
                                value={inputs['start_date'] || ''}
                                onChange={(e) => handleInputChange(e, 'start_date')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                            <p className="text-xs text-slate-400 italic">{tUI('enroll_guide')}</p>
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('total_enroll_period')}</Label>
                            <Input 
                                type="number" 
                                value={inputs['enroll_months'] || ''}
                                placeholder={tUI('ex_12')} 
                                onChange={(e) => handleInputChange(e, 'enroll_months')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                            <p className="text-xs text-slate-400 italic">{tUI('last_enroll_guide')}</p>
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('obs_period')}</Label>
                            <Input 
                                type="number" 
                                value={inputs['follow_up'] || ''}
                                placeholder={tUI('ex_6')} 
                                onChange={(e) => handleInputChange(e, 'follow_up')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                            <p className="text-xs text-slate-400 italic">{tUI('obs_guide')}</p>
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('closure_period')}</Label>
                            <Input 
                                type="number" 
                                value={inputs['db_lock'] || ''}
                                placeholder={tUI('ex_2')} 
                                onChange={(e) => handleInputChange(e, 'db_lock')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                            <p className="text-xs text-slate-400 italic">{tUI('closure_guide')}</p>
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
                            {tUI('calc_forecast')} {tUI('calc_btn')}
                        </Button>
                    </div>

                    {result && (
                        <div className="mt-10 animate-in fade-in slide-in-from-top-4">
                            <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div>
                                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">{tUI('est_lplv')}</p>
                                            <p className="text-4xl font-black text-blue-400 mb-2">{result.lplvDate || `${result.monthsToLPLV}${tUI('months_after')}`}</p>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                                                <span>{tUI('from_baseline')} +{result.monthsToLPLV}{tUI('months')}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">{tUI('est_closure')}</p>
                                            <p className="text-4xl font-black text-emerald-400 mb-2">{result.finishDate || `${result.monthsToFinish}${tUI('months_after')}`}</p>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                                                <span>{tUI('from_baseline')} +{result.monthsToFinish}{tUI('months')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-slate-800">
                                        <div className="flex flex-wrap gap-6">
                                            <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                                                <span className="text-slate-500 text-[10px] font-black uppercase block">{tUI('enroll_period')}</span>
                                                <span className="text-sm font-bold">{inputs['enroll_months']}{tUI('months')}</span>
                                            </div>
                                            <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                                                <span className="text-slate-500 text-[10px] font-black uppercase block">{tUI('followup_period')}</span>
                                                <span className="text-sm font-bold">{inputs['follow_up']}{tUI('months')}</span>
                                            </div>
                                            <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                                                <span className="text-slate-500 text-[10px] font-black uppercase block">{tUI('closure_period')}</span>
                                                <span className="text-sm font-bold">{inputs['db_lock'] || 0}{tUI('months')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-sm flex items-start gap-3 mt-6">
                                <span className="text-xl">📊</span>
                                <p>{tUI('study_duration_disclaimer')}</p>
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
                            {tFAQ('study-duration_faq_q0')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {tFAQ('study-duration_faq_a0')}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
