'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { DownloadIcon, FileSpreadsheet, FileText } from 'lucide-react';

interface ExportButtonsProps {
    onExportPDF?: () => void;
    onExportExcel?: () => void;
    onExportCSV?: () => void;
}

export function ExportButtons({ onExportPDF, onExportExcel, onExportCSV }: ExportButtonsProps) {
    const t = useTranslations('Common');

    return (
        <div className="flex flex-wrap gap-2 mt-6">
            {onExportPDF && (
                <Button variant="outline" onClick={onExportPDF} className="gap-2">
                    <FileText className="w-4 h-4" />
                    {t('exportPDF')}
                </Button>
            )}
            {onExportExcel && (
                <Button variant="outline" onClick={onExportExcel} className="gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    {t('exportExcel')}
                </Button>
            )}
            {onExportCSV && (
                <Button variant="outline" onClick={onExportCSV} className="gap-2">
                    <DownloadIcon className="w-4 h-4 text-blue-600" />
                    {t('exportCSV')}
                </Button>
            )}
        </div>
    );
}
