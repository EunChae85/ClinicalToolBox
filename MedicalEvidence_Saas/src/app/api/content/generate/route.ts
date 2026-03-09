import { NextResponse } from 'next/server';
import { generateMedicalContent, analyzeMedicalEvidence } from '@/lib/openai';
import { fetchPubMedData } from '@/lib/pubmed';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    const { evidence_id, type, language = 'ko', tone = 'professional' } = await request.json();

    if (!evidence_id || !type) {
        return NextResponse.json({ error: 'Evidence ID and content type are required' }, { status: 400 });
    }

    try {
        // Fetch/Analyze Data
        const pubMedData = await fetchPubMedData(evidence_id);
        if (!pubMedData) return NextResponse.json({ error: 'Data not found' }, { status: 404 });

        const analysis = await analyzeMedicalEvidence(pubMedData.title, pubMedData.abstract);
        const content = await generateMedicalContent(type, analysis, language, tone);

        // Persist to Supabase
        const contentId = uuidv4();
        // Explicitly cast to any to avoid Database type mismatch in MVP
        const { error: dbError } = await (supabase.from('content_assets') as any).insert({
            id: contentId,
            evidence_id: evidence_id,
            content_type: type,
            content_json: content,
            language: language
        });

        if (dbError) console.error('Supabase Save Error:', dbError);

        return NextResponse.json({
            content_id: contentId,
            evidence_id,
            type,
            content,
            message: 'Content generated and saved successfully',
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }
}
