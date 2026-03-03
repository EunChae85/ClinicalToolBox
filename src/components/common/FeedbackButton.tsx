'use client';

import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function FeedbackButton() {
    const t = useTranslations('Feedback');

    // Replace with your actual Google Form URL
    const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdqnh79vrEYbU1Ymvvdfp4wOpVkcz8k4NgX-KG7fvu4ry2vzg/viewform?usp=header";

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Button
                onClick={() => window.open(GOOGLE_FORM_URL, '_blank')}
                className="rounded-full shadow-2xl h-14 px-6 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all bg-primary text-primary-foreground border-2 border-primary-foreground/10"
            >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span className="font-semibold">{t('floatingBtn')}</span>
            </Button>
        </div>
    );
}
