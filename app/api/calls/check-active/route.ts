import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { supabase } from '@/lib/shared/supabase';

export async function GET(request: NextRequest) {
  try {
    const { getUser, isAuthenticated } = getKindeServerSession();

    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's UID from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('uid, role')
      .eq('auth_id', user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User data not found' }, { status: 404 });
    }

    // Check for active appointments with status 'in_progress' or 'scheduled' that are happening now
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format

    let query = supabase
      .from('appointments')
      .select('aid, scheduled_date, scheduled_time, status, did, pid')
      .eq('scheduled_date', currentDate)
      .in('status', ['scheduled', 'in_progress', 'confirmed']);

    // Filter based on user role
    if (userData.role === 'patient') {
      query = query.eq('pid', userData.uid);
    } else if (userData.role === 'doctor') {
      query = query.eq('did', userData.uid);
    }

    const { data: appointments, error: appointmentsError } = await query;

    if (appointmentsError) {
      console.error('Error fetching appointments:', appointmentsError);
      return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }

    // Filter appointments that are happening now (within 15 minutes window)
    const activeCalls = appointments?.filter(apt => {
      const aptTime = apt.scheduled_time;
      const [aptHour, aptMinute] = aptTime.split(':').map(Number);
      const [currentHour, currentMinute] = currentTime.split(':').map(Number);
      
      const aptMinutes = aptHour * 60 + aptMinute;
      const currentMinutes = currentHour * 60 + currentMinute;
      
      // Call is active if it's within 15 minutes before or after scheduled time
      const timeDiff = currentMinutes - aptMinutes;
      return timeDiff >= -15 && timeDiff <= 60; // 15 min before to 60 min after
    }) || [];

    return NextResponse.json({
      active: activeCalls.length > 0,
      calls: activeCalls,
      count: activeCalls.length
    });

  } catch (error) {
    console.error('Error in check-active API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
