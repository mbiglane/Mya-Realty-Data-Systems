
import React, { useState, useEffect, useRef } from 'react';
import { BetaConfig, FeedbackItem, User, LogEntry } from '../types';
import { 
    Shield, Activity, MessageSquare, AlertCircle, CheckCircle, Sliders, 
    Play, Pause, Terminal, Database, Lock, Cpu, BarChart3, 
    CloudLightning, Zap, Radio, Globe, RefreshCw, Layers, 
    HardDrive, HardDriveDownload, Power, Users, Send, Bell
} from 'lucide-react';
import { SectionCard } from './SectionCard';
import { Input } from './ui/Input';

interface BetaAdminProps {
    config: BetaConfig;
    onConfigChange: (newConfig: BetaConfig) => void;
    users: User[];
    onUserStatusChange: (userId: string, newStatus: User['status']) => void;
}

const MOCK_FEEDBACK: FeedbackItem[] = [
    { id: '1', user: 'tester_01@platform.ai', type: 'bug', message: 'Voice assistant cuts off after 30 seconds on iOS.', date: '2024-10-24', status: 'new' },
    { id: '2', user: 'realestate_pro', type: 'feature', message: 'Would love a tool to estimate rental yield.', date: '2024-10-23', status: 'reviewed' },
];

export const BetaAdmin: React.FC<BetaAdminProps> = ({ config, onConfigChange, users, onUserStatusChange }) => {
    const [feedback, setFeedback] = useState<FeedbackItem[]>(MOCK_FEEDBACK);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLogStreamPaused, setIsLogStreamPaused] = useState(false);
    const [activeTab, setActiveTab] = useState<'telemetry' | 'infrastructure' | 'users'>('telemetry');
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const logsEndRef = useRef<HTMLDivElement>(null);

    // Simulated Real-time Metrics
    const [metrics, setMetrics] = useState({
        latency: 142,
        tokens: 450,
        nodes: 12,
        load: 34
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => ({
                latency: Math.floor(130 + Math.random() * 30),
                tokens: Math.floor(400 + Math.random() * 150),
                nodes: Math.floor(10 + Math.random() * 4),
                load: Math.floor(30 + Math.random() * 10)
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Simulated Log Stream
    useEffect(() => {
        if (isLogStreamPaused) return;
        const interval = setInterval(() => {
            const sources = ['Bot-Crawler', 'Bot-Refiner', 'AIService', 'Zillow-API-Proxy', 'Neural-Handshake'];
            const messages = [
                'Superbot: HTML metadata refined successfully',
                'Zillow API: Response time 158ms',
                'Gemini Live: Real-time PCM stream established',
                'Superbot: Proxy rotation detected valid node',
                'Neural-Handshake: Latency within optimal bounds',
                'Audit: Comparative variance calculated at 2.4%',
                'Security: Beta Enrollment Mode: AUTHORIZED'
            ];
            
            const newLog: LogEntry = {
                id: `log-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                level: 'INFO',
                source: sources[Math.floor(Math.random() * sources.length)],
                message: messages[Math.floor(Math.random() * messages.length)]
            };

            setLogs(prev => [...prev.slice(-49), newLog]);
        }, 1500);
        return () => clearInterval(interval);
    }, [isLogStreamPaused]);

    useEffect(() => {
        if (!isLogStreamPaused) logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs, isLogStreamPaused]);

    const handleBroadcast = () => {
        if (!broadcastMsg.trim()) return;
        setLogs(prev => [...prev, {
            id: `broadcast-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            level: 'WARN',
            source: 'MOC-BROADCAST',
            message: `GLOBAL ALERT: ${broadcastMsg}`
        }]);
        setBroadcastMsg('');
        alert("Broadcast dispatched to all active beta terminals.");
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20 max-w-7xl mx-auto">
            {/* Header HUD */}
            <div className="bg-slate-900 border-b border-brand-primary/20 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                    <Cpu size={200} />
                </div>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-3 w-3 rounded-full bg-status-green animate-pulse"></div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Mya Operations Command</h2>
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Proprietary AI Real Estate Infrastructure Control</p>
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-lg">
                           <Shield size={12} className="text-brand-primary" />
                           <span className="text-[10px] font-black text-brand-primary uppercase">Beta Status: 1.0 Unleashed</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white text-xs font-black uppercase tracking-widest transition-all"
                        >
                            <RefreshCw size={14}/> System Re-sync
                        </button>
                        <button 
                            onClick={() => onConfigChange({ ...config, isLive: !config.isLive })}
                            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-white text-sm font-black uppercase tracking-widest shadow-2xl transition-all ${config.isLive ? 'bg-status-red shadow-status-red/20' : 'bg-status-green shadow-status-green/20'}`}
                        >
                            <Power size={18}/> {config.isLive ? 'KILL SWITCH' : 'INITIALIZE'}
                        </button>
                    </div>
                </div>

                {/* Telemetry Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                    {[
                        { label: 'WebSocket Latency', value: `${metrics.latency}ms`, icon: Radio, color: 'text-brand-secondary' },
                        { label: 'Neural Throughput', value: `${metrics.tokens} t/s`, icon: Zap, color: 'text-status-yellow' },
                        { label: 'Superbot Nodes', value: `${metrics.nodes} Active`, icon: Database, color: 'text-brand-primary' },
                        { label: 'Infrastructure Load', value: `${metrics.load}%`, icon: Activity, color: 'text-status-green' }
                    ].map((s, i) => (
                        <div key={i} className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                            <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest mb-1 flex items-center gap-2">
                                <s.icon size={10} className={s.color} /> {s.label}
                            </p>
                            <p className="text-xl font-black text-white">{s.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* MOC Navigation */}
            <div className="flex gap-6 border-b border-slate-200 dark:border-base-300 pb-2">
                {[
                    { id: 'telemetry', label: 'Triage & Logs', icon: Terminal },
                    { id: 'infrastructure', label: 'Infrastructure', icon: Layers },
                    { id: 'users', label: 'User Matrix', icon: Shield }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.id ? 'text-brand-primary border-brand-primary' : 'text-slate-400 border-transparent'}`}
                    >
                        <tab.icon size={14}/> {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'telemetry' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                    {/* Live Console */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <SectionCard title="Neural Scrape Console" icon={Terminal}>
                            <div className="bg-slate-950 text-slate-400 font-mono text-[11px] p-6 rounded-3xl h-[450px] overflow-y-auto relative border border-slate-800 shadow-inner">
                                <div className="absolute top-4 right-4 z-20">
                                    <button 
                                        onClick={() => setIsLogStreamPaused(!isLogStreamPaused)}
                                        className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-xl transition-all"
                                    >
                                        {isLogStreamPaused ? <Play size={14} /> : <Pause size={14} />}
                                    </button>
                                </div>
                                {logs.map((log) => (
                                    <div key={log.id} className="mb-2 flex gap-4 border-b border-white/5 pb-1">
                                        <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                                        <span className={`font-black uppercase w-32 shrink-0 ${log.level === 'WARN' ? 'text-status-yellow' : 'text-brand-primary'}`}>[{log.source}]</span>
                                        <span className={log.level === 'WARN' ? 'text-white font-bold' : 'text-slate-200'}>{log.message}</span>
                                    </div>
                                ))}
                                <div ref={logsEndRef} />
                            </div>
                        </SectionCard>

                        {/* Global Broadcast Hub */}
                        <div className="bg-white dark:bg-base-200 p-8 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-base-300">
                             <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><Bell size={14} className="text-brand-primary"/> Global System Broadcast</h3>
                             <div className="flex gap-4">
                                <input 
                                    type="text"
                                    value={broadcastMsg}
                                    onChange={(e) => setBroadcastMsg(e.target.value)}
                                    placeholder="Enter system-wide announcement message..."
                                    className="flex-1 bg-slate-50 dark:bg-base-300 border border-slate-200 dark:border-base-100 rounded-2xl px-6 py-4 text-sm outline-none focus:border-brand-primary"
                                />
                                <button 
                                    onClick={handleBroadcast}
                                    className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
                                >
                                    <Send size={18}/> Push
                                </button>
                             </div>
                        </div>
                    </div>

                    {/* Triage & Feedback */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-base-200 p-8 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-base-300">
                            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><AlertCircle size={14} className="text-status-red"/> Emergency Triage</h3>
                            <div className="space-y-4">
                                <button className="w-full flex items-center justify-between p-4 bg-status-red/10 border border-status-red/20 rounded-2xl group hover:bg-status-red/20 transition-all">
                                    <span className="text-xs font-black uppercase text-status-red">Clear Neural Cache</span>
                                    <RefreshCw size={16} className="text-status-red group-hover:rotate-180 transition-transform" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl group hover:bg-brand-primary/20 transition-all">
                                    <span className="text-xs font-black uppercase text-brand-primary">Restart Scraper Nodes</span>
                                    <Globe size={16} className="text-brand-primary" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 bg-slate-100 dark:bg-base-300 border border-slate-200 dark:border-base-100 rounded-2xl group transition-all">
                                    <span className="text-xs font-black uppercase text-slate-500">Dump Debug logs</span>
                                    <HardDriveDownload size={16} className="text-slate-500" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-base-200 p-8 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-base-300">
                            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><MessageSquare size={14} className="text-brand-secondary"/> Intelligence Feedback</h3>
                            <div className="space-y-4">
                                {feedback.map(f => (
                                    <div key={f.id} className="p-4 bg-slate-50 dark:bg-base-300 rounded-2xl border border-slate-100 dark:border-base-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${f.type === 'bug' ? 'bg-status-red text-white' : 'bg-brand-secondary text-white'}`}>{f.type}</span>
                                            <span className="text-[8px] text-slate-400 font-bold">{f.date}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-gray-300 leading-tight mb-2">"{f.message}"</p>
                                        <p className="text-[9px] text-slate-400 font-bold">{f.user}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'infrastructure' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                    <SectionCard title="API Bridge Management" icon={Layers}>
                        <div className="space-y-4">
                            {[
                                { id: 'gemini_live', label: 'Gemini Live API', status: 'Optimal', icon: CloudLightning, color: 'text-brand-primary' },
                                { id: 'zillow_rapid', label: 'Zillow RapidAPI', status: '82% Quota', icon: Database, color: 'text-brand-secondary' },
                                { id: 'google_maps', label: 'Google Maps Engine', status: 'Operational', icon: Globe, color: 'text-status-green' },
                                { id: 'superbot_crawl', label: 'Superbot Core Nodes', status: 'High Performance', icon: Cpu, color: 'text-status-yellow' }
                            ].map(bridge => (
                                <div key={bridge.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-base-300 rounded-[2rem] border border-slate-100 dark:border-base-100">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl bg-white dark:bg-base-200 shadow-sm ${bridge.color}`}>
                                            <bridge.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-tighter">{bridge.label}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">{bridge.status}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard title="Neural Configuration" icon={Sliders}>
                        <div className="space-y-8">
                             <div className="flex items-center justify-between p-6 bg-brand-primary/5 border border-brand-primary/20 rounded-[2rem]">
                                <div>
                                    <h4 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest mb-1">Public Beta Mode</h4>
                                    <p className="text-[10px] text-slate-500 font-bold">Allows self-enrollment for whitelisted domains.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                                </label>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Neural Safety Shield Level</label>
                                <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 dark:bg-base-300 rounded-2xl">
                                    {['STRICT', 'DYNAMIC', 'RELAXED'].map(l => (
                                        <button 
                                            key={l}
                                            onClick={() => onConfigChange({...config, safetyLevel: l.toLowerCase() as any})}
                                            className={`py-3 text-[10px] font-black uppercase rounded-xl transition-all ${config.safetyLevel === l.toLowerCase() ? 'bg-white dark:bg-base-200 text-brand-primary shadow-xl' : 'text-slate-400'}`}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Mya Knowledge Base Injection</label>
                                <textarea 
                                    value={config.knowledgeBase}
                                    onChange={(e) => onConfigChange({...config, knowledgeBase: e.target.value})}
                                    placeholder="Inject proprietary logic, company SOPs, or internal data sets here..."
                                    className="w-full h-40 bg-slate-50 dark:bg-base-300 border border-slate-200 dark:border-base-100 rounded-3xl p-6 text-sm text-slate-600 dark:text-gray-300 outline-none focus:border-brand-primary transition-all"
                                />
                            </div>
                        </div>
                    </SectionCard>
                </div>
            )}

            {activeTab === 'users' && (
                <SectionCard title="Beta Access User Matrix" icon={Users}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-base-300">
                                    <th className="pb-4 pl-4">Identification</th>
                                    <th className="pb-4">Credential Level</th>
                                    <th className="pb-4">Status Vector</th>
                                    <th className="pb-4 pr-4 text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-base-300">
                                {users.map(u => (
                                    <tr key={u.id} className="group hover:bg-slate-50 dark:hover:bg-base-300/30 transition-colors">
                                        <td className="py-6 pl-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary font-black uppercase text-xs">
                                                    {u.name.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-tighter">{u.name}</p>
                                                    <p className="text-xs text-slate-400">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-status-red text-white' : 'bg-brand-primary text-white'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-2 w-2 rounded-full ${u.status === 'active' ? 'bg-status-green' : u.status === 'blocked' ? 'bg-status-red' : 'bg-status-yellow'}`}></div>
                                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{u.status}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 pr-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => onUserStatusChange(u.id, u.status === 'active' ? 'blocked' : 'active')}
                                                    className="px-4 py-2 bg-slate-100 dark:bg-base-300 hover:bg-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                                >
                                                    {u.status === 'active' ? 'Revoke' : 'Grant'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SectionCard>
            )}
        </div>
    );
};
