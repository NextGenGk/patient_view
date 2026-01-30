'use client';

import { useEffect, useState } from 'react';
import { Search, User, Award, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import DoctorProfileModal from '../components/DoctorProfileModal';
import { TranslatedText } from '../../components/TranslatedText';
import { useTranslation } from '../../hooks/useTranslation';

interface Doctor {
  did: string;
  specialization: string[];
  custom_specializations: string;
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

export default function FindDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const { text: searchPlaceholder } = useTranslation('Search by doctor name, specialization, or location...');
  const { text: allSpecsText } = useTranslation('All Specializations');
  const { text: allCitiesText } = useTranslation('All Cities');

  useEffect(() => {
    fetchDoctors();
    const interval = setInterval(fetchDoctors, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, selectedSpecialization, selectedCity, doctors]);

  async function fetchDoctors() {
    try {
      const response = await fetch('/api/doctors/find-all');
      const data = await response.json();

      if (data.success) {
        setDoctors(data.doctors || []);
        setFilteredDoctors(data.doctors || []);
      } else {
        toast.error('Failed to load doctors');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }

  function filterDoctors() {
    let filtered = [...doctors];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((doctor) => {
        const name = doctor.user?.name?.toLowerCase() || '';
        const city = doctor.city?.toLowerCase() || '';
        const state = doctor.state?.toLowerCase() || '';
        const specializations = (doctor.specialization || []).join(' ').toLowerCase();
        const customSpecs = doctor.custom_specializations?.toLowerCase() || '';
        
        return (
          name.includes(search) ||
          city.includes(search) ||
          state.includes(search) ||
          specializations.includes(search) ||
          customSpecs.includes(search)
        );
      });
    }

    if (selectedSpecialization !== 'all') {
      filtered = filtered.filter((doctor) =>
        doctor.specialization?.includes(selectedSpecialization)
      );
    }

    if (selectedCity !== 'all') {
      filtered = filtered.filter((doctor) => doctor.city === selectedCity);
    }

    setFilteredDoctors(filtered);
  }

  const allSpecializations = Array.from(
    new Set(doctors.flatMap((d) => d.specialization || []))
  ).sort();
  const allCities = Array.from(new Set(doctors.map((d) => d.city).filter(Boolean))).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DoctorProfileModal 
        doctor={selectedDoctor}
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
      />

      {/* Compact Header */}
      <div className="mb-4">
        <TranslatedText as="h1" className="text-3xl font-black text-gray-900 mb-1">Find Ayurvedic Doctors</TranslatedText>
        <TranslatedText as="p" className="text-gray-600 text-sm">Connect with verified Ayurvedic practitioners</TranslatedText>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <TranslatedText>Specialization</TranslatedText>
            </label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all font-medium"
            >
              <option value="all">{allSpecsText}</option>
              {allSpecializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <TranslatedText>City</TranslatedText>
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all font-medium"
            >
              <option value="all">{allCitiesText}</option>
              {allCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Cards */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-16">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            <TranslatedText>
              {searchTerm || selectedSpecialization !== 'all' || selectedCity !== 'all'
                ? 'No doctors found matching your criteria'
                : 'No doctors are currently available'}
            </TranslatedText>
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => {
            const remainingSpecs = doctor.specialization?.length > 3 ? doctor.specialization.length - 3 : 0;
            
            return (
              <div 
                key={doctor.did} 
                onClick={() => setSelectedDoctor(doctor)}
                className="group relative h-[400px] bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  {doctor.user?.profile_image_url ? (
                    <img
                      src={doctor.user.profile_image_url}
                      alt={doctor.user?.name || 'Doctor'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-emerald-200 flex items-center justify-center">
                      <User className="w-32 h-32 text-white opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>

                {/* Bottom Info (Always Visible) */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10 translate-y-2 group-hover:translate-y-full transition-transform duration-300">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-primary-300" />
                    <span className="text-xs font-bold tracking-wide bg-white/20 px-2 py-1 rounded-md backdrop-blur-md">
                      {doctor.years_of_experience}y <TranslatedText>Experience</TranslatedText>
                    </span>
                  </div>
                  <h3 className="text-3xl font-black mb-1 drop-shadow-md truncate">
                    <TranslatedText>Dr.</TranslatedText> <TranslatedText>{doctor.user?.name || 'Doctor'}</TranslatedText>
                  </h3>
                  <p className="text-xs font-bold text-primary-100 tracking-wide mb-2">
                    <TranslatedText>{doctor.qualification}</TranslatedText>
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {doctor.specialization?.slice(0, 2).map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold"
                      >
                        <TranslatedText>{spec}</TranslatedText>
                      </span>
                    ))}
                  </div>
                  {doctor.bio && (
                    <p className="text-gray-100 text-xs line-clamp-2 opacity-90">
                      <TranslatedText>{doctor.bio}</TranslatedText>
                    </p>
                  )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center z-20 transform scale-95 group-hover:scale-100">
                  <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-white mb-4 shadow-xl">
                    {doctor.user?.profile_image_url ? (
                      <img src={doctor.user.profile_image_url} className="w-full h-full object-cover" alt={doctor.user.name} />
                    ) : (
                      <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                        <User className="w-10 h-10 text-primary-600" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-white font-black text-2xl mb-1"><TranslatedText>Dr.</TranslatedText> <TranslatedText>{doctor.user?.name}</TranslatedText></h3>
                  <p className="text-primary-100 text-xs font-bold tracking-wide mb-2">
                    <TranslatedText>{doctor.qualification}</TranslatedText>
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {doctor.specialization?.slice(0, 3).map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded-full text-xs font-bold"
                      >
                        <TranslatedText>{spec}</TranslatedText>
                      </span>
                    ))}
                    {remainingSpecs > 0 && (
                      <span className="px-3 py-1 bg-primary-500/30 border border-primary-300/50 text-primary-100 rounded-full text-xs font-bold">
                        +{remainingSpecs} <TranslatedText>more</TranslatedText>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10 w-full mb-6">
                    <div className="text-center">
                      <MapPin className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <p className="text-xs font-bold text-gray-400 mb-1"><TranslatedText>Location</TranslatedText></p>
                      <p className="text-xs font-bold text-white truncate"><TranslatedText>{doctor.city}</TranslatedText>, <TranslatedText>{doctor.state}</TranslatedText></p>
                    </div>
                    <div className="text-center">
                      <div className="w-4 h-4 mx-auto mb-1 text-primary-400">🗣️</div>
                      <p className="text-xs font-bold text-gray-400 mb-1"><TranslatedText>Languages</TranslatedText></p>
                      <p className="text-xs font-bold text-white truncate"><TranslatedText>{(doctor.languages || []).slice(0, 2).join(', ')}</TranslatedText></p>
                    </div>
                  </div>

                  <div className="w-full space-y-3">
                    <div className="flex items-baseline justify-center space-x-2 mb-3">
                      <span className="text-3xl font-black text-white">₹{doctor.consultation_fee}</span>
                      <span className="text-xs text-gray-400"><TranslatedText>Consultation</TranslatedText></span>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      <TranslatedText>Click to view full profile</TranslatedText>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
