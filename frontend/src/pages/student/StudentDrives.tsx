import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Briefcase, Building, Search, Loader2, Calendar, MapPin, DollarSign, CheckCircle, ExternalLink, Info } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface Company {
    name: string;
}

interface Drive {
    id: string;
    role: string;
    ctc: string;
    location: string;
    eligibility_cgpa: number;
    deadline: string;
    status: string;
    application_link?: string;
    company: Company;
}

interface Application {
    drive_id: string;
    status: string;
}

export default function StudentDrives() {
    const { } = useAuth();
    const [drives, setDrives] = useState<Drive[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [applyingToId, setApplyingToId] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [drivesRes, appsRes] = await Promise.all([
                api.get('/drives/'),
                api.get('/applications/my-applications')
            ]);
            setDrives(drivesRes.data.filter((d: Drive) => d.status === 'Active')); // Only show active drives
            setApplications(appsRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApply = async (driveId: string) => {
        const confirmMsg = "Have you completed the application on the company's portal? Clicking 'Confirm' will mark this drive as 'Applied' in our records.";
        if (!confirm(confirmMsg)) return;

        setApplyingToId(driveId);
        try {
            await api.post('/applications/apply', {
                drive_id: driveId,
                status: 'Applied'
            });
            // Update local state to reflect application
            setApplications(prev => [...prev, { drive_id: driveId, status: 'Applied' }]);
        } catch (error: any) {
            const msg = error.response?.data?.detail || 'Failed to apply';
            alert(msg);
        } finally {
            setApplyingToId(null);
        }
    };

    const isApplied = (driveId: string) => applications.some(app => app.drive_id === driveId);

    const filteredDrives = drives.filter(drive =>
        drive.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 selection:bg-secondary/30">
            {/* Header */}
            <div className="relative overflow-hidden pt-2 pb-6 border-b border-white/5">
                <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/5 blur-[60px] -ml-16 -mt-16"></div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-black tracking-tight text-white mb-1">Prime <span className="text-secondary italic">Opportunities</span></h2>
                    <p className="text-text-secondary text-sm font-medium max-w-2xl">Precision-matched placement drives for your professional journey.</p>
                </div>
            </div>

            {/* Interactions Row */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full max-w-lg group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-secondary transition-all" />
                    <Input
                        placeholder="Search roles or companies..."
                        className="h-11 pl-11 pr-4 bg-surface/30 border-white/5 rounded-xl focus:ring-secondary/10 text-sm placeholder:text-text-muted transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">
                    {filteredDrives.length} Openings
                </div>
            </div>

            {/* Content Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-10 h-10 text-secondary animate-spin" />
                    <p className="text-text-muted font-black uppercase tracking-[0.3em] text-[8px]">Curating Experiences</p>
                </div>
            ) : filteredDrives.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-surface/10 rounded-[40px] border border-dashed border-white/5">
                    <Briefcase className="w-10 h-10 text-white/5 mb-4" />
                    <h3 className="text-xl font-black text-white mb-2">Quiet Performance</h3>
                    <p className="text-text-muted text-sm max-w-xs text-center font-medium">Adjust your search or check back shortly.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    {filteredDrives.map((drive) => {
                        const applied = isApplied(drive.id);

                        return (
                            <Card key={drive.id} className="group hover:bg-surface/40 hover:-translate-y-1 transition-all duration-500 border-white/5 bg-surface/20 rounded-3xl overflow-hidden relative shadow-xl border-t-2 border-t-transparent hover:border-t-secondary/30">
                                <CardHeader className="p-6 pb-2 relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-text-muted group-hover:text-secondary transition-colors">
                                            {drive.company.name}
                                        </div>
                                        <div className="w-7 h-7 rounded-lg bg-surface-soft border border-white/5 flex items-center justify-center shadow-inner group-hover:bg-secondary/10 transition-colors">
                                            <Building className="h-3.5 w-3.5 text-text-muted group-hover:text-secondary" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl font-black tracking-tight text-white leading-tight">
                                        {drive.role}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="p-6 pt-4 relative z-10 flex flex-col flex-1">
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Package</p>
                                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                                <DollarSign className="w-4 h-4 text-secondary" />
                                                {drive.ctc || 'Neg'} <span className="text-[8px] opacity-40 uppercase">LPA</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Location</p>
                                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                                <MapPin className="w-4 h-4 text-primary" />
                                                <span className="truncate">{drive.location || 'Remote'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Academic</p>
                                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                                <div className="w-4 h-4 rounded-sm border border-accent flex items-center justify-center text-[8px] font-black text-accent shrink-0">C</div>
                                                <span>{drive.eligibility_cgpa ? `${drive.eligibility_cgpa}+` : 'Open'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Closing</p>
                                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                                <Calendar className="w-4 h-4 text-success" />
                                                <span>
                                                    {drive.deadline ? new Date(drive.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'ASAP'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-white/5">
                                        {applied ? (
                                            <Button variant="ghost" className="w-full h-10 rounded-xl bg-success/10 text-success font-black uppercase tracking-widest text-[9px] cursor-default gap-2 border border-success/20" disabled>
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                Application Recorded
                                            </Button>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                {drive.application_link ? (
                                                    <Button
                                                        className="h-10 rounded-xl bg-white text-background hover:bg-white/90 font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg active:scale-95 transition-all w-full"
                                                        onClick={() => window.open(drive.application_link, '_blank')}
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        Apply on Portal
                                                    </Button>
                                                ) : (
                                                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 text-[9px] font-bold text-text-muted">
                                                        <Info className="w-4 h-4 text-primary shrink-0 opacity-40" />
                                                        Access pending. Monitor inbox.
                                                    </div>
                                                )}

                                                <Button
                                                    variant="ghost"
                                                    className="h-10 rounded-xl border border-white/5 text-white hover:bg-white/5 font-black uppercase tracking-widest text-[9px] active:scale-95 transition-all w-full disabled:opacity-50"
                                                    onClick={() => handleApply(drive.id)}
                                                    disabled={applyingToId === drive.id}
                                                >
                                                    {applyingToId === drive.id ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-secondary" />
                                                    ) : (
                                                        "Mark as Applied"
                                                    )}
                                                </Button>
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
