import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Briefcase, GraduationCap, FileText, Bell, Building, Loader2, CheckCircle, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { useState } from 'react';

export default function DashboardLayout({ requireAdmin = false }) {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-text-secondary">Loading your workspace...</p>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (requireAdmin && user?.role !== 'admin') return <Navigate to="/student" replace />;
    if (!requireAdmin && user?.role === 'admin' && location.pathname.startsWith('/student')) return <Navigate to="/admin" replace />;

    const adminLinks = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Companies', path: '/admin/companies', icon: <Building className="w-5 h-5" /> },
        { name: 'Drives', path: '/admin/drives', icon: <Briefcase className="w-5 h-5" /> },
        { name: 'Applications', path: '/admin/applications', icon: <FileText className="w-5 h-5" /> },
        { name: 'Results', path: '/admin/results', icon: <CheckCircle className="w-5 h-5" /> },
    ];

    const studentLinks = [
        { name: 'Dashboard', path: '/student', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Drives', path: '/student/drives', icon: <Briefcase className="w-5 h-5" /> },
        { name: 'Applications', path: '/student/applications', icon: <FileText className="w-5 h-5" /> },
        { name: 'Profile', path: '/student/profile', icon: <GraduationCap className="w-5 h-5" /> },
        { name: 'Results', path: '/student/results', icon: <CheckCircle className="w-5 h-5" /> },
    ];

    const links = user?.role === 'admin' ? adminLinks : studentLinks;

    return (
        <div className="min-h-screen bg-background text-text-primary flex flex-col md:flex-row overflow-hidden pb-20 md:pb-0">
            {/* Desktop Sidebar */}
            <aside className="w-72 border-r border-white/5 bg-surface/50 hidden md:flex flex-col relative z-20">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10 cursor-pointer group" onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/student')}>
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white italic">Connect<span className="text-primary not-italic">.</span></span>
                    </div>

                    <nav className="space-y-1.5">
                        {links.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <button
                                    key={link.path}
                                    onClick={() => navigate(link.path)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                        isActive
                                            ? "bg-primary/10 text-primary border border-primary/10"
                                            : "text-text-secondary hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <div className={cn("transition-colors", isActive ? "text-primary opacity-100" : "text-text-secondary opacity-70 group-hover:opacity-100 group-hover:text-white")}>
                                        {link.icon}
                                    </div>
                                    {link.name}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-white/5">
                    <div className="flex items-center gap-3 px-3 py-3 mb-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-surface-soft flex items-center justify-center shrink-0 text-primary font-bold">
                            {user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                            <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold truncate">{user?.role}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-danger hover:text-danger hover:bg-danger/10 h-12 rounded-xl"
                        onClick={logout}
                    >
                        <LogOut className="mr-3 h-4 w-4" />
                        Log out
                    </Button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 h-20 bg-surface/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4 z-50 md:hidden">
                {links.slice(0, 4).map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            className={cn(
                                "flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all",
                                isActive ? "text-primary" : "text-text-secondary"
                            )}
                        >
                            <div className={cn("transition-transform", isActive && "scale-110")}>
                                {link.icon}
                            </div>
                            <span className="text-[10px] font-bold tracking-tight uppercase">
                                {link.name.split(' ')[0]}
                            </span>
                        </button>
                    )
                })}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="flex flex-col items-center gap-1.5 p-2 text-text-secondary"
                >
                    <Menu className="w-5 h-5" />
                    <span className="text-[10px] font-bold tracking-tight uppercase">More</span>
                </button>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                {/* Structured Structured Background Subtlety */}
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>

                {/* Header */}
                <header className="h-20 border-b border-white/5 bg-background/50 backdrop-blur-sm flex items-center justify-between px-6 lg:px-10 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden h-10 w-10 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="h-5 w-5 text-text-primary" />
                        </Button>
                        <h2 className="text-xl font-bold tracking-tight text-white">
                            {links.find(l => l.path === location.pathname)?.name || 'Platform'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                            <span className="text-xs font-bold text-text-secondary tracking-tight">System Online</span>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 relative">
                            <Bell className="h-5 w-5 text-text-primary" />
                            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,1)]" />
                        </Button>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <div className="flex-1 overflow-auto p-6 lg:p-10 relative z-10 selection:bg-primary/20">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-lg animate-in fade-in duration-300 flex flex-col">
                    <div className="p-8 flex items-center justify-between border-b border-white/5">
                        <span className="text-xl font-bold tracking-tight text-white">More Options</span>
                        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                    <div className="flex-1 p-8 space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest pl-2">Account</h4>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                                    {user?.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-white">{user?.name}</p>
                                    <p className="text-sm text-text-secondary capitalize">{user?.role}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest pl-2">Platform</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {links.map((link) => (
                                    <button
                                        key={link.path}
                                        onClick={() => { navigate(link.path); setIsMobileMenuOpen(false); }}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-white active:bg-white/10"
                                    >
                                        <div className="text-primary">{link.icon}</div>
                                        <span className="font-medium">{link.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            variant="destructive"
                            className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-danger/20"
                            onClick={logout}
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Sign Out Completely
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
