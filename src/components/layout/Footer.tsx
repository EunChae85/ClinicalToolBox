import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('Footer');

    return (
        <footer className="border-t py-6 mt-12 bg-muted/20">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
                    {t('disclaimer')}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-4">
                    v1.0.0
                </p>
            </div>
        </footer>
    );
}
