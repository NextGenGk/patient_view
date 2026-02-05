'use client';

import { X, Award, MapPin, DollarSign, Briefcase, Languages, Calendar } from 'lucide-react';
import { useEffect } from 'react';
import Link from 'next/link';
import { TranslatedText } from '../../components/TranslatedText';

interface Doctor {
  did: string;
  specialization: string[];
  custom_specializations?: string;
  qualification: string;
  years_of_experience: number;
  consultation_fee: number;
  city: string;
  state: string;
  bio: string;
  languages: string[];
  user: {
    name: string;
    email: string;
    profile_image_url?: string;
  };
}

interface DoctorProfileModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DoctorProfileModal({ doctor, isOpen, onClose }: DoctorProfileModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-enter overflow-hidden">
        {/* Header with Image Background or Gradient */}
        <div className="relative bg-gradient-to-br from-primary-50 to-emerald-50 p-8 pt-12">
           <button 
             onClick={onClose}
             className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
           >
             <X className="w-6 h-6 text-gray-600" />
           </button>

           <div className="flex flex-col sm:flex-row items-center sm:items-end -mb-16 sm:space-x-6 space-y-4 sm:space-y-0 relative z-10">
              <div className="w-32 h-32 rounded-[1.5rem] border-4 border-white shadow-xl overflow-hidden bg-white">
                {doctor.user.profile_image_url ? (
                  <img src={doctor.user.profile_image_url} alt={doctor.user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary-100 flex items-center justify-center text-4xl text-primary-600 font-bold">
                    {doctor.user.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="text-center sm:text-left pb-4">
                <h2 className="text-3xl font-black text-gray-900 leading-tight">
                  <TranslatedText>{doctor.user.name}</TranslatedText>
                </h2>
                <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-600 font-medium mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    <TranslatedText>{doctor.city}</TranslatedText>, <TranslatedText>{doctor.state}</TranslatedText>
                  </span>
                </div>
              </div>
           </div>
        </div>

        {/* Spacer for overlapping avatar */}
        <div className="h-12 bg-white"></div>

        {/* Content */}
        <div className="p-8 space-y-8 bg-white">
          {/* Specializations */}
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center space-x-2">
              <Award className="w-5 h-5 text-primary-600" />
              <TranslatedText as="span">Specializations</TranslatedText>
            </h3>
            <div className="flex flex-wrap gap-2">
              {doctor.specialization.map((spec, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold border border-primary-100"
                >
                  <TranslatedText>{spec}</TranslatedText>
                </span>
              ))}
              {doctor.custom_specializations && (
                 <span className="px-4 py-2 bg-secondary-50 text-secondary-700 rounded-full text-sm font-semibold border border-secondary-100">
                    <TranslatedText>{doctor.custom_specializations}</TranslatedText>
                 </span>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                <Briefcase className="w-4 h-4" />
                <TranslatedText as="span" className="text-xs font-bold uppercase tracking-wider">Experience</TranslatedText>
              </div>
              <p className="text-2xl font-black text-gray-900">
                {doctor.years_of_experience} <TranslatedText as="span" className="text-lg font-medium text-gray-500">years</TranslatedText>
              </p>
            </div>

            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
              <div className="flex items-center space-x-2 text-emerald-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <TranslatedText as="span" className="text-xs font-bold uppercase tracking-wider">Consultation Fee</TranslatedText>
              </div>
              <p className="text-2xl font-black text-emerald-700">
                ₹{doctor.consultation_fee}
              </p>
            </div>
          </div>

          {/* Languages */}
          {doctor.languages && doctor.languages.length > 0 && (
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center space-x-2">
                <Languages className="w-5 h-5 text-primary-600" />
                <TranslatedText as="span">Languages</TranslatedText>
              </h3>
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                  >
                    <TranslatedText>{lang}</TranslatedText>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {doctor.bio && (
            <div>
              <TranslatedText as="h3" className="text-lg font-black text-gray-900 mb-3">About Doctor</TranslatedText>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100"><TranslatedText>{doctor.bio}</TranslatedText></p>
            </div>
          )}

          {/* Book Appointment Button */}
          <Link
            href={`/dashboard/book-appointment?did=${doctor.did}`}
            className="block w-full px-8 py-5 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-2xl font-bold text-lg text-center shadow-lg hover:shadow-xl hover:scale-[1.02] smooth-transition"
          >
            <Calendar className="w-5 h-5 inline-block mr-2 mb-1" />
            <TranslatedText>Book Appointment</TranslatedText>
          </Link>
        </div>
      </div>
    </div>
  );
}
