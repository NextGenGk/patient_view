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

    const body = await request.json();
    const {
      aid,
      did,
      amount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payment_method,
      razorpay_response,
      status = 'paid',
    } = body;

    // Get user's UID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('uid')
      .eq('auth_id', kindeUser.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get patient ID
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('pid')
      .eq('uid', userData.uid)
      .single();

    if (patientError || !patientData) {
      return NextResponse.json(
        { error: 'Patient record not found' },
        { status: 404 }
      );
    }

    const pid = patientData.pid;

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('finance_transactions')
      .insert({
        aid,
        pid,
        did,
        transaction_type: 'consultation',
        amount,
        currency: 'INR',
        status,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        payment_method: payment_method || 'card',
        razorpay_response,
        description: `Consultation payment for appointment ${aid}`,
        initiated_at: new Date().toISOString(),
        paid_at: status === 'paid' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      return NextResponse.json(
        { error: 'Failed to record transaction' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transaction,
      message: 'Transaction recorded successfully',
    });
  } catch (error) {
    console.error('Transaction recording error:', error);
    return NextResponse.json(
      { error: 'Failed to record transaction' },
      { status: 500 }
    );
  }
}
