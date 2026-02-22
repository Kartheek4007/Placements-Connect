import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Building, Briefcase, FileText, CheckCircle, Clock, Plus } from 'lucide-react';
import api from '../../lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalCompanies: 0,
        activeDrives: 0,
        totalApplications: 0,
        placedStudents: 0
    });
    const [recentDrives, setRecentDrives] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, drivesRes] = await Promise.all([
                    api.get('/stats'),
                    api.get('/drives/')
                ]);

                setStats({
                    totalCompanies: statsRes.data.total_companies,
                    activeDrives: statsRes.data.active_drives,
                    totalApplications: statsRes.data.total_applications,
                    placedStudents: statsRes.data.placed_students
                });
                setRecentDrives(drivesRes.data.slice(0, 5));
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 selection:bg-primary/30">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Admin <span className="text-primary">Overview</span></h1>
                    <p className="text-text-secondary text-lg">Real-time performance metrics and placement logistics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => navigate('/admin/drives')} className="bg-primary hover:bg-primary-hover text-white rounded-xl px-5 h-12 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
                        <Plus className="mr-2 h-5 w-5" />
                        Launch Drive
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Registered Partners', value: stats.totalCompanies, icon: Building, color: 'primary', sub: 'Total Companies' },
                    { label: 'Active Opportunities', value: stats.activeDrives, icon: Briefcase, color: 'secondary', sub: 'Open Drives' },
                    { label: 'Processed Apps', value: stats.totalApplications, icon: FileText, color: 'accent', sub: 'Total Applications' },
                    { label: 'Career Success', value: stats.placedStudents, icon: CheckCircle, color: 'success', sub: 'Placed Students' }
                ].map((stat, i) => (
                    <Card key={i} className="bg-surface/30 border-white/5 hover:border-white/10 transition-all overflow-hidden relative group rounded-2xl">
                        <div className={`absolute top - 0 right - 0 w - 32 h - 32 bg - ${stat.color} /5 blur-3xl -mr-16 -mt-16 group-hover:bg-${stat.color}/10 transition - colors`}></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-muted">
                                {stat.sub}
                            </CardTitle>
                            <div className={`p - 2 rounded - xl bg - ${stat.color} /10 border border-${stat.color}/20 group - hover: scale - 110 transition - transform duration - 500`}>
                                <stat.icon className={`h - 5 w - 5 text - ${stat.color} `} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-extrabold text-white mb-1 tabular-nums">{stat.value}</div>
                            <p className="text-sm text-text-secondary">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 border-white/5 bg-surface/20 rounded-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    <CardHeader className="relative z-10 border-b border-white/5 pb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold text-white">Recent Placement Drives</CardTitle>
                                <CardDescription className="text-text-muted">Currently active or recently closed opportunities</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 relative z-10">
                        <div className="divide-y divide-white/5">
                            {recentDrives.length > 0 ? recentDrives.map(drive => (
                                <div key={drive.id} className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors group/row">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-surface-soft border border-white/5 flex items-center justify-center shrink-0 group-hover/row:scale-110 transition-transform">
                                            <Building className="h-6 w-6 text-text-secondary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-lg">{drive.company.name}</p>
                                            <p className="text-sm text-text-muted font-medium">{drive.role} • {drive.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text - [10px] sm: text - xs font - bold px - 3 py - 1 rounded - full uppercase tracking - widest ${drive.status === 'Active' ? 'bg-success/10 text-success border border-success/20' : 'bg-text-muted/10 text-text-muted border border-white/5'
                                            } `}>
                                            {drive.status}
                                        </span>
                                        <p className="text-sm font-bold text-primary">{drive.ctc} LPA</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                        <Clock className="h-8 w-8 text-text-muted opacity-20" />
                                    </div>
                                    <p className="text-text-muted font-medium">No recent activity detected</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Shortcuts */}
                <Card className="border-white/5 bg-primary/5 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -mr-32 -mt-32"></div>
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-xl font-bold text-white">System Actions</CardTitle>
                        <CardDescription className="text-text-muted">Core administrative functions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 relative z-10">
                        <div
                            onClick={() => navigate('/admin/drives')}
                            className="p-5 rounded-2xl border border-white/5 bg-surface/40 hover:bg-surface/60 transition-all cursor-pointer group/action flex items-start gap-4"
                        >
                            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover/action:scale-110 transition-transform">
                                <Plus className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-bold text-white">Manage Drives</p>
                                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">Create and monitor placement windows for students.</p>
                            </div>
                        </div>
                        <div
                            onClick={() => navigate('/admin/companies')}
                            className="p-5 rounded-2xl border border-white/5 bg-surface/40 hover:bg-surface/60 transition-all cursor-pointer group/action flex items-start gap-4"
                        >
                            <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 group-hover/action:scale-110 transition-transform">
                                <Building className="h-6 w-6 text-secondary" />
                            </div>
                            <div>
                                <p className="font-bold text-white">Partner Directory</p>
                                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">View and onboard new corporate hiring partners.</p>
                            </div>
                        </div>
                        <div
                            onClick={() => navigate('/admin/applications')}
                            className="p-5 rounded-2xl border border-white/5 bg-surface/40 hover:bg-surface/60 transition-all cursor-pointer group/action flex items-start gap-4"
                        >
                            <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 group-hover/action:scale-110 transition-transform">
                                <FileText className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                                <p className="font-bold text-white">Review Portal</p>
                                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">Review student resumes and track shortlisting status.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
