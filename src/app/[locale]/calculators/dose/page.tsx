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
    const [doseType, setDoseType] = useState<string>('weight');

    const handleDoseTypeChange = (type: string) => {
        setDoseType(type);
        setResult(null);
        setInputs({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setInputs({...inputs, [id]: e.target.type === 'number' ? Number(e.target.value) : e.target.value});
    };

    const calculate = () => {
        if (doseType === 'weight') {
            const weight = Number(inputs['weight']);
            const dose_mg_kg = Number(inputs['dose_mg_kg']);
            if (weight && dose_mg_kg) {
                setResult({
                    value: (weight * dose_mg_kg).toFixed(2),
                    unit: 'mg',
                    desc: tUI('dose_calc_weight')
                });
            }
        } else {
            const weight = Number(inputs['weight']);
            const height = Number(inputs['height']);
            const dose_mg_m2 = Number(inputs['dose_mg_m2']);
            if (weight && height && dose_mg_m2) {
                const bsa = Math.sqrt((height * weight) / 3600);
                setResult({
                    value: (bsa * dose_mg_m2).toFixed(2),
                    unit: 'mg',
                    desc: `BSA(${bsa.toFixed(2)}m²) ${tUI('dose_calc_bsa')}`
                });
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header & Description */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{tTools('dose_title')}</h1>
                <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-left leading-relaxed border border-slate-100 shadow-sm">
                    {tDesc('dose_desc')}
                </div>
            </div>

            {/* Tool Interface */}
            <Card className="mb-12 shadow-lg border-none bg-white rounded-3xl overflow-hidden">
                <CardContent className="space-y-8 pt-10">
                    <div className="space-y-4">
                        <Label className="font-bold text-slate-700">{tUI('dose_type')}</Label>
                        <div className="flex bg-slate-100 p-1 rounded-xl h-12 w-full md:w-80">
                            <button 
                                onClick={() => handleDoseTypeChange('weight')}
                                className={`flex-1 rounded-lg text-sm font-bold transition-all ${doseType === 'weight' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                            >
                                {tUI('weight_based')}
                            </button>
                            <button 
                                onClick={() => handleDoseTypeChange('bsa')}
                                className={`flex-1 rounded-lg text-sm font-bold transition-all ${doseType === 'bsa' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                            >
                                {tUI('bsa_based')}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('weight')} (kg)</Label>
                            <Input 
                                type="number" 
                                value={inputs['weight'] || ''}
                                placeholder={tUI('ex_70')}
                                onChange={(e) => handleInputChange(e, 'weight')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                        {doseType === 'bsa' && (
                            <div className="space-y-3">
                                <Label className="font-bold text-slate-700">{tUI('height')} (cm)</Label>
                                <Input 
                                    type="number" 
                                    value={inputs['height'] || ''}
                                    placeholder={tUI('ex_170')}
                                    onChange={(e) => handleInputChange(e, 'height')} 
                                    className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                                />
                            </div>
                        )}
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">
                                {tUI('prescribed_dose')} {doseType === 'weight' ? '(mg/kg)' : '(mg/m²)'}
                            </Label>
                            <Input 
                                type="number" 
                                value={doseType === 'weight' ? (inputs['dose_mg_kg'] || '') : (inputs['dose_mg_m2'] || '')}
                                placeholder={tUI('ex_5')} 
                                onChange={(e) => handleInputChange(e, doseType === 'weight' ? 'dose_mg_kg' : 'dose_mg_m2')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                    </div>
                    
                    <Button onClick={calculate} size="lg" className="w-full h-14 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl transition-all active:scale-[0.98]">
                        {tUI('total_dose')} {tUI('calc_btn')}
                    </Button>

                    {result && typeof result === 'object' && (
                        <div className="mt-10 animate-in fade-in slide-in-from-top-4">
                            <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">{result.desc}</p>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-6xl font-black text-blue-400">{result.value}</span>
                                        <span className="text-xl text-slate-400 font-bold">{result.unit}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm">{tUI('target_dose_warning')}</p>
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
                            {tFAQ('dose_faq_q0')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {tFAQ('dose_faq_a0')}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            
            <AdSlot slot="tool-bottom" />
        </div>
    );
}
