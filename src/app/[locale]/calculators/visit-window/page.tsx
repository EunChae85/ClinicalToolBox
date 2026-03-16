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
        setInputs({ ...inputs, [id]: e.target.value });
    };

    const handleReset = () => {
        setInputs({});
        setResult(null);
    };

    const calculate = () => {
        const target = parseInt(inputs['target']);
        const margin = parseInt(inputs['margin']);
        const baseline = inputs['baseline'];

        if (isNaN(target) || isNaN(margin)) return;

        const startDay = target - margin;
        const endDay = target + margin;

        if (baseline) {
            try {
                const baseDate = parseISO(baseline);
                const tDate = addDays(baseDate, target);
                const sDate = addDays(baseDate, startDay);
                const eDate = addDays(baseDate, endDay);

                setResult({
                    dayRange: `D${startDay} ~ D${endDay}`,
                    dateRange: `${format(sDate, 'yyyy-MM-dd')} ~ ${format(eDate, 'yyyy-MM-dd')}`,
                    targetDate: format(tDate, 'yyyy-MM-dd')
                });
            } catch (e) {
                setResult({ dayRange: `Day ${startDay} ~ Day ${endDay}` });
            }
        } else {
            setResult({ dayRange: `Day ${startDay} ~ Day ${endDay}` });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header & Description */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{tTools('visit-window_title')}</h1>
                <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-left leading-relaxed border border-slate-100 shadow-sm">
                    {tDesc('visit-window_desc')}
                </div>
            </div>

            {/* Tool Interface */}
            <Card className="mb-12 shadow-lg border-none bg-white rounded-3xl overflow-hidden">
                <CardContent className="space-y-8 pt-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('day_0')}</Label>
                            <Input
                                type="date"
                                value={inputs['baseline'] || ''}
                                onChange={(e) => handleInputChange(e, 'baseline')}
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('target_day')}</Label>
                            <Input
                                type="number"
                                value={inputs['target'] || ''}
                                placeholder={tUI('ex_14')}
                                onChange={(e) => handleInputChange(e, 'target')}
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('margin_days')}</Label>
                            <Input
                                type="number"
                                value={inputs['margin'] || ''}
                                placeholder={tUI('ex_3')}
                                onChange={(e) => handleInputChange(e, 'margin')}
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
                            {tUI('calc_btn')}
                        </Button>
                    </div>

                    {result && (
                        <div className="mt-10 animate-in fade-in slide-in-from-top-4">
                            <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    {result.dateRange ? (
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">{tHub('visit-window_title')}</p>
                                                <p className="text-4xl md:text-5xl font-black text-blue-400 tracking-tight">
                                                    {result.dateRange}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-x-8 gap-y-4 border-t border-slate-800 pt-6">
                                                <div>
                                                    <p className="text-slate-500 text-[10px] font-black uppercase mb-1">{tUI('target_date')}</p>
                                                    <p className="text-xl font-bold text-slate-200">{result.targetDate}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500 text-[10px] font-black uppercase mb-1">{tUI('from_baseline')}</p>
                                                    <p className="text-xl font-bold text-slate-200">{result.dayRange}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">{tUI('relative_visit_window')}</p>
                                            <p className="text-5xl font-black text-blue-400">{result.dayRange}</p>
                                            <p className="mt-4 text-slate-500 text-sm">{tUI('enter_baseline_guide')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                                <span className="text-xl">⚠️</span>
                                <p className="text-amber-800 text-sm font-medium leading-relaxed">
                                    {tUI('pd_warning_text')}
                                </p>
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
                            {tFAQ('visit-window_faq_q0')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {tFAQ('visit-window_faq_a0')}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-left font-semibold text-slate-800 hover:text-blue-600 transition-colors py-4">
                            {tFAQ('visit-window_faq_q1')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {tFAQ('visit-window_faq_a1')}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-left font-semibold text-slate-800 hover:text-blue-600 transition-colors py-4">
                            {tFAQ('visit-window_faq_q2')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {tFAQ('visit-window_faq_a2')}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
