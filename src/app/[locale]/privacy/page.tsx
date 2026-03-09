import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Privacy' });
    return {
        title: t('metaTitle'),
        description: t('metaDesc'),
    };
}

export default function PrivacyPage() {
    const t = useTranslations('Privacy');

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold mb-6 tracking-tight">
                    {t('title')}
                </h1>
                <p className="text-lg text-muted-foreground">
                    {t('introduction')}
                </p>
            </header>

            <div className="space-y-12">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">{t('cookiesTitle')}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t('cookiesText')}</p>
                </section>

                <section className="bg-muted/50 p-8 rounded-2xl border space-y-4">
                    <h2 className="text-2xl font-bold">{t('adsenseTitle')}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t('adsenseText1')}</p>
                    <p className="text-muted-foreground leading-relaxed font-semibold">{t('adsenseText2')}</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">{t('dataHandlingTitle')}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t('dataHandlingText')}</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">{t('complianceTitle')}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t('complianceText')}</p>
                </section>

                <footer className="pt-8 border-t text-sm text-muted-foreground">
                    <p>Last Updated: {new Date().toLocaleDateString()}</p>
                </footer>
            </div>
        </div>
    );
}
