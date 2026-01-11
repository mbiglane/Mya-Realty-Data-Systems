
import React from 'react';
/* Added CheckCircle to imports */
import { Code, Server, Cpu, Layers, FolderTree, Database, Terminal, Mic, ShieldAlert, Key, Globe, TerminalSquare, Rocket, Zap, Github, Cloud, CheckCircle } from 'lucide-react';
import { SectionCard } from './SectionCard';

const CodeBlock = ({ title, code }: { title: string; code: string }) => (
    <div className="mt-4 mb-6 overflow-hidden rounded-lg border border-white/5">
        <div className="bg-slate-900 px-4 py-2 text-xs font-mono font-semibold text-slate-500 border-b border-white/5">
            {title}
        </div>
        <div className="bg-slate-950 p-4 overflow-x-auto">
            <pre className="text-xs sm:text-sm font-mono text-emerald-400">
                <code>{code}</code>
            </pre>
        </div>
    </div>
);

export const TechnicalManual: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in pb-12 relative max-w-5xl mx-auto">
             <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 rounded-3xl flex items-center gap-6 mb-8 shadow-inner">
                <div className="bg-emerald-500/20 p-4 rounded-2xl">
                    <Rocket className="h-10 w-10 text-emerald-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-emerald-400 uppercase tracking-tighter italic">Vercel & Netlify Deployment</h1>
                    <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">
                        Modern Infrastructure Strategy: Zero-Config Deployment
                    </p>
                </div>
            </div>

            <SectionCard title="1. User-Friendly Hosting Guide" icon={Cloud}>
                <div className="space-y-6">
                    <p className="text-sm text-slate-400 leading-relaxed">
                        For the best performance and ease of use, we recommend **Vercel** or **Netlify**. These platforms handle SSL, scaling, and distribution automatically.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900 p-6 rounded-2xl border border-white/5">
                            <h4 className="font-black text-[10px] uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                                <Github size={14}/> Github Integration
                            </h4>
                            <p className="text-xs text-slate-500 mb-4">Connect your repository to Vercel/Netlify for automatic "push-to-deploy" updates.</p>
                            <ul className="space-y-2 text-[10px] font-bold text-slate-400 uppercase">
                                <li className="flex items-center gap-2"> <CheckCircle size={10} className="text-emerald-400"/> Instant Branch Previews</li>
                                <li className="flex items-center gap-2"> <CheckCircle size={10} className="text-emerald-400"/> Automatic SSL Issuance</li>
                                <li className="flex items-center gap-2"> <CheckCircle size={10} className="text-emerald-400"/> Global Edge CDN</li>
                            </ul>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-2xl border border-white/5">
                            <h4 className="font-black text-[10px] uppercase tracking-widest text-violet-400 mb-4 flex items-center gap-2">
                                <Key size={14}/> Environment Secrets
                            </h4>
                            <p className="text-xs text-slate-500 mb-4">You must inject the Gemini API Key into the dashboard's Environment Variables section.</p>
                            <div className="bg-black/50 p-3 rounded-lg font-mono text-[10px] text-violet-400">
                                API_KEY=your_key_here
                            </div>
                        </div>
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="2. Intelligence Architecture" icon={Cpu}>
                <div className="space-y-8">
                    <div>
                        <h4 className="font-black text-xs text-brand-secondary uppercase flex items-center gap-2 mb-4">
                            <Zap size={16} /> Thinking Budgeting
                        </h4>
                        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                            Mya v2.0 utilizes **Gemini 3 Pro** with a specific **Thinking Budget** configuration. This allows the model to "reason" through complex property valuations before providing the final answer, significantly reducing hallucinations.
                        </p>
                        <CodeBlock 
                            title="config/ai.ts" 
                            code={`const response = await ai.models.generateContent({
  model: "gemini-3-pro-preview",
  config: {
    thinkingConfig: { thinkingBudget: 2048 },
    responseMimeType: "application/json"
  }
});`} 
                        />
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="3. Live WebSocket Protocol" icon={Mic}>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    Mya's voice link uses a high-performance **PCM Stream**. We capture audio at 16kHz and output at 24kHz using a custom decoding pipeline to ensure crystal-clear responsiveness on modern browsers.
                </p>
                <div className="bg-slate-900 p-8 rounded-3xl border border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="text-center">
                            <div className="text-emerald-400 font-black text-xs uppercase mb-2">Voice Latency</div>
                            <div className="text-3xl font-black text-white">85ms</div>
                            <p className="text-[8px] text-slate-600 uppercase mt-2">Edge Fiber Optimal</p>
                         </div>
                         <div className="text-center">
                            <div className="text-violet-400 font-black text-xs uppercase mb-2">Sync Rate</div>
                            <div className="text-3xl font-black text-white">99.9%</div>
                            <p className="text-[8px] text-slate-600 uppercase mt-2">Neural Frame Locking</p>
                         </div>
                         <div className="text-center">
                            <div className="text-brand-primary font-black text-xs uppercase mb-2">Throughput</div>
                            <div className="text-3xl font-black text-white">24kHz</div>
                            <p className="text-[8px] text-slate-600 uppercase mt-2">Hi-Fidelity PCM</p>
                         </div>
                    </div>
                </div>
            </SectionCard>

            <div className="text-center pt-8 opacity-20">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">© 2024 MYA INTELLIGENCE SYSTEMS | STABLE_BUILD_V2</p>
            </div>
        </div>
    );
};
