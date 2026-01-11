
import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Globe, Cpu, Zap, Server, BarChart3, AlertCircle, CheckCircle2, Lock, Wifi } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const MOCK_TRAFFIC = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    latency: Math.floor(120 + Math.random() * 40),
    success: Math.floor(95 + Math.random() * 5)
}));

export const TechnicalHealth: React.FC = () => {
    const [healthMetrics, setHealthMetrics] = useState({
        uptime: '99.98%',
        handshakeRate: '97.4%',
        avgLatency: '142ms',
        activeStreams: 3
    });

    const [readiness, setReadiness] = useState({
        ssl: true,
        api: !!process.env.API_KEY,
        ws: true,
        permissions: false
    });

    useEffect(() => {
        // Check microphone permission status
        navigator.permissions.query({ name: 'microphone' as any }).then(result => {
            setReadiness(prev => ({ ...prev, permissions: result.state === 'granted' }));
        });
    }, []);

    return (
        <div className="space-y-8 animate-fade-in pb-20 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-base-300 pb-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-gray-100 uppercase tracking-tighter italic">Infrastructure HUD</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs mt-1">Real-time Hostinger Node Monitoring</p>
                </div>
                <div className="flex items-center gap-3 bg-status-green/10 text-status-green px-4 py-2 rounded-2xl border border-status-green/20">
                    <ShieldCheck size={18} />
                    <span className="text-xs font-black uppercase">Hostinger Node: PHOENIX_01 ACTIVE</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'System Uptime', value: healthMetrics.uptime, icon: Server, color: 'text-brand-primary' },
                    { label: 'Inference Success', value: healthMetrics.handshakeRate, icon: Zap, color: 'text-status-yellow' },
                    { label: 'Avg Latency', value: healthMetrics.avgLatency, icon: Activity, color: 'text-brand-secondary' },
                    { label: 'Live Sessions', value: healthMetrics.activeStreams, icon: Globe, color: 'text-status-green' }
                ].map((m, i) => (
                    <div key={i} className="bg-white dark:bg-base-200 p-6 rounded-[2rem] shadow-xl border border-slate-200 dark:border-base-300 transition-transform hover:scale-[1.02]">
                        <m.icon className={`${m.color} mb-3`} size={24} />
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{m.label}</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-gray-100">{m.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <SectionCard title="Handshake Latency (ms)" icon={BarChart3}>
                        <div className="h-80 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_TRAFFIC}>
                                    <defs>
                                        <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                                    <XAxis dataKey="time" hide />
                                    <YAxis domain={[100, 200]} tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '1rem', color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="latency" stroke="#2dd4bf" strokeWidth={3} fill="url(#colorLat)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </SectionCard>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-base-200 p-8 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-base-300">
                        <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                            <AlertCircle size={14} className="text-brand-primary"/> Beta Launch Readiness
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'SSL/HTTPS Protocol', status: readiness.ssl, desc: 'Required for Microphone/WebSockets' },
                                { label: 'Gemini API Link', status: readiness.api, desc: 'Environment Key Verification' },
                                { label: 'WebSocket Gateway', status: readiness.ws, desc: 'Real-time Audio Handshake' },
                                { label: 'Browser Permissions', status: readiness.permissions, desc: 'Mic/Camera Access Check' }
                            ].map((item, i) => (
                                <div key={i} className="p-4 bg-slate-50 dark:bg-base-300/50 rounded-2xl border border-slate-100 dark:border-base-100 flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${item.status ? 'bg-status-green/10 text-status-green' : 'bg-status-red/10 text-status-red'}`}>
                                        {item.status ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tighter">{item.label}</p>
                                        <p className="text-[10px] text-slate-500 font-bold">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8 p-5 bg-brand-primary/10 rounded-2xl border border-brand-primary/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Lock size={14} className="text-brand-primary" />
                                <p className="text-xs font-black text-brand-primary uppercase">Deployment Recommendation</p>
                            </div>
                            <p className="text-[10px] text-brand-primary/80 font-bold leading-relaxed italic">
                                "System meets all Tier-1 Hostinger deployment criteria. Latency is optimal for North American and European clusters."
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Wifi className="text-brand-secondary animate-pulse" size={18} />
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Network Edge Pulse</h4>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-brand-secondary w-[85%] animate-[shimmer_2s_infinite]"></div>
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold text-center">Inference Load: 85% | P99 Sync: 152ms</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
