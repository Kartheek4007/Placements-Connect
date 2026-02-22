import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Loader2, User as UserIcon, Upload, CheckCircle, ExternalLink, GraduationCap, Briefcase } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface StudentProfile {
    reg_number: string;
    department: string;
    year: string;
    cgpa: number;
    resume_url: string | null;
}

export default function StudentProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState({
        reg_number: '',
        department: '',
        year: '',
        cgpa: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/me');
                if (res.data.profile) {
                    setProfile(res.data.profile);
                    setFormData({
                        reg_number: res.data.profile.reg_number,
                        department: res.data.profile.department,
                        year: res.data.profile.year,
                        cgpa: res.data.profile.cgpa.toString(),
                    });
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                cgpa: parseFloat(formData.cgpa)
            };
            const res = await api.put('/users/me/profile', payload);
            setProfile(res.data);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error('Failed to update profile', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await api.post('/files/resume', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Update profile with new resume URL
            setProfile(prev => prev ? { ...prev, resume_url: res.data.file_url } : null);
            alert("Resume uploaded successfully!");
        } catch (error) {
            console.error('Failed to upload resume', error);
            alert("Failed to upload resume.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-1">My Profile</h2>
                <p className="text-text-secondary">Manage your academic details and resume to stand out.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Basic Info & Resume */}
                <div className="md:col-span-1 space-y-6">
                    {/* User Card */}
                    <Card className="border-white/10 bg-surface/50 text-center overflow-hidden">
                        <div className="h-24 bg-gradient-to-br from-primary/40 to-secondary/40" />
                        <CardContent className="px-6 pb-6 pt-0 relative">
                            <div className="w-20 h-20 mx-auto rounded-full bg-surface border-4 border-[#0F172A] flex items-center justify-center -mt-10 mb-3 shadow-xl">
                                <UserIcon className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-white line-clamp-1">{user?.name}</h3>
                            <p className="text-sm text-text-secondary line-clamp-1">{user?.email}</p>
                            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                                <span className="px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary">
                                    Student Account
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Resume Card */}
                    <Card className="border-white/10 bg-surface/50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-primary" />
                                My Resume
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {profile?.resume_url ? (
                                <div className="p-3 border border-success/20 bg-success/5 rounded-xl flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center text-success shrink-0">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-white truncate">resume.pdf</p>
                                        <p className="text-xs text-text-secondary">Uploaded Successfully</p>
                                    </div>
                                    <a href={profile.resume_url} target="_blank" rel="noreferrer" className="text-primary hover:text-white transition-colors shrink-0">
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                </div>
                            ) : (
                                <div className="text-center py-6 border border-dashed border-white/20 rounded-xl bg-surface/30 px-4">
                                    <p className="text-sm text-text-secondary mb-3">No resume uploaded yet.</p>
                                </div>
                            )}

                            <div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".pdf"
                                    onChange={handleFileUpload}
                                />
                                <Button
                                    variant={profile?.resume_url ? "outline" : "default"}
                                    className="w-full gap-2"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                >
                                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                    {profile?.resume_url ? 'Upload New Resume' : 'Upload Resume'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Academic Details Form */}
                <div className="md:col-span-2">
                    <Card className="border-white/10 bg-surface/50 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <GraduationCap className="w-6 h-6 text-primary" />
                                Academic Information
                            </CardTitle>
                            <CardDescription>
                                Accurately fill your details to ensure eligibility for placement drives.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSave} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-secondary">Registration Number</label>
                                        <Input
                                            name="reg_number"
                                            placeholder="e.g. 21BCE1234"
                                            value={formData.reg_number}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-secondary">Current CGPA</label>
                                        <Input
                                            name="cgpa"
                                            type="number"
                                            step="0.01"
                                            placeholder="e.g. 8.5"
                                            value={formData.cgpa}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-secondary">Department</label>
                                        <Input
                                            name="department"
                                            placeholder="e.g. Computer Science"
                                            value={formData.department}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-secondary">Graduation Year</label>
                                        <Input
                                            name="year"
                                            placeholder="e.g. 2025"
                                            value={formData.year}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex justify-end">
                                    <Button type="submit" disabled={isSaving} className="min-w-[150px]">
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        Save Profile
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
