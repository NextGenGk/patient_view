'use client';

import { useEffect, useState } from 'react';
import DailyMedicinePopup from '../components/DailyMedicinePopup';
import DashboardAdherenceWidget from '../components/DashboardAdherenceWidget';
import { Calendar, Pill, FileText, TrendingUp, Activity, User, Video, Heart, ArrowRight, ArrowUpRight, MoreHorizontal, Search, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import {
  AlertCircle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TranslatedText } from '../components/TranslatedText';

interface Appointment {
  aid: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  doctor?: {
    users?: {
    };
  };
}
import {
  LineChart,
  Line,  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,} from 'recharts';

export default function PatientDashboardPage() {
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    activePrescriptions: 0,
    totalAppointments: 0,
    adherenceRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [greeting, setGreeting] = useState('Welcome');
  const [adherenceData, setAdherenceData] = useState<any[]>([]); 
  const [medicineData, setMedicineData] = useState<any[]>([]);


  useEffect(() => {
    // Generate dynamic greeting
    const greetings = [
      "Welcome back",
      "Great to see you",
      "Hello",
      "Good to have you here",
      "Welcome",
      "Hey there",
      "Greetings",
      "Nice to see you",
    ];
    
    const hour = new Date().getHours();
    let timeGreeting = "";
    if (hour < 12) timeGreeting = "Good morning";
    else if (hour < 17) timeGreeting = "Good afternoon";
    else if (hour < 21) timeGreeting = "Good evening";
    else timeGreeting = "Good night";
    
    const selectedGreeting = Math.random() > 0.5 
      ? timeGreeting 
      : greetings[Math.floor(Math.random() * greetings.length)];
    
    setGreeting(selectedGreeting);
    
    fetchDashboardData();

    // Poll for real-time updates
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);  }, []);

  async function fetchDashboardData() {
    try {
      const syncResponse = await fetch('/api/sync-user');
      const { user } = await syncResponse.json();
      
      if (user) {
        setUserName(user.name || '');
        if (user.profile_image_url) {
          setProfileImage(user.profile_image_url);
        }
                const response = await fetch(`/api/patient/dashboard?uid=${user.uid}`);
        const data = await response.json();

        if (data.success) {
          setStats({
            upcomingAppointments: data.upcomingAppointments || 0,
            activePrescriptions: data.activePrescriptions || 0,
            totalAppointments: data.totalAppointments || 0,
            adherenceRate: data.adherenceRate || 0,
          });
          
          // Set adherence trend data if available
          if (data.adherenceTrend && data.adherenceTrend.length > 0) {
            setAdherenceData(data.adherenceTrend);
          }
          
          // Set medicine-wise data if available
          if (data.medicineAdherence && data.medicineAdherence.length > 0) {
            setMedicineData(data.medicineAdherence);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>      </div>
    );
  }

  // Textured Stats Card Style (Small text, Green Texture)
  const statsCardClass = "relative rounded-[2rem] p-6 overflow-hidden flex flex-col justify-between min-h-[160px] shadow-sm hover:shadow-md smooth-transition group border border-gray-100 bg-[url('/landing-bg.jpg')] bg-cover bg-center";

  // Date formatting for header
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  return (
    <div className="space-y-8 font-poppins text-gray-800">
      {/* Daily Medicine Reminder Popup */}
      <DailyMedicinePopup />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
             <TranslatedText>{userName || 'User'}</TranslatedText>
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1 ml-1">
             <TranslatedText>{greeting}</TranslatedText>
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-600 text-sm font-semibold tracking-wide">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        
        {/* Daily Check-in Hero Card (Textured) */}
        <div className="lg:col-span-2 relative h-full min-h-[300px] rounded-[2rem] overflow-hidden p-8 flex flex-col justify-between group shadow-lg smooth-transition hover:shadow-xl bg-[url('/landing-bg.jpg')] bg-cover bg-center border border-gray-100">
          
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-1"><TranslatedText>Daily Check-in</TranslatedText></h2>
            <p className="text-emerald-900 text-xs font-medium opacity-80"><TranslatedText>Update your status</TranslatedText></p>
          </div>

          {/* Central Avatar */}
          <div className="relative z-10 flex justify-center my-6">
             <div className="relative">
               <div className="w-28 h-28 rounded-full border-4 border-white/80 shadow-xl overflow-hidden relative z-10 bg-emerald-100">
                 {profileImage ? (
                   <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-emerald-600 font-bold text-3xl">
                     {userName.charAt(0)}
                   </div>
                 )}
               </div>
               {/* Pulse Effect */}
               <div className="absolute 0 -right-0 bottom-1 bg-[#10b981] text-white p-2 rounded-full border-[3px] border-white z-20 shadow-lg">
                 <Activity className="w-4 h-4" />
               </div>
             </div>
          </div>

          {/* Bottom Card Action - Glassmorphism */}
          <Link href="/dashboard/medications" className="relative z-10 bg-white/60 backdrop-blur-md px-6 py-4 rounded-[1.5rem] flex items-center justify-between border border-white/40 hover:bg-white/80 smooth-transition cursor-pointer group-hover:scale-[1.01] shadow-sm mt-auto">
             <div>
               <p className="text-[10px] text-gray-700 font-bold uppercase tracking-wider mb-0.5">Health Score</p>
               <p className="text-2xl font-black text-gray-900">98%</p>
             </div>
             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-800 hover:scale-110 transition-transform">
               <ArrowRight className="w-5 h-5" />
             </div>
          </Link>
        </div>

        {/* Right Side Stats Grid (4 Cards) - Textured + Small Text */}
        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-5 h-full">
            
            {/* Upcoming Appointments */}
             <Link href="/dashboard/appointments" className={statsCardClass}>
                <div className="relative z-10 flex justify-between items-start">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                     <Calendar className="w-5 h-5 text-emerald-600" strokeWidth={2} />
                   </div>
                   <Link href="/dashboard/appointments" className="text-white opacity-80 hover:opacity-100 transition-opacity"><ArrowUpRight className="w-5 h-5" /></Link>
                </div>
                <div className="relative z-10 mt-6">
                  <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stats.upcomingAppointments}</h3>
                  <p className="text-xs text-gray-700 font-bold opacity-90 uppercase tracking-wide">Upcoming Appointments</p>
                  <p className="text-[10px] text-emerald-900 mt-1 font-medium opacity-60">Next: Check Schedule</p>
                </div>
            </Link>

            {/* Active Prescriptions */}
            <Link href="/dashboard/prescriptions" className={statsCardClass}>
                <div className="relative z-10 flex justify-between items-start">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                     <Pill className="w-5 h-5 text-emerald-600" strokeWidth={2} />
                   </div>
                   <Link href="/dashboard/prescriptions" className="text-white opacity-80 hover:opacity-100 transition-opacity"><ArrowUpRight className="w-5 h-5" /></Link>
                </div>
                <div className="relative z-10 mt-6">
                  <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stats.activePrescriptions}</h3>
                  <p className="text-xs text-gray-700 font-bold opacity-90 uppercase tracking-wide">Active Prescriptions</p>
                  <p className="text-[10px] text-emerald-900 mt-1 font-medium opacity-60">2 refills pending</p>
                </div>
            </Link>

            {/* Total Activity */}
            <div className={statsCardClass}>
                <div className="relative z-10 flex justify-between items-start">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                     <Activity className="w-5 h-5 text-emerald-600" strokeWidth={2} />
                   </div>
                   <div className="text-white opacity-70 cursor-pointer hover:opacity-100"><MoreHorizontal className="w-5 h-5" /></div>
                </div>
                <div className="relative z-10 mt-6">
                  <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stats.totalAppointments}</h3>
                  <p className="text-xs text-gray-700 font-bold opacity-90 uppercase tracking-wide">Total Activity</p>
                  {/* Blue Progress Bar */}
                  <div className="w-full bg-blue-200/50 h-1.5 rounded-full mt-4 overflow-hidden">
                     <div className="bg-[#3b82f6] h-full rounded-full shadow-sm" style={{ width: '45%' }}></div>
                  </div>
                </div>
            </div>

            {/* Adherence Score */}
            <Link href="/dashboard/medications" className={statsCardClass}>
                <div className="relative z-10 flex justify-between items-start">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                     <CheckCircle className="w-5 h-5 text-emerald-600" strokeWidth={2} />
                   </div>
                   <span className="text-[10px] uppercase font-bold bg-white px-3 py-1 rounded-full text-emerald-600 shadow-sm">Daily</span>
                </div>
                <div className="relative z-10 mt-6">
                  <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stats.adherenceRate}%</h3>
                  <p className="text-xs text-gray-700 font-bold opacity-90 uppercase tracking-wide">Adherence Score</p>
                </div>
            </Link>
        </div>
      </div>

      {/* Bottom Section - Colored Gradient Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         
         {/* AI Doctor Search */}
         <Link href="/" className="bg-gradient-to-br from-white to-emerald-50 rounded-[2rem] p-8 shadow-sm border border-emerald-100 hover:shadow-lg smooth-transition group flex flex-col justify-between overflow-hidden min-h-[200px]">
            <div className="flex justify-between items-start mb-4">
               <div>
                 <h3 className="text-xl font-bold text-gray-900 mb-1">AI Doctor</h3>
                 <p className="text-gray-500 text-xs font-medium">24/7 Assistance</p>
               </div>
               <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 group-hover:scale-110 smooth-transition shadow-sm border border-emerald-100">
                  <Search className="w-5 h-5" />
               </div>
            </div>
            {/* Avatars Mockup */}
            <div className="flex items-center gap-2 mt-auto">
               <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-xs text-emerald-700 font-bold shadow-sm">A</div>
                  <div className="w-8 h-8 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-xs text-teal-700 font-bold shadow-sm">I</div>
               </div>
               <span className="text-xs text-gray-500 font-medium ml-1">Active Specialists</span>
            </div>
         </Link>

         {/* Find Doctors */}
         <Link href="/dashboard/find-doctors" className="bg-gradient-to-br from-white to-blue-50 rounded-[2rem] p-8 shadow-sm border border-blue-100 hover:shadow-lg smooth-transition group overflow-hidden min-h-[200px]">
            <div className="flex justify-between items-start mb-8">
               <div>
                 <h3 className="text-xl font-bold text-gray-900 mb-1">Find Doctors</h3>
                 <p className="text-gray-500 text-xs font-medium">Book Appointments</p>
               </div>
               <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 smooth-transition shadow-sm border border-blue-100">
                  <Stethoscope className="w-5 h-5" />
               </div>
            </div>
            
            <div className="bg-white/70 p-3 rounded-xl flex items-center gap-3 border border-blue-100 backdrop-blur-sm">
               <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shadow-sm border border-blue-100">
                  <User className="w-4 h-4" />
               </div>
               <div>
                  <p className="text-sm font-bold text-gray-900">New Specialist</p>
                  <p className="text-[10px] text-gray-500 font-medium">Dr. Anjali Joined</p>
               </div>
            </div>
         </Link>

         {/* Adherence Chart */}
         <div className="bg-gradient-to-br from-white to-green-50 rounded-[2rem] p-8 shadow-sm border border-green-100 overflow-hidden group hover:shadow-lg smooth-transition min-h-[200px]">
            <div className="flex justify-between items-start mb-4">
               <h3 className="text-xl font-bold text-gray-900">Adherence</h3>
               <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 smooth-transition shadow-sm border border-green-100">
                  <TrendingUp className="w-5 h-5" />
               </div>
            </div>
            <div className="h-24 flex items-center justify-center">
              {adherenceData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={adherenceData}>
                       <Line type="monotone" dataKey="taken" stroke="#10B981" strokeWidth={3} dot={false} />
                    </LineChart>
                 </ResponsiveContainer>
              ) : (
                <p className="text-xs text-gray-400 font-medium">No data available</p>
              )}
            </div>
         </div>
      </div>
    </div>
  );
}
