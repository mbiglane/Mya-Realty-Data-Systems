
import React, { useState } from 'react';
import { BookOpen, CheckCircle, Clock, ChevronRight, Play, Sparkles, ArrowRight } from 'lucide-react';

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
            <div className="space-y-8 animate-fade-in">
                <h2 className="text-4xl font-black text-white tracking-tighter italic">Intelligence x Infrastructure</h2>
                <p className="text-xl text-slate-400 leading-relaxed font-medium">
                    The intersection of real estate and artificial intelligence represents the most significant wealth-transfer opportunity of the century.
                </p>
                <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
                    <p>
                        We are moving from static listings to **Dynamic Asset Intelligence**. In PropTech 3.0, every property is no longer just a physical location, but a node in a vast neural network of market trends.
                    </p>
                    <p>
                        Traditional valuation relies on "Comps" from 3-6 months ago. AI-driven systems use **Grounding Engines** to look at data from 3-6 *minutes* ago. This shifts the real estate professional's role from a information-gatherer to an insight-strategist.
                    </p>
                </div>
                <div className="bg-brand-primary/10 border border-brand-primary/20 p-6 rounded-3xl">
                    <h4 className="font-black text-brand-primary uppercase text-xs tracking-widest flex items-center gap-2 mb-2"><Sparkles size={16}/> Strategic Insight</h4>
                    <p className="text-sm text-slate-300 italic">
                        "Real estate data is no longer about recording history; it's about predicting the future before the listing hits the market."
                    </p>
                </div>
            </div>
        )
    },
    // ... Additional modules remain consistent but visual styles are updated
    {
        id: 'mod-02',
        title: '02. Predictive Valuation',
        subtitle: 'Beyond the Spreadsheet',
        readTime: '15 min',
        content: (
            <div className="space-y-8 animate-fade-in">
                <h2 className="text-4xl font-black text-white tracking-tighter italic">Machine-Assisted Alpha</h2>
                <p className="text-xl text-slate-400 leading-relaxed font-medium">
                    AVMs (Automated Valuation Models) are being replaced by **Generative Financial Agents**.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                    <div className="p-6 bg-slate-900 rounded-3xl border border-white/5">
                        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">Static AVM</h4>
                        <p className="text-xs text-slate-500">Historical regression based on past transactions. Lagging indicators.</p>
                    </div>
                    <div className="p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">Neural Valuation</h4>
                        <p className="text-xs text-slate-300">Real-time sentiment, foot traffic, and demographic forecasting. Leading indicators.</p>
                    </div>
                </div>
            </div>
        )
    }
];

export const InteractiveBook: React.FC<InteractiveBookProps> = ({ onOpenAssistant }) => {
    const [activeModuleId, setActiveModuleId] = useState('mod-01');
    const [completedModules, setCompletedModules] = useState<Set<string>>(new Set([]));

    const activeModule = curriculumData.find(m => m.id === activeModuleId) || curriculumData[0];

    const handleComplete = () => {
        const newSet = new Set(completedModules);
        newSet.add(activeModuleId);
        setCompletedModules(newSet);
        const currentIndex = curriculumData.findIndex(m => m.id === activeModuleId);
        if (currentIndex < curriculumData.length - 1) {
            setActiveModuleId(curriculumData[currentIndex + 1].id);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-full min-h-0">
            {/* Curriculum Index */}
            <div className="lg:w-80 flex flex-col shrink-0 gap-6">
                <div className="bg-slate-900 rounded-3xl border border-white/5 p-6 shadow-xl">
                    <h2 className="font-black text-white uppercase tracking-tighter text-lg flex items-center gap-2 mb-6">
                        <BookOpen size={20} className="text-brand-primary" />
                        Curriculum
                    </h2>
                    <div className="space-y-3">
                        {curriculumData.map((module, idx) => {
                            const isActive = module.id === activeModuleId;
                            const isCompleted = completedModules.has(module.id);
                            return (
                                <button
                                    key={module.id}
                                    onClick={() => setActiveModuleId(module.id)}
                                    className={`w-full text-left p-4 rounded-2xl transition-all border ${isActive ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20' : 'bg-transparent border-white/5 text-slate-400 hover:bg-white/5'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-xs font-black uppercase tracking-tight">{module.title}</h3>
                                        {isCompleted && <CheckCircle size={14} className="text-emerald-400" />}
                                    </div>
                                    <p className={`text-[10px] truncate ${isActive ? 'text-white/80' : 'text-slate-600'}`}>{module.subtitle}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
                
                <div className="bg-brand-primary/5 p-6 rounded-3xl border border-brand-primary/20">
                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1">Total Progress</p>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-brand-primary transition-all duration-1000" style={{ width: `${(completedModules.size / curriculumData.length) * 100}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Content Reader */}
            <div className="flex-1 bg-slate-900 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col overflow-hidden relative">
                <div className="flex-1 overflow-y-auto p-12 lg:p-16 custom-scrollbar">
                    <div className="max-w-3xl mx-auto">
                        {activeModule.content}
                        
                        <div className="mt-20 pt-10 border-t border-white/5 flex justify-between items-center">
                            <button 
                                className="text-xs font-black text-slate-600 hover:text-white uppercase tracking-widest transition-colors disabled:opacity-20"
                                disabled={curriculumData.findIndex(m => m.id === activeModuleId) === 0}
                                onClick={() => {
                                    const idx = curriculumData.findIndex(m => m.id === activeModuleId);
                                    if(idx > 0) setActiveModuleId(curriculumData[idx-1].id);
                                }}
                            >
                                Previous
                            </button>
                            
                            <button
                                onClick={handleComplete}
                                className="flex items-center gap-3 bg-brand-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-primary/20"
                            >
                                {curriculumData.findIndex(m => m.id === activeModuleId) === curriculumData.length - 1 ? 'End Phase' : 'Next Chapter'}
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="absolute top-8 right-8">
                     <button 
                        onClick={onOpenAssistant}
                        className="bg-brand-secondary text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-secondary/20 hover:scale-110 transition-all flex items-center gap-2"
                     >
                        <Sparkles size={14} /> Ask Mya Helper
                     </button>
                </div>
            </div>
        </div>
    );
};
