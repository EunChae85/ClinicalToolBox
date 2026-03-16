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
        const volume = Number(inputs['volume']);
        const time_min = Number(inputs['time_min']);
        const drop_factor = Number(inputs['drop_factor']);
        
        if (volume && time_min && drop_factor) { 
            const rate_ml_hr = (volume / (time_min / 60)); 
            const gtt_min = (volume * drop_factor) / time_min; 
            
            setResult({
                ml_hr: rate_ml_hr.toFixed(1),
                gtt_min: gtt_min.toFixed(1)
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header & Description */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{tTools('infusion-rate_title')}</h1>
                <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-left leading-relaxed border border-slate-100 shadow-sm">
                    {tDesc('infusion-rate_desc')}
                </div>
            </div>

            {/* Tool Interface */}
            <Card className="mb-12 shadow-lg border-none bg-white rounded-3xl overflow-hidden">
                <CardContent className="space-y-8 pt-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('total_infusion_volume')} (mL)</Label>
                            <Input 
                                type="number" 
                                placeholder="500" 
                                onChange={(e) => handleInputChange(e, 'volume')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('infusion_time')} ({tUI('minutes')})</Label>
                            <Input 
                                type="number" 
                                placeholder="60" 
                                onChange={(e) => handleInputChange(e, 'time_min')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('drop_factor')} (gtt/mL)</Label>
                            <Input 
                                type="number" 
                                placeholder="20" 
                                onChange={(e) => handleInputChange(e, 'drop_factor')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                    </div>
                    
                    <Button onClick={calculate} size="lg" className="w-full h-14 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl transition-all active:scale-[0.98]">
                        {tUI('calc_infusion_rate')}
                    </Button>

                    {result && typeof result === 'object' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 animate-in fade-in slide-in-from-top-4">
                            <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">{tUI('flow_rate_hr')}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-blue-400">{result.ml_hr}</span>
                                    <span className="text-lg text-slate-400 font-bold">mL/hr</span>
                                </div>
                            </div>
                            <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">{tUI('drop_rate_min')}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-emerald-400">{result.gtt_min}</span>
                                    <span className="text-lg text-slate-400 font-bold">gtt/min</span>
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
                            {tFAQ('infusion-rate_faq_q0')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {tFAQ('infusion-rate_faq_a0')}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
