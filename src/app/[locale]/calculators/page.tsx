'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExportButtons } from '@/components/common/ExportButtons';
import { exportToCSV, exportToExcel, exportToPDF } from '@/lib/exportUtils';
import { Button } from '@/components/ui/button';
import AdSlot from '@/components/ads/AdSlot';

// Sub-components for each tab
function UnitConverter() {
    const t = useTranslations('Calculators');

    const [cm, setCm] = useState<string>('');
    const [inch, setInch] = useState<string>('');
    const [kg, setKg] = useState<string>('');
    const [lb, setLb] = useState<string>('');
    const [celsius, setCelsius] = useState<string>('');
    const [fahrenheit, setFahrenheit] = useState<string>('');

    const handleCmChange = (val: string) => { setCm(val); setInch(val ? (parseFloat(val) / 2.54).toFixed(2) : ''); };
    const handleInchChange = (val: string) => { setInch(val); setCm(val ? (parseFloat(val) * 2.54).toFixed(2) : ''); };

    const handleKgChange = (val: string) => { setKg(val); setLb(val ? (parseFloat(val) * 2.20462).toFixed(2) : ''); };
    const handleLbChange = (val: string) => { setLb(val); setKg(val ? (parseFloat(val) / 2.20462).toFixed(2) : ''); };

    const handleCChange = (val: string) => { setCelsius(val); setFahrenheit(val ? ((parseFloat(val) * 9 / 5) + 32).toFixed(2) : ''); };
    const handleFChange = (val: string) => { setFahrenheit(val); setCelsius(val ? ((parseFloat(val) - 32) * 5 / 9).toFixed(2) : ''); };

    return (
        <Card>
            <CardHeader><CardTitle>Unit Converter</CardTitle></CardHeader>
            <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label>{t('length')} (cm)</Label>
                        <Input type="number" placeholder="0" value={cm} onChange={e => handleCmChange(e.target.value)} />
                    </div>
                    <div className="space-y-3">
                        <Label>{t('length')} (inch)</Label>
                        <Input type="number" placeholder="0" value={inch} onChange={e => handleInchChange(e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label>{t('weight')} (kg)</Label>
                        <Input type="number" placeholder="0" value={kg} onChange={e => handleKgChange(e.target.value)} />
                    </div>
                    <div className="space-y-3">
                        <Label>{t('weight')} (lb)</Label>
                        <Input type="number" placeholder="0" value={lb} onChange={e => handleLbChange(e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label>{t('temp')} (°C)</Label>
                        <Input type="number" placeholder="0" value={celsius} onChange={e => handleCChange(e.target.value)} />
                    </div>
                    <div className="space-y-3">
                        <Label>{t('temp')} (°F)</Label>
                        <Input type="number" placeholder="0" value={fahrenheit} onChange={e => handleFChange(e.target.value)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function DoseCalculator() {
    const t = useTranslations('Calculators');

    const [mg, setMg] = useState<string>('');
    const [conc, setConc] = useState<string>('');
    const [vol, setVol] = useState<string>('');

    const [weight, setWeight] = useState<string>('');
    const [dosePerKg, setDosePerKg] = useState<string>('');

    const calcVol = () => {
        if (mg && conc) return (parseFloat(mg) / parseFloat(conc)).toFixed(2) + ' mL';
        return '-';
    };

    const calcTotalDose = () => {
        if (weight && dosePerKg) return (parseFloat(weight) * parseFloat(dosePerKg)).toFixed(2) + ' mg';
        return '-';
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Concentration & Volume (mg ↔ mL)</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <Label>{t('totalDose')} (mg)</Label>
                            <Input type="number" placeholder="0" value={mg} onChange={e => setMg(e.target.value)} />
                        </div>
                        <div className="space-y-3">
                            <Label>{t('concentration')} (mg/mL)</Label>
                            <Input type="number" placeholder="0" value={conc} onChange={e => setConc(e.target.value)} />
                        </div>
                        <div className="space-y-3">
                            <Label>{t('volume')} (mL)</Label>
                            <div className="text-2xl font-bold pt-1 text-primary">{calcVol()}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Weight-based Dose (mg/kg)</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <Label>{t('weight')} (kg)</Label>
                            <Input type="number" placeholder="0" value={weight} onChange={e => setWeight(e.target.value)} />
                        </div>
                        <div className="space-y-3">
                            <Label>Dose (mg/kg)</Label>
                            <Input type="number" placeholder="0" value={dosePerKg} onChange={e => setDosePerKg(e.target.value)} />
                        </div>
                        <div className="space-y-3">
                            <Label>{t('totalDose')}</Label>
                            <div className="text-2xl font-bold pt-1 text-primary">{calcTotalDose()}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function IVInfusionCalculator() {
    const t = useTranslations('Calculators');

    const [vol, setVol] = useState<string>('');
    const [hours, setHours] = useState<string>('');
    const [dropFactor, setDropFactor] = useState<string>('20');

    const rateMlHr = vol && hours ? (parseFloat(vol) / parseFloat(hours)).toFixed(1) : '-';
    const rateGttMin = vol && hours && dropFactor ? ((parseFloat(vol) * parseFloat(dropFactor)) / (parseFloat(hours) * 60)).toFixed(0) : '-';

    return (
        <Card>
            <CardHeader><CardTitle>IV Infusion Rate</CardTitle></CardHeader>
            <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <Label>{t('volume')} (mL)</Label>
                        <Input type="number" placeholder="0" value={vol} onChange={e => setVol(e.target.value)} />
                    </div>
                    <div className="space-y-3">
                        <Label>{t('duration')} (hr)</Label>
                        <Input type="number" placeholder="0" value={hours} onChange={e => setHours(e.target.value)} />
                    </div>
                    <div className="space-y-3">
                        <Label>{t('dropFactor')} (gtt/mL)</Label>
                        <Input type="number" placeholder="20" value={dropFactor} onChange={e => setDropFactor(e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6 bg-muted/20 p-4 border rounded-md">
                    <div>
                        <Label className="text-muted-foreground">mL/hr Rate</Label>
                        <div className="text-3xl font-bold text-primary">{rateMlHr} <span className="text-lg font-normal">mL/hr</span></div>
                    </div>
                    <div>
                        <Label className="text-muted-foreground">Drop Rate (gtt/min)</Label>
                        <div className="text-3xl font-bold text-primary">{rateGttMin} <span className="text-lg font-normal">gtt/min</span></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function RenalFunctionCalculator() {
    const t = useTranslations('Calculators');

    const [age, setAge] = useState<string>('');
    const [weight, setWeight] = useState<string>('');
    const [scr, setScr] = useState<string>('');
    const [gender, setGender] = useState<'M' | 'F'>('M');

    const calcEgfr = () => {
        if (!age || !scr) return '-';
        const a = parseFloat(age);
        const s = parseFloat(scr);
        if (s === 0) return 'Error';

        // CKD-EPI 2021 Race-free
        const k = gender === 'F' ? 0.7 : 0.9;
        const alpha = gender === 'F' ? -0.241 : -0.302;
        const min = Math.min(s / k, 1);
        const max = Math.max(s / k, 1);

        let egfr = 142 * Math.pow(min, alpha) * Math.pow(max, -1.200) * Math.pow(0.9938, a);
        if (gender === 'F') egfr *= 1.012;

        return egfr.toFixed(1);
    };

    const calcCrCl = () => {
        if (!age || !weight || !scr) return '-';
        const a = parseFloat(age);
        const w = parseFloat(weight);
        const s = parseFloat(scr);
        if (s === 0) return 'Error';

        let crcl = ((140 - a) * w) / (72 * s);
        if (gender === 'F') crcl *= 0.85;

        return crcl.toFixed(1);
    };

    return (
        <Card>
            <CardHeader><CardTitle>Renal Function (eGFR & CrCl)</CardTitle></CardHeader>
            <CardContent className="space-y-8">
                <div className="flex gap-6 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="gender" className="w-4 h-4 text-primary" checked={gender === 'M'} onChange={() => setGender('M')} />
                        <span className="text-sm font-medium">Male</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="gender" className="w-4 h-4 text-primary" checked={gender === 'F'} onChange={() => setGender('F')} />
                        <span className="text-sm font-medium">Female</span>
                    </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <Label>{t('age')}</Label>
                        <Input type="number" placeholder="0" value={age} onChange={e => setAge(e.target.value)} />
                    </div>
                    <div className="space-y-3">
                        <Label>{t('weight')} (kg)</Label>
                        <Input type="number" placeholder="0" value={weight} onChange={e => setWeight(e.target.value)} />
                    </div>
                    <div className="space-y-3">
                        <Label>{t('scr')}</Label>
                        <Input type="number" step="0.1" placeholder="0.0" value={scr} onChange={e => setScr(e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 bg-muted/20 p-4 border rounded-md">
                    <div>
                        <Label className="text-muted-foreground">eGFR (CKD-EPI 2021)</Label>
                        <div className={`text-3xl font-bold ${calcEgfr() !== '-' && parseFloat(calcEgfr()) < 60 ? 'text-destructive' : 'text-primary'}`}>
                            {calcEgfr()} <span className="text-sm font-normal">mL/min/1.73m²</span>
                        </div>
                        {calcEgfr() !== '-' && parseFloat(calcEgfr()) < 60 && <p className="text-xs text-destructive mt-1">Check defining protocol thresholds</p>}
                    </div>
                    <div>
                        <Label className="text-muted-foreground">CrCl (Cockcroft-Gault)</Label>
                        <div className="text-3xl font-bold text-primary">{calcCrCl()} <span className="text-sm font-normal">mL/min</span></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function VitalsCalculator() {
    const t = useTranslations('Calculators');

    const [height, setHeight] = useState<string>('');
    const [weight, setWeight] = useState<string>('');

    const [baseWt, setBaseWt] = useState<string>('');
    const [curWt, setCurWt] = useState<string>('');

    const calcBmi = () => {
        if (height && weight) {
            const hM = parseFloat(height) / 100;
            return (parseFloat(weight) / (hM * hM)).toFixed(1);
        }
        return '-';
    };

    const calcBsa = () => {
        // DuBois formula
        if (height && weight) {
            return (0.007184 * Math.pow(parseFloat(height), 0.725) * Math.pow(parseFloat(weight), 0.425)).toFixed(2);
        }
        return '-';
    };

    const calcWtChange = () => {
        if (baseWt && curWt) {
            const b = parseFloat(baseWt);
            const c = parseFloat(curWt);
            if (b === 0) return '-';
            const change = ((c - b) / b) * 100;
            return (change > 0 ? '+' : '') + change.toFixed(1) + '%';
        }
        return '-';
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>BMI & BSA</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label>{t('height')} (cm)</Label>
                            <Input type="number" placeholder="0" value={height} onChange={e => setHeight(e.target.value)} />
                        </div>
                        <div className="space-y-3">
                            <Label>{t('weight')} (kg)</Label>
                            <Input type="number" placeholder="0" value={weight} onChange={e => setWeight(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6 bg-muted/20 p-4 border rounded-md">
                        <div><Label>BMI</Label><div className="text-2xl font-bold text-primary">{calcBmi()}</div></div>
                        <div><Label>BSA (m², DuBois)</Label><div className="text-2xl font-bold text-primary">{calcBsa()}</div></div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Weight Change %</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <Label>{t('baselineWt')} (kg)</Label>
                            <Input type="number" placeholder="0" value={baseWt} onChange={e => setBaseWt(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('currentWt')} (kg)</Label>
                            <Input type="number" placeholder="0" value={curWt} onChange={e => setCurWt(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('wtChange')}</Label>
                            <div className="text-2xl font-bold pt-1 text-primary">{calcWtChange()}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


export default function CalculatorsPage() {
    const t = useTranslations('Calculators');
    const tCommon = useTranslations('Common');
    const [activeTab, setActiveTab] = useState('units');

    const handleExportPDF = () => exportToPDF('calculators-container', `clinical-calc-${activeTab}`);

    // For calculators, we can export the current values by scanning the DOM container
    const handleExportExcel = () => {
        const element = document.getElementById('calculators-container');
        if (!element) return;

        const inputs = Array.from(element.querySelectorAll('input')).map(i => ({
            Label: i.parentElement?.querySelector('label')?.textContent || 'Value',
            Value: i.value
        }));

        const outputs = Array.from(element.querySelectorAll('.text-2xl, .text-3xl')).map(o => ({
            Label: o.previousElementSibling?.textContent || 'Result',
            Value: o.textContent
        }));

        exportToExcel([{ sheetName: 'Results', data: [...inputs, ...outputs] }], `clinical-calc-${activeTab}`);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl" id="calculators-container">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">{t('title')}</h1>
                <p className="text-muted-foreground">{t('desc')}</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-12 h-16 p-1.5 bg-slate-100 rounded-xl overflow-visible">
                    <TabsTrigger
                        value="units"
                        className="h-full whitespace-normal break-words rounded-lg transition-all flex items-center justify-center text-center px-2
                                   data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:-translate-y-1.5 data-[state=active]:border data-[state=active]:border-slate-200"
                    >
                        {t('tabUnits')}
                    </TabsTrigger>
                    <TabsTrigger
                        value="dose"
                        className="h-full whitespace-normal break-words rounded-lg transition-all flex items-center justify-center text-center px-2
                                   data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:-translate-y-1.5 data-[state=active]:border data-[state=active]:border-slate-200"
                    >
                        {t('tabDose')}
                    </TabsTrigger>
                    <TabsTrigger
                        value="iv"
                        className="h-full whitespace-normal break-words rounded-lg transition-all flex items-center justify-center text-center px-2
                                   data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:-translate-y-1.5 data-[state=active]:border data-[state=active]:border-slate-200"
                    >
                        {t('tabIV')}
                    </TabsTrigger>
                    <TabsTrigger
                        value="renal"
                        className="h-full whitespace-normal break-words rounded-lg transition-all flex items-center justify-center text-center px-2
                                   data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:-translate-y-1.5 data-[state=active]:border data-[state=active]:border-slate-200"
                    >
                        {t('tabRenal')}
                    </TabsTrigger>
                    <TabsTrigger
                        value="vitals"
                        className="h-full whitespace-normal break-words rounded-lg transition-all flex items-center justify-center text-center px-2
                                   data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:-translate-y-1.5 data-[state=active]:border data-[state=active]:border-slate-200"
                    >
                        {t('tabVitals')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="units"><UnitConverter /></TabsContent>
                <TabsContent value="dose"><DoseCalculator /></TabsContent>
                <TabsContent value="iv"><IVInfusionCalculator /></TabsContent>
                <TabsContent value="renal"><RenalFunctionCalculator /></TabsContent>
                <TabsContent value="vitals"><VitalsCalculator /></TabsContent>
            </Tabs>

            <div className="mt-12 pt-8 border-t flex justify-end">
                <ExportButtons
                    onExportPDF={handleExportPDF}
                    onExportExcel={handleExportExcel}
                    onExportCSV={handleExportExcel}
                />
            </div>

            <AdSlot slot="clinical-bottom" />


        </div>
    );
}
