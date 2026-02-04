'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2, User, Award, MapPin, Mic, Send, MicOff } from 'lucide-react';
import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useVoiceToText } from './hooks/useVoiceToText';
<<<<<<< HEAD
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { TranslatedText } from './components/TranslatedText';
=======
>>>>>>> 15f2075 (Patien_View final ver)

interface DoctorRecommendation {
  name: string;
  specialization: string;
  experience: number;
  fee: number;
  location: string;
  rating: number;
  matchScore: number;
  reason: string;
  did?: string;
  profile_image_url?: string;
}

export default function HomePage() {
  const [symptoms, setSymptoms] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [doctors, setDoctors] = useState<DoctorRecommendation[]>([]);
  const { isAuthenticated, isLoading, user } = useKindeBrowserClient();
  const router = useRouter();
  const { isRecording, transcript, isSupported, startRecording, stopRecording, resetTranscript } = useVoiceToText();
  const [profileImage, setProfileImage] = useState('');

  // Fetch profile image for authenticated users
  useEffect(() => {
    async function fetchProfile() {
      if (isAuthenticated && user) {
        try {
          const syncResponse = await fetch('/api/sync-user');
          const { user: dbUser } = await syncResponse.json();
          if (dbUser?.profile_image_url) {
            setProfileImage(dbUser.profile_image_url);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    }
    fetchProfile();
  }, [isAuthenticated, user]);

  // Update symptoms when voice transcript changes
  useEffect(() => {
    if (transcript) {
      setSymptoms(transcript);
    }
  }, [transcript]);

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      resetTranscript();
      setSymptoms('');
      startRecording();
    }
  };

  const handleAISearch = async () => {
    if (!symptoms.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch('/api/ai-doctor-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });

      const data = await response.json();
      if (data.success && data.doctors && data.doctors.length > 0) {
        setDoctors(data.doctors);
      } else if (data.success && data.doctors && data.doctors.length === 0) {
        alert('No doctors found matching your symptoms. Please try describing your symptoms in more detail.');
      } else if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      console.error('AI search failed:', error);
      alert('Failed to search for doctors. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSearching && symptoms.trim()) {
      handleAISearch();
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
        <div className="container mx-auto px-6 py-4">
=======
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-4">
>>>>>>> 15f2075 (Patien_View final ver)
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <img src="/Logos/logo_transparent.png" alt="AuraSutra" className="h-10" />
              <span className="text-2xl font-semibold" style={{ fontFamily: 'Alatsi, sans-serif' }}>AuraSutra</span>
            </div>
<<<<<<< HEAD
            
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {isAuthenticated ? (
                <Link 
                  href="/dashboard"
                  className="flex items-center space-x-3 px-4 py-2 rounded-full hover:bg-gray-100 smooth-transition"
                >
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover border-2 border-primary-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                  )}
                  <TranslatedText as="span" className="font-semibold text-gray-900">
                    Dashboard
                  </TranslatedText>
                </Link>
              ) : (
                <LoginLink className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full font-semibold hover:shadow-lg smooth-transition">
                  <TranslatedText as="span">Sign In</TranslatedText>
                </LoginLink>
              )}
            </div>
=======

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="px-6 py-2.5 bg-white/50 border border-gray-200 text-gray-900 rounded-full font-semibold hover:bg-white/80 smooth-transition shadow-sm backdrop-blur-md"
                >
                  Dashboard
                </Link>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-gray-600" />
                  )}
                </div>
              </div>
            ) : (
              <LoginLink className="px-6 py-2.5 bg-white/50 border border-gray-200 text-gray-900 rounded-full font-semibold hover:bg-white/80 smooth-transition shadow-sm backdrop-blur-md">
                Sign In
              </LoginLink>
            )}
>>>>>>> 15f2075 (Patien_View final ver)
          </div>
        </div>
      </nav>

      {/* Hero Section with AI Search */}
<<<<<<< HEAD
      <section className="pt-24 pb-12 px-6">
=======
      <section className="pt-24 pb-12 px-4 md:px-6">
>>>>>>> 15f2075 (Patien_View final ver)
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-50 to-purple-50 text-primary-700 px-4 py-2 rounded-full mb-6 animate-fade-in border border-primary-100">
              <Sparkles className="w-4 h-4" />
