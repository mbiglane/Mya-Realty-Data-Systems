
import React, { useState, useEffect, useRef } from 'react';
import { Users, Video, Mic, MessageSquare, Plus, Sparkles, Activity, ShieldCheck, Zap, Search, Landmark, Calendar, Ruler, Cpu, BarChart3, Database, Filter, Layers, Globe, ZapOff, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';

interface Collaborator {
    id: string;
    name: string;
    role: string;
    avatar: string;
    isMuted: boolean;
    isActive: boolean;
}

const INITIAL_COLLABORATORS: Collaborator[] = [
    { id: '1', name: 'Mya Intelligence', role: 'Facilitator', avatar: 'https://images.unsplash.com/photo-1675379068028-4032d30aa0bf?auto=format&fit=crop&q=80&w=150&h=150', isMuted: false, isActive: true },
    { id: '2', name: 'Marcus Miller', role: 'Senior Agent', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150', isMuted: true, isActive: false },
    { id: '3', name: 'Sarah Chen', role: 'Investment Lead', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150', isMuted: false, isActive: false },
];

export const CollaborationRoom: React.FC = () => {
    const [collaborators, setCollaborators] = useState(INITIAL_COLLABORATORS);
    const [isLive, setIsLive] = useState(false);
    const [propertySearch, setPropertySearch] = useState('');
    const [botSpecs, setBotSpecs] = useState('full-financial-audit');
    const [scrapeStatus, setScrapeStatus] = useState<'idle' | 'scraping' | 'api-handshake' | 'refining' | 'complete'>('idle');
    const [progress, setProgress] = useState(0);
    const [activeProperty, setActiveProperty] = useState<any>(null);
    const [insight, setInsight] = useState<{ title: string; content: string; metrics: any } | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handlePropertySearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!propertySearch.trim()) return;
        
        setScrapeStatus('scraping');
        setProgress(0);
        setActiveProperty(null);
        setInsight(null);

        // Accelerated progress engine (~1.8 seconds total)
        const totalDuration = 1800; 
        const intervalTime = 30;
        const steps = totalDuration / intervalTime;
        const progressPerStep = 100 / steps;

        let currentProgress = 0;
        const timer = setInterval(() => {
            currentProgress += progressPerStep;
            const cappedProgress = Math.min(Math.round(currentProgress), 100);
            setProgress(cappedProgress);

            if (cappedProgress < 30) setScrapeStatus('scraping');
            else if (cappedProgress < 70) setScrapeStatus('api-handshake');
            else if (cappedProgress < 100) setScrapeStatus('refining');

            if (cappedProgress >= 100) {
                clearInterval(timer);
                setScrapeStatus('complete');
                
                // Final synthesized payload
                setActiveProperty({
                    address: propertySearch,
                    coreEstimate: 1245000,
                    scrapedPrice: 1210000,
                    sqft: 3450,
                    yearBuilt: 2014,
                    fidelityScore: 99.4, 
                    sourceType: 'Hybrid (Scrape + Core)',
                    compsFound: 18,
                    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600"
                });
                setInsight({
                    title: "Hybrid Market Audit Finalized",
                    content: `Mya detected a hidden 'Price Drop' in HTML metadata. Listing arbitrage found at $1.15M.`,
                    metrics: { confidence: 99, risk: 'Low', upside: '158k' }
                });
            }
        }, intervalTime);
    };

    useEffect(() => {
        if (!isLive || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#2dd4bf';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < canvas.width; i++) {
                const y = 25 + Math.sin(i * 0.05 + Date.now() * 0.01) * 15;
                if (i === 0) ctx.moveTo(i, y);
                else ctx.lineTo(i, y);
            }
            ctx.stroke();
            animationFrame = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationFrame);
    }, [isLive]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-in pb-20 max-w-7xl mx-auto min-h-[700px] lg:h-[calc(100vh-200px)] w-full">
            <div className="flex-1 flex flex-col gap-6 h-full min-h-0">
                <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/5 flex flex-col flex-1 min-h-0">
                    
                    {/* Neural Handshake Trace Bar */}
                    {scrapeStatus !== 'idle' && scrapeStatus !== 'complete' && (
                        <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-white/5 overflow-hidden">
                            <div 
                                className="h-full bg-brand-primary shadow-[0_0_15px_#2dd4bf] transition-all duration-300 ease-linear" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    )}

                    <div className="absolute top-8 left-8 right-8 flex flex-col gap-4 z-20">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <form onSubmit={handlePropertySearch} className="flex-[2] flex items-center gap-4 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 shadow-2xl transition-all hover:border-brand-primary/40 focus-within:border-brand-primary">
                                <Search size={18} className="text-slate-400" />
                                <input 
                                    type="text"
                                    value={propertySearch}
                                    onChange={(e) => setPropertySearch(e.target.value)}
                                    placeholder="Neural Search (Address/URL)..."
                                    className="bg-transparent border-none outline-none text-white text-sm w-full font-medium placeholder:text-slate-600"
                                />
                            </form>
                            
                            <div className="flex-1 flex items-center gap-3 bg-slate-800/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/5">
                                <Filter size={16} className="text-brand-secondary" />
                                <select 
                                    value={botSpecs}
                                    onChange={(e) => setBotSpecs(e.target.value)}
                                    className="bg-transparent border-none outline-none text-white text-[10px] font-black uppercase tracking-widest w-full cursor-pointer"
                                >
                                    <option value="full-financial-audit">Full Fin Audit</option>
                                    <option value="comparative-analysis">Comp Analysis</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-status-green animate-pulse' : 'bg-slate-500'}`}></div>
                                <span className="text-white text-[10px] font-black uppercase tracking-widest">{isLive ? 'Systems Ready' : 'Off-link'}</span>
                            </div>
                        </div>
                        
                        {/* Real-time Gauging Status */}
                        {scrapeStatus !== 'idle' && scrapeStatus !== 'complete' && (
                            <div className="flex items-center gap-4 animate-fade-in bg-black/40 p-3 rounded-2xl border border-white/5">
                                <div className="flex gap-2">
                                    <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${scrapeStatus === 'scraping' ? 'bg-brand-primary text-white' : 'bg-white/5 text-white/40'}`}>
                                        Crawl
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${scrapeStatus === 'api-handshake' ? 'bg-brand-secondary text-white' : 'bg-white/5 text-white/40'}`}>
                                        Sync
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${scrapeStatus === 'refining' ? 'bg-status-yellow text-white' : 'bg-white/5 text-white/40'}`}>
                                        Refine
                                    </div>
                                </div>
                                <div className="flex-1 flex items-center gap-3">
                                    <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-primary" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <span className="text-[10px] font-black text-brand-primary min-w-[35px]">{progress}%</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex items-center justify-center p-20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 pt-32 min-h-0 overflow-hidden text-center">
                        {!isLive ? (
                            <div className="text-center group cursor-pointer" onClick={() => setIsLive(true)}>
                                <div className="w-24 h-24 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-2xl">
                                    <Database className="text-brand-primary h-10 w-10" />
                                </div>
                                <h3 className="text-white font-black text-2xl uppercase tracking-tighter mb-2">Connect to Neural Hub</h3>
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-12 min-h-0">
                                <div className="grid grid-cols-2 gap-8 w-full max-w-2xl min-h-0 overflow-y-auto custom-scrollbar p-4">
                                    {collaborators.map(c => (
                                        <div key={c.id} className={`relative p-1 rounded-[2rem] border-2 transition-all duration-700 ${c.isActive ? 'border-brand-primary scale-105' : 'border-white/5 opacity-40'}`}>
                                            <img src={c.avatar} className="w-full aspect-square rounded-[1.8rem] object-cover" alt={c.name} />
                                            {c.isActive && (
                                                <div className="absolute top-4 right-4 w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center animate-pulse">
                                                    <Mic size={14} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    
                                    {activeProperty && (
                                        <div className="relative p-1 rounded-[2rem] border-2 border-brand-secondary bg-slate-800 shadow-2xl animate-fade-in group overflow-hidden">
                                            <img src={activeProperty.image} className="w-full aspect-square rounded-[1.8rem] object-cover" alt="Property" />
                                            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 via-transparent">
                                                <p className="text-white text-lg font-black tracking-tight leading-tight mb-2 truncate">{activeProperty.address}</p>
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-1 text-white/80 text-[10px] font-bold uppercase">
                                                        <Ruler size={10} /> {activeProperty.sqft}ft²
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!activeProperty && scrapeStatus === 'idle' && (
                                        <div className="border-2 border-dashed border-white/10 rounded-[2rem] flex items-center justify-center cursor-pointer hover:border-brand-secondary transition-all">
                                            <Plus className="text-white/20 h-12 w-12" />
                                        </div>
                                    )}

                                    {scrapeStatus !== 'idle' && scrapeStatus !== 'complete' && !activeProperty && (
                                        <div className="border-2 border-white/5 bg-slate-800/50 rounded-[2rem] flex items-center justify-center">
                                            <Loader2 className="text-brand-primary h-12 w-12 animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-8 bg-black/40 border-t border-white/5 flex items-center justify-between">
                        <div className="flex gap-4">
                            <button className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all ${isLive ? 'bg-brand-primary text-white' : 'bg-white/10'}`}>
                                <Mic size={24} />
                            </button>
                        </div>
                        <Button 
                            variant="primary" 
                            className={`px-12 h-16 rounded-2xl text-lg uppercase tracking-[0.2em] font-black transition-all ${isLive ? 'bg-status-red' : 'bg-brand-primary'}`}
                            onClick={() => setIsLive(!isLive)}
                        >
                            {isLive ? 'Exit Hub' : 'Enter Hub'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-[400px] flex flex-col gap-6 h-full min-h-0">
                <div className="bg-white dark:bg-base-200 p-8 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-base-300 flex-1 flex flex-col overflow-hidden min-h-0">
                    <div className="flex items-center gap-3 mb-8">
                        <Sparkles className="text-brand-primary" />
                        <h3 className="font-black text-xl uppercase tracking-tight">Market Intel</h3>
                    </div>

                    {!insight ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            {scrapeStatus !== 'idle' ? <Loader2 className="text-brand-primary h-10 w-10 animate-spin mb-4" /> : <Activity className="text-slate-300 h-10 w-10 animate-pulse mb-4" />}
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed">
                                {scrapeStatus !== 'idle' ? `Aggregating: ${progress}%` : 'Awaiting Data Handshake...'}
                            </p>
                        </div>
                    ) : (
                        <div className="animate-slide-in-up space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-0">
                            {activeProperty && (
                                <div className="bg-slate-900 text-white p-6 rounded-3xl border border-white/10 relative overflow-hidden">
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-lg font-black">${activeProperty.coreEstimate.toLocaleString()}</span>
                                            <span className="text-brand-primary text-xs font-black uppercase">Internal Trace</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-brand-primary/5 p-6 rounded-3xl border border-brand-primary/20">
                                <h4 className="font-black text-slate-800 dark:text-white text-lg mb-2">{insight.title}</h4>
                                <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed italic">"{insight.content}"</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
