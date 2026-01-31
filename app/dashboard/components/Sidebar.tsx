'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, User, FileText, Pill, LogOut, HelpCircle } from 'lucide-react';

interface SidebarProps {
    user: any;
}

export default function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Find Doctors', href: '/dashboard/find-doctors', icon: User },
        { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
        { name: 'Prescriptions', href: '/dashboard/prescriptions', icon: Pill },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
    ];

    const isActive = (path: string) => {
        if (path === '/dashboard' && pathname === '/dashboard') return true;
        if (path !== '/dashboard' && pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <aside className="w-64 h-full flex flex-col z-20 relative bg-transparent border-r border-white/10 px-4 py-8">
            {/* Branding */}
            <div className="px-4 mb-8">
                <Link href="/dashboard" className="flex items-center gap-1">
                    <div className="relative w-8 h-8">
                        <img
                            src="/Logos/logo_transparent.png"
                            alt="Brand"
                            className="object-contain w-full h-full"
                        />
                    </div>
                    <span
                        className="text-2xl font-bold text-[#2E6F63] tracking-tight"
                    >
                        AuraSutra
                    </span>
                </Link>
            </div>

            {/* "Dashboard +" Search/Add Placeholder from image */}
            {/* "Dashboard +" Search/Add Placeholder removed */}
            <div className="px-4 mb-2"></div>

            {/* Navigation Menu */}
            <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar px-2">
                {navigation.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 group
                                ${active ? 'nav-item-active' : 'nav-item-inactive'}
                            `}
                        >
                            <item.icon
                                className={`w-5 h-5 transition-transform duration-300 ${active ? 'stroke-[2px]' : 'stroke-[1.5px] group-hover:scale-110'}`}
                            />
                            <span className="text-sm font-medium">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Card / Logout */}
            <div className="mt-4 px-2">
                <div className="card-dark rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-transform">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-teal-100">Signed in as</span>
                            <span className="text-sm font-bold truncate max-w-[100px]">{user?.given_name || 'User'}</span>
                        </div>
                    </div>
                    <Link href="/api/auth/logout" className="text-teal-200 hover:text-white transition-colors">
                        <LogOut className="w-4 h-4/8" />
                    </Link>
                </div>
            </div>
        </aside >
    );
}
