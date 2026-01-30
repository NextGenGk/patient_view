'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Video, MapPin, Clock, User, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Appointment {
  aid: string;
  scheduled_date: string;
  scheduled_time: string;
  mode: string;
  status: string;
  complaint_description: string;
  duration_minutes?: number;
  start_time?: string;
  end_time?: string;
  doctor: {
    did: string;
    specialization: string;
    user: {
      name: string;
      email: string;
      profile_image_url?: string;
    };
  };
}

export default function AppointmentsPage() {
  const searchParams = useSearchParams();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const syncResponse = await fetch('/api/sync-user');
      const { user } = await syncResponse.json();

      if (!user) {
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/patient/appointments?uid=${user.uid}`);
      const data = await response.json();

      if (data.success) {
        setAppointments(data.appointments || []);
      } else {
        toast.error('Failed to load appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }

  async function cancelAppointment(aid: string) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const response = await fetch(`/api/patient/appointments/${aid}/cancel`, {
        method: 'PATCH',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
      } else {
        toast.error(data.error || 'Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  }

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'confirmed'
  );
  const completedAppointments = appointments.filter((apt) => apt.status === 'completed');
  const cancelledAppointments = appointments.filter((apt) => apt.status === 'cancelled');

  const displayedAppointments =
    activeTab === 'upcoming'
      ? upcomingAppointments
      : activeTab === 'completed'
      ? completedAppointments
      : cancelledAppointments;

  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compact Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-black text-gray-900 mb-1">My Appointments</h1>
        <p className="text-gray-600 text-sm">Track and manage your healthcare consultations</p>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 inline-flex space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      {displayedAppointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            {activeTab === 'upcoming'
              ? 'No upcoming appointments'
              : activeTab === 'completed'
              ? 'No completed appointments'
              : 'No cancelled appointments'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedAppointments.map((apt) => (
            <div 
              key={apt.aid} 
              className="group relative h-[400px] bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                {apt.doctor?.user?.profile_image_url ? (
                  <img
                    src={apt.doctor.user.profile_image_url}
                    alt={apt.doctor.user.name}
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
                <h3 className="text-3xl font-black mb-3 drop-shadow-md truncate">
                  Dr. {apt.doctor?.user?.name || 'Doctor'}
                </h3>
                
                <div className="flex items-center space-x-3 text-sm mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-300" />
                    <span className="font-medium">{new Date(apt.scheduled_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-300" />
                    <span className="font-medium">{apt.scheduled_time}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${
                    apt.status === 'confirmed' ? 'bg-green-500/40 text-green-50 border-green-300/60' :
                    apt.status === 'completed' ? 'bg-blue-500/40 text-blue-50 border-blue-300/60' :
                    apt.status === 'cancelled' ? 'bg-red-500/40 text-red-50 border-red-300/60' :
                    apt.status === 'in_progress' ? 'bg-purple-500/40 text-purple-50 border-purple-300/60 animate-pulse' :
                    'bg-amber-500/40 text-amber-50 border-amber-300/60'
                  }`}>
                    {apt.status.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md flex items-center space-x-1 ${
                    apt.mode === 'online' ? 'bg-blue-500/40 text-blue-50 border border-blue-300/60' : 'bg-emerald-500/40 text-emerald-50 border border-emerald-300/60'
                  }`}>
                    {apt.mode === 'online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                    <span className="capitalize">{apt.mode}</span>
                  </span>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center z-20 transform scale-95 group-hover:scale-100">
                
                {/* Doctor Photo and Name */}
                <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-white mb-3 shadow-xl">
                  {apt.doctor?.user?.profile_image_url ? (
                    <img src={apt.doctor.user.profile_image_url} className="w-full h-full object-cover" alt={apt.doctor.user.name} />
                  ) : (
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                      <User className="w-10 h-10 text-primary-600" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-white font-black text-xl mb-4">Dr. {apt.doctor?.user?.name}</h3>

                {/* Chief Complaint */}
                {apt.complaint_description && (
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20 mb-4 w-full">
                    <p className="text-xs font-bold text-primary-200 mb-2">Chief Complaint</p>
                    <p className="text-sm text-white leading-relaxed">{apt.complaint_description}</p>
                  </div>
                )}

                {/* Appointment Info */}
                <div className={`grid ${apt.status === 'completed' && apt.mode === 'online' && apt.start_time && apt.end_time ? 'grid-cols-2' : 'grid-cols-2'} gap-3 py-4 border-y border-white/10 w-full mb-4`}>
                  <div className="text-center">
                    <Calendar className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-gray-400 mb-1">Date</p>
                    <p className="text-xs font-bold text-white">{new Date(apt.scheduled_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-gray-400 mb-1">Time</p>
                    <p className="text-xs font-bold text-white">{apt.scheduled_time}</p>
                  </div>
                </div>

                {/* Meeting Duration for Completed Online Appointments */}
                {apt.status === 'completed' && apt.mode === 'online' && apt.start_time && apt.end_time && (
                  <div className="bg-blue-500/20 rounded-xl p-3 border border-blue-300/30 mb-4 w-full">
                    <p className="text-xs font-bold text-blue-200 mb-2">Meeting Duration</p>
                    <div className="flex items-center justify-center space-x-3 text-sm text-white">
                      <span className="font-medium">{apt.start_time}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium">{apt.end_time}</span>
                    </div>
                  </div>
                )}

                <div className="w-full space-y-2">
                  {activeTab === 'upcoming' && apt.mode === 'online' && (apt.status === 'confirmed' || apt.status === 'in_progress') && 
                   new Date(apt.scheduled_date).toDateString() === new Date().toDateString() && (
                    <button
                      onClick={(e) => { e.stopPropagation(); window.location.href = `/dashboard/video-call/${apt.aid}`; }}
                      className="w-full py-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-2xl font-bold text-sm hover:scale-105 transition-all"
                    >
                      {apt.status === 'in_progress' ? '🔴 Join Call Now' : 'Join Call'}
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedAppointment(apt); }}
                    className="w-full py-3 bg-white/20 border border-white/30 text-white rounded-2xl font-bold text-sm hover:bg-white/30 transition-all"
                  >
                    View Full Details
                  </button>
                  
                  {activeTab === 'upcoming' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); cancelAppointment(apt.aid); }}
                      className="w-full py-3 bg-red-500/30 border border-red-300/50 text-red-100 rounded-2xl font-bold text-sm hover:bg-red-500/50 transition-all"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedAppointment(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-emerald-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Appointment Details</h2>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary-200 shadow-md">
                  {selectedAppointment.doctor?.user?.profile_image_url ? (
                    <img
                      src={selectedAppointment.doctor.user.profile_image_url}
                      alt={selectedAppointment.doctor.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                      <User className="w-10 h-10 text-primary-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-gray-900">Dr. {selectedAppointment.doctor?.user?.name}</h3>
                  <p className="text-primary-600 font-semibold">{selectedAppointment.doctor?.specialization}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 mb-1">Date</p>
                  <p className="text-lg font-black text-gray-900">
                    {new Date(selectedAppointment.scheduled_date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 mb-1">Time</p>
                  <p className="text-lg font-black text-gray-900">{selectedAppointment.scheduled_time}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 mb-1">Mode</p>
                  <p className="text-lg font-black text-gray-900 capitalize">{selectedAppointment.mode}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 mb-1">Status</p>
                  <p className="text-lg font-black text-gray-900 capitalize">{selectedAppointment.status}</p>
                </div>
              </div>

              {selectedAppointment.complaint_description && (
                <div className="bg-primary-50 p-4 rounded-xl border border-primary-100">
                  <p className="text-xs font-bold text-primary-700 mb-2">Your Note</p>
                  <p className="text-gray-700">{selectedAppointment.complaint_description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
