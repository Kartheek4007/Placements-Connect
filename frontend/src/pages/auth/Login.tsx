import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Lock, Mail, Loader2 } from 'lucide-react';
import api from '../../lib/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const res = await api.post('/auth/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            login(res.data.access_token, res.data.user);

            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/student');
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background selection:bg-primary/30">
            {/* Structured Branding Side (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden border-r border-white/5 bg-surface/20">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12 group cursor-default">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-110 transition-transform duration-500">
                            <GraduationCap className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">Placement Connect</span>
                    </div>

                    <div className="max-w-md">
                        <h2 className="text-5xl font-extrabold text-white leading-tight mb-6">
                            Bridging the gap between <span className="text-primary italic">Ambition</span> and <span className="text-secondary">Achievement</span>.
                        </h2>
                        <p className="text-lg text-text-secondary leading-relaxed">
                            A centralized platform designed for elite placement management. Streamlined, secure, and built for your success.
                        </p>
                    </div>
                </div>

                {/* Structured Decorative Grid */}
                <div className="absolute inset-0 z-0 opacity-20 [mask-image:linear-gradient(to_bottom,black_20%,transparent)]">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                </div>

                <div className="relative z-10 flex items-center gap-6 text-sm text-text-muted">
                    <span>© 2026 Admin Panel</span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span>Direct Opportunities</span>
                </div>

                {/* Subtle Glow */}
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 blur-[100px] rounded-full"></div>
            </div>

            {/* Login Form Side */}
            <div className="flex flex-col items-center justify-center p-6 lg:p-12 relative">
                <div className="w-full max-w-sm space-y-8 relative z-10">
                    {/* Mobile Header (Only visible on mobile) */}
                    <div className="lg:hidden flex flex-col items-center text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
                            <GraduationCap className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Placement Connect</h1>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-3xl font-semibold text-white tracking-tight">Welcome back</h3>
                        <p className="text-text-secondary">Enter your credentials to manage your placements</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm animate-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary ml-1">Work Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="name@university.edu"
                                    className="pl-11 h-12 bg-surface/30 border-white/5 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-sm font-medium text-text-secondary">Secure Password</label>
                                <button type="button" className="text-xs text-primary hover:underline font-medium">Forgot password?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-11 h-12 bg-surface/30 border-white/5 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 mt-4 text-sm font-bold bg-primary hover:bg-primary-hover shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all active:scale-[0.98] rounded-xl"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : 'Access Account'}
                        </Button>
                    </form>

                    <div className="pt-8 text-center">
                        <p className="text-sm text-text-secondary">
                            New here? <span className="text-primary font-semibold hover:underline cursor-pointer" onClick={() => navigate('/register')}>Create Student Account</span>
                        </p>
                    </div>
                </div>

                {/* Subtle Light Leak */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[80px] rounded-full -mr-32 -mt-32"></div>
            </div>
        </div>
    );
}
