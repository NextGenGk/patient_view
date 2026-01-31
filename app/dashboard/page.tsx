'use client';

import { useEffect, useState } from 'react';
import DailyMedicinePopup from '../components/DailyMedicinePopup';
<<<<<<< HEAD
import DashboardAdherenceWidget from '../components/DashboardAdherenceWidget';
import { Calendar, Pill, FileText, TrendingUp, Activity, User, Video, Heart } from 'lucide-react';
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
  Line,
=======
import Link from 'next/link';
import {
  Calendar,
  Pill,
  TrendingUp,
  User,
  FileText,
  Activity,
  Search,
  CheckCircle2,
  ArrowRight,
  MoreHorizontal,
  Stethoscope
} from 'lucide-react';
import {
>>>>>>> 15f2075 (Patien_View final ver)
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
<<<<<<< HEAD
  PieChart,
  Pie,
  Cell,
=======
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
>>>>>>> 15f2075 (Patien_View final ver)
} from 'recharts';

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
<<<<<<< HEAD
  const [greeting, setGreeting] = useState('Welcome');
  const [adherenceData, setAdherenceData] = useState<any[]>([]); // Re-added adherenceData
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
    return () => clearInterval(interval);
=======
  const [adherenceData, setAdherenceData] = useState<any[]>([]);
  const [medicineData, setMedicineData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
>>>>>>> 15f2075 (Patien_View final ver)
  }, []);

  async function fetchDashboardData() {
    try {
      const syncResponse = await fetch('/api/sync-user');
      const { user } = await syncResponse.json();
<<<<<<< HEAD
      
      if (user) {
        setUserName(user.name || '');
        if (user.profile_image_url) {
          setProfileImage(user.profile_image_url);
        }
        
=======

      if (user) {
        setUserName(user.name || 'User');
        if (user.profile_image_url) {
          setProfileImage(user.profile_image_url);
        }

>>>>>>> 15f2075 (Patien_View final ver)
        const response = await fetch(`/api/patient/dashboard?uid=${user.uid}`);
        const data = await response.json();

        if (data.success) {
          setStats({
            upcomingAppointments: data.upcomingAppointments || 0,
            activePrescriptions: data.activePrescriptions || 0,
            totalAppointments: data.totalAppointments || 0,
            adherenceRate: data.adherenceRate || 0,
          });
<<<<<<< HEAD
          
          // Set adherence trend data if available
          if (data.adherenceTrend && data.adherenceTrend.length > 0) {
            setAdherenceData(data.adherenceTrend);
          }
          
          // Set medicine-wise data if available
=======

          if (data.adherenceTrend && data.adherenceTrend.length > 0) {
            setAdherenceData(data.adherenceTrend);
          }
>>>>>>> 15f2075 (Patien_View final ver)
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
<<<<<<< HEAD
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
=======
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
>>>>>>> 15f2075 (Patien_View final ver)
      </div>
    );
  }

<<<<<<< HEAD
  const colors = ['#6366F1', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-6">
      {/* Daily Medicine Reminder Popup */}
      <DailyMedicinePopup />

      {/* Welcome Header with Profile */}
      <div className="glass-card p-8 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img
                src={profileImage}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-primary-600" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              <TranslatedText as="span">{greeting}</TranslatedText>, <TranslatedText>{userName}</TranslatedText>! 👋
            </h1>
            <TranslatedText as="p" className="text-gray-600 mt-1">We hope you're feeling well today</TranslatedText>
=======
  return (
    <div className="space-y-6 h-full flex flex-col">
      <DailyMedicinePopup />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar matching image "Foncaa" */}
        <div className="w-full md:w-auto flex-1 max-w-md">
          {/* Search removed */}
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          {/* Actions removed */}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 tracking-tight">
          {userName}
        </h1>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 shadow-sm">
            <Calendar className="w-4 h-4 text-[#2E6F63]" />
            <span className="text-sm font-semibold text-[#2E6F63]">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
>>>>>>> 15f2075 (Patien_View final ver)
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card-hover p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
            <span className="text-2xl font-bold text-primary-600">
              {stats.upcomingAppointments}
            </span>
          </div>
          <TranslatedText as="h3" className="text-sm font-medium text-gray-600 mb-1">
            Upcoming Appointments
          </TranslatedText>
          <Link
            href="/dashboard/appointments"
            className="text-sm text-primary-600 hover:underline"
          >
            <TranslatedText>View all →</TranslatedText>
          </Link>
        </div>

        <div className="glass-card-hover p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl flex items-center justify-center">
              <Pill className="w-6 h-6 text-secondary-600" />
            </div>
            <span className="text-2xl font-bold text-secondary-600">
              {stats.activePrescriptions}
            </span>
          </div>
          <TranslatedText as="h3" className="text-sm font-medium text-gray-600 mb-1">
            Active Prescriptions
          </TranslatedText>
          <Link
            href="/dashboard/prescriptions"
            className="text-sm text-secondary-600 hover:underline"
          >
            <TranslatedText>Manage →</TranslatedText>
          </Link>
        </div>

        <div className="glass-card-hover p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent-600" />
            </div>
            <span className="text-2xl font-bold text-accent-600">
              {stats.adherenceRate}%
            </span>
          </div>
          <TranslatedText as="h3" className="text-sm font-medium text-gray-600 mb-1">
            Medication Adherence
          </TranslatedText>
          <p className="text-sm text-accent-600">
            {stats.adherenceRate >= 80 ? (
              <TranslatedText>Excellent! Keep it up</TranslatedText>
            ) : (
              <TranslatedText>Keep improving!</TranslatedText>
            )}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      {adherenceData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Medication Adherence Trend */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <TranslatedText as="h2" className="text-lg font-bold text-gray-900">
                Weekly Medication Trend
              </TranslatedText>
              <img src="/Logos/logo_emblem_total black+transparent.png" alt="AuraSutra" className="h-5" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={adherenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="taken"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 4 }}
                  name="Taken"
                />
                <Line
                  type="monotone"
                  dataKey="skipped"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', r: 4 }}
                  name="Skipped"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Medicine-wise Adherence */}
          {medicineData.length > 0 && (
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <TranslatedText as="h2" className="text-lg font-bold text-gray-900">
                  Medicine-wise Progress
                </TranslatedText>
                <Pill className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={medicineData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {medicineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {medicineData.map((med, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="text-sm text-gray-700">{med.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {med.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="glass-card p-6 rounded-2xl">
        <TranslatedText as="h2" className="text-lg font-bold text-gray-900 mb-4">Quick Actions</TranslatedText>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/"
            className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 hover:shadow-lg smooth-transition group"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 smooth-transition">
              <img src="/Logos/logo_emblem_total black+transparent.png" alt="AuraSutra" className="h-5" />
            </div>
            <TranslatedText as="span" className="font-medium text-gray-900">AI Doctor Search</TranslatedText>
          </Link>

          <Link
            href="/dashboard/find-doctors"
            className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-br from-secondary-50 to-secondary-100/50 hover:shadow-lg smooth-transition group"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 smooth-transition">
              <Calendar className="w-5 h-5 text-secondary-600" />
            </div>
            <TranslatedText as="span" className="font-medium text-gray-900">Find Doctors</TranslatedText>
          </Link>

          <Link
            href="/dashboard/prescriptions"
            className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-br from-accent-50 to-accent-100/50 hover:shadow-lg smooth-transition group"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 smooth-transition">
              <FileText className="w-5 h-5 text-accent-600" />
            </div>
            <TranslatedText as="span" className="font-medium text-gray-900">View Prescriptions</TranslatedText>
          </Link>

          <Link
            href="/dashboard/medications"
            className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 hover:shadow-lg smooth-transition group"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 smooth-transition">
              <Pill className="w-5 h-5 text-emerald-600" />
            </div>
            <TranslatedText as="span" className="font-medium text-gray-900">Check Adherence</TranslatedText>
          </Link>

          <Link
            href="/dashboard/profile"
            className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100/50 hover:shadow-lg smooth-transition group"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 smooth-transition">
              <FileText className="w-5 h-5 text-rose-600" />
            </div>
            <TranslatedText as="span" className="font-medium text-gray-900">Update Profile</TranslatedText>
          </Link>
=======
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">

        {/* Left Column: Hero/Profile Card */}
        <div className="lg:col-span-5 h-full min-h-[300px]">
          <div className="card-dark w-full h-full rounded-[32px] p-8 flex flex-col justify-between relative group">
            {/* Background decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal-400/20 blur-[60px] rounded-full"></div>

            <div className="flex justify-between items-start z-10">
              <div>
                <h2 className="text-2xl font-bold leading-tight mb-1">Daily<br />Check-in</h2>
                <p className="text-teal-200/80 text-sm">Update your status</p>
              </div>
              <div className="flex flex-col gap-2">
              </div>
            </div>

            <div className="flex items-center justify-center z-10 my-4">
              <div className="relative w-40 h-40 rounded-full p-1 border-2 border-dashed border-teal-300/30">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#2E6F63] relative">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-teal-800 flex items-center justify-center text-4xl font-bold text-white/50">{userName.charAt(0)}</div>
                  )}
                </div>
                <div className="absolute bottom-0 right-4 w-10 h-10 bg-emerald-400 rounded-full border-4 border-[#2E6F63] flex items-center justify-center text-[#2E6F63]">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/10 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-teal-300" />
                </div>
                <div>
                  <p className="text-xs text-teal-200">Health Score</p>
                  <p className="font-bold text-lg">98%</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white text-[#2E6F63] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 2x2 Stats Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Appointments Card */}
          <Link href="/dashboard/appointments" className="card-dark rounded-[32px] p-6 hover:brightness-110 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-emerald-300" />
              </div>
              <ArrowRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1">{stats.upcomingAppointments}</h3>
              <p className="text-teal-200 text-sm font-medium">Upcoming Appointments</p>
              <p className="text-xs text-white/40 mt-1">Next: Dr. Sarah • 10:00 AM</p>
            </div>
          </Link>

          {/* Prescriptions Card */}
          <Link href="/dashboard/prescriptions" className="card-dark rounded-[32px] p-6 hover:brightness-110 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Pill className="w-6 h-6 text-teal-300" />
              </div>
              <ArrowRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1">{stats.activePrescriptions}</h3>
              <p className="text-teal-200 text-sm font-medium">Active Prescriptions</p>
              <p className="text-xs text-white/40 mt-1">2 refills pending</p>
            </div>
          </Link>

          {/* Active/History Card */}
          <div className="card-dark rounded-[32px] p-6 group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-300" />
              </div>
              <MoreHorizontal className="w-5 h-5 text-white/50" />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1">{stats.totalAppointments}</h3>
              <p className="text-teal-200 text-sm font-medium">Total Activity</p>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-3">
                <div className="bg-blue-400 h-full rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>

          {/* Adherence Card */}
          <Link href="/dashboard/medications" className="card-dark rounded-[32px] p-6 group hover:brightness-110 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-300" />
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg text-white">Daily</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-1">{stats.adherenceRate}%</h3>
              <p className="text-teal-200 text-sm font-medium">Adherence Score</p>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-3">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${stats.adherenceRate}%` }}></div>
              </div>
            </div>
          </Link>

        </div>

      </div>

      {/* Bottom Row - Light Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Doctor */}
        <Link href="/" className="card-light rounded-[32px] p-6 flex flex-col justify-between group cursor-pointer hover:shadow-lg transition-all h-[180px]">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-800 text-lg">AI Doctor</h3>
              <p className="text-sm text-gray-500">24/7 Assistance</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
              <Search className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">+3</div>
            </div>
            <span className="text-xs text-gray-400 font-medium ml-2">Active Specialists</span>
          </div>
        </Link>

        {/* Find Doctors */}
        <Link href="/dashboard/find-doctors" className="card-light rounded-[32px] p-6 flex flex-col justify-between group cursor-pointer hover:shadow-lg transition-all h-[180px]">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-800 text-lg">Find Doctors</h3>
              <p className="text-sm text-gray-500">Book Appointments</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="bg-blue-50/50 rounded-xl p-3 flex items-center gap-3 mt-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">New Specialist</p>
              <p className="text-[10px] text-gray-500">Dr. Anjali Joined</p>
            </div>
          </div>
        </Link>

        {/* Adherence Graph (Small) */}
        <div className="card-light rounded-[32px] p-6 flex flex-col justify-between h-[180px]">
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-800 text-lg">Adherence</h3>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex-1 w-full min-h-0">
            {adherenceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={adherenceData}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="taken"
                    stroke="#14B8A6"
                    fillOpacity={1}
                    fill="url(#colorTrend)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                No data available
              </div>
            )}
          </div>
>>>>>>> 15f2075 (Patien_View final ver)
        </div>
      </div>
    </div>
  );
}
