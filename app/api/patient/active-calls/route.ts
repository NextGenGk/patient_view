import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const uid = searchParams.get('uid'); // Database UID

        if (!uid) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Get PID for this user
        const { data: patient } = await supabase
            .from('patients')
            .select('pid')
            .eq('uid', uid)
            .single();

        if (!patient) {
            return NextResponse.json({ activeCalls: [] });
        }

        // Find active calls
        const { data: activeCalls } = await supabase
            .from('appointments')
            .select('*, doctor:doctors(user:users(name))')
            .eq('pid', patient.pid)
            .eq('status', 'in_progress')
            .order('call_started_at', { ascending: false });

        return NextResponse.json({
            success: true,
            activeCalls: activeCalls || []
        });

    } catch (error: any) {
        console.error('[API] Active calls error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
