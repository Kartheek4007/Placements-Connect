import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Building, Briefcase, FileText, CheckCircle, Clock } from 'lucide-react';
import api from '../../lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalCompanies: 0,
        activeDrives: 0,
        totalApplications: 0,
        recentlyApplied: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [companiesRes, drivesRes] = await Promise.all([
                    api.get('/companies'),
                    api.get('/drives')
                ]);

                setStats(prev => ({
                    ...prev,
                    totalCompanies: companiesRes.data.length,
                    activeDrives: drivesRes.data.filter((d: any) => d.status === 'Active').length
                }));
            } catch (err) {
                console.error("Failed to load stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Admin Overview</h1>
                <p className="text-text-secondary">Manage and monitor placement activities across the campus.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-primary/10 border-primary/20 hover:border-primary/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-text-secondary">
                            Total Companies
                        </CardTitle>
                        <Building className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">{stats.totalCompanies}</div>
                        <p className="text-xs text-text-secondary mt-1">Registered partners</p>
                    </CardContent>
                </Card>

                <Card className="bg-secondary/10 border-secondary/20 hover:border-secondary/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-text-secondary">
                            Active Drives
                        </CardTitle>
                        <Briefcase className="h-4 w-4 text-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">{stats.activeDrives}</div>
                        <p className="text-xs text-text-secondary mt-1">Currently open</p>
                    </CardContent>
                </Card>

                <Card className="bg-success/10 border-success/20 hover:border-success/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-text-secondary">
                            Total Applications
                        </CardTitle>
                        <FileText className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">---</div>
                        <p className="text-xs text-text-secondary mt-1">Across all drives</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 hover:border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-text-secondary">
                            Placed Students
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-white" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">---</div>
                        <p className="text-xs text-text-secondary mt-1">Selected candidates</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Drives</CardTitle>
                        <CardDescription>Latest placement drives added to the system</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Clock className="h-8 w-8 text-text-secondary mb-3 opacity-50" />
                            <p className="text-sm text-text-secondary">Navigate to Manage Drives to see details</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Applications</CardTitle>
                        <CardDescription>Latest student applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <FileText className="h-8 w-8 text-text-secondary mb-3 opacity-50" />
                            <p className="text-sm text-text-secondary">Data visualization coming soon</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
