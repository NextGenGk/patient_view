import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Log availability of keys (masked)
    console.log('Razorpay Config Check:', {
      keyIdPresent: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      keySecretPresent: !!process.env.RAZORPAY_KEY_SECRET,
    });

    // Get authenticated user
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log('Create Order Payload:', body); // Debugging payload

    const { amount, currency = "INR", receipt, notes } = body;

    // Validate amount
    if (!amount || amount <= 0) {
      console.error('Invalid amount received:', amount);
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    };

    console.log('Razorpay Order Options:', options);

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    // Log detailed Razorpay error
    console.error("Razorpay order creation error:", JSON.stringify(error, null, 2));

    // Check for specific Razorpay error code
    const errorMessage = error.error?.description || error.message || "Failed to create payment order";

    return NextResponse.json(
      { error: errorMessage, details: error },
      { status: 500 },
    );
  }
}
