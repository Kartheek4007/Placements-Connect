import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Building, Plus, Search, Trash2, Loader2, Link as LinkIcon } from 'lucide-react';
import api from '../../lib/api';

interface Company {
    id: string;
    name: string;
    description: string;
    application_link?: string;
    created_at: string;
}

export default function AdminCompanies() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [isAdding, setIsAdding] = useState(false);
    const [newCompany, setNewCompany] = useState({
        name: '',
        description: '',
        application_link: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCompanies = async () => {
        try {
            const res = await api.get('/companies/');
            setCompanies(res.data);
        } catch (error) {
            console.error('Failed to fetch companies', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleAddCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/companies/', newCompany);
            setNewCompany({ name: '', description: '', application_link: '' });
            setIsAdding(false);
            fetchCompanies();
        } catch (error) {
            console.error('Failed to add company', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCompany = async (id: string) => {
        if (!confirm('Are you sure you want to remove this company?')) return;
        try {
            await api.delete(`/companies/${id}`);
            fetchCompanies();
        } catch (error) {
            console.error('Failed to delete company', error);
        }
    };

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (company.description && company.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 selection:bg-primary/30">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-white mb-1">Corporate <span className="text-primary">Partners</span></h2>
                    <p className="text-text-secondary text-sm font-medium">Manage and onboard partnering organizations.</p>
                </div>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} className="bg-primary hover:bg-primary-hover text-white rounded-xl px-5 h-11 font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all text-xs uppercase tracking-wider">
                        <Plus className="w-4 h-4 mr-2" />
                        Onboard Partner
                    </Button>
                )}
            </div>

            {/* Add Company Form */}
            {isAdding && (
                <Card className="border-white/5 bg-surface/30 backdrop-blur-xl rounded-2xl overflow-hidden relative shadow-xl">
                    <CardHeader className="p-6 pb-2 relative z-10">
                        <CardTitle className="text-lg font-bold text-white">System Integration</CardTitle>
                        <CardDescription className="text-xs text-text-muted font-medium">Initialize a new corporate profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-4 relative z-10">
                        <form onSubmit={handleAddCompany} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Organization Name</label>
                                    <Input
                                        placeholder="e.g. Google Cloud"
                                        value={newCompany.name}
                                        onChange={e => setNewCompany({ ...newCompany, name: e.target.value })}
                                        className="h-11 rounded-xl bg-surface/50 border-white/5 px-4 focus:ring-primary/10 font-bold text-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Career Portal</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
                                        <Input
                                            placeholder="https://careers.example.com"
                                            value={newCompany.application_link}
                                            onChange={e => setNewCompany({ ...newCompany, application_link: e.target.value })}
                                            className="h-11 rounded-xl bg-surface/50 border-white/5 pl-11 pr-4 focus:ring-primary/10 font-bold text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Overview</label>
                                    <textarea
                                        placeholder="Concise description..."
                                        className="flex min-h-[80px] w-full rounded-xl border border-white/5 bg-surface/50 px-4 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold resize-none"
                                        value={newCompany.description}
                                        onChange={e => setNewCompany({ ...newCompany, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="rounded-xl px-6 h-10 text-xs font-bold border-white/10 hover:bg-white/5">
                                    Discard
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="bg-white text-background hover:bg-white/90 rounded-xl px-8 h-10 text-xs font-bold uppercase tracking-widest active:scale-95 transition-all">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Confirm
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Controls */}
            <div className="relative max-w-lg group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-primary transition-all" />
                <Input
                    placeholder="Search directory..."
                    className="h-12 pl-11 pr-4 bg-surface/30 border-white/5 rounded-2xl focus:ring-primary/10 text-sm placeholder:text-text-muted shadow-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Registry Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-text-muted font-black uppercase tracking-[0.3em] text-[8px]">Syncing Database</p>
                </div>
            ) : filteredCompanies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-surface/10 rounded-[40px] border border-dashed border-white/5">
                    <Building className="w-10 h-10 text-white/5 mb-4" />
                    <h3 className="text-xl font-black text-white mb-2">Silent Directory</h3>
                    <p className="text-text-muted text-sm max-w-xs text-center font-medium">No partner profiles match your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    {filteredCompanies.map((company) => (
                        <Card key={company.id} className="group hover:bg-surface/40 hover:-translate-y-1 transition-all duration-500 border-white/5 bg-surface/20 rounded-3xl overflow-hidden relative flex flex-col shadow-xl">
                            <CardHeader className="p-6 pb-4 relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <Building className="w-5 h-5 text-primary" />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                                        onClick={() => handleDeleteCompany(company.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-lg font-black tracking-tight text-white leading-tight line-clamp-1">{company.name}</CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-text-muted mt-1">
                                    {new Date(company.created_at).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 flex-1 relative z-10 flex flex-col">
                                <p className="text-text-muted font-medium leading-relaxed line-clamp-2 mb-6 text-xs">
                                    {company.description || "Partnered for specialized recruitment initiatives."}
                                </p>
                                {company.application_link && (
                                    <div className="mt-auto">
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-primary/60 bg-primary/5 p-3 rounded-xl border border-primary/10 transition-all hover:bg-primary/10 cursor-pointer overflow-hidden" onClick={() => window.open(company.application_link, '_blank')}>
                                            <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate">{company.application_link.replace('https://', '')}</span>
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
