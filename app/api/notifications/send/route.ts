import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/shared/notifications/email';
import { generateAppointmentCreatedEmail, generatePrescriptionCreatedEmail } from '@/lib/shared/notifications/templates';
import { supabase } from '@/lib/shared/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, data } = body;

        if (!type || !data) {
            return NextResponse.json(
                { success: false, error: 'Missing type or data' },
                { status: 400 }
            );
        }

        let results: any[] = [];

        if (type === 'appointment_created') {
            const {
                patientId,
                doctorId,
                appointmentDate,
                appointmentTime,
                mode,
                chiefComplaint,
                meetingLink,
                tokenNumber,
            } = data;

            // Fetch patient and doctor details
            console.log('Fetching patient with pid:', patientId);
            console.log('Fetching doctor with did:', doctorId);

            const { data: patient, error: patientError } = await supabase
                .from('patients')
                .select(`
                    *,
                    user:uid (
                        uid,
                        name,
                        email,
                        profile_image_url
                    )
                `)
                .eq('pid', patientId)
                .single();

            if (patientError) {
                console.error('Patient fetch error:', patientError);
            }

            const { data: doctor, error: doctorError } = await supabase
                .from('doctors')
                .select(`
                    *,
                    user:uid (
                        uid,
                        name,
                        email,
                        profile_image_url
                    )
                `)
                .eq('did', doctorId)
                .single();

            if (doctorError) {
                console.error('Doctor fetch error:', doctorError);
            }

            if (!patient?.user || !doctor?.user) {
                console.error('Missing data - Patient:', !!patient, 'Doctor:', !!doctor);
                console.error('Patient user:', !!patient?.user, 'Doctor user:', !!doctor?.user);
                if (patient) console.log('Patient data:', patient);
                if (doctor) console.log('Doctor data:', doctor);
                return NextResponse.json(
                    { success: false, error: 'Patient or doctor not found' },
                    { status: 404 }
                );
            }

            // Send email to patient
            const patientEmailHtml = generateAppointmentCreatedEmail({
                recipientName: patient.user.name,
                recipientType: 'patient',
                patientName: patient.user.name,
                doctorName: doctor.user.name,
                appointmentDate,
                appointmentTime,
                mode,
                chiefComplaint,
                meetingLink,
                tokenNumber,
            });

            const patientEmailResult = await sendEmail({
                to: patient.user.email,
                subject: '✅ Appointment Confirmed - AuraSutra',
                html: patientEmailHtml,
            });

            results.push({ recipient: 'patient', email: patient.user.email, ...patientEmailResult });

            // Send email to doctor
            const doctorEmailHtml = generateAppointmentCreatedEmail({
                recipientName: doctor.user.name,
                recipientType: 'doctor',
                patientName: patient.user.name,
                doctorName: doctor.user.name,
                appointmentDate,
                appointmentTime,
                mode,
                chiefComplaint,
                meetingLink,
                tokenNumber,
            });

            const doctorEmailResult = await sendEmail({
                to: doctor.user.email,
                subject: '📅 New Appointment Scheduled - AuraSutra',
                html: doctorEmailHtml,
            });

            results.push({ recipient: 'doctor', email: doctor.user.email, ...doctorEmailResult });
        }

        else if (type === 'prescription_created') {
            const {
                patientId,
                doctorId,
                diagnosis,
                medicines,
                instructions,
            } = data;

            // Fetch patient and doctor details
            const { data: patient } = await supabase
                .from('patients')
                .select(`
                    *,
                    user:uid (
                        uid,
                        name,
                        email,
                        profile_image_url
                    )
                `)
                .eq('pid', patientId)
                .single();

            const { data: doctor } = await supabase
                .from('doctors')
                .select(`
                    *,
                    user:uid (
                        uid,
                        name,
                        email,
                        profile_image_url
                    )
                `)
                .eq('did', doctorId)
                .single();

            if (!patient?.user || !doctor?.user) {
                return NextResponse.json(
                    { success: false, error: 'Patient or doctor not found' },
                    { status: 404 }
                );
            }

            const dashboardLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/prescriptions`;

            // Send email to patient
            const patientEmailHtml = generatePrescriptionCreatedEmail({
                recipientName: patient.user.name,
                recipientType: 'patient',
                patientName: patient.user.name,
                doctorName: doctor.user.name,
                diagnosis,
                medicines,
                instructions,
                dashboardLink,
            });

            const patientEmailResult = await sendEmail({
                to: patient.user.email,
                subject: `💊 New Prescription from Dr. ${doctor.user.name} - AuraSutra`,
                html: patientEmailHtml,
            });

            results.push({ recipient: 'patient', email: patient.user.email, ...patientEmailResult });

            // Send email to doctor
            const doctorEmailHtml = generatePrescriptionCreatedEmail({
                recipientName: doctor.user.name,
                recipientType: 'doctor',
                patientName: patient.user.name,
                doctorName: doctor.user.name,
                diagnosis,
                medicines,
                instructions,
                dashboardLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/dashboard/prescriptions`,
            });

            const doctorEmailResult = await sendEmail({
                to: doctor.user.email,
                subject: `📋 Prescription Created for ${patient.user.name} - AuraSutra`,
                html: doctorEmailHtml,
            });

            results.push({ recipient: 'doctor', email: doctor.user.email, ...doctorEmailResult });
        }

        else {
            return NextResponse.json(
                { success: false, error: 'Invalid notification type' },
                { status: 400 }
            );
        }

        const allSuccess = results.every(r => r.success);

        return NextResponse.json({
            success: allSuccess,
            results,
            message: allSuccess ? 'All notifications sent successfully' : 'Some notifications failed',
        });

    } catch (error: any) {
        console.error('Notification error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to send notifications' },
            { status: 500 }
        );
    }
}
