import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const uid = searchParams.get('uid');

        if (!uid) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Get patient record
        const { data: patient } = await supabase
            .from('patients')
            .select('pid')
            .eq('uid', uid)
            .single();

        if (!patient) {
            return NextResponse.json({ success: true, appointments: [] });
        }

        // Get appointments
        const { data: appointments, error: appointmentsError } = await supabase
            .from('appointments')
            .select('*')
            .eq('pid', patient.pid)
            .order('scheduled_date', { ascending: false })
            .order('scheduled_time', { ascending: false });

        if (appointmentsError) {
            console.error('Appointments error:', appointmentsError);
            throw appointmentsError;
        }

        if (!appointments || appointments.length === 0) {
            return NextResponse.json({ success: true, appointments: [] });
        }

        // Get all unique doctor IDs
        const doctorIds = [...new Set(appointments.map(apt => apt.did))];

        // Fetch doctor details with user info
        const { data: doctors, error: doctorsError } = await supabase
            .from('doctors')
            .select(`
                did,
                uid,
                specialization,
                consultation_fee,
                user:users(name, email, phone, profile_image_url)
            `)
            .in('did', doctorIds);

        if (doctorsError) {
            console.error('Doctors error:', doctorsError);
        }

        // Map doctor data to appointments
        const enrichedAppointments = appointments.map(apt => ({
            ...apt,
            doctor: doctors?.find(doc => doc.did === apt.did) || null
        }));

        return NextResponse.json({
            success: true,
            appointments: enrichedAppointments,
        });
    } catch (error) {
        console.error('Appointments API error:', error);
        return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { pid, did, scheduled_date, scheduled_time, mode, chief_complaint, symptoms, consultation_fee } = body;

        // Basic validation
        if (!pid || !did || !scheduled_date || !scheduled_time) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Insert new appointment
        const { data: appointment, error } = await supabase
            .from('appointments')
            .insert({
                pid,
                did,
                scheduled_date,
                scheduled_time,
                mode: mode || 'online',
                chief_complaint,
                symptoms: symptoms || [],
                status: 'scheduled',
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Appointment creation error:', error);
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: 'Appointment booked successfully',
            appointment
        });

    } catch (error: any) {
        console.error('Book appointment error:', error);
        return NextResponse.json({ 
            error: 'Failed to book appointment',
            details: error.message 
        }, { status: 500 });
    }
}
