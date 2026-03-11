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
    const [resultList, setResultList] = useState<any[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setInputs({...inputs, [id]: e.target.type === 'number' ? Number(e.target.value) : e.target.value});
    };

    const calculate = () => {
        const totalN = Number(inputs['total_n']);
        const ratioText = inputs['ratio'] || '1:1';
        const blockSize = Number(inputs['block_size'] || 4);

        if (!totalN || totalN <= 0) return;

        // Simple Ratio Parser (e.g., "1:1" -> [1, 1], "2:1" -> [2, 1])
        const ratios = ratioText.split(':').map(Number);
        const sumRatio = ratios.reduce((a: number, b: number) => a + b, 0);
        
        const list: any[] = [];
        const groupNames = ['A', 'B', 'C', 'D'].slice(0, ratios.length);

        // Permuted Block Randomization Logic
        let currentN = 0;
        while (currentN < totalN) {
            let block: string[] = [];
            ratios.forEach((r: number, idx: number) => {
                const countInBlock = Math.round((blockSize / sumRatio) * r);
                for (let i = 0; i < countInBlock; i++) {
                    block.push(groupNames[idx]);
                }
            });

            // Fisher-Yates Shuffle for the block
            for (let i = block.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [block[i], block[j]] = [block[j], block[i]];
            }

            block.forEach(group => {
                if (currentN < totalN) {
                    currentN++;
                    list.push({ seq: currentN, group });
                }
            });
        }
        setResultList(list);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header & Description */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{tTools('randomization_title')}</h1>
                <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-left leading-relaxed border border-slate-100 shadow-sm">
                    {tDesc('randomization_desc')}
                </div>
            </div>

            {/* Tool Interface */}
            <Card className="mb-12 shadow-lg border-none bg-white rounded-3xl overflow-hidden">
                <CardContent className="space-y-8 pt-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('total_n')}</Label>
                            <Input 
                                type="number" 
                                placeholder={tUI('ex_40')} 
                                onChange={(e) => handleInputChange(e, 'total_n')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('ratio')}</Label>
                            <Input 
                                type="text" 
                                placeholder="1:1" 
                                defaultValue="1:1"
                                onChange={(e) => handleInputChange(e, 'ratio')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-slate-700">{tUI('block_size')}</Label>
                            <Input 
                                type="number" 
                                placeholder={tUI('ex_4')} 
                                defaultValue="4"
                                onChange={(e) => handleInputChange(e, 'block_size')} 
                                className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl"
                            />
                        </div>
                    </div>
                    
                    <Button onClick={calculate} size="lg" className="w-full h-14 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl transition-all active:scale-[0.98]">
                        {tUI('generate_list')}
                    </Button>

                    {resultList.length > 0 && (
                        <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-top-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-800">{tUI('allocation_list')}</h3>
                                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase">{tUI('simulation_only')}</span>
                            </div>
                            
                            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                <div className="max-h-[400px] overflow-y-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 sticky top-0">
                                            <tr>
                                                <th className="p-4 font-bold text-slate-600 border-b">{tUI('serial_no')}</th>
                                                <th className="p-4 font-bold text-slate-600 border-b">{tUI('rand_id')}</th>
                                                <th className="p-4 font-bold text-slate-600 border-b">{tUI('group')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {resultList.map((item) => (
                                                <tr key={item.seq} className="hover:bg-blue-50/50 transition-colors">
                                                    <td className="p-4 text-slate-500 font-medium">{item.seq}</td>
                                                    <td className="p-4 text-slate-900 font-bold">R-{String(item.seq).padStart(3, '0')}</td>
                                                    <td className="p-4">
                                                        <span className={`px-4 py-1.5 rounded-full text-sm font-black ${
                                                            item.group === 'A' ? 'bg-indigo-100 text-indigo-700' : 
                                                            item.group === 'B' ? 'bg-emerald-100 text-emerald-700' : 
                                                            'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            {item.group}{tUI('group_suffix')}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm flex items-start gap-3">
                                <span className="text-xl">⚠️</span>
                                <p><span dangerouslySetInnerHTML={{ __html: tUI('rand_disclaimer') }} /></p>
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
                            {tFAQ('randomization_faq_q0')}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-b-lg border-t border-slate-100 mt-1">
                            {tFAQ('randomization_faq_a0')}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            
            <AdSlot slot="tool-bottom" />
        </div>
    );
}
