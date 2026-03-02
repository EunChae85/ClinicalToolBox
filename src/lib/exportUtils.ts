import * as XLSX from 'xlsx';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * simple CSV export
 */
export function exportToCSV(data: any[], filename: string) {
    if (!data || data.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Excel export logic
 * Can accept multiple sheets data.
 * @param sheetsData Array of objects: { sheetName: string, data: any[][] | object[] }
 */
export function exportToExcel(sheetsData: { sheetName: string; data: any[] }[], filename: string) {
    const workbook = XLSX.utils.book_new();

    sheetsData.forEach(sheet => {
        let worksheet;
        if (Array.isArray(sheet.data) && Array.isArray(sheet.data[0])) {
            worksheet = XLSX.utils.aoa_to_sheet(sheet.data);
        } else {
            worksheet = XLSX.utils.json_to_sheet(sheet.data);
        }
        XLSX.utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
    });

    XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * PDF export using html-to-image & jsPDF
 */
export async function exportToPDF(elementId: string, filename: string) {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        // Capture dimensions to avoid cutting
        const width = element.scrollWidth;
        const height = element.scrollHeight;

        // Use html-to-image with higher pixel ratio for better clarity
        const dataUrl = await toPng(element, {
            backgroundColor: '#ffffff',
            pixelRatio: 2,
            width: width,
            height: height,
            style: {
                padding: '10px',
                margin: '0',
                width: `${width}px`,
                height: `${height}px`,
            }
        });

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const margin = 15; // 15mm margin
        const printableWidth = pdfWidth - (margin * 2);
        const printableHeight = pdfHeight - (margin * 2);

        const imgProps = pdf.getImageProperties(dataUrl);
        const ratio = printableWidth / imgProps.width;
        const contentHeight = imgProps.height * ratio;

        let heightLeft = contentHeight;
        let position = margin;

        // Add first page
        pdf.addImage(dataUrl, 'PNG', margin, position, printableWidth, contentHeight);
        heightLeft -= printableHeight;

        // Add extra pages if content is taller than A4
        while (heightLeft > 0) {
            position = (position - printableHeight);
            pdf.addPage();
            // To prevent content from overlapping the top margin on new pages,
            // we'd ideally crop the image, but the offset method is common.
            pdf.addImage(dataUrl, 'PNG', margin, position, printableWidth, contentHeight);
            heightLeft -= printableHeight;
        }

        pdf.save(`${filename}.pdf`);
    } catch (err) {
        console.error('Failed to generate PDF', err);
    }
}
