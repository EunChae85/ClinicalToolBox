'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { differenceInDays, parseISO } from 'date-fns';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/common/KpiCard';
import { FlagList, Flag } from '@/components/common/FlagList';
import { ExportButtons } from '@/components/common/ExportButtons';
import { exportToCSV, exportToExcel, exportToPDF } from '@/lib/exportUtils';
import AdSlot from '@/components/ads/AdSlot';

const complianceSchema = z.object({
    startDate: z.string().min(1, 'Required'),
    endDate: z.string().min(1, 'Required'),
    dispensedQty: z.number().min(0),
    returnedQty: z.number().min(0),
    dailyDose: z.number().min(0),
    lostDamaged: z.number().min(0).optional(),
    missedDoses: z.number().min(0).optional(),
    applyMissed: z.boolean().optional()
});

type ComplianceFormValues = z.infer<typeof complianceSchema>;

export default function CompliancePage() {
    const t = useTranslations('Compliance');
    const tCommon = useTranslations('Common');

    const [activeTab, setActiveTab] = useState('input');
    const [flags, setFlags] = useState<Flag[]>([]);
    const [results, setResults] = useState({
        days: 0,
        expectedTaken: 0,
        estimatedTaken: 0,
        adjustedTaken: 0,
        compliance: 0
    });

    const form = useForm<ComplianceFormValues>({
        resolver: zodResolver(complianceSchema),
        defaultValues: {
            startDate: '',
            endDate: '',
            dispensedQty: 0,
            returnedQty: 0,
            dailyDose: 0,
            lostDamaged: 0,
            missedDoses: 0,
            applyMissed: false
        }
    });

    const values = useWatch({ control: form.control });

    useEffect(() => {
        // Real-time calculation
        if (values.startDate && values.endDate && values.dailyDose !== undefined && values.dispensedQty !== undefined && values.returnedQty !== undefined) {
            const start = parseISO(values.startDate);
            const end = parseISO(values.endDate);

            let newFlags: Flag[] = [];
            let days = 0;

            if (end < start) {
                newFlags.push({ id: 'F01', type: 'error', message: 'End Date cannot be before Start Date' });
            } else {
                days = differenceInDays(end, start) + 1; // inclusive
            }

            const expectedTaken = days * values.dailyDose;
            if (expectedTaken === 0 && days > 0) {
                newFlags.push({ id: 'F02', type: 'error', message: 'Expected Taken is 0 (Daily Dose is 0)' });
            }

            const lost = values.lostDamaged || 0;
            const estimatedTaken = values.dispensedQty - values.returnedQty - lost;

            if (estimatedTaken < 0) {
                newFlags.push({ id: 'F03', type: 'error', message: 'Estimated Taken < 0 : Check returned and lost amounts' });
            }
            if (estimatedTaken > values.dispensedQty) {
                newFlags.push({ id: 'F04', type: 'error', message: 'Estimated Taken > Dispensed Quantity' });
            }

            const missed = values.missedDoses || 0;
            const adjustedTaken = estimatedTaken - (missed * values.dailyDose);

            if (missed * values.dailyDose > estimatedTaken && estimatedTaken > 0) {
                newFlags.push({ id: 'F07', type: 'warning', message: 'Missed doses exceed estimated taken amount' });
            }

            const takenForCompliance = values.applyMissed ? adjustedTaken : estimatedTaken;
            let compliance = 0;

            if (expectedTaken > 0) {
                compliance = (takenForCompliance / expectedTaken) * 100;

                if (compliance < 80) {
                    newFlags.push({ id: 'F05', type: 'warning', message: 'Compliance is below 80%' });
                }
                if (compliance > 120) {
                    newFlags.push({ id: 'F06', type: 'warning', message: 'Compliance is above 120%' });
                }
            }

            setResults({
                days,
                expectedTaken,
                estimatedTaken,
                adjustedTaken,
                compliance
            });
            setFlags(newFlags);
        }
    }, [values]);

    const handleExportPDF = () => exportToPDF('compliance-report', 'compliance-report');

    const handleExportExcel = () => {
        const inputData = [
            { Field: 'Start Date', Value: values.startDate },
            { Field: 'End Date', Value: values.endDate },
            { Field: 'Dispensed Qty', Value: values.dispensedQty },
            { Field: 'Returned Qty', Value: values.returnedQty },
            { Field: 'Daily Dose', Value: values.dailyDose },
            { Field: 'Lost/Damaged', Value: values.lostDamaged },
            { Field: 'Missed Doses', Value: values.missedDoses }
        ];

        // Attempting to export with formulas if possible, but sheetjs json_to_sheet creates static values.
        // For MVP, static values is acceptable for export mapping
        const resultData = [
            { Metric: 'Treatment Days', Value: results.days },
            { Metric: 'Expected Taken', Value: results.expectedTaken },
            { Metric: 'Estimated Taken', Value: results.estimatedTaken },
            { Metric: 'Adjusted Taken', Value: results.adjustedTaken },
            { Metric: 'Compliance (%)', Value: results.compliance.toFixed(2) }
        ];

        exportToExcel([
            { sheetName: 'Inputs', data: inputData },
            { sheetName: 'Results', data: resultData }
        ], 'compliance-report');
    };

    const handleExportCSV = () => {
        const data = [
            { Metric: 'Compliance (%)', Value: results.compliance.toFixed(2) },
            { Metric: 'Estimated Taken', Value: results.estimatedTaken },
            { Metric: 'Expected Taken', Value: results.expectedTaken }
        ];
        exportToCSV(data, 'compliance-report');
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl" id="compliance-report">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">{t('title')}</h1>
                <p className="text-muted-foreground">{t('desc')}</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-10 h-16 p-1.5 bg-slate-100 rounded-xl max-w-2xl mx-auto overflow-visible">
                    <TabsTrigger
                        value="input"
                        className="h-full rounded-lg transition-all flex items-center justify-center
                                   data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:-translate-y-1.5 data-[state=active]:border data-[state=active]:border-slate-200"
                    >
                        {t('tabInput')}
                    </TabsTrigger>
                    <TabsTrigger
                        value="adjust"
                        className="h-full rounded-lg transition-all flex items-center justify-center
                                   data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:-translate-y-1.5 data-[state=active]:border data-[state=active]:border-slate-200"
                    >
                        {t('tabAdjust')}
                    </TabsTrigger>
                    <TabsTrigger
                        value="result"
                        className="h-full rounded-lg transition-all flex items-center justify-center
                                   data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:-translate-y-1.5 data-[state=active]:border data-[state=active]:border-slate-200"
                    >
                        {t('tabResult')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="input">
                    <Card>
                        <CardHeader><CardTitle>{t('timeline')} & {t('dispensing')}</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label>{t('startDate')}</Label>
                                    <Input type="date" {...form.register('startDate')} />
                                </div>
                                <div className="space-y-3">
                                    <Label>{t('endDate')}</Label>
                                    <Input type="date" {...form.register('endDate')} />
                                </div>
                                <div className="space-y-3">
                                    <Label>{t('dispensedQty')}</Label>
                                    <Input type="number" step="0.5" {...form.register('dispensedQty', { valueAsNumber: true })} />
                                </div>
                                <div className="space-y-3">
                                    <Label>{t('returnedQty')}</Label>
                                    <Input type="number" step="0.5" {...form.register('returnedQty', { valueAsNumber: true })} />
                                </div>
                                <div className="space-y-3">
                                    <Label>{t('dailyDose')}</Label>
                                    <Input type="number" step="0.1" {...form.register('dailyDose', { valueAsNumber: true })} />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button onClick={() => setActiveTab('adjust')}>{tCommon('next')}</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="adjust">
                    <Card>
                        <CardHeader><CardTitle>{t('adjustments')}</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label>{t('lostDamaged')}</Label>
                                    <Input type="number" step="0.5" {...form.register('lostDamaged', { valueAsNumber: true })} />
                                </div>
                                <div className="space-y-3">
                                    <Label>{t('missedDoses')}</Label>
                                    <Input type="number" step="0.5" {...form.register('missedDoses', { valueAsNumber: true })} />
                                </div>
                                <div className="space-y-2 flex items-center gap-2 mt-8">
                                    <input type="checkbox" id="applyMissed" {...form.register('applyMissed')} className="w-4 h-4" />
                                    <Label htmlFor="applyMissed">{t('applyMissed')}</Label>
                                </div>
                            </div>
                            <div className="flex justify-between pt-4">
                                <Button variant="outline" onClick={() => setActiveTab('input')}>{tCommon('prev')}</Button>
                                <Button onClick={() => setActiveTab('result')}>{tCommon('next')}</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="result">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <KpiCard
                                title={t('kpiCompliance')}
                                value={`${results.compliance.toFixed(1)}%`}
                                alert={results.compliance < 80 || results.compliance > 120}
                            />
                            <KpiCard title={t('kpiEstimated')} value={results.estimatedTaken} />
                            <KpiCard title={t('kpiExpected')} value={results.expectedTaken} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <KpiCard title={t('kpiDays')} value={results.days} />
                            {values.applyMissed && (
                                <KpiCard title={t('kpiAdjusted')} value={results.adjustedTaken} />
                            )}
                        </div>

                        <FlagList flags={flags} />

                        <Card className="mt-8">
                            <CardHeader><CardTitle>{t('summary')}</CardTitle></CardHeader>
                            <CardContent className="text-sm font-mono space-y-2 bg-muted/30 p-4 rounded-md mx-6 mb-6">
                                <p>Days = (End - Start) + 1 = {results.days}</p>
                                <p>Expected Taken = Days * Daily Dose = {results.expectedTaken}</p>
                                <p>Estimated Taken = Dispensed - Returned - Lost = {results.estimatedTaken}</p>
                                {values.applyMissed && <p>Adjusted Taken = Estimated - (Missed * Daily Dose) = {results.adjustedTaken}</p>}
                                <p>Compliance % = ({values.applyMissed ? 'Adjusted' : 'Estimated'} / Expected) * 100 = {results.compliance.toFixed(2)}%</p>
                            </CardContent>
                        </Card>

                        <AdSlot slot="compliance-result" />



                        <div className="flex justify-between pt-4 border-t mt-8">
                            <Button variant="outline" onClick={() => setActiveTab('adjust')}>{tCommon('prev')}</Button>
                            <ExportButtons
                                onExportPDF={handleExportPDF}
                                onExportExcel={handleExportExcel}
                                onExportCSV={handleExportCSV}
                            />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
