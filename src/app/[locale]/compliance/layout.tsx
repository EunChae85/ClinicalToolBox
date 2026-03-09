import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Compliance' });
    return {
        title: `${t('title')} | Clinical ToolBox`,
        description: t('desc'),
        keywords: ["Medication Compliance", "Drug Accountability", "CRA Tool", "Clinical Trial Calculator"],
        openGraph: {
            title: t('title'),
            description: t('desc'),
        }
    };
}

export default function ComplianceLayout({ children }: { children: React.ReactNode }) {
    return children;
}
