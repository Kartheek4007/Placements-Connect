import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Briefcase, Plus, Search, Trash2, Loader2, Calendar, MapPin, DollarSign, Link as LinkIcon } from 'lucide-react';
import api from '../../lib/api';

interface Company {
    id: string;
    name: string;
    application_link?: string;
}

interface Drive {
    id: string;
    company_id: string;
    role: string;
    ctc: string;
    location: string;
    eligibility_cgpa: number;
    deadline: string;
    status: string;
    application_link?: string;
    created_at: string;
    company: Company;
}

export default function AdminDrives() {
    const [drives, setDrives] = useState<Drive[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        company_id: '',
        role: '',
        ctc: '',
        location: '',
        eligibility_cgpa: '',
        deadline: '',
        status: 'Active',
        application_link: ''
    });

    const fetchData = async () => {
        try {
            const [drivesRes, companiesRes] = await Promise.all([
                api.get('/drives/'),
                api.get('/companies/')
            ]);
            setDrives(drivesRes.data);
            setCompanies(companiesRes.data);
            if (companiesRes.data.length > 0 && !formData.company_id) {
                const firstCompany = companiesRes.data[0];
                setFormData(prev => ({
                    ...prev,
                    company_id: firstCompany.id,
                    application_link: prev.application_link || firstCompany.application_link || ''
                }));
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Effect to pre-fill link when company changes
    useEffect(() => {
        if (formData.company_id) {
            const selected = companies.find(c => c.id === formData.company_id);
            if (selected && selected.application_link && !formData.application_link) {
                setFormData(prev => ({ ...prev, application_link: selected.application_link || '' }));
            }
        }
    }, [formData.company_id, companies]);

    const handleAddDrive = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                eligibility_cgpa: parseFloat(formData.eligibility_cgpa),
                deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
            };
            await api.post('/drives/', payload);
            setFormData({
                company_id: companies[0]?.id || '',
                role: '',
                ctc: '',
                location: '',
                eligibility_cgpa: '',
                deadline: '',
                status: 'Active',
                application_link: companies[0]?.application_link || ''
            });
            setIsAdding(false);
            fetchData();
        } catch (error) {
            console.error('Failed to add drive', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleStatus = async (drive: Drive) => {
        const newStatus = drive.status === 'Active' ? 'Closed' : 'Active';
        try {
            await api.patch(`/drives/${drive.id}`, { status: newStatus });
            setDrives(prev => prev.map(d => d.id === drive.id ? { ...d, status: newStatus } : d));
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status');
        }
    };

    const handleDeleteDrive = async (id: string) => {
        if (!confirm('Are you sure you want to remove this placement drive?')) return;
        try {
            await api.delete(`/drives/${id}`);
            fetchData();
        } catch (error) {
            console.error('Failed to delete drive', error);
        }
    };

    const filteredDrives = drives.filter(drive =>
        drive.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 selection:bg-primary/30">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-white mb-1">Drive <span className="text-primary">Registry</span></h2>
                    <p className="text-text-secondary text-sm font-medium">Schedule and oversee active recruitment windows.</p>
                </div>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} className="bg-primary hover:bg-primary-hover text-white rounded-xl px-5 h-11 font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all text-xs uppercase tracking-wider">
                        <Plus className="w-4 h-4 mr-2" />
                        Initialize Drive
                    </Button>
                )}
            </div>

            {/* Add Drive Form */}
            {isAdding && (
                <Card className="border-white/5 bg-surface/30 backdrop-blur-xl rounded-2xl overflow-hidden relative shadow-xl">
                    <CardHeader className="p-6 pb-2 relative z-10">
                        <CardTitle className="text-lg font-bold text-white">Drive Configuration</CardTitle>
                        <CardDescription className="text-xs text-text-muted font-medium">Define a new placement opportunity for students.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-4 relative z-10">
                        <form onSubmit={handleAddDrive} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Corporate Partner</label>
                                    <select
                                        className="flex h-11 w-full rounded-xl border border-white/5 bg-surface/50 px-4 py-2 text-sm text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer outline-none font-bold"
                                        value={formData.company_id}
                                        onChange={e => setFormData({ ...formData, company_id: e.target.value })}
                                        required
                                    >
                                        <option value="" disabled>Select a Company</option>
                                        {companies.map(c => (
                                            <option key={c.id} value={c.id} className="bg-background text-white">{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Professional Role</label>
                                    <Input
                                        placeholder="e.g. SDE - I"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="h-11 rounded-xl bg-surface/50 border-white/5 px-4 focus:ring-primary/10 font-bold text-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Package (LPA)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
                                        <Input
                                            placeholder="e.g. 12.0"
                                            value={formData.ctc}
                                            onChange={e => setFormData({ ...formData, ctc: e.target.value })}
                                            className="h-11 rounded-xl bg-surface/50 border-white/5 pl-11 pr-4 focus:ring-primary/10 font-bold text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Deployment Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                                        <Input
                                            placeholder="e.g. Remote"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            className="h-11 rounded-xl bg-surface/50 border-white/5 pl-11 pr-4 focus:ring-primary/10 font-bold text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Min. CGPA</label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        placeholder="7.5"
                                        value={formData.eligibility_cgpa}
                                        onChange={e => setFormData({ ...formData, eligibility_cgpa: e.target.value })}
                                        className="h-11 rounded-xl bg-surface/50 border-white/5 px-4 focus:ring-primary/10 font-bold text-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Closing Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                                        <Input
                                            type="date"
                                            value={formData.deadline}
                                            onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                                            className="h-11 rounded-xl bg-surface/50 border-white/5 pl-11 pr-4 focus:ring-primary/10 [color-scheme:dark] font-bold text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="lg:col-span-3 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">External Application Portal</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
                                        <Input
                                            placeholder="https://career.portal.com/apply"
                                            value={formData.application_link}
                                            onChange={e => setFormData({ ...formData, application_link: e.target.value })}
                                            className="h-11 rounded-xl bg-surface/50 border-white/5 pl-11 pr-4 focus:ring-primary/10 font-bold text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="rounded-xl px-6 h-10 text-xs font-bold border-white/10 hover:bg-white/5">
                                    Discard
                                </Button>
                                <Button type="submit" disabled={isSubmitting || companies.length === 0} className="bg-white text-background hover:bg-white/90 rounded-xl px-8 h-10 text-xs font-bold uppercase tracking-widest active:scale-95 transition-all">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Publish
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full max-w-lg group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search roles or partners..."
                        className="h-12 pl-11 pr-4 bg-surface/30 border-white/5 rounded-xl focus:ring-primary/10 text-sm placeholder:text-text-muted shadow-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">
                    {filteredDrives.length} Registry Entries
                </div>
            </div>

            {/* Drives List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-text-muted font-black uppercase tracking-[0.3em] text-[8px]">Syncing Registry</p>
                </div>
            ) : filteredDrives.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-surface/10 rounded-[40px] border border-dashed border-white/5">
                    <Briefcase className="w-10 h-10 text-white/5 mb-4" />
                    <h3 className="text-xl font-black text-white mb-2">Registry Inactive</h3>
                    <p className="text-text-muted text-sm max-w-xs text-center font-medium">Initialize a new drive to populate the database.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                    {filteredDrives.map((drive) => (
                        <Card key={drive.id} className="group hover:bg-surface/40 hover:-translate-y-1 transition-all duration-500 border-white/5 bg-surface/20 rounded-3xl overflow-hidden relative shadow-xl border-l-4" style={{
                            borderLeftColor: drive.status === 'Active' ? 'var(--color-primary)' : 'var(--color-text-muted)'
                        }}>
                            <CardHeader className="p-6 pb-2 relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-text-muted group-hover:text-primary transition-colors">
                                        {drive.company.name}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(drive)}
                                            className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95 ${drive.status === 'Active'
                                                ? 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                                                : 'bg-white/5 text-text-muted border-white/10'
                                                }`}
                                        >
                                            {drive.status}
                                        </button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                                            onClick={() => handleDeleteDrive(drive.id)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                                <CardTitle className="text-xl font-black tracking-tight text-white leading-tight">
                                    {drive.role}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-6 pt-4 relative z-10 grid grid-cols-2 gap-x-6 gap-y-4">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Package</p>
                                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                                        <DollarSign className="w-3.5 h-3.5 text-primary" />
                                        {drive.ctc || 'Neg'} <span className="text-[8px] opacity-40">LPA</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Location</p>
                                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                                        <MapPin className="w-3.5 h-3.5 text-secondary" />
                                        <span className="truncate">{drive.location || 'Remote'}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Threshold</p>
                                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                                        <div className="w-3.5 h-3.5 rounded-sm border border-accent flex items-center justify-center text-[7px] font-black text-accent shrink-0">C</div>
                                        <span>{drive.eligibility_cgpa ? `${drive.eligibility_cgpa}+` : 'Open'}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Deadline</p>
                                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                                        <Calendar className="w-3.5 h-3.5 text-success" />
                                        <span>{drive.deadline ? new Date(drive.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'NA'}</span>
                                    </div>
                                </div>

                                {drive.application_link && (
                                    <div className="col-span-2 pt-3 mt-1 border-t border-white/5">
                                        <div className="flex items-center justify-between group/link">
                                            <div className="flex items-center gap-2 text-[8px] font-bold text-text-muted bg-white/5 px-2 py-1 rounded-lg border border-white/5 truncate max-w-[70%]">
                                                <LinkIcon className="w-2.5 h-2.5 shrink-0 text-primary/60" />
                                                <span className="truncate">{drive.application_link.replace('https://', '')}</span>
                                            </div>
                                            <Button variant="ghost" className="h-6 text-[8px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 px-2 rounded-lg" onClick={() => window.open(drive.application_link, '_blank')}>
                                                Verify
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
