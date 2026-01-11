import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(
    request: NextRequest,
    { params }: { params: { aid: string } }
) {
    try {
        const { aid } = params;
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data, error } = await supabase
            .from('appointments')
            .select('status, call_started_at, call_ended_at')
            .eq('aid', aid)
            .single();

        if (error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
