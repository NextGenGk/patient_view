import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Home, Calendar, User, FileText, LogOut, Pill } from 'lucide-react';
import Link from 'next/link';
import PatientProfilePicture from '../components/ProfilePicture';
import LiveCallNotifier from './components/LiveCallNotifier';
import { supabase } from '@/lib/shared/supabase';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { TranslatedText } from '../components/TranslatedText';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, getUser } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect('/');
  }

  const user = await getUser();

  // Check user role from database
  if (user?.id) {
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', user.id)
      .single();

    // If user is a doctor, redirect to unauthorized page
    if (userData?.role === 'doctor') {
      redirect('/unauthorized');
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Find Doctors', href: '/dashboard/find-doctors', icon: User },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Prescriptions', href: '/dashboard/prescriptions', icon: Pill },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex p-8" style={{ backgroundColor: '#a5d8dd' }}>
      {/* Sidebar - Textured with Fixed Width */}
      <aside className="w-64 border-r border-gray-200/50 min-h-full sticky top-0 flex flex-col bg-[url('/landing-bg.jpg')] bg-cover bg-center shrink-0 rounded-l-3xl overflow-hidden shadow-lg">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center space-x-1">
            <img src="/Logos/logo_transparent.png" alt="AuraSutra" className="h-12" />
            <span className="text-2xl font-semibold" style={{ fontFamily: 'Alatsi, sans-serif' }}>AuraSutra</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 relative z-10">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/50 smooth-transition text-gray-700 hover:text-emerald-700 group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 smooth-transition" />
              <span className="font-medium">
                <TranslatedText>{item.name}</TranslatedText>
              </span>
            </Link>
          ))}
          
          {/* Language Switcher */}
          <div className="pt-4 mt-4 border-t border-gray-200/50 px-4">
            <LanguageSwitcher />
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200/50 relative z-10">
          <div className="flex items-center space-x-3 px-4 py-3 bg-white/40 rounded-xl backdrop-blur-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white">
              <PatientProfilePicture uid={user?.id} />
              {!user?.id && (
                <span className="text-emerald-700 font-semibold">
                  {user?.given_name?.[0] || 'U'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                <TranslatedText>{user?.given_name || 'User'}</TranslatedText>
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Link
            href="/api/auth/logout"
            className="flex items-center space-x-2 px-4 py-2 mt-2 text-red-600 hover:bg-red-50 rounded-lg smooth-transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">
              <TranslatedText>Logout</TranslatedText>
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-white min-w-0 rounded-r-3xl shadow-lg">
        <LiveCallNotifier />
        <div className="p-8 font-poppins">{children}</div>
      </main>
    </div>
  );
}
