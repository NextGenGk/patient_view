'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2, User, Award, MapPin, Mic, Send, MicOff, Menu, X } from 'lucide-react';
import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useVoiceToText } from './hooks/useVoiceToText';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { TranslatedText } from './components/TranslatedText';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/landing-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Light overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-emerald-50/30 to-green-50/35"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg relative z-50">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/Logos/logo_transparent.png" alt="AuraSutra" className="h-10" />
              <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Alatsi, sans-serif' }}>AuraSutra</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <LanguageSwitcher />
              
              {isAuthenticated ? (
                <Link 
                  href="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium smooth-transition"
                >
                  {user?.picture ? (
                    <img 
                      src={user.picture} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <TranslatedText as="span">Dashboard</TranslatedText>
                </Link>
              ) : (
                <>
                  <LoginLink className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium smooth-transition">
                    <TranslatedText as="span">Sign In</TranslatedText>
                  </LoginLink>
                  <LoginLink className="px-6 py-2.5 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 smooth-transition flex items-center space-x-2">
                    <TranslatedText as="span">Sign Up</TranslatedText>
                    <span>→</span>
                  </LoginLink>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-4 border-t border-gray-100 mt-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
              <div className="flex justify-center">
                <LanguageSwitcher />
              </div>
              
              {isAuthenticated ? (
                <Link 
                  href="/dashboard"
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {user?.picture ? (
                    <img 
                      src={user.picture} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <TranslatedText as="span">Go to Dashboard</TranslatedText>
                </Link>
              ) : (
                <div className="flex flex-col gap-3">
                  <LoginLink className="w-full text-center px-4 py-3 bg-gray-50 rounded-xl text-gray-700 font-medium">
                    <TranslatedText as="span">Sign In</TranslatedText>
                  </LoginLink>
                  <LoginLink className="w-full text-center px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                    <TranslatedText as="span">Sign Up Free</TranslatedText>
                    <span>→</span>
                  </LoginLink>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with AI Search - Overflow Protection */}
      <section className="pt-12 pb-10 md:pt-20 md:pb-16 px-4 md:px-6 w-full overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          {/* Badge */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-50/80 backdrop-blur-sm border border-emerald-100 text-emerald-800 px-3 py-1 md:px-4 md:py-1.5 rounded-full mb-6 md:mb-8 shadow-sm hover:bg-emerald-100/80 smooth-transition cursor-default select-none">
              <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-600 animate-pulse" />
              <TranslatedText as="span" className="text-[10px] md:text-xs font-bold tracking-widest uppercase">
                AI-Powered Health Match
              </TranslatedText>
            </div>
            
            {/* Main Heading - Responsive Text Sizes */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 leading-tight break-words">
              <span className="block text-gray-900">
                <TranslatedText as="span">Describe your symptoms,</TranslatedText>
              </span>
              <span className="block">
                <TranslatedText as="span" className="text-gray-900">Find the </TranslatedText>
                <span className="relative inline-block">
                  <span className="font-black text-emerald-600"><TranslatedText as="span">perfect doctor.</TranslatedText></span>
                </span>
              </span>
            </h1>
            
            {/* Subtitle */}
            <TranslatedText 
              as="p" 
              className="text-sm sm:text-base md:text-xl text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
            >
              Experience the future of healthcare with our intelligent platform designed for your wellness
            </TranslatedText>
          </div>

          {/* Search Box - Responsive Card - Texture Removed */}
          <div className="max-w-3xl mx-auto px-2 md:px-0">
            <div className="bg-white/70 backdrop-blur-xl rounded-[1.5rem] shadow-xl p-4 md:p-6 min-h-[120px] flex flex-col justify-between border border-white/50 relative">
               
               <div className="relative z-10 flex flex-col h-full justify-between">
              {/* Input Area - Top */}
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!isSearching && symptoms.trim()) handleAISearch();
                  }
                }}
                placeholder="Describe your symptoms... (e.g., 'Severe migraine and nausea')"
                className="w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none font-normal text-sm md:text-base resize-none h-16 md:h-12"
                disabled={isSearching || isRecording}
              />
              
              {/* Bottom Actions Row - Flex Wrap for Mobile Safety */}
              <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3 mt-4">
                
                {isRecording && (
                    <div className="mr-auto flex items-center space-x-2 text-emerald-600 text-sm font-medium animate-pulse">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                      <span>Listening...</span>
                    </div>
                )}
                
                {/* Voice Button */}
                {isSupported && (
                  <button
                    onClick={handleVoiceToggle}
                    className={`p-2 rounded-lg smooth-transition ${
                      isRecording
                        ? 'bg-emerald-100 text-emerald-600 animate-pulse'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                    title={isRecording ? 'Stop recording' : 'Start voice input'}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
                
                {/* Find Matches Button */}
                <button
                  onClick={handleAISearch}
                  disabled={isSearching || !symptoms.trim()}
                  className="px-4 py-2 md:px-6 md:py-2 bg-emerald-400 text-white rounded-lg font-bold hover:bg-emerald-500 smooth-transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm whitespace-nowrap text-xs md:text-sm"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <TranslatedText as="span">Find Matches</TranslatedText>
                  )}
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Doctor Recommendations */}
      {doctors.length > 0 && (
        <section className="pb-16 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-gray-900">
                🎯 <TranslatedText>Recommended Doctors for You</TranslatedText>
              </h2>
              <span className="text-sm text-gray-700 font-medium bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-lg">
                {doctors.length} matches found
              </span>
            </div>

            <div className="grid gap-6">
              {doctors.map((doctor, index) => (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:border-emerald-300/50 smooth-transition"
                >
                  <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                    <div className="flex items-start space-x-6 flex-1">
                      {doctor.profile_image_url ? (
                        <img
                          src={doctor.profile_image_url}
                          alt={doctor.name}
                          className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-100 shadow-md"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl flex items-center justify-center border-2 border-emerald-100 shadow-md">
                          <User className="w-12 h-12 text-emerald-600" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-2xl font-black text-gray-900">{doctor.name}</h3>
                          <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 rounded-full text-sm font-black border border-emerald-200">
                            {doctor.matchScore}% Match
                          </span>
                        </div>

                        <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          <span className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full">
                            <Award className="w-4 h-4 text-emerald-600" />
                            <span className="font-semibold text-emerald-700">{doctor.specialization}</span>
                          </span>
                          <span className="font-semibold text-gray-700">{doctor.experience} years exp</span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{doctor.location}</span>
                          </span>
                          <span className="text-amber-600 font-bold">★ {doctor.rating}</span>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-4 border border-blue-100">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            <span className="font-black text-emerald-600">💡 Why recommended:</span> {doctor.reason}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-3xl font-black text-emerald-600">
                            ₹{doctor.fee}
                          </span>
                          <span className="text-sm text-gray-500 font-medium">per consultation</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-auto">
                      {isAuthenticated ? (
                        <Link
                          href={`/dashboard/book-appointment?did=${doctor.did}`}
                          className="block w-full md:w-auto px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 smooth-transition text-center"
                        >
                          <TranslatedText>Book Now</TranslatedText>
                        </Link>
                      ) : (
                        <LoginLink
                          postLoginRedirectURL={doctor.did ? `/dashboard/book-appointment?did=${doctor.did}` : '/dashboard'}
                          className="block w-full md:w-auto px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 smooth-transition text-center"
                        >
                          <TranslatedText>Book Now</TranslatedText>
                        </LoginLink>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-8">
              <button
                onClick={() => {
                  setDoctors([]);
                  setSymptoms('');
                  resetTranscript();
                }}
                className="text-emerald-600 hover:text-emerald-700 font-semibold text-lg"
              >
                ← <TranslatedText>Search again</TranslatedText>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Features Section - Responsive Spacing & Overflow Fix */}
      {doctors.length === 0 && !isSearching && (
        <section className="pt-12 pb-16 md:pt-24 md:pb-20 px-4 md:px-6 w-full overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            {/* Centered Heading */}
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 md:mb-4">
                <TranslatedText as="span">Why Choose AuraSutra?</TranslatedText>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg px-2">
                <TranslatedText as="span">
                  Experience the future of healthcare with our intelligent platform designed for your wellness
                </TranslatedText>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: <Sparkles className="w-6 h-6 text-emerald-500" />,
                  title: 'Smart Matching',
                  description: 'Our AI understands nuanced symptoms to find the exact specialist you need.',
                },
                {
                  icon: <Award className="w-6 h-6 text-emerald-500" />,
                  title: 'Verified Experts',
                  description: 'Every doctor is vetted for credentials, experience, and patient satisfaction.',
                },
                {
                  icon: <div className="w-6 h-6 border-2 border-emerald-500 rounded-md flex items-center justify-center"><div className="w-3 h-3 bg-emerald-500 rounded-sm" /></div>, 
                  title: 'Seamless Booking',
                  description: 'Book appointments, join video calls, and get prescriptions all in one place.',
                },
              ].map((feature, index) => (
                <div key={index} className="relative bg-white/60 backdrop-blur-lg p-6 md:p-8 lg:p-10 rounded-[2rem] shadow-sm hover:shadow-md smooth-transition border border-white/40 flex flex-col items-start text-left h-full hover:bg-white/70 overflow-hidden group">
                  {/* Texture Overlay - Full Opacity (100%) */}
                  <div className="absolute inset-0 bg-[url('/landing-bg.jpg')] bg-cover opacity-100 pointer-events-none z-0 group-hover:opacity-100 smooth-transition mix-blend-overlay"></div>
                  
                  <div className="relative z-10 p-3 rounded-2xl bg-emerald-50/90 mb-4 md:mb-6 inline-flex items-center justify-center backdrop-blur-sm shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="relative z-10 text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                    <TranslatedText as="span">{feature.title}</TranslatedText>
                  </h3>
                  <p className="relative z-10 text-gray-600 leading-relaxed text-sm font-medium">
                    <TranslatedText as="span">{feature.description}</TranslatedText>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Footer - Single Line Style */}
      <footer className="py-6 px-6 bg-[#047857] text-white">
        <div className="container mx-auto text-center">
          <p className="text-sm font-normal">
            © 2026 AuraSutra. Holistic Healthcare Simplified.
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
}
