import { NextResponse } from 'next/server';
import { fetchPubMedData } from '@/lib/pubmed';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    const { evidence_id } = await request.json();

    if (!evidence_id) {
        return NextResponse.json({ error: 'Evidence ID is required' }, { status: 400 });
    }

    const pubMedData = await fetchPubMedData(evidence_id);

    if (pubMedData) {
        // Upsert to Supabase
        const { error: dbError } = await (supabase.from('evidence_items') as any).upsert({
            id: evidence_id,
            user_id: 'mvp-user', // Mock user for now
            source_type: 'pmid',
            pmid: evidence_id,
            title: pubMedData.title,
            journal: pubMedData.journal,
            year: parseInt(pubMedData.year) || null,
            abstract: pubMedData.abstract,
        });

        if (dbError) console.error('Supabase Save Error (evidence_items):', dbError);

        return NextResponse.json({
            id: pubMedData.id,
            title: pubMedData.title,
            abstract: pubMedData.abstract,
            journal: pubMedData.journal,
            year: pubMedData.year,
            message: 'Evidence imported and saved successfully',
        });
    }

    return NextResponse.json({
        error: 'PMID not found. Please check the ID or upload a PDF.'
    }, { status: 404 });
}
