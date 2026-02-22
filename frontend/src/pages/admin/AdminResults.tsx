import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { FileCheck, Loader2, Download, FileSpreadsheet, FileText, Upload, X } from 'lucide-react';
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

export default function AdminResults() {
    const [results, setResults] = useState<Result[]>([]);
    const [drives, setDrives] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [newResult, setNewResult] = useState({
        drive_id: '',
        title: '',
        file_url: ''
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [resultsRes, drivesRes] = await Promise.all([
                api.get('/applications/results/all'),
                api.get('/drives/')
            ]);
            setResults(resultsRes.data);
            setDrives(drivesRes.data);
        } catch (err) {
            console.error("Failed to load results data", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingFile(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/files/upload/result', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setNewResult(prev => ({ ...prev, file_url: res.data.url }));
            if (!newResult.title) {
                // Auto-fill title with filename without extension
                const fileName = file.name.split('.').slice(0, -1).join('.');
                setNewResult(prev => ({ ...prev, title: fileName }));
            }
        } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to upload file. Please try again.");
        } finally {
            setUploadingFile(false);
        }
    };

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newResult.drive_id || !newResult.title || !newResult.file_url) {
            alert("Please select a drive, give a title, and provide a file/link.");
            return;
        }

        setIsPosting(true);
        try {
            await api.post('/applications/results', newResult);
            alert("Result published successfully!");
            setNewResult({ drive_id: '', title: '', file_url: '' });
            fetchData(); // Refresh list
        } catch (err) {
            console.error("Failed to post result", err);
            alert("Failed to publish result. Ensure all data is valid.");
        } finally {
            setIsPosting(false);
        }
    };

    const isExcel = (url: string) => url.toLowerCase().includes('.xls') || url.toLowerCase().includes('.xlsx') || url.toLowerCase().includes('sheet');

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 selection:bg-secondary/30">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black tracking-tight text-white mb-1">Final <span className="text-secondary italic">Outcomes</span></h2>
                <p className="text-text-secondary text-sm font-medium">Broadcast and preserve official selection lists for placement initiatives.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Post Result Form */}
                <Card className="lg:col-span-1 border-white/5 bg-surface/30 backdrop-blur-xl rounded-2xl h-fit overflow-hidden relative shadow-xl">
                    <CardHeader className="p-6 pb-2 relative z-10">
                        <CardTitle className="text-lg font-bold text-white">Publish Bulletin</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-4 relative z-10">
                        <form onSubmit={handlePost} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Deployment Context</label>
                                <select
                                    className="w-full h-11 bg-surface/50 border border-white/5 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all appearance-none font-bold"
                                    value={newResult.drive_id}
                                    onChange={(e) => setNewResult({ ...newResult, drive_id: e.target.value })}
                                >
                                    <option value="" className="bg-background">Select Drive...</option>
                                    {drives.map(drive => (
                                        <option key={drive.id} value={drive.id} className="bg-background text-white text-xs">
                                            {drive.company.name} — {drive.role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Document Title</label>
                                <Input
                                    placeholder="e.g. Master List v1"
                                    value={newResult.title}
                                    onChange={(e) => setNewResult({ ...newResult, title: e.target.value })}
                                    className="h-11 rounded-xl bg-surface/50 border-white/5 px-4 focus:ring-secondary/10 font-bold text-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Selection Logic (File/URL)</label>
                                {!newResult.file_url ? (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-secondary/30 hover:bg-secondary/5 transition-all group/upload bg-white/[0.02]"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover/upload:scale-105 group-hover/upload:bg-secondary/10 transition-all">
                                            {uploadingFile ? (
                                                <Loader2 className="w-5 h-5 animate-spin text-secondary" />
                                            ) : (
                                                <Upload className="w-5 h-5 text-text-muted group-hover/upload:text-secondary transition-colors" />
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white">Upload Dossier</p>
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            accept=".pdf,.xls,.xlsx"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/10 border border-secondary/20 text-white">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                {isExcel(newResult.file_url) ? <FileSpreadsheet className="w-4 h-4 text-success" /> : <FileText className="w-4 h-4 text-secondary" />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[8px] font-black uppercase tracking-widest text-secondary truncate">Asset Locked</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setNewResult(prev => ({ ...prev, file_url: '' }))}
                                            className="p-1.5 rounded-lg hover:bg-secondary/20 transition-colors text-secondary"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                <div className="relative py-1 flex items-center gap-2">
                                    <div className="flex-1 h-px bg-white/5"></div>
                                    <span className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em] whitespace-nowrap">OR USE LINK</span>
                                    <div className="flex-1 h-px bg-white/5"></div>
                                </div>
                                <div className="relative group/input">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted group-focus-within/input:text-secondary transition-all">
                                        <FileText className="w-3.5 h-3.5" />
                                    </div>
                                    <Input
                                        placeholder="Cloud Asset URI"
                                        value={newResult.file_url}
                                        onChange={(e) => setNewResult({ ...newResult, file_url: e.target.value })}
                                        className="h-11 rounded-xl bg-surface/50 border-white/5 pl-11 pr-4 focus:ring-secondary/10 font-bold text-xs"
                                    />
                                </div>
                            </div>

                            <Button className="w-full h-11 rounded-xl bg-secondary text-white hover:bg-secondary-hover font-black uppercase tracking-widest text-[10px] shadow-lg shadow-secondary/10 active:scale-95 transition-all mt-2" disabled={isPosting || uploadingFile}>
                                {isPosting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileCheck className="w-4 h-4 mr-2" />}
                                Broadcast
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Results List */}
                <Card className="lg:col-span-2 border-white/5 bg-surface/30 backdrop-blur-xl rounded-2xl overflow-hidden relative shadow-xl flex flex-col">
                    <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between relative z-10 border-b border-white/5">
                        <CardTitle className="text-lg font-bold text-white">Archives <span className="text-secondary opacity-30 tracking-[0.2em] ml-2 text-xs">REGISTRY</span></CardTitle>
                        <Button variant="ghost" size="sm" onClick={fetchData} className="h-9 px-4 rounded-xl border border-white/5 text-[9px] font-black uppercase tracking-widest text-text-muted hover:bg-white/5">
                            Refresh
                        </Button>
                    </CardHeader>
                    <CardContent className="p-6 relative z-10 flex-1">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-3">
                                <Loader2 className="w-10 h-10 text-secondary animate-spin" />
                                <p className="text-text-muted font-black uppercase tracking-[0.3em] text-[8px]">Syncing Records</p>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <FileText className="w-8 h-8 text-white/5 mb-4" />
                                <p className="text-text-muted font-black uppercase tracking-widest text-[10px]">Registry Empty</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {results.map(result => (
                                    <div key={result.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-secondary/20 transition-all duration-300 relative overflow-hidden">
                                        <div className="flex items-center gap-4 relative z-10 flex-1 min-w-0">
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${isExcel(result.file_url) ? 'bg-success/10 text-success' : 'bg-secondary/10 text-secondary'} group-hover:scale-105 transition-transform`}>
                                                {isExcel(result.file_url) ? <FileSpreadsheet className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-black text-white mb-1 truncate group-hover:text-secondary transition-colors">{result.title}</h4>
                                                <div className="flex items-center gap-2">
                                                    <div className="px-2 py-0.5 rounded-md bg-white/5 text-[8px] font-black uppercase tracking-widest text-text-muted border border-white/5">
                                                        {result.drive?.company?.name || 'Unknown'}
                                                    </div>
                                                    <span className="text-[10px] text-text-secondary truncate font-medium">
                                                        {result.drive?.role || 'Role N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mt-4 sm:mt-0 relative z-10 w-full sm:w-auto border-t sm:border-0 border-white/5 pt-4 sm:pt-0">
                                            <div className="text-right hidden md:block">
                                                <p className="text-[8px] font-black tracking-widest text-text-muted uppercase">Date</p>
                                                <p className="text-[10px] font-black text-white">
                                                    {new Date(result.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <Button
                                                className="h-10 w-10 bg-white text-background hover:bg-secondary hover:text-white rounded-xl active:scale-90 transition-all shadow-md group/btn ml-auto sm:ml-0"
                                                onClick={() => window.open(result.file_url, '_blank')}
                                            >
                                                <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
