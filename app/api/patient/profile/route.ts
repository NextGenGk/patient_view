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

        // Get user and patient data
        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('uid', uid)
            .single();

        const { data: patient } = await supabase
            .from('patients')
            .select('*')
            .eq('uid', uid)
            .single();

        return NextResponse.json({
            success: true,
            user,
            patient: patient || null,
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { uid, user, patient } = await request.json();

        if (!uid) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Update user table
        if (user) {
            const { error: userError } = await supabase
                .from('users')
                .update({
                    name: user.name,
                    phone: user.phone,
                    profile_image_url: user.profile_image_url,
                })
                .eq('uid', uid);

            if (userError) {
                console.error('User update error:', userError);
                throw userError;
            }
        }

        // Update or create patient record
        if (patient) {
            const { data: existingPatient } = await supabase
                .from('patients')
                .select('pid')
                .eq('uid', uid)
                .single();

            // Clean up patient data - convert empty strings to null for optional fields
            const cleanedPatient = {
                date_of_birth: patient.date_of_birth || null,
                gender: patient.gender || null,
                blood_group: patient.blood_group || null,
                address_line1: patient.address_line1 || null,
                address_line2: patient.address_line2 || null,
                city: patient.city || null,
                state: patient.state || null,
                postal_code: patient.postal_code || null,
                emergency_contact_name: patient.emergency_contact_name || null,
                emergency_contact_phone: patient.emergency_contact_phone || null,
                allergies: patient.allergies || [],
                chronic_conditions: patient.chronic_conditions || [],
            };

            if (existingPatient) {
                // Update existing patient
                const { error: patientError } = await supabase
                    .from('patients')
                    .update(cleanedPatient)
                    .eq('uid', uid);

                if (patientError) {
                    console.error('Patient update error:', patientError);
                    throw patientError;
                }
            } else {
                // Create new patient record
                const { error: createError } = await supabase
                    .from('patients')
                    .insert({
                        uid,
                        ...cleanedPatient,
                    });

                if (createError) {
                    console.error('Patient create error:', createError);
                    throw createError;
                }
            }
        }

        return NextResponse.json({ success: true, message: 'Profile updated successfully' });
    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json({ 
            error: 'Failed to update profile',
            details: error.message || 'Unknown error'
        }, { status: 500 });
    }
}
