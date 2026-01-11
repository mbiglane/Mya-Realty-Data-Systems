
import React, { useState } from 'react';
import { ArrowRight, Loader2, Sparkles, AlertCircle, CheckCircle2, Lock, Key, Mail, User as UserIcon, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { User } from '../types';

interface LoginScreenProps {
    onAuthAttempt: (email: string, name: string) => { success: boolean; message?: string; user?: User };
}

const DEMO_ACCOUNTS = [
    { email: 'admin@platform.ai', name: 'SYSTEM ADMIN', desc: 'Admin Terminal' },
    { email: 'tester@platform.ai', name: 'BETA TESTER', desc: 'Standard Access' }
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onAuthAttempt }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [betaCode, setBetaCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);

    const handleEnter = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        setFeedback(null);

        if (!email.trim() || !name.trim()) {
             setFeedback({ type: 'error', message: 'Credentials incomplete. Enter Name and Email.' });
             return;
        }

        // Validate Beta Entry Code - MUST MATCH OR BE BLANK FOR CERTAIN ROLES
        // But for this platform, we enforce BETA1.0
        if (betaCode.trim().toUpperCase() !== 'BETA1.0') {
             setFeedback({ type: 'error', message: 'Access Denied: Invalid Beta Entry Code.' });
             return;
        }

        setIsLoading(true);

        // Simulated validation handshake
        await new Promise(resolve => setTimeout(resolve, 800));

        const result = onAuthAttempt(email, name);

        if (result.success) {
            // Success state handled by parent (App.tsx)
            setFeedback({ type: 'success', message: 'Neural Handshake Successful. Redirecting...' });
        } else {
            setFeedback({ 
                type: 'error', 
                message: result.message || 'Identity not recognized on the Beta Whitelist.' 
            });
            setIsLoading(false);
        }
    };

    const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
        setEmail(acc.email);
        setName(acc.name);
        setBetaCode('BETA1.0');
        setFeedback(null);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-slate-950 to-brand-secondary/10 pointer-events-none"></div>
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px]"></div>
            
            <div className="max-w-md w-full bg-slate-900 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] p-10 border border-white/5 animate-fade-in relative z-10">
                <div className="text-center mb-10">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full"></div>
                        <div className="relative bg-slate-950 w-20 h-20 rounded-[1.8rem] flex items-center justify-center mx-auto mb-6 border border-brand-primary/30 shadow-2xl">
                            <Lock className="h-10 w-10 text-brand-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">
                        TITAN GATEWAY
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                        Secure Mya Intelligence Network
                    </p>
                </div>

                <form onSubmit={handleEnter} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Identity</label>
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                                <input 
                                    id="name"
                                    type="text"
                                    placeholder="Enter Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-white/5 rounded-2xl text-sm text-white outline-none focus:border-brand-primary/50 transition-all placeholder:text-slate-700"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Credential Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                                <input 
                                    id="email"
                                    type="email"
                                    placeholder="admin@platform.ai"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-white/5 rounded-2xl text-sm text-white outline-none focus:border-brand-primary/50 transition-all placeholder:text-slate-700"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Beta Entry Code</label>
                                <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">Required: BETA1.0</span>
                            </div>
                            <div className="relative group">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                                <input 
                                    id="betaCode"
                                    type="text"
                                    placeholder="BETA1.0"
                                    value={betaCode}
                                    onChange={(e) => setBetaCode(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-white/5 rounded-2xl text-sm text-white outline-none focus:border-brand-primary/50 transition-all placeholder:text-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    {feedback && (
                        <div className={`p-4 rounded-2xl text-xs flex items-start gap-3 border animate-fade-in ${
                            feedback.type === 'error' ? 'bg-status-red/10 text-status-red border-status-red/20' :
                            feedback.type === 'success' ? 'bg-status-green/10 text-status-green border-status-green/20' :
                            'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                        }`}>
                            {feedback.type === 'error' ? <AlertCircle size={16} className="shrink-0" /> :
                             feedback.type === 'success' ? <CheckCircle2 size={16} className="shrink-0" /> :
                             <ShieldCheck size={16} className="shrink-0" />}
                            <span className="font-bold">{feedback.message}</span>
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        className="w-full py-5 text-sm font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-brand-primary/30 transition-all hover:scale-[1.02] active:scale-95 bg-brand-primary text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <>Log Into Terminal <ArrowRight size={18} className="ml-2" /></>}
                    </Button>
                </form>

                <div className="mt-12 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <ShieldCheck className="text-brand-secondary h-4 w-4" />
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Authorized Quick-Access</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {DEMO_ACCOUNTS.map(acc => (
                            <button 
                                key={acc.email}
                                type="button"
                                onClick={() => fillDemo(acc)}
                                className="w-full p-4 bg-slate-950/50 hover:bg-slate-950 border border-white/5 hover:border-brand-primary/30 rounded-2xl transition-all group flex items-center justify-between"
                            >
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-white uppercase tracking-tight group-hover:text-brand-primary transition-colors">{acc.name}</p>
                                    <p className="text-[9px] text-slate-500 font-medium">{acc.email}</p>
                                </div>
                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">{acc.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            <p className="mt-8 text-[9px] text-slate-600 font-mono uppercase tracking-[0.4em]">
                Mya Intelligence Systems © 2024 | Tier: Stable Beta
            </p>
        </div>
    );
};
