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

    const handleReset = () => {
        setInputs({});
        setResult(null);
    };

    const calculate = () => {
        const total_pts = Number(inputs['total_pts']);
        const months_passed = Number(inputs['months_passed']);
        const enrolled = Number(inputs['enrolled']);
        
        if (total_pts && months_passed && enrolled) { 
            const rate = enrolled / months_passed; 
            const remaining = Math.max(0, total_pts - enrolled); 
            const remaining_months = rate > 0 ? remaining / rate : 0; 
            
            setResult({
                rate: rate.toFixed(2),
                remaining_months: remaining_months.toFixed(1),
                remaining_pts: remaining,
                percent: ((enrolled / total_pts) * 100).toFixed(1)
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header & Description */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{tTools('enrollment-rate_title')}</h1>
                <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-left leading-relaxed border border-slate-100 shadow-sm">
                    {tDesc('enrollment-rate_desc')}
                </div>
            </div>

            {/* Tool Interface */}
            <Card className="mb-12 shadow-lg border-none bg-white rounded-3xl overflow-hidden">
                <CardContent className="space-y-8 pt-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('target_n')}</Label>
                            <Input 
                                type="number" 
                                value={inputs['total_pts'] || ''}
                                placeholder={tUI('ex_100')} 
                                onChange={(e) => handleInputChange(e, 'total_pts')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('elapsed_months')}</Label>
                            <Input 
                                type="number" 
                                value={inputs['months_passed'] || ''}
                                placeholder={tUI('ex_6')} 
                                onChange={(e) => handleInputChange(e, 'months_passed')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('enrolled')}</Label>
                            <Input 
                                type="number" 
                                value={inputs['enrolled'] || ''}
                                placeholder={tUI('ex_30')} 
                                onChange={(e) => handleInputChange(e, 'enrolled')} 
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
                            {tUI('analyze_status')}
                        </Button>
                    </div>

                    {result && typeof result === 'object' && (
                        <div className="space-y-6 mt-10 animate-in fade-in slide-in-from-top-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">{tUI('current_enrollment_rate')}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-blue-400">{result.rate}</span>
                                        <span className="text-lg text-slate-400 font-bold">{tUI('people_per_month_unit')}</span>
                                    </div>
                                    <div className="mt-4 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${result.percent}%` }}></div>
                                    </div>
                                    <p className="mt-2 text-slate-400 text-sm font-bold">{tUI('enrollment_progress')}: {result.percent}%</p>
                                </div>
                                <div className="p-8 bg-blue-600 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                    <p className="text-blue-200 text-xs font-black uppercase tracking-widest mb-4">{tUI('enrollment_projection')}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-white">{result.remaining_months}</span>
                                        <span className="text-lg text-blue-200 font-bold">{tUI('more_months_required')}</span>
                                    </div>
                                    <p className="mt-4 text-blue-100 text-sm font-medium">{tUI('enrollment_remaining')}: {result.remaining_pts} {tUI('people_unit')}</p>
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
                            {tFAQ('enrollment-rate_faq_q0')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {tFAQ('enrollment-rate_faq_a0')}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            
            <AdSlot slot="tool-bottom" />
        </div>
    );
}
