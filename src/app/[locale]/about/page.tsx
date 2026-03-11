import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'About' });
    return {
        title: t('metaTitle'),
        description: t('metaDesc'),
        openGraph: {
            title: t('metaTitle'),
            description: t('metaDesc'),
        }
    };
}

export default function AboutPage() {
    const t = useTranslations('About');

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                    {t('title')}
                </h1>
                <p className="text-xl text-muted-foreground font-medium">
                    {t('intro')}
                </p>
            </header>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                <section className="space-y-4">
                    <p className="text-lg leading-relaxed">{t('p1')}</p>
                    <p className="text-lg leading-relaxed">{t('p2')}</p>
                    <p className="text-lg leading-relaxed">{t('p3')}</p>
                    <p className="text-lg leading-relaxed">{t('p4')}</p>
                    <p className="text-lg leading-relaxed">{t('p5')}</p>
                </section>

                <section className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10">
                    <h2 className="text-3xl font-bold mb-6">{t('mission')}</h2>
                    <p className="text-xl leading-relaxed italic text-foreground/90 font-medium">
                        "{t('missionText')}"
                    </p>
                </section>

                <section className="space-y-10 py-8">
                    <h2 className="text-3xl font-bold text-center">{t('whyUs')}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-card p-6 rounded-2xl border shadow-sm">
                            <h3 className="text-xl font-bold mb-3">{t('reason1Title')}</h3>
                            <p className="text-muted-foreground leading-relaxed">{t('reason1Desc')}</p>
                        </div>
                        <div className="bg-card p-6 rounded-2xl border shadow-sm">
                            <h3 className="text-xl font-bold mb-3">{t('reason2Title')}</h3>
                            <p className="text-muted-foreground leading-relaxed">{t('reason2Desc')}</p>
                        </div>
                        <div className="bg-card p-6 rounded-2xl border shadow-sm">
                            <h3 className="text-xl font-bold mb-3">{t('reason3Title')}</h3>
                            <p className="text-muted-foreground leading-relaxed">{t('reason3Desc')}</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