<<<<<<< HEAD
              <TranslatedText as="span" className="text-sm font-semibold">
                AI-Powered Doctor Discovery
              </TranslatedText>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black mb-4 animate-fade-in">
              <TranslatedText as="span">Find Your Suitable</TranslatedText>{' '}
              <span className="gradient-text">
                <TranslatedText as="span">Expert Doctor</TranslatedText>
              </span>
            </h1>
            
            <TranslatedText 
              as="p" 
              className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in"
            >
              Describe your symptoms and let AI recommend the best verified practitioners
            </TranslatedText>
          </div>

          {/* Compact AI Search Box */}
          <div className="backdrop-blur-xl bg-white/80 p-6 rounded-3xl shadow-2xl border border-gray-200/50 mb-8 animate-fade-in">
=======
              <span className="text-sm font-semibold">AI-Powered Doctor Discovery</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 animate-fade-in">
              Find Your Suitable{' '}
              <span className="gradient-text">Expert Doctor</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
              Describe your symptoms and let AI recommend the best verified practitioners
            </p>
          </div>

          {/* Compact AI Search Box */}
          <div className="backdrop-blur-xl bg-white/80 p-4 md:p-6 rounded-3xl shadow-2xl border border-gray-200/50 mb-8 animate-fade-in">
>>>>>>> 15f2075 (Patien_View final ver)
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms... ↵"
<<<<<<< HEAD
                className="flex-1 px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:bg-white smooth-transition font-medium text-gray-900 placeholder-gray-400"
                disabled={isSearching || isRecording}
              />
              
=======
                className="flex-1 px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:bg-white smooth-transition font-medium text-gray-900 placeholder-gray-400 text-sm md:text-base"
                disabled={isSearching || isRecording}
              />

