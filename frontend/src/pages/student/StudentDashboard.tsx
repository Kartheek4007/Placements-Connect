import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Briefcase, Building, FileText, CheckCircle, Star } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
    const { user } = useAuth();
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome, {user?.name.split(' ')[0]} 👋</h1>
                <p className="text-text-secondary">Here is a summary of your placement tracking.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-primary/10 border-primary/20 hover:border-primary/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-text-secondary">
                            Available Drives
                        </CardTitle>
                        <Briefcase className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">{drives.filter((d: any) => d.status === 'Active').length}</div>
                        <p className="text-xs text-text-secondary mt-1">Explore new opportunities</p>
                    </CardContent>
                </Card>

                <Card className="bg-secondary/10 border-secondary/20 hover:border-secondary/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-text-secondary">
                            My Applications
                        </CardTitle>
                        <FileText className="h-4 w-4 text-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">{applications.length}</div>
                        <p className="text-xs text-text-secondary mt-1">Track your progress</p>
                    </CardContent>
                </Card>

                <Card className="bg-success/10 border-success/20 hover:border-success/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-text-secondary">
                            Shortlists
                        </CardTitle>
                        <Star className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">
                            {applications.filter((a: any) => a.status === 'Shortlisted' || a.status === 'Selected').length}
                        </div>
                        <p className="text-xs text-text-secondary mt-1">Keep it up!</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recent Drives</CardTitle>
                    <CardDescription>Latest placement opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {drives.slice(0, 3).length > 0 ? drives.slice(0, 3).map((drive: any) => (
                            <div key={drive.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                        <Building className="h-6 w-6 text-white/70" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">{drive.company?.name || 'Company'}</h4>
                                        <p className="text-sm text-text-secondary">{drive.role} • {drive.location || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex m-auto items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                                        {drive.ctc ? `$${drive.ctc}` : 'CTC Undisclosed'}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-6 text-text-secondary text-sm">No drives available right now</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
