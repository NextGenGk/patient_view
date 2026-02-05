'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Calendar, Clock, Video, MapPin, User, Award, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { TranslatedText } from '../../components/TranslatedText';      setSubmitting(false);
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
              {doctor.specialization?.slice(0, 3).map((spec, idx) => (
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
          )}
        </button>
      </form>
    </div>
  );
}
