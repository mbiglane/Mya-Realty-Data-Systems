
import React, { useState, useEffect, useRef } from 'react';
import { Users, Video, Mic, MessageSquare, Plus, Sparkles, Activity, ShieldCheck, Zap, Search, Landmark, Calendar, Maximize, Cpu, BarChart3, Database, Filter, Layers, Globe, ZapOff } from 'lucide-react';
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
    const [activeProperty, setActiveProperty] = useState<any>(null);
    const [insight, setInsight] = useState<{ title: string; content: string; metrics: any } | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handlePropertySearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!propertySearch.trim()) return;
        
        setScrapeStatus('scraping');
        setActiveProperty(null);

        // Simulated Hybrid Pipeline: Superbot Scrape -> Zillow API Cross-Ref -> Mya Synthesis
        setTimeout(() => {
            setScrapeStatus('api-handshake');
            setTimeout(() => {
                setScrapeStatus('refining');
                setTimeout(() => {
                    setScrapeStatus('complete');
                    setActiveProperty({
                        address: propertySearch,
                        zestimate: 1245000,
                        scrapedPrice: 1210000,
                        sqft: 3450,
                        yearBuilt: 2014,
                        fidelityScore: 99.4, 
                        sourceType: 'Hybrid (Scrape + API)',
                        compsFound: 18,
                        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600"
                    });
                    setInsight({
                        title: "Hybrid Market Audit Finalized",
                        content: `Your Superbot identified a listing discrepancy: Zillow API reports $1.24M, but raw scrape detected a hidden 'Price Drop' tag in the HTML metadata not yet reflected in the aggregator. Mya recommends an aggressive opening bid at $1.15M.`,
                        metrics: { confidence: 99, risk: 'Low', upside: '158k' }
                    });
                }, 1000);
            }, 1000);
        }, 1500);
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
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-in pb-20 max-w-7xl mx-auto min-h-[700px] lg:h-[calc(100vh-220px)] w-full">
            {/* Left: Interaction Layer */}
            <div className="flex-1 flex flex-col gap-6 h-full min-h-0">
                <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/5 flex flex-col flex-1 min-h-0">
                    
                    {/* Integrated Search & Spec Bar */}
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
                                    <option value="distress-detection">Distress Detection</option>
                                    <option value="custom-spec">Custom Bot Spec</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-status-green animate-pulse' : 'bg-slate-500'}`}></div>
                                <span className="text-white text-[10px] font-black uppercase tracking-widest">{isLive ? 'Systems Ready' : 'Off-link'}</span>
                            </div>
                        </div>
                        
                        {/* Bot Status Indicators */}
                        {scrapeStatus !== 'idle' && (
                            <div className="flex gap-2 animate-fade-in">
                                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${scrapeStatus === 'scraping' ? 'bg-brand-primary text-white scale-105 shadow-lg' : 'bg-white/5 text-white/40'}`}>
                                    <Globe size={10} className={scrapeStatus === 'scraping' ? 'animate-spin' : ''} /> Superbot Crawl
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${scrapeStatus === 'api-handshake' ? 'bg-brand-secondary text-white scale-105 shadow-lg' : 'bg-white/5 text-white/40'}`}>
                                    <Layers size={10} className={scrapeStatus === 'api-handshake' ? 'animate-bounce' : ''} /> Zillow/Rapid Sync
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${scrapeStatus === 'refining' ? 'bg-status-yellow text-white scale-105 shadow-lg' : 'bg-white/5 text-white/40'}`}>
                                    <Sparkles size={10} className={scrapeStatus === 'refining' ? 'animate-pulse' : ''} /> Mya Refinement
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Visual Workspace */}
                    <div className="flex-1 flex items-center justify-center p-20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 pt-32 min-h-0 overflow-hidden">
                        {!isLive ? (
                            <div className="text-center group cursor-pointer" onClick={() => setIsLive(true)}>
                                <div className="w-24 h-24 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-2xl">
                                    <Database className="text-brand-primary h-10 w-10" />
                                </div>
                                <h3 className="text-white font-black text-2xl uppercase tracking-tighter mb-2">Connect to Neural Hub</h3>
                                <p className="text-slate-500 text-sm">Initialize proprietary bot-link and market API bridge.</p>
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-12 min-h-0">
                                <div className="grid grid-cols-2 gap-8 w-full max-w-2xl min-h-0 overflow-y-auto custom-scrollbar p-4">
                                    {collaborators.map(c => (
                                        <div key={c.id} className={`relative p-1 rounded-[2rem] border-2 transition-all duration-700 ${c.isActive ? 'border-brand-primary scale-105' : 'border-white/5 opacity-40'}`}>
                                            <img src={c.avatar} className="w-full aspect-square rounded-[1.8rem] object-cover" alt={c.name} />
                                            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                                                <p className="text-white text-[10px] font-black uppercase tracking-tight truncate">{c.name}</p>
                                                <p className="text-white/40 text-[8px] font-bold uppercase">{c.role}</p>
                                            </div>
                                            {c.isActive && (
                                                <div className="absolute top-4 right-4 w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center animate-pulse shadow-xl shadow-brand-primary/20">
                                                    <Mic size={14} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    
                                    {/* Active Property Card (The Hybrid Asset) */}
                                    {activeProperty && (
                                        <div className="relative p-1 rounded-[2rem] border-2 border-brand-secondary bg-slate-800 shadow-2xl animate-fade-in group overflow-hidden">
                                            <img src={activeProperty.image} className="w-full aspect-square rounded-[1.8rem] object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Property" />
                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                <div className="bg-brand-secondary text-white text-[8px] font-black uppercase px-2 py-1 rounded-md shadow-lg flex items-center gap-1 border border-white/10"><Cpu size={8}/> Superbot Verified</div>
                                                <div className="bg-black/60 backdrop-blur-sm text-brand-primary text-[8px] font-black uppercase px-2 py-1 rounded-md border border-brand-primary/20">{activeProperty.fidelityScore}% Data Fidelity</div>
                                            </div>
                                            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 via-transparent to-transparent">
                                                <p className="text-white text-lg font-black tracking-tight leading-tight mb-2 truncate">{activeProperty.address}</p>
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-1 text-white/80 text-[10px] font-bold uppercase"><Maximize size={10} /> {activeProperty.sqft}ft²</div>
                                                    <div className="flex items-center gap-1 text-white/80 text-[10px] font-bold uppercase"><BarChart3 size={10} /> {activeProperty.compsFound} Hybrid Comps</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!activeProperty && scrapeStatus === 'idle' && (
                                        <div className="border-2 border-dashed border-white/10 rounded-[2rem] flex items-center justify-center group cursor-pointer hover:border-brand-secondary transition-all">
                                            <div className="text-center">
                                                <Plus className="text-white/20 group-hover:text-brand-secondary h-12 w-12 mx-auto mb-2 transition-colors" />
                                                <p className="text-white/20 group-hover:text-brand-secondary text-[10px] font-black uppercase">Add Intelligence Layer</p>
                                            </div>
                                        </div>
                                    )}

                                    {scrapeStatus !== 'idle' && scrapeStatus !== 'complete' && !activeProperty && (
                                        <div className="border-2 border-white/5 bg-slate-800/50 rounded-[2rem] flex items-center justify-center">
                                            <div className="text-center relative">
                                                <div className="absolute -inset-8 bg-brand-primary/10 rounded-full animate-ping opacity-20"></div>
                                                <Activity className="text-brand-primary h-12 w-12 mx-auto mb-4 animate-pulse" />
                                                <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">{scrapeStatus}...</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Interaction Dock */}
                    <div className="p-8 bg-black/40 backdrop-blur-xl border-t border-white/5 flex items-center justify-between">
                        <div className="flex gap-4">
                            <button className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all ${isLive ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-white/10 text-white/40'}`}>
                                <Mic size={24} />
                            </button>
                            <button className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all">
                                <Video size={24} />
                            </button>
                            <button className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all">
                                <MessageSquare size={24} />
                            </button>
                        </div>
                        
                        <div className="flex-1 mx-12 h-16 bg-white/5 rounded-2xl border border-white/5 flex items-center px-6 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-transparent to-brand-primary/5 animate-pulse"></div>
                            <canvas ref={canvasRef} width={400} height={50} className="w-full h-12 opacity-50 relative z-10" />
                        </div>

                        <Button 
                            variant="primary" 
                            className={`px-12 h-16 rounded-2xl text-lg uppercase tracking-[0.2em] font-black transition-all ${isLive ? 'bg-status-red' : 'bg-brand-primary hover:scale-105'}`}
                            onClick={() => setIsLive(!isLive)}
                        >
                            {isLive ? 'Exit Hub' : 'Enter Hub'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right: Data Analysis Panel */}
            <div className="w-full lg:w-[400px] flex flex-col gap-6 h-full min-h-0">
                <div className="bg-white dark:bg-base-200 p-8 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-base-300 flex-1 flex flex-col overflow-hidden min-h-0">
                    <div className="flex items-center gap-3 mb-8">
                        <Sparkles className="text-brand-primary" />
                        <h3 className="font-black text-xl uppercase tracking-tight">Market Intelligence</h3>
                    </div>

                    {!insight ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-base-300 rounded-3xl flex items-center justify-center mb-6">
                                <Activity className="text-slate-300 h-10 w-10 animate-pulse" />
                            </div>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed">Awaiting Data Handshake...</p>
                        </div>
                    ) : (
                        <div className="animate-slide-in-up space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-0">
                            
                            {/* Superbot + Zillow Comparative Data */}
                            {activeProperty && (
                                <div className="bg-slate-900 text-white p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <Landmark size={80} />
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <h5 className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">Triangulated Values</h5>
                                        <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-primary w-[99%]"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex justify-between items-baseline">
                                            <div className="flex flex-col">
                                                <span className="text-white/40 text-[8px] font-black uppercase">Zillow Estimate</span>
                                                <span className="text-lg font-black">${activeProperty.zestimate.toLocaleString()}</span>
                                            </div>
                                            <div className="flex flex-col text-right">
                                                <span className="text-brand-primary text-[8px] font-black uppercase">Superbot Scrape</span>
                                                <span className="text-lg font-black">${activeProperty.scrapedPrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-brand-primary/10 p-3 rounded-xl border border-brand-primary/20">
                                            <p className="text-[10px] text-brand-primary font-black uppercase mb-1">Audit Variance</p>
                                            <p className="text-xs font-bold">Bot detected a 2.8% discount from aggregator book price.</p>
                                        </div>

                                        <div className="pt-4 grid grid-cols-2 gap-4 border-t border-white/10">
                                            <div>
                                                <p className="text-[8px] text-white/40 uppercase font-bold">Fidelity Index</p>
                                                <p className="text-xs font-black text-status-green">99.4% Critical</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] text-white/40 uppercase font-bold">Source Sync</p>
                                                <p className="text-xs font-black">Live Edge</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-brand-primary/5 p-6 rounded-3xl border border-brand-primary/20">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black text-brand-primary uppercase bg-brand-primary/10 px-3 py-1 rounded-full">Mya Synthesis</span>
                                    <ShieldCheck className="text-brand-primary h-5 w-5" />
                                </div>
                                <h4 className="font-black text-slate-800 dark:text-white text-lg mb-2 leading-tight">{insight.title}</h4>
                                <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed mb-4 italic">"{insight.content}"</p>
                                
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-brand-primary/10">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Arbitrage Found</p>
                                        <p className="text-brand-primary font-black text-lg">+${insight.metrics.upside}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Mya Confidence</p>
                                        <p className="text-slate-800 dark:text-white font-black text-lg">{insight.metrics.confidence}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Operational Pulse */}
                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-base-300/20 shrink-0">
                        <div className="flex items-center gap-3 mb-4">
                            <Zap className="text-status-yellow h-5 w-5" />
                            <h4 className="font-black text-xs uppercase tracking-widest">Bot Intelligence Dock</h4>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Bot Scrape Throughput</p>
                                <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">1.2GB/s</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">RapidAPI Latency</p>
                                <p className="text-2xl font-black text-status-green tracking-tighter">142ms</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
