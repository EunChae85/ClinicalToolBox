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
    const [category, setCategory] = useState<string>('weight');

    const handleCategoryChange = (newCat: string) => {
        setCategory(newCat);
        setResult(null);
        setInputs({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setInputs({...inputs, [id]: e.target.type === 'number' ? Number(e.target.value) : e.target.value});
    };

    const calculate = () => {
        const val = Number(inputs['val']);
        if (isNaN(val)) return;

        let results: any[] = [];
        switch(category) {
            case 'weight':
                results = [
                    { label: tUI('lb'), value: (val * 2.20462).toFixed(2), unit: 'lb' },
                    { label: tUI('kg'), value: (val / 2.20462).toFixed(2), unit: 'kg' }
                ];
                break;
            case 'height':
                results = [
                    { label: tUI('inch'), value: (val / 2.54).toFixed(2), unit: 'in' },
                    { label: tUI('cm'), value: (val * 2.54).toFixed(2), unit: 'cm' }
                ];
                break;
            case 'glucose':
                results = [
                    { label: tUI('mmol'), value: (val / 18.0182).toFixed(2), unit: 'mmol/L' },
                    { label: tUI('mgdl'), value: (val * 18.0182).toFixed(1), unit: 'mg/dL' }
                ];
                break;
            case 'hba1c':
                results = [
                    { label: tUI('eag_mgdl'), value: (val * 28.7 - 46.7).toFixed(1), unit: 'mg/dL' },
                    { label: tUI('eag_mmol'), value: ((val * 28.7 - 46.7) / 18.0182).toFixed(2), unit: 'mmol/L' }
                ];
                break;
            case 'creatinine':
                results = [
                    { label: tUI('cr_umol'), value: (val * 88.4).toFixed(1), unit: 'μmol/L' },
                    { label: tUI('cr_mgdl'), value: (val / 88.4).toFixed(2), unit: 'mg/dL' }
                ];
                break;
        }
        setResult(results);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header & Description */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{tTools('unit-converter_title')}</h1>
                <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-left leading-relaxed border border-slate-100 shadow-sm">
                    {tDesc('unit-converter_desc')}
                </div>
            </div>

            {/* Tool Interface */}
            <Card className="mb-12 shadow-lg border-none bg-white rounded-3xl overflow-hidden">
                <CardContent className="space-y-8 pt-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('test_category')}</Label>
                            <select 
                                value={category}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl px-3 bg-white font-medium shadow-sm"
                            >
                                <option value="weight">{tUI('opt_weight')}</option>
                                <option value="height">{tUI('opt_height')}</option>
                                <option value="glucose">{tUI('opt_glucose')}</option>
                                <option value="hba1c">{tUI('opt_hba1c')}</option>
                                <option value="creatinine">{tUI('opt_creatinine')}</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('input_val')}</Label>
                            <Input 
                                type="number" 
                                value={inputs['val'] || ''}
                                placeholder={tUI('enter_numbers')} 
                                onChange={(e) => handleInputChange(e, 'val')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                    </div>
                    
                    <Button onClick={calculate} size="lg" className="w-full h-14 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl transition-all active:scale-[0.98]">
                        {tUI('check_conversion')}
                    </Button>

                    {result && Array.isArray(result) && (
                        <div className="mt-10 animate-in fade-in slide-in-from-top-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.map((item, idx) => (
                                    <div key={idx} className="p-6 bg-slate-900 rounded-2xl text-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                                        <div className="relative z-10">
                                            <p className="text-slate-500 text-[10px] font-black uppercase mb-1">{item.label}</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black text-blue-400">{item.value}</span>
                                                <span className="text-sm text-slate-400 font-bold">{item.unit}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                            {tFAQ('unit-converter_faq_q0')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {tFAQ('unit-converter_faq_a0')}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
