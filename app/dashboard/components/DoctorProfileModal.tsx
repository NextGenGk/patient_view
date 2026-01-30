'use client';

import { X, Award, MapPin, DollarSign, Briefcase, Languages, Calendar } from 'lucide-react';
import { useEffect } from 'react';
import Link from 'next/link';

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

import { TranslatedText } from '../../components/TranslatedText';

export default function DoctorProfileModal({ doctor, isOpen, onClose }: DoctorProfileModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-primary-50 to-emerald-50 p-8 rounded-t-3xl">
          <div className="flex items-start space-x-6">
            {doctor.user.profile_image_url ? (
              <img
                src={doctor.user.profile_image_url}
                alt={doctor.user.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-emerald-100 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                <Award className="w-12 h-12 text-primary-600" />
              </div>
            )}
            
            <div className="flex-1">
              <h2 className="text-3xl font-black text-gray-900 mb-1">
                <TranslatedText>Dr.</TranslatedText> <TranslatedText>{doctor.user.name}</TranslatedText>
              </h2>
              <p className="text-primary-600 font-semibold mb-3"><TranslatedText>{doctor.qualification}</TranslatedText></p>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm"><TranslatedText>{doctor.city}</TranslatedText>, <TranslatedText>{doctor.state}</TranslatedText></span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
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
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <Briefcase className="w-4 h-4" />
                <TranslatedText as="span" className="text-xs font-semibold">Experience</TranslatedText>
              </div>
              <p className="text-xl font-black text-gray-900">
                {doctor.years_of_experience} <TranslatedText>years</TranslatedText>
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <TranslatedText as="span" className="text-xs font-semibold">Consultation Fee</TranslatedText>
              </div>
              <p className="text-xl font-black text-primary-600">
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
              <p className="text-gray-700 leading-relaxed"><TranslatedText>{doctor.bio}</TranslatedText></p>
            </div>
          )}

          {/* Book Appointment Button */}
          <Link
            href={`/dashboard/book-appointment?did=${doctor.did}`}
            className="block w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-2xl font-black text-center hover:shadow-2xl hover:scale-105 smooth-transition"
          >
            <Calendar className="w-5 h-5 inline-block mr-2" />
            <TranslatedText>Book Appointment</TranslatedText>
          </Link>
        </div>
      </div>
    </div>
  );
}
