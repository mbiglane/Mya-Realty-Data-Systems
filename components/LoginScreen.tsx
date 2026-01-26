
import React, { useState } from 'react';
import { ArrowRight, Loader2, Sparkles, AlertCircle, CheckCircle2, Lock, Key, Mail, User as UserIcon, ShieldCheck, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { User } from '../types';

interface LoginScreenProps {
    onAuthAttempt: (email: string, name: string) => { success: boolean; message?: string; user?: User };
}

const DEMO_ACCOUNTS = [
    { email: 'admin@platform.ai', name: 'SYSTEM ADMIN', role: 'admin', desc: 'Manage Nodes & Users' },
    { email: 'beta.tester@domain.com', name: 'BETA TESTER', role: 'user', desc: 'Access AI Tools & Book' }
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onAuthAttempt }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [betaCode, setBetaCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);

    const handleLoginSequence = async (targetEmail: string, targetName: string, targetCode: string) => {
        if (isLoading) return;
        setFeedback(null);

        // Validation logic
        if (!targetEmail.trim() || !targetName.trim()) {
             setFeedback({ type: 'error', message: 'Credentials required. Enter Name and Email to register.' });
             return;
        }

        const normalizedCode = targetCode.trim().toUpperCase();
        if (normalizedCode !== 'BETA1.0') {
             setFeedback({ 
                type: 'error', 
                message: 'Invalid Invite Code. This platform is currently Invite-Only.' 
             });
             return;
        }

        setIsLoading(true);
        // Visual delay for "Neural Handshake" effect
        await new Promise(resolve => setTimeout(resolve, 1200));

        const result = onAuthAttempt(targetEmail, targetName);

        if (result.success) {
            setFeedback({ type: 'success', message: 'Handshake successful. Provisioning session...' });
        } else {
            setFeedback({ 
                type: 'error', 
                message: result.message || 'Identity service rejected the request.' 
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
        setBetaCode('BETA1.0');
        handleLoginSequence(acc.email, acc.name, 'BETA1.0');
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-slate-950 to-brand-secondary/10 pointer-events-none"></div>
            
            <div className="max-w-md w-full bg-slate-900 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] p-10 border border-white/5 animate-fade-in relative z-10">
                <div className="text-center mb-10">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-brand-primary/20 blur-2xl rounded-full"></div>
                        <div className="relative bg-slate-950 w-24 h-24 rounded-[2.2rem] flex items-center justify-center mx-auto mb-6 border-2 border-brand-primary/40 shadow-2xl">
                            <Lock className="h-12 w-12 text-brand-primary" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">
                        TITAN GATEWAY
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                        Secure Mya Intelligence Network
                    </p>
                </div>

                {/* QUICK START SECTION - NOW TOP PRIORITY */}
                <div className="mb-10 space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-4 flex items-center justify-center gap-2">
                        <Zap size={12} className="text-brand-primary" /> ONE-CLICK QUICK START
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                        {DEMO_ACCOUNTS.map(acc => (
                            <button 
                                key={acc.email}
                                type="button"
                                onClick={() => triggerQuickStart(acc)}
                                disabled={isLoading}
                                className={`w-full p-4 rounded-2xl border transition-all group flex items-center justify-between shadow-lg hover:scale-[1.02] active:scale-95 ${
                                    acc.role === 'admin' 
                                    ? 'bg-brand-primary/5 border-brand-primary/30 hover:bg-brand-primary/10' 
                                    : 'bg-brand-secondary/5 border-brand-secondary/30 hover:bg-brand-secondary/10'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${acc.role === 'admin' ? 'bg-brand-primary/20 text-brand-primary' : 'bg-brand-secondary/20 text-brand-secondary'}`}>
                                        {acc.role === 'admin' ? <ShieldCheck size={20} /> : <Sparkles size={20} />}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-black text-white uppercase tracking-tight group-hover:text-white transition-colors">{acc.name}</p>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase">{acc.desc}</p>
                                    </div>
                                </div>
                                <ArrowRight size={16} className="text-slate-700 group-hover:text-white transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-black"><span className="px-4 bg-slate-900 text-slate-600 tracking-widest">Or Manual Handshake</span></div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Identity Display Name</label>
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                                <input 
                                    type="text"
                                    placeholder="Enter Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-white/5 rounded-2xl text-sm text-white outline-none focus:border-brand-primary/50 transition-all placeholder:text-slate-700"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Beta Whitelist Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                                <input 
                                    type="email"
                                    placeholder="your@email.com"
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
                            </div>
                            <div className="relative group">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                                <input 
                                    type="text"
                                    placeholder="BETA1.0"
                                    value={betaCode}
                                    onChange={(e) => setBetaCode(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-white/5 rounded-2xl text-sm text-white outline-none focus:border-brand-primary/50 transition-all placeholder:text-slate-700 font-mono"
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
            </div>
            
            <p className="mt-8 text-[9px] text-slate-600 font-mono uppercase tracking-[0.4em]">
                Mya Intelligence Systems © 2024 | Tier: Stable Beta
            </p>
        </div>
    );
};
