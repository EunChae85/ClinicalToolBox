'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export default function Header() {
    const t = useTranslations('Index');
    const tNav = useTranslations('Navigation');
    const tCommon = useTranslations('Common');
    const pathname = usePathname();
    const router = useRouter();
    const { locale } = useParams();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <header className="border-b bg-background">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
                    {t('title')}
                </Link>
                <nav className="hidden md:flex gap-6">
                    <Link href="/#clinical" className="text-muted-foreground hover:text-foreground transition-colors">
                        {tNav('clinical')}
                    </Link>
                    <Link href="/#medical" className="text-muted-foreground hover:text-foreground transition-colors">
                        {tNav('medical')}
                    </Link>
                    <Link href="/#statistical" className="text-muted-foreground hover:text-foreground transition-colors">
                        {tNav('statistical')}
                    </Link>
                    <Link href="/guides" className={pathname.startsWith('/guides') ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground transition-colors"}>
                        {tNav('guides')}
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <select
                        value={locale as string}
                        onChange={handleLanguageChange}
                        className="text-sm border rounded p-1 bg-transparent"
                        aria-label={tCommon('language')}
                    >
                        <option value="ko">KO</option>
                        <option value="en">EN</option>
                    </select>
                </div>
            </div>
        </header>
    );
}
