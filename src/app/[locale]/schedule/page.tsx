'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addDays, format, parseISO } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FlagList, Flag } from '@/components/common/FlagList';
import { ExportButtons } from '@/components/common/ExportButtons';
import { exportToCSV, exportToExcel, exportToPDF } from '@/lib/exportUtils';

const visitSchema = z.object({
    name: z.string().min(1, 'Required'),
    offsetDays: z.number().min(0, 'Must be positive'),
    windowDays: z.number().min(0, 'Must be positive')
});

const scheduleSchema = z.object({
    visit1Date: z.string().min(1, 'Required'),
    visits: z.array(visitSchema)
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

export default function SchedulePage() {
    const t = useTranslations('Schedule');
    const tCommon = useTranslations('Common');
    const tInfo = useTranslations('CalculatorInfo');

    const [activeTab, setActiveTab] = useState('setup');
    const [flags, setFlags] = useState<Flag[]>([]);
    const [scheduleResults, setScheduleResults] = useState<any[]>([]);

    const form = useForm<ScheduleFormValues>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            visit1Date: format(new Date(), 'yyyy-MM-dd'),
            visits: [
                { name: 'V2', offsetDays: 14, windowDays: 3 },
                { name: 'V3', offsetDays: 28, windowDays: 7 }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'visits'
    });

    const values = useWatch({ control: form.control });

    useEffect(() => {
        if (values.visit1Date && values.visits && values.visits.length > 0) {
            const v1Date = parseISO(values.visit1Date);
            let newFlags: Flag[] = [];
            let results = [];

            // Add V1 first
            results.push({
                id: 'v1',
                name: 'V1',
                offsetDays: 0,
                windowDays: 0,
                targetDate: v1Date,
                windowStart: v1Date,
                windowEnd: v1Date
            });

            let previousTargetDate = v1Date;
            let previousWindowEnd = v1Date;

            values.visits.forEach((v, index) => {
                if (!v || v.offsetDays === undefined || v.windowDays === undefined) return;

                const targetDate = addDays(v1Date, v.offsetDays);
                const wStart = addDays(targetDate, -v.windowDays);
                const wEnd = addDays(targetDate, v.windowDays);

                // Validations
                if (wEnd < wStart) {
                    newFlags.push({ id: `V01-${v.name}`, type: 'error', message: `${v.name}: Window End < Window Start` });
                }

                if (targetDate < previousTargetDate) {
                    newFlags.push({ id: `V02-${v.name}`, type: 'error', message: `${v.name}: Target Date is earlier than previous visit` });
                }

                if (v.windowDays > 30) {
                    newFlags.push({ id: `V03-${v.name}`, type: 'warning', message: `${v.name}: Window is unusually large (>30 days)` });
                }

                if (wStart <= previousWindowEnd && index > 0) {
                    // V04 overlap warning
                    newFlags.push({ id: `V04-${v.name}`, type: 'warning', message: `${v.name}: Window overlaps with previous visit window` });
                }

                results.push({
                    id: `v-${index}`,
                    name: v.name,
                    offsetDays: v.offsetDays,
                    windowDays: v.windowDays,
                    targetDate,
                    windowStart: wStart,
                    windowEnd: wEnd
                });

                previousTargetDate = targetDate;
                previousWindowEnd = wEnd;
            });

            results.forEach((r) => {
                if (r.targetDate && isNaN(r.targetDate.getTime())) {
                    newFlags.push({ id: `V-ERR`, type: 'error', message: `Invalid date detected in ${r.name}` });
                }
            });

            setScheduleResults(results);
            setFlags(newFlags);
        }
    }, [values]);

    const handleExportPDF = () => exportToPDF('schedule-report', 'visit-schedule');

    const handleExportExcel = () => {
        const inputData = scheduleResults.filter(r => r.targetDate && !isNaN(r.targetDate.getTime())).map(r => ({
            Visit: r.name,
            'Offset (Days)': r.offsetDays,
            'Window (±Days)': r.windowDays,
            'Target Date': format(r.targetDate, 'yyyy-MM-dd'),
            'Window Start': format(r.windowStart, 'yyyy-MM-dd'),
            'Window End': format(r.windowEnd, 'yyyy-MM-dd')
        }));

        exportToExcel([{ sheetName: 'Schedule', data: inputData }], 'visit-schedule');
    };

    const handleExportCSV = () => {
        const data = scheduleResults.filter(r => r.targetDate && !isNaN(r.targetDate.getTime())).map(r => ({
            Visit: r.name,
            'Target Date': format(r.targetDate, 'yyyy-MM-dd'),
            'Window Start': format(r.windowStart, 'yyyy-MM-dd'),
            'Window End': format(r.windowEnd, 'yyyy-MM-dd')
        }));
        exportToCSV(data, 'visit-schedule');
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl" id="schedule-report">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{t('title')}</h1>
                <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-left leading-relaxed border border-slate-100 shadow-sm">
                    {t('desc')}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-10 h-16 p-1.5 bg-slate-100 rounded-2xl max-w-md mx-auto overflow-visible shadow-inner">
                    <TabsTrigger
                        value="setup"
                        className="h-full rounded-xl transition-all flex items-center justify-center font-bold text-slate-500
                                   data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg data-[state=active]:-translate-y-1.5 data-[state=active]:border data-[state=active]:border-slate-200"
                    >
                        {t('tabSetup')}
                    </TabsTrigger>
                    <TabsTrigger
                        value="generate"
                        className="h-full rounded-xl transition-all flex items-center justify-center font-bold text-slate-500
                                   data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg data-[state=active]:-translate-y-1.5 data-[state=active]:border data-[state=active]:border-slate-200"
                    >
                        {t('tabGenerate')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="setup">
                    <Card className="shadow-lg border-none bg-white rounded-3xl overflow-hidden">
                        <CardContent className="space-y-6 pt-10">
                            <div className="space-y-3 max-w-sm mx-auto">
                                <Label className="font-bold text-slate-700">{t('visit1Date')}</Label>
                                <Input type="date" className="h-12 border-2 border-slate-100 focus:border-blue-500 rounded-xl font-medium text-center" {...form.register('visit1Date')} />
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-4 items-end bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <div className="space-y-3 flex-1">
                                            <Label className="font-bold text-slate-700">{t('visitName')}</Label>
                                            <Input placeholder="V2" className="h-12 border-2 border-w border-slate-200 focus:border-blue-500 rounded-xl bg-white" {...form.register(`visits.${index}.name` as const)} />
                                        </div>
                                        <div className="space-y-3 flex-1">
                                            <Label className="font-bold text-slate-700">{t('targetOffset')}</Label>
                                            <Input type="number" className="h-12 border-2 border-w border-slate-200 focus:border-blue-500 rounded-xl bg-white" {...form.register(`visits.${index}.offsetDays` as const, { valueAsNumber: true })} />
                                        </div>
                                        <div className="space-y-3 flex-1">
                                            <Label className="font-bold text-slate-700">{t('windowDays')}</Label>
                                            <Input type="number" className="h-12 border-2 border-w border-slate-200 focus:border-blue-500 rounded-xl bg-white" {...form.register(`visits.${index}.windowDays` as const, { valueAsNumber: true })} />
                                        </div>
                                        <Button type="button" variant="destructive" className="h-12 w-12 rounded-xl" size="icon" onClick={() => remove(index)}>
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-14 border-2 border-dashed border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 rounded-xl font-bold transition-all text-lg"
                                    onClick={() => append({ name: `V${fields.length + 2}`, offsetDays: (fields.length + 1) * 14, windowDays: 3 })}
                                >
                                    <Plus className="w-5 h-5 mr-2" /> {t('addVisit')}
                                </Button>
                            </div>

                            <div className="flex justify-center pt-8">
                                <Button className="w-full max-w-sm h-14 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl transition-all active:scale-[0.98] rounded-2xl" onClick={() => setActiveTab('generate')}>{tCommon('next')} &gt; {t('tabGenerate')}</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="generate">
                    <div className="space-y-6">
                        <Card className="shadow-lg border-none bg-white rounded-3xl overflow-hidden">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-center w-[100px]">Visit</TableHead>
                                            <TableHead className="text-center">{t('targetDate')}</TableHead>
                                            <TableHead className="text-center">{t('windowStart')}</TableHead>
                                            <TableHead className="text-center">{t('windowEnd')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scheduleResults.map((r) => {
                                            const isValid = r.targetDate && !isNaN(r.targetDate.getTime());
                                            return (
                                                <TableRow key={r.id}>
                                                    <TableCell className="text-center font-medium">{r.name}</TableCell>
                                                    <TableCell className="text-center">{isValid ? format(r.targetDate, 'yyyy-MM-dd') : '-'}</TableCell>
                                                    <TableCell className="text-center">{isValid ? format(r.windowStart, 'yyyy-MM-dd') : '-'}</TableCell>
                                                    <TableCell className="text-center">{isValid ? format(r.windowEnd, 'yyyy-MM-dd') : '-'}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <FlagList flags={flags} />

                        <div className="flex justify-between pt-4 border-t border-slate-100 mt-8">
                            <Button variant="outline" className="h-12 rounded-xl border-2 border-slate-200" onClick={() => setActiveTab('setup')}>{tCommon('prev')}</Button>
                            <ExportButtons
                                onExportPDF={handleExportPDF}
                                onExportExcel={handleExportExcel}
                                onExportCSV={handleExportCSV}
                            />
                        </div>

                        {/* SEO/AdSense Content Support Section */}
                        <section className="mt-16 bg-muted/20 p-8 rounded-2xl border border-muted-foreground/10">
                            <h2 className="text-xl font-bold mb-3">{tInfo('schedule.title')}</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {tInfo('schedule.text')}
                            </p>
                        </section>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
