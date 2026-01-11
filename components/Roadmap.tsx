
import React from 'react';
import { Rocket, Globe, Zap, Shield, Cpu, Users, ChevronRight, CheckCircle2, Circle } from 'lucide-react';

const ROADMAP_DATA = [
    {
        phase: "Phase 1: Foundation (Current)",
        status: "Active",
        color: "brand-primary",
        items: [
            { title: "Mya Intelligence Engine", desc: "Core voice and multi-modal integration using Gemini 2.5/3.", status: "complete" },
            { title: "Proprietary Scraper Hub", desc: "Live property triangulation between Zillow and raw HTML metadata.", status: "complete" },
            { title: "SaaS Dashboard Framework", desc: "High-performance Titan interface with secure auth gateway.", status: "complete" }
        ]
    },
    {
        phase: "Phase 2: Deep Expansion",
        status: "Coming Q1 2025",
        color: "brand-secondary",
        items: [
            { title: "RAG Knowledge Base", desc: "Ability to upload and query entire company SOPs and local laws.", status: "in-progress" },
            { title: "Automated Valuation Agents", desc: "Autonomous bots that generate 100-page investment reports overnight.", status: "queued" },
            { title: "CRM Multi-Agent Sync", desc: "Mya integration for Salesforce and FollowUpBoss.", status: "queued" }
        ]
    },
    {
        phase: "Phase 3: Autonomous Real Estate",
        status: "Future Horizon",
        color: "status-yellow",
        items: [
            { title: "Virtual Showing Avatars", desc: "Interactive 3D avatars that walk clients through homes via AR.", status: "queued" },
            { title: "Autonomous Deal Sourcing", desc: "AI that finds, negotiates, and signs LOIs for specific criteria.", status: "queued" },
            { title: "Global Market Prediction", desc: "Predictive price modeling for every metro area worldwide.", status: "queued" }
        ]
    }
];

export const Roadmap: React.FC = () => {
    return (
        <div className="space-y-12 animate-fade-in max-w-5xl mx-auto pb-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic mb-4">The Horizon Timeline</h2>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Strategic Evolution of Mya Intelligence Systems</p>
            </div>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-white/5 hidden md:block"></div>

                <div className="space-y-16">
                    {ROADMAP_DATA.map((p, idx) => (
                        <div key={idx} className="relative md:pl-24 group">
                            {/* Phase Dot */}
                            <div className={`absolute left-5 top-2 w-7 h-7 rounded-full border-4 border-slate-950 z-10 hidden md:block transition-all group-hover:scale-125 ${
                                p.status === 'Active' ? 'bg-brand-primary' : 'bg-slate-800'
                            }`}></div>

                            <div className="bg-white dark:bg-base-200 rounded-[2.5rem] border border-white/5 shadow-2xl p-8 lg:p-12 hover:border-white/10 transition-all">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                                    <div>
                                        <h3 className="text-2xl font-black text-white tracking-tight uppercase mb-1">{p.phase}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${p.status === 'Active' ? 'bg-status-green' : 'bg-slate-600'}`}></span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{p.status}</span>
                                        </div>
                                    </div>
                                    <div className={`p-4 rounded-2xl bg-${p.color}/10 text-${p.color}`}>
                                        {idx === 0 ? <Zap size={24} /> : idx === 1 ? <Rocket size={24} /> : <Globe size={24} />}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {p.items.map((item, ii) => (
                                        <div key={ii} className="bg-slate-950 p-6 rounded-3xl border border-white/5 hover:bg-slate-900 transition-all group/item">
                                            <div className="flex justify-between items-start mb-4">
                                                {item.status === 'complete' ? (
                                                    <CheckCircle2 size={16} className="text-status-green" />
                                                ) : item.status === 'in-progress' ? (
                                                    <div className="h-4 w-4 rounded-full border-2 border-brand-secondary border-t-transparent animate-spin"></div>
                                                ) : (
                                                    <Circle size={16} className="text-slate-700" />
                                                )}
                                                <ChevronRight size={14} className="text-slate-800 group-hover/item:text-white transition-colors" />
                                            </div>
                                            <h4 className="text-white text-sm font-black uppercase tracking-tight mb-2 leading-tight">{item.title}</h4>
                                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-16 bg-brand-primary/5 p-10 rounded-[3rem] border-2 border-dashed border-brand-primary/20 text-center">
                <Shield className="h-10 w-10 text-brand-primary mx-auto mb-4" />
                <h3 className="text-white font-black text-lg uppercase mb-2 tracking-tighter">Strategic Commitment</h3>
                <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
                    Our roadmap is governed by **Responsible Intelligence Protocols**. Every phase includes a mandatory 90-day security audit before moving to public availability.
                </p>
            </div>
        </div>
    );
};
