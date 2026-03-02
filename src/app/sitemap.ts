import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://clinical-toolbox.com';
    const locales = ['ko', 'en'];
    const paths = ['', '/calculators', '/compliance', '/schedule'];

    const routes = locales.flatMap((locale) =>
        paths.map((path) => ({
            url: `${baseUrl}/${locale}${path}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: path === '' ? 1 : 0.8,
        }))
    );

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        ...routes,
    ];
}
