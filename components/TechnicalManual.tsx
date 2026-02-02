
import React, { useState } from 'react';
import { 
  Network, Cpu, Layers, Database, Terminal, ShieldAlert, Cloud, Workflow, FileCode, ArrowRight, Activity, Zap 
} from 'lucide-react';
import { SectionCard } from './SectionCard';

const CodeBlock = ({ title, code }: { title: string; code: string }) => (
    <div className="mt-4 mb-6 overflow-hidden rounded-xl border border-white/10">
        <div className="bg-slate-900 px-4 py-2 text-[10px] font-mono text-slate-500 border-b border-white/5 flex justify-between">
            <span>{title}</span>
            <span className="text-brand-primary/40">TS_STABLE</span>
        </div>
        <div className="bg-black p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-emerald-400"><code>{code}</code></pre>
        </div>
    </div>
);

export const TechnicalManual: React.FC = () => {
    const [view, setView] = useState<'architecture' | 'protocols' | 'security'>('architecture');

    return (
        <div className="space-y-8 animate-fade-in pb-20 max-w-5xl mx-auto">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border-b border-brand-primary/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                    <Terminal className="text-brand-primary" size={32} />
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">TITAN_SYSTEM_MANUAL</h1>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Mya Intelligence Infrastructure Analysis v2.5</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {(['architecture', 'protocols', 'security'] as const).map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setView(tab)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === tab ? 'bg-brand-primary text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {view === 'architecture' && (
                <SectionCard title="Distributed Neural Node Network" icon={Network}>
                    <div className="space-y-6">
                        <p className="text-sm text-slate-400 leading-relaxed">
                            The Titan architecture separates ingestion from inference, ensuring 99.9% uptime by utilizing edge proxies to rotate market nodes dynamically.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-6 bg-black rounded-3xl border border-white/5 text-center">
                                <Activity className="text-brand-primary mx-auto mb-2" size={24} />
                                <h4 className="text-[10px] font-black text-white uppercase mb-1">Scraper Hub</h4>
                                <p className="text-[10px] text-slate-500">HTML Refinement</p>
                            </div>
                            <div className="p-6 bg-black rounded-3xl border border-white/5 text-center">
                                <Cpu className="text-brand-secondary mx-auto mb-2" size={24} />
                                <h4 className="text-[10px] font-black text-white uppercase mb-1">Neural Core</h4>
                                <p className="text-[10px] text-slate-500">Gemini 3 Pro</p>
                            </div>
                            <div className="p-6 bg-black rounded-3xl border border-white/5 text-center">
                                <ShieldAlert className="text-status-yellow mx-auto mb-2" size={24} />
                                <h4 className="text-[10px] font-black text-white uppercase mb-1">Security Shield</h4>
                                <p className="text-[10px] text-slate-500">PII Redaction</p>
                            </div>
                        </div>
                        <CodeBlock title="core/ingestion.ts" code={`const fetchMarketNode = async (address: string) => {\n  const results = await Promise.all([\n    scrapeZillow(address),\n    scrapeRedfin(address)\n  ]);\n  return reconcile(results);\n};`} />
                    </div>
                </SectionCard>
            )}

            {view === 'protocols' && (
                <SectionCard title="Live WebSocket Handshake" icon={Workflow}>
                    <div className="space-y-6">
                        <div className="flex gap-4 items-center p-6 bg-brand-primary/5 rounded-3xl border border-brand-primary/20">
                            <Zap className="text-brand-primary" />
                            <p className="text-sm text-slate-300">The Live API captures PCM audio at 16kHz and returns human-like spoken audio at 24kHz.</p>
                        </div>
                        <CodeBlock title="api/live_session.ts" code={`const session = await ai.live.connect({\n  model: 'gemini-2.5-flash-native-audio-preview',\n  config: {\n    responseModalities: [Modality.AUDIO],\n    speechConfig: { voiceName: 'Kore' }\n  }\n});`} />
                    </div>
                </SectionCard>
            )}

            {view === 'security' && (
                <SectionCard title="Privacy Shield Implementation" icon={ShieldAlert}>
                    <div className="space-y-6">
                        <div className="bg-slate-900 p-8 rounded-3xl border border-white/5 text-center">
                            <h4 className="text-xl font-black text-white uppercase mb-2">Zero-Storage Policy</h4>
                            <p className="text-sm text-slate-500">User voice data is never written to disk. Inference happens in-memory with ephemeral buffers.</p>
                        </div>
                        <CodeBlock title="middleware/redact.ts" code={`export const maskPII = (text: string) => {\n  return text.replace(/\\b\\d{3}-\\d{3}-\\d{4}\\b/g, '[REDACTED]');\n};`} />
                    </div>
                </SectionCard>
            )}
        </div>
    );
};
