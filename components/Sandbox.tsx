
import React, { useState } from 'react';
import { Beaker, Lightbulb, TrendingUp, Users, ArrowLeft, Lock, Target, ChevronRight, Shield } from 'lucide-react';
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
        icon: TrendingUp,
        title: "Valuation Challenge",
        tagline: "Cap Rate & NOI Deep Dive",
        description: "Analyze a mixed-use property. Provide income/expense data, and MYA will provide comps, calculate NOI, and estimate a cap rate.",
        featureKey: 'valuationTool' as keyof BetaConfig['features'],
        difficulty: 'Advanced'
    },
    {
        id: 'negotiation' as Scenario,
        icon: Users,
        title: "Negotiation SIM",
        tagline: "Buyer Objection Roleplay",
        description: "Practice negotiation skills. MYA will role-play a buyer with specific objections. Your goal is to reach a deal.",
        featureKey: 'negotiationSim' as keyof BetaConfig['features'],
        difficulty: 'Intermediate'
    },
    {
        id: 'analysis' as Scenario,
        icon: Lightbulb,
        title: "Market Insight",
        tagline: "Demographic Trend Analysis",
        description: "Identify opportunities in a target market. Ask MYA to interpret demographic data and predict future growth areas.",
        featureKey: 'marketAnalysis' as keyof BetaConfig['features'],
        difficulty: 'Standard'
    },
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
            <div className="bg-white dark:bg-base-200 p-12 rounded-2xl shadow-xl border-t-8 border-status-red text-center animate-fade-in">
                <Shield className="h-16 w-16 text-status-red mx-auto mb-6 animate-pulse" />
                <h2 className="text-3xl font-black text-slate-900 dark:text-gray-100 tracking-tight">Access Restricted</h2>
                <p className="text-lg text-slate-600 dark:text-gray-400 mt-3 max-w-md mx-auto leading-relaxed">The Simulation Environment has been paused for technical maintenance or policy updates.</p>
                <div className="mt-8 flex justify-center">
                    <span className="px-4 py-1.5 bg-slate-100 dark:bg-base-300 rounded-full text-xs font-mono text-slate-500 uppercase tracking-widest">Code: Maintenance_Active</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-base-200 p-6 sm:p-10 rounded-2xl shadow-xl animate-fade-in border border-slate-200 dark:border-base-300">
            {activeScenario ? renderScenario() : (
                <>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100 dark:border-base-300">
                        <div className="flex items-center gap-5">
                            <div className="bg-brand-primary/10 p-4 rounded-2xl">
                                <Beaker className="h-10 w-10 text-brand-primary" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-gray-100 tracking-tight">Interactive Lab</h2>
                                <p className="text-slate-500 dark:text-gray-400 font-medium">Immersive Simulations for Data Analysts & Agents.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-base-100 px-4 py-2 rounded-full border border-slate-100 dark:border-base-300">
                            <Target size={14} className="text-status-green" /> Environment: STABLE
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {scenarioDetails.map((scenario) => {
                            const Icon = scenario.icon;
                            const isEnabled = config.features[scenario.featureKey];

                            return (
                                    <button 
                                    key={scenario.id} 
                                    onClick={() => isEnabled && setActiveScenario(scenario.id)}
                                    disabled={!isEnabled}
                                    className={`group relative flex flex-col p-6 rounded-2xl border text-left transition-all duration-300 ${
                                        isEnabled 
                                        ? 'bg-white dark:bg-base-300/30 border-slate-200 dark:border-base-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:border-brand-primary dark:hover:border-brand-primary transform hover:-translate-y-1' 
                                        : 'bg-slate-50 dark:bg-base-300 border-slate-100 dark:border-base-300 opacity-60 cursor-not-allowed'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`p-3 rounded-xl ${isEnabled ? 'bg-brand-primary/10 text-brand-primary' : 'bg-slate-200 text-slate-400'}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                                            scenario.difficulty === 'Advanced' ? 'bg-status-red/10 text-status-red' :
                                            scenario.difficulty === 'Intermediate' ? 'bg-status-yellow/10 text-status-yellow' :
                                            'bg-status-green/10 text-status-green'
                                        }`}>
                                            {scenario.difficulty}
                                        </span>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h4 className={`text-xl font-black mb-1 tracking-tight ${isEnabled ? 'text-slate-900 dark:text-gray-100' : 'text-slate-500'}`}>
                                            {scenario.title}
                                        </h4>
                                        <p className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest mb-4">{scenario.tagline}</p>
                                        <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed line-clamp-3">{scenario.description}</p>
                                    </div>

                                    <div className="mt-8 flex items-center justify-between">
                                        {isEnabled ? (
                                            <>
                                                <span className="text-xs font-bold text-brand-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                                    Launch Simulation <ChevronRight size={14} />
                                                </span>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                <Lock size={12} /> Access Restricted
                                            </div>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-12 p-6 bg-slate-50 dark:bg-base-100/50 rounded-2xl border border-dashed border-slate-300 dark:border-base-300 flex flex-col sm:flex-row items-center gap-6">
                        <div className="bg-white dark:bg-base-200 p-3 rounded-full shadow-sm">
                            <Lightbulb className="h-6 w-6 text-status-yellow" />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 italic text-center sm:text-left">
                            "The Interactive Lab uses <strong>Gemini 3.0 Real-time Context</strong> to adapt scenarios based on your specific inputs. No two sessions are the same."
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}
