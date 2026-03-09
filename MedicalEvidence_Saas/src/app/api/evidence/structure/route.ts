import { NextResponse } from 'next/server';
import { analyzeMedicalEvidence } from '@/lib/openai';
import { fetchPubMedData } from '@/lib/pubmed';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    const { evidence_id } = await request.json();

    if (!evidence_id) {
        return NextResponse.json({ error: 'Evidence ID is required' }, { status: 400 });
    }

    try {
        const pubMedData = await fetchPubMedData(evidence_id);
        if (!pubMedData) return NextResponse.json({ error: 'Data not found' }, { status: 404 });

        const analysis = await analyzeMedicalEvidence(pubMedData.title, pubMedData.abstract);

        // Persist PICO structure to Supabase
        const { error: dbError } = await (supabase.from('evidence_structures') as any).upsert({
            id: evidence_id, // Using evidence_id as ID for simple lookup in MVP
            evidence_id: evidence_id,
            study_type: analysis.study_type,
            population: analysis.population,
            intervention: analysis.intervention,
            comparison: analysis.comparison,
            outcome: analysis.outcome,
            results: analysis.results,
            safety: analysis.safety,
            limitations: analysis.limitations,
            evidence_strength: analysis.evidence_strength
        });

        if (dbError) console.error('Supabase Save Error (evidence_structures):', dbError);

        return NextResponse.json({
            evidence_id,
            title: pubMedData.title,
            ...analysis,
            message: 'Evidence analyzed and structured successfully',
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to analyze evidence' }, { status: 500 });
    }
}
