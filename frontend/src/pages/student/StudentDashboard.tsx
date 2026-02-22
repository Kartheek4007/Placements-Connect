import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Briefcase, Building, FileText, Star } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [drives, setDrives] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [drivesRes, appsRes] = await Promise.all([
                    api.get('/drives'),
                    api.get('/applications/my-applications')
                ]);
                setDrives(drivesRes.data);
                setApplications(appsRes.data);
            } catch (err) {
                console.error("Failed to load student data", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 selection:bg-secondary/30">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
                        Welcome, <span className="text-secondary italic">{user?.name.split(' ')[0]}</span> 👋
                    </h1>
                    <p className="text-text-secondary text-lg font-medium">Your centralized career progress overview.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Portal Active</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
                {[
                    { label: 'Active Opportunities', value: drives.filter((d: any) => d.status === 'Active').length, icon: Briefcase, color: 'primary', sub: 'Placement Drives' },
                    { label: 'Applications Sent', value: applications.length, icon: FileText, color: 'secondary', sub: 'Your Tracking' },
                    { label: 'Success Indicators', value: applications.filter((a: any) => a.status === 'Shortlisted' || a.status === 'Selected').length, icon: Star, color: 'success', sub: 'Progress Status' }
                ].map((stat, i) => (
                    <Card key={i} className="bg-surface/30 border-white/5 hover:border-secondary/20 transition-all rounded-2xl relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}/5 blur-2xl group-hover:bg-${stat.color}/10 transition-colors`}></div>
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                                {stat.sub}
                            </CardTitle>
                            <div className={`p-2.5 rounded-xl bg-surface-soft border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-extrabold text-white mb-1 tabular-nums transition-all">
                                {stat.value}
                            </div>
                            <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Interactive Sections */}
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                {/* Recent High-Impact Drives */}
                <Card className="border-white/5 bg-surface/20 rounded-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none"></div>
                    <CardHeader className="relative z-10 p-8 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-extrabold text-white tracking-tight">Prime Opportunities</CardTitle>
                                <CardDescription className="text-text-muted mt-1 font-medium italic">Hand-picked roles matching your expertise</CardDescription>
                            </div>
                            <Button variant="ghost" onClick={() => navigate('/student/drives')} className="text-secondary hover:text-white hover:bg-secondary/10 font-bold text-xs uppercase tracking-widest">
                                Explore All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 relative z-10 px-6 pb-6 mt-4">
                        <div className="space-y-3">
                            {drives.slice(0, 3).length > 0 ? drives.slice(0, 3).map((drive: any) => (
                                <div
                                    key={drive.id}
                                    onClick={() => navigate('/student/drives')}
                                    className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:translate-x-1 transition-all cursor-pointer group/row"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-surface-soft flex items-center justify-center border border-white/5 shadow-inner">
                                            <Building className="h-6 w-6 text-text-muted transition-transform group-hover/row:scale-110" />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-white text-lg tracking-tight group-hover/row:text-secondary transition-colors">{drive.company?.name || 'Company'}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{drive.role}</p>
                                                <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                                <p className="text-xs text-text-muted">{drive.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="px-4 py-1.5 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary font-bold text-xs shadow-[0_0_15px_rgba(14,165,233,0.1)]">
                                            {drive.ctc ? `${drive.ctc} LPA` : 'Competitive'}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/5">
                                    <Briefcase className="w-10 h-10 text-white/10 mx-auto mb-4" />
                                    <p className="text-text-muted font-bold text-sm">Waiting for fresh opportunities</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Engagement / Next Steps */}
                <div className="space-y-8">
                    <Card className="border-white/5 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-3xl relative overflow-hidden group p-8">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(14,165,233,0.05)_0%,transparent_50%)]"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                            <div>
                                <h3 className="text-2xl font-black text-white leading-tight">Elevate your <br /><span className="text-secondary">profile presence.</span></h3>
                                <p className="text-text-secondary mt-3 leading-relaxed text-sm">Ensure your resume and technical skills are up to date to increase shortlisting chances by up to 60%.</p>
                            </div>
                            <Button
                                onClick={() => navigate('/student/profile')}
                                className="w-full bg-white text-background hover:bg-white/90 font-black text-xs uppercase tracking-[0.2em] h-14 rounded-2xl shadow-xl active:scale-95 transition-all"
                            >
                                Optimize Profile
                            </Button>
                        </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <div
                            onClick={() => navigate('/student/applications')}
                            className="p-6 rounded-3xl bg-surface/40 border border-white/5 hover:border-white/20 transition-all cursor-pointer group/card active:scale-[0.98]"
                        >
                            <FileText className="w-7 h-7 text-text-muted mb-4 group-hover/card:text-secondary group-hover/card:scale-110 transition-all" />
                            <p className="font-bold text-white mb-1">Track Apps</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-text-muted">Live Updates</p>
                        </div>
                        <div
                            onClick={() => navigate('/student/results')}
                            className="p-6 rounded-3xl bg-surface/40 border border-white/5 hover:border-white/20 transition-all cursor-pointer group/card active:scale-[0.98]"
                        >
                            <Star className="w-7 h-7 text-text-muted mb-4 group-hover/card:text-success group-hover/card:scale-110 transition-all" />
                            <p className="font-bold text-white mb-1">View Results</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-text-muted">Final Outcomes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
