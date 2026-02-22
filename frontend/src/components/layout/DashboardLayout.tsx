import React from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Briefcase, GraduationCap, FileText, Bell, ChevronLeft, Building } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

export default function DashboardLayout({ requireAdmin = false }) {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (requireAdmin && user?.role !== 'admin') return <Navigate to="/student" replace />;
    if (!requireAdmin && user?.role === 'admin' && location.pathname.startsWith('/student')) return <Navigate to="/admin" replace />;

    const adminLinks = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Manage Companies', path: '/admin/companies', icon: <Building className="w-5 h-5" /> },
        { name: 'Manage Drives', path: '/admin/drives', icon: <Briefcase className="w-5 h-5" /> },
        { name: 'Applications', path: '/admin/applications', icon: <FileText className="w-5 h-5" /> },
    ];

    const studentLinks = [
        { name: 'Dashboard', path: '/student', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Available Drives', path: '/student/drives', icon: <Briefcase className="w-5 h-5" /> },
        { name: 'My Applications', path: '/student/applications', icon: <FileText className="w-5 h-5" /> },
        { name: 'Profile', path: '/student/profile', icon: <GraduationCap className="w-5 h-5" /> },
    ];

    const links = user?.role === 'admin' ? adminLinks : studentLinks;

    return (
        <div className="min-h-screen bg-background text-text-primary flex">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-white/10 glass hidden md:flex flex-col relative z-20">
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/student')}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-white">Placement<span className="text-primary">Connect</span></span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-primary/10 text-primary border border-primary/20 shadow-inner"
                                        : "text-text-secondary hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <div className={cn("transition-colors", isActive ? "text-primary" : "text-text-secondary group-hover:text-white")}>
                                    {link.icon}
                                </div>
                                {link.name}
                            </button>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center shrink-0">
                            <span className="font-semibold text-sm">{user?.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                            <p className="text-xs text-text-secondary truncate capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <Button variant="ghost" className="w-full justify-start text-danger hover:text-danger hover:bg-danger/10" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                {/* Aesthetic Backgrounds */}
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

                {/* Header */}
                <header className="h-16 border-b border-white/10 glass flex items-center justify-between px-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-medium tracking-tight">
                            {links.find(l => l.path === location.pathname)?.name || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="rounded-full relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                        </Button>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <div className="flex-1 overflow-auto p-6 relative z-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
