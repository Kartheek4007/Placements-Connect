import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { GraduationCap, Lock, Mail, User, Loader2, ArrowLeft } from 'lucide-react';
import api from '../../lib/api';

export default function Register() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await api.post('/auth/register', {
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name,
                role: 'student'
            });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background selection:bg-primary/30">
            {/* Branding Side (Structured & Immersive) */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden border-r border-white/5 bg-surface/20">
                <div className="relative z-10">
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors mb-20 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </button>

                    <div className="max-w-md">
                        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                            <GraduationCap className="text-white w-7 h-7" />
                        </div>
                        <h2 className="text-5xl font-extrabold text-white leading-tight mb-6">
                            Start your <span className="text-secondary italic">Professional</span> journey today.
                        </h2>
                        <ul className="space-y-4 text-text-secondary">
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                                Access exclusive placement drives
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                                Direct coordination with top recruiters
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                                Centralized offer management
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,#6366f122_0%,transparent_50%)]"></div>
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,#0ea5e922_0%,transparent_50%)]"></div>
                </div>

                <div className="relative z-10 text-sm text-text-muted">
                    Joined by over 5,000 students this month.
                </div>
            </div>

            {/* Registration Form Side */}
            <div className="flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
                <div className="w-full max-w-sm space-y-8 py-8 relative z-10">
                    <div className="space-y-2 text-center lg:text-left">
                        <h3 className="text-3xl font-semibold text-white tracking-tight">Create Account</h3>
                        <p className="text-text-secondary">Join the official university placement portal</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        {error && (
                            <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-3.5 h-4 w-4 text-text-muted group-focus-within:text-secondary transition-colors" />
                                <Input
                                    placeholder="John Doe"
                                    className="pl-11 h-12 bg-surface/30 border-white/5 focus:border-secondary/50 focus:ring-secondary/20 rounded-xl"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-text-muted group-focus-within:text-secondary transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="john@university.edu"
                                    className="pl-11 h-12 bg-surface/30 border-white/5 focus:border-secondary/50 focus:ring-secondary/20 rounded-xl"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-text-muted group-focus-within:text-secondary transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="Min. 8 characters"
                                    className="pl-11 h-12 bg-surface/30 border-white/5 focus:border-secondary/50 focus:ring-secondary/20 rounded-xl"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary ml-1">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-text-muted group-focus-within:text-secondary transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="Repeat password"
                                    className="pl-11 h-12 bg-surface/30 border-white/5 focus:border-secondary/50 focus:ring-secondary/20 rounded-xl"
                                    value={formData.confirm_password}
                                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 mt-4 text-sm font-bold bg-secondary hover:bg-secondary/80 shadow-[0_0_20px_rgba(14,165,233,0.3)] rounded-xl transition-all active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : 'Create Student Account'}
                        </Button>
                    </form>

                    <div className="pt-6 text-center">
                        <p className="text-sm text-text-secondary">
                            Already registered? <span className="text-secondary font-semibold hover:underline cursor-pointer" onClick={() => navigate('/login')}>Sign in here</span>
                        </p>
                    </div>
                </div>

                {/* Mobile Decorative Element */}
                <div className="lg:hidden absolute bottom-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full"></div>
            </div>
        </div>
    );
}
