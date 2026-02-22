import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { FileText, Loader2, CheckCircle, XCircle, Clock, PlayCircle, Building } from 'lucide-react';
import api from '../../lib/api';

interface Drive {
    role: string;
    company: { name: string };
}

interface Application {
    id: string;
    status: string;
    applied_at: string;
    drive: Drive;
}

export default function StudentApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get('/applications/my-applications');
                setApplications(res.data);
            } catch (error) {
                console.error('Failed to fetch applications', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Selected': return { color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', icon: CheckCircle };
            case 'Rejected': return { color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20', icon: XCircle };
            case 'Shortlisted': return { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', icon: PlayCircle };
            default: return { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', icon: Clock };
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 selection:bg-primary/30">
            {/* Header */}
            <div>
                <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">My <span className="text-primary">Journey</span></h2>
                <p className="text-text-secondary text-lg font-medium">Monitor the real-time status of your recruitment pipelines.</p>
            </div>

            {/* Applications List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 space-y-6">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    <p className="text-text-muted font-black uppercase tracking-[0.4em] text-[10px]">Syncing Application Ledger</p>
                </div>
            ) : applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 bg-surface/10 rounded-[60px] border border-dashed border-white/5">
                    <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mb-8">
                        <FileText className="w-12 h-12 text-white/5" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-3">No Trackers Active</h3>
                    <p className="text-text-muted max-w-sm text-center font-medium leading-relaxed">You haven't initiated any applications yet. Explore available opportunities to begin.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
                    {applications.map((app) => {
                        const statusConfig = getStatusConfig(app.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                            <Card key={app.id} className="group hover:bg-surface/40 hover:-translate-y-2 transition-all duration-700 border-white/5 bg-surface/20 rounded-[40px] overflow-hidden relative flex flex-col pt-2 shadow-2xl">
                                {/* Status Glow */}
                                <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${app.status === 'Selected' ? 'bg-success/20' :
                                    app.status === 'Rejected' ? 'bg-danger/20' :
                                        'bg-primary/20'
                                    }`}></div>

                                <CardContent className="p-10 flex flex-col h-full relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-700">
                                            <Building className="w-7 h-7 text-primary" />
                                        </div>
                                        <div className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border backdrop-blur-md flex items-center gap-3 transition-all ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            {app.status}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-3xl font-black tracking-tight text-white mb-2 line-clamp-2 leading-tight">
                                            {app.drive?.role || 'Professional Role'}
                                        </h3>
                                        <p className="text-text-muted font-bold text-lg mb-8">
                                            {app.drive?.company?.name || 'Corporate Partner'}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-text-muted" />
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                                                Initiated {new Date(app.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
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
