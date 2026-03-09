import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Guides' });
    return {
        title: t('metaTitle'),
        description: t('metaDesc'),
    };
}

export default function GuidesPage() {
    const t = useTranslations('Guides');

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
            <header className="mb-16 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                    {t('title')}
                </h1>
                <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-6" />
            </header>

            <div className="space-y-24">
                {/* Compliance Guide */}
                <article className="space-y-8">
                    <h2 className="text-3xl font-bold border-b pb-4">
                        {t('complianceGuide.title')}
                    </h2>
                    <p className="text-lg leading-relaxed text-foreground/80">
                        {t('complianceGuide.intro')}
                    </p>

                    <div className="grid md:grid-cols-2 gap-12 pt-4">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-primary">
                                {t('complianceGuide.section1Title')}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('complianceGuide.section1Text')}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-primary">
                                {t('complianceGuide.section2Title')}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('complianceGuide.section2Text')}
                            </p>
                        </div>
                    </div>

                    <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 mt-8">
                        <h3 className="text-xl font-bold text-primary mb-3">
                            {t('complianceGuide.section3Title')}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {t('complianceGuide.section3Text')}
                        </p>
                    </div>
                </article>

                {/* Schedule Guide */}
                <article className="space-y-8">
                    <h2 className="text-3xl font-bold border-b pb-4">
                        {t('scheduleGuide.title')}
                    </h2>
                    <p className="text-lg leading-relaxed text-foreground/80">
                        {t('scheduleGuide.intro')}
                    </p>

                    <div className="grid md:grid-cols-2 gap-12 pt-4">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-teal-600">
                                {t('scheduleGuide.section1Title')}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('scheduleGuide.section1Text')}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-teal-600">
                                {t('scheduleGuide.section2Title')}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('scheduleGuide.section2Text')}
                            </p>
                        </div>
                    </div>

                    <div className="bg-teal-500/5 p-8 rounded-2xl border border-teal-500/10 mt-8">
                        <h3 className="text-xl font-bold text-teal-600 mb-3">
                            {t('scheduleGuide.section3Title')}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {t('scheduleGuide.section3Text')}
                        </p>
                    </div>
                </article>

                {/* Site Management Section */}
                <article className="bg-slate-900 text-white p-10 md:p-16 rounded-[2.5rem] space-y-6 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
                    <h2 className="text-3xl font-bold relative z-10">{t('siteManagement.title')}</h2>
                    <p className="text-slate-300 leading-relaxed text-xl relative z-10 whitespace-pre-wrap">
                        {t('siteManagement.text')}
                    </p>
                </article>
            </div>
        </div>
    );
}
