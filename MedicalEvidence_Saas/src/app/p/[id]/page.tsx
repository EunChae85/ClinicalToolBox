import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import PublicContentView from '../../../components/PublicContentView';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    // Fetch asset and evidence for SEO
    const { data: asset } = await (supabase
        .from('content_assets')
        .select('*, evidence_items(*)')
        .eq('id', id)
        .single() as any);

    if (!asset) return { title: 'EvidenceFlow | Content Not Found' };

    const evidence = asset.evidence_items;
    const title = `Medical Insight: ${evidence?.title || 'Summary'}`;
    const description = `Summarized evidence from ${evidence?.journal || 'Research'} (${evidence?.year || '2026'})`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        }
    };
}

export default async function PublicPage({ params }: Props) {
    const { id } = await params;

    // Fetch from Supabase with explicit cast to any for MVP speed
    const { data: asset, error } = await (supabase
        .from('content_assets')
        .select('*, evidence_items(*), evidence_structures(*)')
        .eq('id', id)
        .single() as any);

    if (error || !asset) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#f8fafc]">
            <PublicContentView asset={asset} />
        </main>
    );
}
