
import React, { useState, useEffect } from 'react';
/* Added Zap to the imports from lucide-react to fix 'Cannot find name' error */
import { BookOpen, CheckCircle, Clock, ChevronRight, Play, Sparkles, ArrowRight, Share2, Bookmark, Layout, Activity, MessageSquare, Zap } from 'lucide-react';

interface Module {
    id: string;
    title: string;
    subtitle: string;
    readTime: string;
    content: React.ReactNode;
}

interface InteractiveBookProps {
    onOpenAssistant?: () => void;
}

const curriculumData: Module[] = [
    {
        id: 'mod-01',
        title: '01. Neural PropTech',
        subtitle: 'The Future of Real Estate AI',
        readTime: '10 min',
        content: (
            <div className="space-y-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-primary/20"></div>
                    <span className="text-[10px] font-black uppercase text-brand-primary tracking-[0.5em]">FOUNDATION_LAYER</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-primary/20"></div>
                </div>
                
                <h2 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
                    Intelligence <br/><span className="text-brand-primary">x</span> Infrastructure
                </h2>
                
                <p className="text-2xl text-slate-400 leading-relaxed font-bold italic border-l-4 border-brand-primary pl-8">
                    The intersection of real estate and artificial intelligence represents the most significant wealth-transfer opportunity of the century.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10">
                    <div className="lg:col-span-8 prose prose-invert max-w-none space-y-8 text-slate-300 text-lg leading-relaxed font-medium">
                        <p>
                            We are moving from static listings to <span className="text-white font-black underline decoration-brand-primary decoration-4 underline-offset-4">Dynamic Asset Intelligence</span>. In PropTech 3.0, every property is no longer just a physical location, but a node in a vast neural network of market trends.
                        </p>
                        <p>
                            Traditional valuation relies on "Comps" from 3-6 months ago. AI-driven systems use **Grounding Engines** to look at data from 3-6 *minutes* ago. This shifts the real estate professional's role from an information-gatherer to an insight-strategist.
                        </p>
                        
                        <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-white/5 relative group">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Share2 size={16} className="text-slate-700 cursor-pointer hover:text-white" />
                            </div>
                            <p className="text-slate-400 italic">
                                "The agent of the future is an orchestrator of algorithms. The 'gut feeling' is now a validated inference model."
                            </p>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-4 space-y-6">
                        <div className="p-6 bg-brand-primary/10 rounded-3xl border border-brand-primary/20 animate-pulse-soft">
                            <h4 className="font-black text-brand-primary uppercase text-[10px] tracking-widest flex items-center gap-2 mb-4">
                                <Activity size={16}/> Live Context Grounding
                            </h4>
                            <div className="space-y-4">
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Market Velocity</p>
                                    <p className="text-white font-black text-xl">+12.4% <span className="text-[10px] text-emerald-400 tracking-tighter">(Q4 Pred)</span></p>
                                </div>
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Neural Demand Index</p>
                                    <p className="text-white font-black text-xl">High <span className="text-[10px] text-emerald-400 tracking-tighter">PHOENIX_CLUSTER</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'mod-02',
        title: '02. Predictive Valuation',
        subtitle: 'Beyond the Spreadsheet',
        readTime: '15 min',
        content: (
            <div className="space-y-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-primary/20"></div>
                    <span className="text-[10px] font-black uppercase text-brand-primary tracking-[0.5em]">ANALYSIS_LAYER</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-primary/20"></div>
                </div>

                <h2 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
                    Machine <br/><span className="text-brand-secondary">Assisted</span> Alpha
                </h2>
                
                <p className="text-xl text-slate-400 leading-relaxed font-bold">
                    AVMs (Automated Valuation Models) are being replaced by **Generative Financial Agents**.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                    <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-white/5 group hover:border-slate-700 transition-all">
                        <div className="h-12 w-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
                            <Zap className="text-slate-500" size={24} />
                        </div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Static AVM</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">Historical regression based on past transactions. Lagging indicators that fail in high-volatility environments.</p>
                    </div>
                    <div className="p-8 bg-emerald-500/10 rounded-[2.5rem] border border-emerald-500/20 group hover:scale-[1.02] transition-all">
                        <div className="h-12 w-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                            <Sparkles className="text-emerald-400" size={24} />
                        </div>
                        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4">Neural Valuation</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">Real-time sentiment, foot traffic, and demographic forecasting. Leading indicators derived from unstructured digital exhaust.</p>
                    </div>
                </div>
            </div>
        )
    }
];

export const InteractiveBook: React.FC<InteractiveBookProps> = ({ onOpenAssistant }) => {
    const [activeModuleId, setActiveModuleId] = useState('mod-01');
    const [completedModules, setCompletedModules] = useState<Set<string>>(new Set([]));
    const [scrolled, setScrolled] = useState(false);

    const activeModule = curriculumData.find(m => m.id === activeModuleId) || curriculumData[0];

    const handleComplete = () => {
        const newSet = new Set(completedModules);
        newSet.add(activeModuleId);
        setCompletedModules(newSet);
        const currentIndex = curriculumData.findIndex(m => m.id === activeModuleId);
        if (currentIndex < curriculumData.length - 1) {
            setActiveModuleId(curriculumData[currentIndex + 1].id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-12 h-full min-h-0">
            {/* Navigation Sidebar */}
            <div className="lg:w-80 flex flex-col shrink-0 gap-8 h-full">
                <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 p-8 shadow-2xl flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="font-black text-white uppercase tracking-tighter text-xl flex items-center gap-3">
                            <BookOpen size={20} className="text-brand-primary" />
                            Curriculum
                        </h2>
                        <span className="bg-slate-800 text-[8px] font-black text-slate-400 px-2 py-1 rounded">PHASE_1</span>
                    </div>
                    
                    <div className="space-y-4">
                        {curriculumData.map((module, idx) => {
                            const isActive = module.id === activeModuleId;
                            const isCompleted = completedModules.has(module.id);
                            return (
                                <button
                                    key={module.id}
                                    onClick={() => setActiveModuleId(module.id)}
                                    className={`w-full text-left p-5 rounded-3xl transition-all border group relative ${isActive ? 'bg-brand-primary text-white border-brand-primary shadow-xl shadow-brand-primary/20' : 'bg-transparent border-white/5 text-slate-500 hover:bg-white/5'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{module.title}</h3>
                                        {isCompleted && <CheckCircle size={14} className="text-emerald-400" />}
                                    </div>
                                    <p className={`text-xs font-bold leading-tight ${isActive ? 'text-white/80' : 'text-slate-600'}`}>{module.subtitle}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
                
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Neural Progress</p>
                            <p className="text-2xl font-black text-white italic">{(completedModules.size / curriculumData.length * 100).toFixed(0)}%</p>
                        </div>
                        <Activity className="text-brand-primary" size={24} />
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-primary transition-all duration-1000" style={{ width: `${(completedModules.size / curriculumData.length) * 100}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Premium Reader Interface */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-900 rounded-[3.5rem] border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden relative">
                {/* Reader Header Actions */}
                <div className="absolute top-10 left-12 right-12 z-30 flex justify-between items-center pointer-events-none">
                    <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5 pointer-events-auto flex items-center gap-6">
                        <button className="text-slate-500 hover:text-white transition-colors" title="Bookmark"><Bookmark size={16} /></button>
                        <button className="text-slate-500 hover:text-white transition-colors" title="Share"><Share2 size={16} /></button>
                        <div className="w-px h-4 bg-white/10"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Module: {activeModuleId.split('-')[1]}</span>
                    </div>
                    
                    <button 
                        onClick={onOpenAssistant}
                        className="pointer-events-auto bg-brand-secondary text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-brand-secondary/30 hover:scale-110 transition-all flex items-center gap-3"
                    >
                        <MessageSquare size={16} /> Explain Logic
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-16 lg:p-24 pt-32 lg:pt-40 custom-scrollbar">
                    <div className="max-w-4xl mx-auto pb-32">
                        {activeModule.content}
                        
                        <div className="mt-32 pt-16 border-t border-white/5 flex justify-between items-center">
                            <button 
                                className="group flex items-center gap-4 text-xs font-black text-slate-600 hover:text-white uppercase tracking-widest transition-all disabled:opacity-0"
                                disabled={curriculumData.findIndex(m => m.id === activeModuleId) === 0}
                                onClick={() => {
                                    const idx = curriculumData.findIndex(m => m.id === activeModuleId);
                                    if(idx > 0) setActiveModuleId(curriculumData[idx-1].id);
                                }}
                            >
                                <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-2 transition-transform" />
                                Previous
                            </button>
                            
                            <button
                                onClick={handleComplete}
                                className="group flex items-center gap-4 bg-brand-primary text-white px-10 py-6 rounded-3xl font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-primary/30"
                            >
                                {curriculumData.findIndex(m => m.id === activeModuleId) === curriculumData.length - 1 ? 'Finish Phase' : 'Next Chapter'}
                                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reader Footer Decor */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-20 pointer-events-none">
                    <div className="h-1 w-1 rounded-full bg-white"></div>
                    <div className="h-1 w-1 rounded-full bg-white"></div>
                    <div className="h-1 w-8 rounded-full bg-brand-primary"></div>
                    <div className="h-1 w-1 rounded-full bg-white"></div>
                    <div className="h-1 w-1 rounded-full bg-white"></div>
                </div>
            </div>
        </div>
    );
};
