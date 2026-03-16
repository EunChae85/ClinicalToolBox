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
    const [mode, setMode] = useState<string>('analysis'); // analysis vs planning

    // Clear state when switching modes
    const handleModeChange = (newMode: string) => {
        setMode(newMode);
        setResult(null);
        setInputs({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setInputs({...inputs, [id]: e.target.type === 'number' ? Number(e.target.value) : e.target.value});
    };

    const calculate = () => {
        if (mode === 'analysis') {
            const screened = Number(inputs['screened']);
            const failed = Number(inputs['failed']);
            if (screened && failed >= 0) { 
                const rate = (failed / screened) * 100; 
                setResult({
                    value: rate.toFixed(1),
                    unit: '%',
                    desc: tUI('actual_fail_rate'),
                    isWarning: rate > 50
                });
            }
        } else {
            const target = Number(inputs['target']);
            const fail_rate = Number(inputs['fail_rate']);
            if (target && fail_rate >= 0) {
                const total = Math.ceil(target / (1 - (fail_rate / 100)));
                setResult({
                    value: total,
                    unit: tUI('people_unit'),
                    desc: tUI('req_screen_target')
                });
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header & Description */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{tTools('screening-failure_title')}</h1>
                <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-left leading-relaxed border border-slate-100 shadow-sm">
                    {tDesc('screening-failure_desc')}
                </div>
            </div>

            {/* Tool Interface */}
            <Card className="mb-12 shadow-lg border-none bg-white rounded-3xl overflow-hidden">
                <CardContent className="space-y-8 pt-10">
                    <div className="flex bg-slate-100 p-1 rounded-xl h-12 w-full md:w-96">
                        <button 
                            onClick={() => handleModeChange('analysis')}
                            className={`flex-1 rounded-lg text-sm font-bold transition-all ${mode === 'analysis' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            {tUI('mode_analysis_short')}
                        </button>
                        <button 
                            onClick={() => handleModeChange('planning')}
                            className={`flex-1 rounded-lg text-sm font-bold transition-all ${mode === 'planning' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            {tUI('mode_planning_short')}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {mode === 'analysis' ? (
                            <>
                                <div className="space-y-3">
                                    <Label className="font-bold text-slate-700">{tUI('total_screened')}</Label>
                                    <Input 
                                        type="number" 
                                        value={inputs['screened'] || ''}
                                        placeholder={tUI('ex_50')} 
                                        onChange={(e) => handleInputChange(e, 'screened')} 
                                        className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-bold text-slate-700">{tUI('failed_count')}</Label>
                                    <Input 
                                        type="number" 
                                        value={inputs['failed'] || ''}
                                        placeholder={tUI('ex_10')} 
                                        onChange={(e) => handleInputChange(e, 'failed')} 
                                        className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-3">
                                    <Label className="font-bold text-slate-700">{tUI('target_n')}</Label>
                                    <Input 
                                        type="number" 
                                        value={inputs['target'] || ''}
                                        placeholder={tUI('ex_100')} 
                                        onChange={(e) => handleInputChange(e, 'target')} 
                                        className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-bold text-slate-700">{tUI('expected_fail_rate')}</Label>
                                    <Input 
                                        type="number" 
                                        value={inputs['fail_rate'] || ''}
                                        placeholder={tUI('ex_30')} 
                                        onChange={(e) => handleInputChange(e, 'fail_rate')} 
                                        className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    
                    <Button onClick={calculate} size="lg" className="w-full h-14 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl transition-all active:scale-[0.98]">
                        {tUI('calc_result')}
                    </Button>

                    {result && typeof result === 'object' && (
                        <div className="mt-10 animate-in fade-in slide-in-from-top-4">
                            <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">{result.desc}</p>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className={`text-6xl font-black ${result.isWarning ? 'text-red-400' : 'text-blue-400'}`}>{result.value}</span>
                                        <span className="text-xl text-slate-400 font-bold">{result.unit}</span>
                                    </div>
                                    {result.isWarning && (
                                        <p className="text-red-400 text-sm font-bold flex items-center gap-1">
                                            ⚠️ {tUI('ie_warning')}
                                        </p>
                                    )}
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
                            {tFAQ('screening-failure_faq_q0')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {tFAQ('screening-failure_faq_a0')}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
