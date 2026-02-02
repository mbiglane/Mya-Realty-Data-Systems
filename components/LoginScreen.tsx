
import React, { useState } from 'react';
import { ArrowRight, Loader2, Sparkles, AlertCircle, CheckCircle2, Lock, Key, Mail, User as UserIcon, ShieldCheck, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { User } from '../types';

interface LoginScreenProps {
    onAuthAttempt: (email: string, name: string) => { success: boolean; message?: string; user?: User };
}

const DEMO_ACCOUNTS = [
    { email: 'admin@platform.ai', name: 'SYSTEM ADMIN', role: 'admin', desc: 'Full System Control' },
    { email: 'beta.tester@domain.com', name: 'BETA TESTER', role: 'user', desc: 'Standard AI Suite' }
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onAuthAttempt }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [betaCode, setBetaCode] = useState('BETA1.0');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);

    const handleLoginSequence = async (targetEmail: string, targetName: string, targetCode: string) => {
        if (isLoading) return;
        setFeedback(null);

        if (!targetEmail.trim() || !targetName.trim()) {
             setFeedback({ type: 'error', message: 'Credentials required for neural handshake.' });
             return;
        }

        const normalizedCode = targetCode.trim().toUpperCase();
        if (normalizedCode !== 'BETA1.0') {
             setFeedback({ 
                type: 'error', 
                message: 'Invalid Invite Code. Authorized terminals only.' 
             });
             return;
        }

        setIsLoading(true);
        // Synchronized delay for telemetry simulation
        await new Promise(resolve => setTimeout(resolve, 800));

        const result = onAuthAttempt(targetEmail, targetName);

        if (result.success) {
            setFeedback({ type: 'success', message: 'Handshake accepted. Provisioning terminal...' });
        } else {
            setFeedback({ 
                type: 'error', 
                message: result.message || 'Identity service failure.' 
            });
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLoginSequence(email, name, betaCode);
    };

    const triggerQuickStart = (acc: typeof DEMO_ACCOUNTS[0]) => {
        setEmail(acc.email);
        setName(acc.name);
        handleLoginSequence(acc.email, acc.name, 'BETA1.0');
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-slate-950 to-brand-secondary/5 pointer-events-none"></div>
            
            <div className="max-w-md w-full bg-slate-900 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] p-10 border border-white/5 animate-fade-in relative z-10">
                <div className="text-center mb-10">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-brand-primary/20 blur-2xl rounded-full"></div>
                        <div className="relative bg-slate-950 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-brand-primary/40 shadow-2xl">
                            <Lock className="h-10 w-10 text-brand-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">
                        Titan Gateway
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                        Authorized Access Terminal
                    </p>
                </div>

                <div className="mb-10 space-y-3">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-4 flex items-center justify-center gap-2">
                        <Zap size={12} className="text-brand-primary" /> Rapid Initialization
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                        {DEMO_ACCOUNTS.map(acc => (
                            <button 
                                key={acc.email}
                                type="button"
                                onClick={() => triggerQuickStart(acc)}
                                disabled={isLoading}
                                className="w-full p-4 rounded-2xl border border-white/5 bg-slate-950/50 transition-all group flex items-center justify-between hover:border-brand-primary/40 hover:bg-slate-950 active:scale-95"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-xl ${acc.role === 'admin' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-brand-secondary/10 text-brand-secondary'}`}>
                                        {acc.role === 'admin' ? <ShieldCheck size={18} /> : <Sparkles size={18} />}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-black text-white uppercase tracking-tight">{acc.name}</p>
                                        <p className="text-[9px] text-slate-600 font-bold uppercase">{acc.desc}</p>
                                    </div>
                                </div>
                                <ArrowRight size={14} className="text-slate-800 group-hover:text-brand-primary transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                    <div className="relative flex justify-center text-[9px] uppercase font-black"><span className="px-4 bg-slate-900 text-slate-600 tracking-widest uppercase">Custom Credentials</span></div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-primary transition-colors" size={16} />
                            <input 
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-white/5 rounded-2xl text-xs text-white outline-none focus:border-brand-primary/50 transition-all placeholder:text-slate-700"
                            />
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-primary transition-colors" size={16} />
                            <input 
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-white/5 rounded-2xl text-xs text-white outline-none focus:border-brand-primary/50 transition-all placeholder:text-slate-700"
                            />
                        </div>

                        <div className="relative group">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-primary transition-colors" size={16} />
                            <input 
                                type="text"
                                placeholder="Invite Code"
                                value={betaCode}
                                onChange={(e) => setBetaCode(e.target.value)}
                                disabled={isLoading}
                                className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-white/5 rounded-2xl text-xs text-white outline-none focus:border-brand-primary/50 transition-all placeholder:text-slate-700 font-mono"
                            />
                        </div>
                    </div>

                    {feedback && (
                        <div className={`p-4 rounded-2xl text-[10px] flex items-start gap-3 border animate-fade-in ${
                            feedback.type === 'error' ? 'bg-status-red/5 text-status-red border-status-red/10' :
                            'bg-status-green/5 text-status-green border-status-green/10'
                        }`}>
                            {feedback.type === 'error' ? <AlertCircle size={14} className="shrink-0" /> : <CheckCircle2 size={14} className="shrink-0" />}
                            <span className="font-bold uppercase tracking-tight">{feedback.message}</span>
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        className="w-full py-5 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 bg-brand-primary text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : <>Initialize Session <ArrowRight size={14} className="ml-2" /></>}
                    </Button>
                </form>
            </div>
            
            <p className="mt-8 text-[9px] text-slate-700 font-mono uppercase tracking-[0.4em]">
                TITAN ARCHITECTURE v0.9.5 | ENCRYPTED
            </p>
        </div>
    );
};
