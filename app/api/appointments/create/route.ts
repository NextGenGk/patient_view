import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        // Get authenticated user
        const { getUser } = getKindeServerSession();
        const kindeUser = await getUser();

        if (!kindeUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get request body
        const body = await request.json();
        const {
            did,
            scheduled_date,
            scheduled_time,
            mode,
            chief_complaint,
            symptoms = [],
            payment_id,
            payment_status = 'pending',                scheduled_date,
                scheduled_time,
                chief_complaint,
                symptoms: symptoms.length > 0 ? symptoms : null,
                payment_id: payment_id || null,
                payment_status,        return NextResponse.json({
            success: true,
            appointment,
            message: 'Appointment booked successfully!',
        });
    } catch (error) {
        console.error('Appointment creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create appointment' },
            { status: 500 }
        );
    }
}
