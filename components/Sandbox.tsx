import React, { useState } from 'react';
import { Beaker, Lightbulb, TrendingUp, Users, Target, ChevronRight, Shield, Activity, DollarSign } from 'lucide-react';
import { ValuationChallenge } from './scenarios/ValuationChallenge';
import { NegotiationSim } from './scenarios/NegotiationSim';
import { MarketAnalysis } from './scenarios/MarketAnalysis';
import { ScenarioContainer } from './scenarios/ScenarioContainer';
import { BetaConfig } from '../types';

type Scenario = 'valuation' | 'negotiation' | 'analysis' | null;

interface SandboxProps {
    isDarkMode: boolean;
    config: BetaConfig;
}

const scenarioDetails = [
    {
        id: 'valuation' as Scenario,
        icon: DollarSign,
        title: "Valuation Challenge",
        tagline: "Cap Rate & NOI Deep Dive",
        description: "Analyze property financial profiles. Mya provides regional comps, calculates NOI, and estimates cap rates based on current market grounding.",
        featureKey: 'valuationTool' as keyof BetaConfig['features'],
        difficulty: 'Advanced'
    },
    {
        id: 'negotiation' as Scenario,
        icon: Users,
        title: "Negotiation SIM",
        tagline: "High-Stakes Roleplay",
        description: "Practice closing techniques. Mya roleplays a savvy buyer with specific objections. Test your ability to maintain price integrity.",
        featureKey: 'negotiationSim' as keyof BetaConfig['features'],
        difficulty: 'Intermediate'
    },
    {
        id: 'analysis' as Scenario,
        icon: TrendingUp,
        title: "Market Analysis",
        tagline: "Demographic Foresight",
        description: "Generate deep-dive reports for any US sub-market. Access population trends, historical pricing, and predictive yield models.",
        featureKey: 'marketAnalysis' as keyof BetaConfig['features'],
        difficulty: 'Intermediate'
    }
]

export const Sandbox: React.FC<SandboxProps> = ({ isDarkMode, config }) => {
    const [activeScenario, setActiveScenario] = useState<Scenario>(null);

    const renderScenario = () => {
        switch (activeScenario) {
            case 'valuation':
                return (
                    <ScenarioContainer title="Property Valuation Simulation" onExit={() => setActiveScenario(null)}>
                        <ValuationChallenge />
                    </ScenarioContainer>
                );
            case 'negotiation':
                return (
                    <ScenarioContainer title="Negotiation Roleplay Terminal" onExit={() => setActiveScenario(null)}>
                        <NegotiationSim />
                    </ScenarioContainer>
                );
            case 'analysis':
                 return (
                    <ScenarioContainer title="Market Demographic Analysis" onExit={() => setActiveScenario(null)}>
                        <MarketAnalysis isDarkMode={isDarkMode} />
                    </ScenarioContainer>
                );
            default:
                return null;
        }
    }
    
    if (!config.isLive) {
        return (
            <div className="bg-slate-900 p-12 rounded-[3rem] border-t-8 border-status-red text-center animate-fade-in">
                <Shield className="h-16 w-16 text-status-red mx-auto mb-6 animate-pulse" />
                <h2 className="text-3xl font-black text-white tracking-tight uppercase">Simulation Locked</h2>
                <p className="text-lg text-slate-500 mt-3 max-w-md mx-auto italic">Technical maintenance in progress.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 p-6 sm:p-12 rounded-[3rem] shadow-2xl animate-fade-in border border-white/5">
            {activeScenario ? renderScenario() : (
                <>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-white/5">
                        <div className="flex items-center gap-6">
                            <div className="bg-brand-primary/10 p-5 rounded-3xl border border-brand-primary/20">
                                <Beaker className="h-10 w-10 text-brand-primary" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Interactive Lab</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Advanced Neural Training Environment</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-black/40 px-6 py-3 rounded-2xl border border-white/5">
                            <Activity size={14} className="text-status-green" /> Cluster: Nominal
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {scenarioDetails.map((scenario) => {
                            const Icon = scenario.icon;
                            const isEnabled = config.features[scenario.featureKey];

                            return (
                                <button 
                                    key={scenario.id} 
                                    onClick={() => isEnabled && setActiveScenario(scenario.id)}
                                    disabled={!isEnabled}
                                    className={`group flex flex-col p-8 rounded-[2.5rem] border text-left transition-all duration-500 ${
                                        isEnabled 
                                        ? 'bg-black/40 border-white/5 hover:border-brand-primary hover:bg-slate-950 transform hover:-translate-y-2' 
                                        : 'bg-slate-950/50 border-transparent opacity-40 cursor-not-allowed'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-8">
                                        <div className={`p-4 rounded-2xl ${isEnabled ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'bg-slate-800 text-slate-500'}`}>
                                            <Icon size={24} />
                                        </div>
                                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                            scenario.difficulty === 'Advanced' ? 'bg-status-red/10 text-status-red' :
                                            'bg-status-green/10 text-status-green'
                                        }`}>
                                            {scenario.difficulty}
                                        </span>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h4 className={`text-xl font-black mb-1 uppercase italic tracking-tight ${isEnabled ? 'text-white' : 'text-slate-500'}`}>
                                            {scenario.title}
                                        </h4>
                                        <p className="text-[10px] font-black text-brand-secondary uppercase tracking-widest mb-4">{scenario.tagline}</p>
                                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 italic">"{scenario.description}"</p>
                                    </div>

                                    <div className="mt-10 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-brand-primary group-hover:translate-x-2 transition-transform flex items-center gap-2 uppercase tracking-widest">
                                            {isEnabled ? 'Initialize' : 'Locked'} <ChevronRight size={14} />
                                        </span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-16 p-8 bg-black/40 rounded-[2.5rem] border border-white/5 flex flex-col sm:flex-row items-center gap-8">
                        <div className="bg-slate-950 p-4 rounded-3xl border border-white/10 shadow-xl">
                            <Lightbulb className="h-8 w-8 text-status-yellow" />
                        </div>
                        <p className="text-sm text-slate-400 italic leading-relaxed">
                            "The Interactive Lab utilizes <strong>Gemini 3 Pro</strong> for complex negotiation and valuation logic. Every simulation response is grounded in real-time market telemetry."
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}