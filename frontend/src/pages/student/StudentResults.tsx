import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FileText, FileSpreadsheet, Download, Building, Info, Loader2 } from 'lucide-react';
import api from '../../lib/api';

interface Result {
    id: string;
    title: string;
    file_url: string;
    drive: {
        role: string;
        company: { name: string };
    };
    published_at: string;
}

export default function StudentResults() {
    const [results, setResults] = useState<Result[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await api.get('/applications/results/all');
                setResults(res.data);
            } catch (err) {
                console.error("Failed to load results", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, []);

    const isExcel = (url: string) => url.toLowerCase().includes('.xls') || url.toLowerCase().includes('.xlsx') || url.toLowerCase().includes('sheet');

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 selection:bg-secondary/30">
            {/* Header */}
            <div>
                <h2 className="text-5xl font-black tracking-tight text-white mb-3">Placement <span className="text-secondary italic">Outcomes</span></h2>
                <p className="text-text-secondary text-xl font-medium max-w-2xl leading-relaxed">Access official selection lists and final recruitment bulletins.</p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 space-y-6">
                    <Loader2 className="w-16 h-16 text-secondary animate-spin" />
                    <p className="text-text-muted font-black uppercase tracking-[0.4em] text-[10px]">Retrieving Official Records</p>
                </div>
            ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 bg-surface/10 rounded-[60px] border border-dashed border-white/5">
                    <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mb-8">
                        <Info className="w-12 h-12 text-white/5" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-3">Awaiting Broadcast</h3>
                    <p className="text-text-muted max-w-md text-center font-medium leading-relaxed">No results have been published in the ledger yet. Notifications will trigger upon publication.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                    {results.map((result) => (
                        <Card key={result.id} className="group hover:bg-surface/40 hover:-translate-y-2 transition-all duration-700 border-white/5 bg-surface/20 rounded-[40px] overflow-hidden relative flex flex-col pt-1 shadow-2xl">
                            {/* Category Glow */}
                            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isExcel(result.file_url) ? 'bg-success/20' : 'bg-secondary/20'}`}></div>

                            <CardContent className="p-10 flex flex-col h-full relative z-10">
                                <div className="flex items-start justify-between mb-8">
                                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 border border-white/5 shadow-inner transition-transform duration-700 group-hover:scale-110 ${isExcel(result.file_url) ? 'bg-success/10 text-success' : 'bg-secondary/10 text-secondary'}`}>
                                        {isExcel(result.file_url) ? <FileSpreadsheet className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="h-14 px-6 rounded-2xl bg-white/5 text-xs font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all active:scale-95 flex items-center gap-3 border border-white/5"
                                        onClick={() => window.open(result.file_url, '_blank')}
                                    >
                                        <Download className="w-4 h-4" />
                                        Access
                                    </Button>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-3xl font-black tracking-tight text-white mb-2 line-clamp-2 leading-tight group-hover:text-secondary transition-colors">
                                        {result.title}
                                    </h3>
                                    <div className="space-y-2 mb-8">
                                        <div className="flex items-center gap-3 text-text-muted">
                                            <Building className="w-4 h-4" />
                                            <span className="font-bold text-sm tracking-tight">{result.drive?.company?.name || 'Academic Partner'}</span>
                                        </div>
                                        <div className="text-secondary text-xs font-black uppercase tracking-[0.2em]">
                                            {result.drive?.role || 'Specialized Role'}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Authenticated</span>
                                        <span className="text-xs font-bold text-white">
                                            {new Date(result.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-text-muted">
                                        Official
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
