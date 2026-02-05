'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Calendar, Clock, Video, MapPin, User, Award, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { TranslatedText } from '../../components/TranslatedText';

export default function BookAppointmentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const did = searchParams.get('did');

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'online' | 'offline'>('online');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (did) {
      fetchDoctor();
    }
  }, [did]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  async function fetchDoctor() {
    try {
      const response = await fetch(`/api/doctors/${did}`);
      const data = await response.json();
      if (data.success) {
        setDoctor(data.doctor);
      } else {
        toast.error('Doctor not found');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
      toast.error('Failed to load doctor details');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 0. Load Razorpay Script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load payment gateway. Please check your internet connection.');
        setSubmitting(false);
        return;
      }

      // 1. Sync user & Get profile
      const syncResponse = await fetch('/api/sync-user');
      const { user } = await syncResponse.json();

      const profileResponse = await fetch(`/api/patient/profile?uid=${user.uid}`);
      const profileData = await profileResponse.json();

      if (!profileData.success || !profileData.patient) {
        toast.error('Please complete your profile first');
        router.push('/dashboard/profile');
        setSubmitting(false);
        return;
      }

      const pid = profileData.patient.pid;

      // 2. Create Razorpay Order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: doctor.consultation_fee,
          currency: 'INR',
          receipt: `apt_${Date.now()}`,
          notes: {
             pid: pid,
             did: did,
             consultation_type: mode
          }
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        toast.error(orderData.error || 'Failed to create payment order');
        setSubmitting(false);
        return;
      }

      // 3. Initialize Razorpay Checkout
      console.log('Initializing Razorpay with order:', orderData.order.id);
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "AuraSutra",
        description: `Consultation with Dr. ${doctor.user.name}`,
        image: "/Logos/logo_transparent.png",
        order_id: orderData.order.id,
        handler: async function (response: any) {
             console.log('Payment successful, verifying...');
          try {
            // 4. Verify Payment
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
               // 5. Book Appointment on Success
               await bookAppointment(pid, doctor.consultation_fee); // Pass fee for record keeping if we add transaction later
            } else {
               toast.error('Payment verification failed');
               setSubmitting(false);
            }
          } catch (error) {
             console.error('Verification error:', error);
             toast.error('Payment verification failed');
             setSubmitting(false);
          }
        },
        prefill: {
          name: profileData.patient.emergency_contact_name || user.name, // Use user name as fallback
          email: user.email,
          contact: profileData.patient.emergency_contact_phone || user.phone || ""
        },
        theme: {
          color: "#10B981" // Emerald-500
        },
        modal: {
            ondismiss: function() {
                setSubmitting(false);
                toast('Payment cancelled', { icon: '⚠️' });
            }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Failed to initiate payment');
      setSubmitting(false);
    }
  }

  async function bookAppointment(pid: string, amount: number) {
      try {
        const appointmentData = {
            pid,
            did,
            scheduled_date: selectedDate,
            scheduled_time: selectedTime,
            mode,
            chief_complaint: chiefComplaint,
            symptoms: symptoms ? symptoms.split(',').map(s => s.trim()) : [],
            // consultation_fee: amount // Removed as per schema fix
        };

        const response = await fetch('/api/patient/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointmentData),
        });

        const data = await response.json();

        if (data.success) {
            setShowSuccess(true);
            setTimeout(() => {
                router.push('/dashboard/appointments');
            }, 2000);
        } else {
            toast.error(data.error || 'Failed to book appointment');
        }
      } catch (error) {
          console.error('Booking error:', error);
          toast.error('Failed to complete booking after payment');
      } finally {
          setSubmitting(false);
      }
  }

  // Generate time slots (9 AM - 5 PM, 30-minute intervals)
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 17 && minute === 30) break;
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  // Get minimum date (today for testing)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  // Get maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!doctor) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
        <p className="text-gray-600">Schedule your consultation with the doctor</p>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 rounded-2xl max-w-md w-full text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked!</h2>
            <p className="text-gray-600 mb-4">
              Your appointment has been successfully scheduled. Redirecting you to appointments page...
            </p>
          </div>
        </div>
      )}

      {/* Doctor Card */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-start space-x-4">
          {doctor.user.profile_image_url ? (
            <img
              src={doctor.user.profile_image_url}
              alt={doctor.user.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
              <User className="w-10 h-10 text-primary-600" />
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2"><TranslatedText>Dr.</TranslatedText> <TranslatedText>{doctor.user.name}</TranslatedText></h2>
            <div className="flex items-center space-x-2 text-gray-600 mb-2">
              <Award className="w-4 h-4" />
              <span className="font-medium"><TranslatedText>{doctor.qualification}</TranslatedText></span>            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {doctor.specialization?.slice(0, 3).map((spec: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                >
                  <TranslatedText>{spec}</TranslatedText>                </span>
              ))}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>📍 <TranslatedText>{doctor.city}</TranslatedText>, <TranslatedText>{doctor.state}</TranslatedText></span>
              <span>💼 {doctor.years_of_experience} <TranslatedText>years exp</TranslatedText></span>              <span className="text-xl font-bold text-primary-600">₹{doctor.consultation_fee}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl space-y-6">
        <h3 className="text-xl font-bold text-gray-900"><TranslatedText>Appointment Details</TranslatedText></h3>
        {/* Mode Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Consultation Mode</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setMode('online')}
              className={`p-4 border-2 rounded-xl flex items-center space-x-3 smooth-transition ${
                mode === 'online'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <Video className={`w-6 h-6 ${mode === 'online' ? 'text-primary-600' : 'text-gray-400'}`} />
              <div className="text-left">
                <div className="font-semibold text-gray-900">Online</div>
                <div className="text-xs text-gray-600">Video consultation</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMode('offline')}
              className={`p-4 border-2 rounded-xl flex items-center space-x-3 smooth-transition ${
                mode === 'offline'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <MapPin className={`w-6 h-6 ${mode === 'offline' ? 'text-primary-600' : 'text-gray-400'}`} />
              <div className="text-left">
                <div className="font-semibold text-gray-900">In-Clinic</div>
                <div className="text-xs text-gray-600">Visit doctor's clinic</div>
              </div>
            </button>
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            <TranslatedText>Appointment Date</TranslatedText>          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={minDate}
            max={maxDateStr}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
          />
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            <TranslatedText>Appointment Time</TranslatedText>          </label>
          
          {/* Custom Time Input for Testing */}
          <div className="mb-3">
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-3 border-2 border-primary-300 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">Or select from common times below:</p>
          </div>

          {/* Predefined Time Slots */}
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`px-4 py-2 border-2 rounded-lg text-sm font-medium smooth-transition ${
                  selectedTime === time
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-primary-300 text-gray-700'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Chief Complaint */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chief Complaint <span className="text-red-500">*</span>
          </label>
          <textarea
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            placeholder="Describe your main health concern..."
            required
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 resize-none"
          />
        </div>

        {/* Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Symptoms (Optional)
          </label>
          <input
            type="text"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Enter symptoms separated by commas (e.g., headache, fever, fatigue)"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
          />
        </div>

        {/* Payment Summary */}
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 rounded-xl border-2 border-primary-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">💰 Payment Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Consultation Fee</span>
              <span className="font-semibold">₹{doctor.consultation_fee}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Platform Fee</span>
              <span className="font-semibold">₹0</span>
            </div>
            <div className="border-t-2 border-primary-200 pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold text-primary-600">
                <span>Total Amount</span>
                <span>₹{doctor.consultation_fee}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            🔒 Secure payment powered by Razorpay
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] smooth-transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <TranslatedText as="span">Processing Payment...</TranslatedText>
            </>
          ) : (
            <>
              <TranslatedText as="span">Confirm Booking & Pay</TranslatedText>
              <CheckCircle2 className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
