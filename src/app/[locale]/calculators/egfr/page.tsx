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
    const [gender, setGender] = useState<string>('male');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setInputs({...inputs, [id]: e.target.type === 'number' ? Number(e.target.value) : e.target.value});
    };

    const handleReset = () => {
        setInputs({});
        setResult(null);
        setGender('male');
    };

    const calculate = () => {
        const age = Number(inputs['age']);
        const scr = Number(inputs['scr']);
        
        if (!age || !scr) return;

        // CKD-EPI 2021 Equation
        const kappa = gender === 'female' ? 0.7 : 0.9;
        const alpha = gender === 'female' ? -0.241 : -0.302;
        const genderConstant = gender === 'female' ? 1.012 : 1;
        
        const egfr = 142 * 
            Math.pow(Math.min(scr / kappa, 1), alpha) * 
            Math.pow(Math.max(scr / kappa, 1), -1.2) * 
            Math.pow(0.9938, age) * 
            genderConstant;

        let stage = '';
        let color = '';
        if (egfr >= 90) { stage = `G1 (${tUI('normal_high')})`; color = 'text-emerald-600'; }
        else if (egfr >= 60) { stage = `G2 (${tUI('mildly_decreased')})`; color = 'text-lime-600'; }
        else if (egfr >= 45) { stage = `G3a (${tUI('mild_mod_decreased')})`; color = 'text-yellow-600'; }
        else if (egfr >= 30) { stage = `G3b (${tUI('mod_severe_decreased')})`; color = 'text-orange-600'; }
        else if (egfr >= 15) { stage = `G4 (${tUI('severely_decreased')})`; color = 'text-red-600'; }
        else { stage = `G5 (${tUI('kidney_failure')})`; color = 'text-red-800'; }

        setResult({
            value: egfr.toFixed(1),
            stage: stage,
            color: color
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header & Description */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{tTools('egfr_title')}</h1>
                <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-left leading-relaxed border border-slate-100 shadow-sm">
                    {tDesc('egfr_desc')}
                </div>
            </div>

            {/* Tool Interface */}
            <Card className="mb-12 shadow-lg border-none bg-white rounded-3xl overflow-hidden">
                <CardContent className="space-y-8 pt-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('gender')}</Label>
                            <div className="flex bg-slate-100 p-1 rounded-xl h-12">
                                <button 
                                    onClick={() => setGender('male')}
                                    className={`flex-1 rounded-lg text-sm font-bold transition-all ${gender === 'male' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {tUI('male')}
                                </button>
                                <button 
                                    onClick={() => setGender('female')}
                                    className={`flex-1 rounded-lg text-sm font-bold transition-all ${gender === 'female' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {tUI('female')}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('age')}</Label>
                            <Input 
                                type="number" 
                                value={inputs['age'] || ''}
                                placeholder={tUI('years_old')} 
                                onChange={(e) => handleInputChange(e, 'age')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('serum_creatinine')}</Label>
                            <Input 
                                type="number" 
                                step="0.01"
                                value={inputs['scr'] || ''}
                                placeholder="mg/dL" 
                                onChange={(e) => handleInputChange(e, 'scr')} 
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
                            eGFR {tUI('calc_btn')}
                        </Button>
                    </div>

                    {result && typeof result === 'object' && (
                        <div className="space-y-6 mt-10 animate-in fade-in slide-in-from-top-4">
                             <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">CKD-EPI (2021) {tUI('formula_result')}</p>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-6xl font-black text-blue-400">{result.value}</span>
                                        <span className="text-xl text-slate-400 font-bold">{tUI('egfr_unit')}</span>
                                    </div>
                                    <p className={`text-xl font-bold ${result.color}`}>{result.stage}</p>
                                </div>
                            </div>

                            <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl text-blue-800 text-sm flex items-start gap-3 leading-relaxed">
                                <span className="text-xl">ℹ️</span>
                                <p>{tUI('egfr_note')}</p>
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
                            {tFAQ('egfr_faq_q0')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {tFAQ('egfr_faq_a0')}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            
            <AdSlot slot="tool-bottom" />
        </div>
    );
}
