import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Schedule' });
    return {
        title: `${t('title')} | Clinical ToolBox`,
        description: t('desc'),
        keywords: ["Visit Schedule", "Clinical Trial Window", "Protocol Management", "CRA Scheduling"],
        openGraph: {
            title: t('title'),
            description: t('desc'),
        }
    };
}

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
    return children;
}
