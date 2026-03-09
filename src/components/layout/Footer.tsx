'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';

export default function Footer() {
    const t = useTranslations('Footer');
    const tNav = useTranslations('Navigation');
    const ft = useTranslations('Feedback');

    const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdqnh79vrEYbU1Ymvvdfp4wOpVkcz8k4NgX-KG7fvu4ry2vzg/viewform?usp=header";

    return (
        <footer className="border-t py-12 mt-20 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Feedback CTA Section */}
                <div className="max-w-4xl mx-auto text-center mb-12 p-8 rounded-2xl bg-background/50 border border-primary/10 shadow-sm">
                    <h3 className="text-xl font-bold mb-3">{ft('footerTitle')}</h3>
                    <p className="text-muted-foreground mb-6">
                        {ft('footerDesc')}
                        <br />
                        <span className="text-foreground font-medium">{ft('footerCallToAction')}</span>
                    </p>
                    <Button
                        variant="default"
                        size="lg"
                        className="rounded-full gap-2 shadow-md hover:shadow-lg transition-all"
                        onClick={() => window.open(GOOGLE_FORM_URL, '_blank')}
                    >
                        <MessageSquarePlus className="w-5 h-5" />
                        {ft('buttonLabel')}
                    </Button>
                </div>

                <div className="text-center">
                    <div className="flex justify-center gap-8 mb-8 text-sm font-medium">
                        <Link href="/about" className="hover:text-primary transition-colors">{tNav('about')}</Link>
                        <Link href="/privacy" className="hover:text-primary transition-colors">{tNav('privacy')}</Link>
                        <Link href="/guides" className="hover:text-primary transition-colors">{tNav('guides')}</Link>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-3xl mx-auto opacity-70">
                        {t('disclaimer')}
                    </p>
                    <p className="text-xs text-muted-foreground/40 mt-6 font-mono">
                        v1.2.0 (ADS & SEO)
                    </p>
                </div>
            </div>
        </footer>
    );
}
