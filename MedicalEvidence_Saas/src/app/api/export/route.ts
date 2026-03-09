import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { format } = await request.json();

        // Mock download response
        return NextResponse.json({
            success: true,
            data: {
                url: `https://mock-domain.com/downloads/sample-export.${format}`
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to export' }, { status: 400 });
    }
}
