import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Calculators' });
    return {
        title: `${t('title')} | Clinical ToolBox`,
        description: t('desc'),
        keywords: ["Clinical Calculator", "eGFR Calculator", "CrCl Calculator", "CRA Tools", "Dose Calculator"],
        openGraph: {
            title: t('title'),
            description: t('desc'),
        }
    };
}

export default function CalculatorsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
