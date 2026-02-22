import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Briefcase, FileText, Loader2, CheckCircle, XCircle, Clock, PlayCircle } from 'lucide-react';
import api from '../../lib/api';

interface StudentProfile {
    reg_number: string;
    department: string;
    year: string;
    cgpa: number;
    resume_url: string | null;
}

interface Application {
    id: string;
    status: string;
    applied_at: string;
    student: StudentProfile;
}

interface Drive {
    id: string;
    role: string;
    company: { name: string };
}

export default function AdminApplications() {
    const [drives, setDrives] = useState<Drive[]>([]);
    const [selectedDriveId, setSelectedDriveId] = useState<string>('');
    const [applications, setApplications] = useState<Application[]>([]);

    const [isLoadingDrives, setIsLoadingDrives] = useState(true);
    const [isLoadingApps, setIsLoadingApps] = useState(false);
    const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);

    useEffect(() => {
        const fetchDrives = async () => {
            try {
                const res = await api.get('/drives/');
                setDrives(res.data);
                if (res.data.length > 0) {
                    setSelectedDriveId(res.data[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch drives', error);
            } finally {
                setIsLoadingDrives(false);
            }
        };
        fetchDrives();
    }, []);

    useEffect(() => {
        if (!selectedDriveId) return;
        const fetchApplications = async () => {
            setIsLoadingApps(true);
            try {
                const res = await api.get(`/applications/drive/${selectedDriveId}`);
                setApplications(res.data);
            } catch (error) {
                console.error('Failed to fetch applications', error);
            } finally {
                setIsLoadingApps(false);
            }
        };
        fetchApplications();
    }, [selectedDriveId]);

    const handleUpdateStatus = async (appId: string, newStatus: string) => {
        setUpdatingAppId(appId);
        try {
            await api.put(`/applications/${appId}/status?new_status=${newStatus}`);
            // Optimistic update
            setApplications(apps => apps.map(app =>
                app.id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error('Failed to update status', error);
        } finally {
            setUpdatingAppId(null);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Selected': return { color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', icon: CheckCircle };
            case 'Rejected': return { color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20', icon: XCircle };
            case 'Shortlisted': return { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', icon: PlayCircle };
            default: return { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', icon: Clock };
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-white mb-1">Application <span className="text-primary">Pipeline</span></h2>
                    <p className="text-text-secondary text-sm font-medium">Process candidate applications and manage recruitment stages.</p>
                </div>
            </div>

            {/* Selector Card */}
            <Card className="border-white/5 bg-surface/30 backdrop-blur-xl rounded-2xl overflow-hidden relative shadow-xl">
                <CardContent className="p-5 relative z-10">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex items-center gap-3 text-text-muted">
                            <Briefcase className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Active Pipeline:</span>
                        </div>
                        {isLoadingDrives ? (
                            <div className="flex items-center gap-2 px-4 h-11 rounded-xl bg-white/5 border border-white/5">
                                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                <span className="text-[10px] font-bold text-text-muted">Syncing...</span>
                            </div>
                        ) : (
                            <div className="relative w-full md:max-w-xs">
                                <select
                                    className="flex h-11 w-full rounded-xl border border-white/5 bg-surface/50 px-4 py-2 text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer outline-none font-bold"
                                    value={selectedDriveId}
                                    onChange={(e) => setSelectedDriveId(e.target.value)}
                                >
                                    {drives.map(d => (
                                        <option key={d.id} value={d.id} className="bg-background text-white">
                                            {d.company.name} — {d.role}
                                        </option>
                                    ))}
                                    {drives.length === 0 && <option value="" className="bg-background text-white">No active drives</option>}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                    <Clock className="w-3.5 h-3.5 opacity-50" />
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Applications Registry */}
            {isLoadingApps ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-text-muted font-black uppercase tracking-[0.3em] text-[8px]">Filtering Candidates</p>
                </div>
            ) : applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-surface/10 rounded-[40px] border border-dashed border-white/5">
                    <FileText className="w-10 h-10 text-white/5 mb-4" />
                    <h3 className="text-xl font-black text-white mb-2">No Candidates</h3>
                    <p className="text-text-muted text-sm max-w-xs text-center font-medium">Students haven't synchronized applications for this drive yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 pb-20">
                    {applications.map((app) => {
                        const statusConfig = getStatusConfig(app.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                            <Card key={app.id} className="group hover:bg-surface/40 transition-all duration-500 border-white/5 bg-surface/20 rounded-2xl overflow-hidden relative shadow-lg">
                                <CardContent className="p-5 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
                                    <div className="flex-1 min-w-0 space-y-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                <div className="text-sm font-black text-white/20 group-hover:text-primary transition-colors">
                                                    {(app.student?.reg_number || 'U').charAt(0)}
                                                </div>
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-lg font-black text-white truncate tracking-tight mb-1">
                                                    {app.student?.reg_number || 'REG: N/A'}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {app.status}
                                                    </span>
                                                    <span className="text-[8px] font-bold text-text-muted uppercase tracking-widest px-1.5 py-0.5 bg-white/5 rounded-md border border-white/5">
                                                        Applied {new Date(app.applied_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Division</p>
                                                <p className="text-xs text-white font-bold truncate">{app.student?.department || 'General'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Metrics</p>
                                                <p className="text-xs text-white font-bold tabular-nums">{app.student?.cgpa || '0.00'} <span className="text-[7px] opacity-30">CGPA</span></p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Year</p>
                                                <p className="text-xs text-white font-bold">{app.student?.year || 'IV'} Year</p>
                                            </div>
                                            <div className="flex items-center pt-1">
                                                {app.student?.resume_url ? (
                                                    <Button variant="ghost" className="h-8 px-3 rounded-lg text-primary hover:bg-primary/10 text-[8px] font-black uppercase tracking-widest gap-2 border border-primary/5 hover:border-primary/20 transition-all" onClick={() => window.open(app.student.resume_url!, '_blank')}>
                                                        <FileText className="w-3 h-3" />
                                                        Resume
                                                    </Button>
                                                ) : (
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-text-muted/30 italic">No File</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 shrink-0 pt-4 xl:pt-0 border-t xl:border-t-0 xl:border-l border-white/5 xl:pl-6 w-full xl:w-auto">
                                        {updatingAppId === app.id ? (
                                            <div className="flex items-center justify-center w-full xl:w-32">
                                                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 xl:flex items-center gap-2 w-full">
                                                {app.status === 'Applied' && (
                                                    <Button onClick={() => handleUpdateStatus(app.id, 'Shortlisted')} className="h-9 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl font-black uppercase tracking-widest text-[8px] border border-primary/20 transition-all flex-1 xl:px-4">
                                                        Shortlist
                                                    </Button>
                                                )}
                                                {app.status === 'Shortlisted' && (
                                                    <Button onClick={() => handleUpdateStatus(app.id, 'Selected')} className="h-9 bg-success/10 hover:bg-success text-success hover:text-white rounded-xl font-black uppercase tracking-widest text-[8px] border border-success/20 transition-all flex-1 xl:px-5">
                                                        Select
                                                    </Button>
                                                )}
                                                {app.status !== 'Rejected' && (
                                                    <Button variant="ghost" onClick={() => handleUpdateStatus(app.id, 'Rejected')} className="h-9 text-danger hover:bg-danger/10 rounded-xl font-black uppercase tracking-widest text-[8px] transition-all flex-1 xl:px-4">
                                                        Reject
                                                    </Button>
                                                )}
                                                {(app.status === 'Selected' || app.status === 'Rejected') && (
                                                    <Button variant="outline" onClick={() => handleUpdateStatus(app.id, 'Applied')} className="h-9 border-white/10 text-text-muted hover:bg-white/5 rounded-xl font-black uppercase tracking-widest text-[8px] transition-all flex-1 xl:px-4">
                                                        Reset
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