>>>>>>> 15f2075 (Patien_View final ver)
              {/* Voice Button */}
              {isSupported && (
                <button
                  onClick={handleVoiceToggle}
<<<<<<< HEAD
                  className={`p-4 rounded-full font-semibold hover:shadow-lg smooth-transition ${
                    isRecording
                      ? 'bg-green-500 text-white animate-pulse'
                      : 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                  }`}
=======
                  className={`p-4 rounded-full font-semibold hover:shadow-lg smooth-transition ${isRecording
                    ? 'bg-green-500 text-white animate-pulse'
                    : 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                    }`}
>>>>>>> 15f2075 (Patien_View final ver)
                  title={isRecording ? 'Stop recording' : 'Start voice input'}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
<<<<<<< HEAD
              
=======

>>>>>>> 15f2075 (Patien_View final ver)
              {/* Send Button */}
              <button
                onClick={handleAISearch}
                disabled={isSearching || !symptoms.trim()}
                className="p-4 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-full font-semibold hover:shadow-lg smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Search for doctors"
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>

            {isRecording && (
              <div className="mt-3 flex items-center space-x-2 text-red-600 text-sm font-medium">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span>Listening... Speak clearly</span>
              </div>
            )}
          </div>

          {/* AI Doctor Recommendations */}
          {doctors.length > 0 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">
                  🎯 Recommended Doctors for You
                </h2>
                <span className="text-sm text-gray-600 font-medium">
                  {doctors.length} matches found
                </span>
              </div>

              {doctors.map((doctor, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-3xl shadow-lg border-2 border-gray-100 hover:shadow-2xl hover:border-primary-200 smooth-transition"
                >
<<<<<<< HEAD
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-start space-x-4 flex-1">
=======
                  <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-start gap-4 flex-1 w-full">
>>>>>>> 15f2075 (Patien_View final ver)
                      {doctor.profile_image_url ? (
                        <img
                          src={doctor.profile_image_url}
                          alt={doctor.name}
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-primary-100 shadow-md"
                        />
                      ) : (
<<<<<<< HEAD
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-emerald-50 rounded-2xl flex items-center justify-center border-2 border-primary-100 shadow-md">
                          <User className="w-10 h-10 text-primary-600" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-black text-gray-900">{doctor.name}</h3>
                          <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-primary-100 text-emerald-700 rounded-full text-xs font-black border border-emerald-200">
=======
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-emerald-50 rounded-2xl flex items-center justify-center border-2 border-primary-100 shadow-md shrink-0">
                          <User className="w-10 h-10 text-primary-600" />
                        </div>
                      )}

                      <div className="flex-1 w-full">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-black text-gray-900">{doctor.name}</h3>
                          <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-primary-100 text-emerald-700 rounded-full text-xs font-black border border-emerald-200 shrink-0">
>>>>>>> 15f2075 (Patien_View final ver)
                            {doctor.matchScore}% Match
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4 flex-wrap gap-2">
                          <span className="flex items-center space-x-1 bg-primary-50 px-3 py-1.5 rounded-full">
                            <Award className="w-4 h-4 text-primary-600" />
                            <span className="font-semibold text-primary-700">{doctor.specialization}</span>
                          </span>
                          <span className="font-semibold text-gray-700">{doctor.experience} years exp</span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{doctor.location}</span>
                          </span>
                          <span className="text-amber-600 font-bold">★ {doctor.rating}</span>
                        </div>

<<<<<<< HEAD
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-4 border border-blue-100">
=======
                        <div className="p-3 md:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-4 border border-blue-100">
>>>>>>> 15f2075 (Patien_View final ver)
                          <p className="text-sm text-gray-700 leading-relaxed">
                            <span className="font-black text-primary-600">💡 Why recommended:</span> {doctor.reason}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-black text-primary-600">
                            ₹{doctor.fee}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">per consultation</span>
                        </div>
                      </div>
                    </div>

<<<<<<< HEAD
                    {isAuthenticated ? (
                      <Link
                        href={`/dashboard/book-appointment?did=${doctor.did}`}
                        className="px-8 py-4 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-2xl font-black hover:shadow-2xl hover:scale-105 smooth-transition flex items-center justify-center"
                      >
                        Book Now
                      </Link>
                    ) : (
                      <LoginLink
                        postLoginRedirectURL={doctor.did ? `/dashboard/book-appointment?did=${doctor.did}` : '/dashboard'}
                        className="px-8 py-4 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-2xl font-black hover:shadow-2xl hover:scale-105 smooth-transition flex items-center justify-center"
                      >
                        Book Now
                      </LoginLink>
                    )}
=======
                    <div className="w-full md:w-auto mt-4 md:mt-0">
                      {isAuthenticated ? (
                        <Link
                          href={`/dashboard/book-appointment?did=${doctor.did}`}
                          className="px-8 py-4 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-2xl font-black hover:shadow-2xl hover:scale-105 smooth-transition flex items-center justify-center w-full md:w-auto"
                        >
                          Book Now
                        </Link>
                      ) : (
                        <LoginLink
                          postLoginRedirectURL={doctor.did ? `/dashboard/book-appointment?did=${doctor.did}` : '/dashboard'}
                          className="px-8 py-4 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-2xl font-black hover:shadow-2xl hover:scale-105 smooth-transition flex items-center justify-center w-full md:w-auto"
                        >
                          Book Now
                        </LoginLink>
                      )}
                    </div>
>>>>>>> 15f2075 (Patien_View final ver)
                  </div>
                </div>
              ))}

              <div className="text-center pt-6">
                <button
                  onClick={() => {
                    setDoctors([]);
                    setSymptoms('');
                    resetTranscript();
                  }}
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  ← Search again
                </button>
              </div>
            </div>
          )}

          {/* Info Section */}
          {doctors.length === 0 && !isSearching && (
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {[
                {
                  icon: <Sparkles className="w-8 h-8 text-primary-600" />,
                  title: 'AI-Powered Matching',
                  description: 'Our AI analyzes your symptoms to find the perfect specialist',
                },
                {
                  icon: <img src="/Logos/logo_emblem_total black+transparent.png" alt="AuraSutra" className="h-8" />,
                  title: 'Verified Practitioners',
                  description: 'All doctors are certified Ayurvedic professionals',
                },
                {
                  icon: <User className="w-8 h-8 text-accent-600" />,
                  title: 'Personalized Care',
                  description: 'Get tailored treatment plans based on your unique needs',
                },
              ].map((feature, index) => (
                <div key={index} className="backdrop-blur-xl bg-white/80 p-6 rounded-2xl text-center border border-gray-200/50">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 mb-4">
                    {feature.icon}
                  </div>
<<<<<<< HEAD
                  <TranslatedText as="h3" className="font-black text-gray-900 mb-2">
                    {feature.title}
                  </TranslatedText>
                  <TranslatedText as="p" className="text-sm text-gray-600">
                    {feature.description}
                  </TranslatedText>
=======
                  <h3 className="font-black text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
>>>>>>> 15f2075 (Patien_View final ver)
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
<<<<<<< HEAD
      <footer className="py-12 px-6 border-t border-gray-200/50 backdrop-blur-xl bg-white/50">
=======
      <footer className="py-12 px-6">
>>>>>>> 15f2075 (Patien_View final ver)
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-1 mb-4">
            <img src="/Logos/logo_transparent.png" alt="AuraSutra" className="h-8" />
            <span className="text-xl font-semibold" style={{ fontFamily: 'Alatsi, sans-serif' }}>AuraSutra</span>
          </div>
          <p className="text-gray-600 mb-4 font-medium">
            AI-powered Ayurvedic healthcare for modern wellness
          </p>
          <p className="text-sm text-gray-500">
            © 2026 AuraSutra. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
