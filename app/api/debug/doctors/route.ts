import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        // 1. Count doctors
        const { count, error: countError } = await supabase
            .from('doctors')
            .select('*', { count: 'exact', head: true });

        // 2. Head rows
        const { data: rawDoctors, error: dataError } = await supabase
            .from('doctors')
            .select('did, uid');

        return NextResponse.json({
            count,
            rawDoctors,
            countError,
            dataError
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
