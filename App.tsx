import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { reportData as initialReportData } from './constants/reportData';
import type { AppConfig, User, BetaConfig, Tab } from './types';
import { Header } from './components/Header';
import { MetricCard } from './components/MetricCard';
import { StatusCard } from './components/StatusCard';
import { ActionItems } from './components/ActionItems';
import { SectionCard } from './components/SectionCard';
import { MyaAssistant } from './components/AiAssistant';
import { MYA_AVATAR_B64 } from './constants/assets';
import { Sandbox } from './components/Sandbox';
import { InteractiveBook } from './components/TableOfContents';
import { MarketingStudio } from './components/MarketingStudio';
import { BusinessPlanner } from './components/BusinessPlanner';
import { CollaborationRoom } from './components/CollaborationRoom';
import { LoginScreen } from './components/LoginScreen';
import { BetaBanner } from './components/BetaBanner';
import { TechnicalManual } from './components/TechnicalManual';
import { BetaAdmin } from './components/BetaAdmin';
import { TechnicalHealth } from './components/TechnicalHealth';
import { Roadmap } from './components/Roadmap';
import { UserManual } from './components/UserManual';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import { 
  ShieldCheck, Zap, Rocket, Sparkles, 
  LayoutDashboard, BookOpen, Beaker, Video, Users, 
  LineChart, Settings, HardDrive, HelpCircle, Map as RoadmapIcon,
  Activity, CheckCircle, Database, Key, AlertCircle, Globe, Terminal
} from 'lucide-react';

const DEFAULT_CONFIG: AppConfig = {
    title: 'Titan Intelligence',
    brandPrimary: '#2dd4bf', 
    brandSecondary: '#a78bfa', 
};

const DEFAULT_BETA_CONFIG: BetaConfig = {
    isLive: true,
    maxUsers: 100,
    safetyLevel: 'standard',
    knowledgeBase: '',
    activePersona: 'analyst_desk',
    features: {
        voiceAssistant: true, marketAnalysis: true, negotiationSim: true,
        valuationTool: true, visionAudit: false, marketingGen: true,
    },
    apiIntegration: { enabled: true, endpointUrl: '', apiKey: '' }
};

const MOCK_TELEMETRY = Array.from({ length: 15 }, (_, i) => ({
    name: i,
    stability: 88 + Math.random() * 12,
    inference: 30 + Math.random() * 70,
}));

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('Overview');
    const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
    const [betaConfig, setBetaConfig] = useState<BetaConfig>(DEFAULT_BETA_CONFIG);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isZenMode, setIsZenMode] = useState(false);
    const [hasApiKey, setHasApiKey] = useState<boolean>(false);
    const [bootPhase, setBootPhase] = useState(0);
    
    const config = useMemo(() => DEFAULT_CONFIG, []);
    const reportData = useMemo(() => initialReportData, []);

    useEffect(() => {
        if (user) {
          const timer = setInterval(() => {
            setBootPhase(prev => {
              if (prev >= 100) {
                clearInterval(timer);
                return 100;
              }
              return prev + 5;
            });
          }, 30);
          return () => clearInterval(timer);
        }
    }, [user]);

    useEffect(() => {
        const checkKey = async () => {
            if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
                try {
                    const active = await window.aistudio.hasSelectedApiKey();
                    setHasApiKey(active);
                } catch (e) {
                    console.debug("API Check pending...");
                }
            }
        };
        checkKey();
        const timer = setInterval(checkKey, 3000);
        return () => clearInterval(timer);
    }, []);

    const handleActivateApis = async () => {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            setHasApiKey(true);
        } else {
            alert("API Setup available in AI Studio Preview.");
        }
    };

    const handleAuthAttempt = (email: string, name: string) => {
        const newUser: User = {
            id: 'u-' + Math.random().toString(36).substring(2, 9),
            name, email,
            role: email.includes('admin') ? 'admin' : 'user',
            status: 'active', joinedAt: new Date().toISOString()
        };
        setUser(newUser);
        return { success: true, user: newUser };
    };

    if (!user) return <LoginScreen onAuthAttempt={handleAuthAttempt} />;

    if (bootPhase < 100) {
        return (
            <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-8 space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-brand-primary/20 blur-3xl animate-pulse"></div>
                    <Sparkles className="text-brand-primary animate-spin-slow relative z-10" size={64} />
                </div>
                <div className="w-64 space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-brand-primary uppercase tracking-widest">
                        <span>Neural_Sync</span>
                        <span>{bootPhase}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-brand-primary transition-all duration-300" style={{ width: `${bootPhase}%` }}></div>
                    </div>
                </div>
                <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest animate-pulse">Initializing Titan Kernel...</p>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <div className="space-y-8 animate-fade-in pb-24">
                         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="h-2 w-2 rounded-full bg-brand-primary animate-heartbeat shadow-[0_0_8px_#2dd4bf]"></div>
                                    <p className="text-brand-primary font-black uppercase tracking-[0.4em] text-[10px] opacity-60">System_Node: Terminal_01 Active</p>
                                </div>
                                <h1 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-2xl">Titan Hub</h1>
                            </div>
                            <div className="flex items-center gap-6 bg-slate-900/40 p-5 rounded-[2rem] border border-white/5 backdrop-blur-xl shadow-2xl group hover:border-brand-primary/20 transition-all">
                                <div className="h-12 w-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/20 group-hover:scale-110 transition-transform">
                                    <Database size={24} />
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Inference_Engine</p>
                                    <p className="text-sm font-bold text-white uppercase italic">Gemini 3 Pro</p>
                                </div>
                            </div>
                        </div>

                        {!hasApiKey && (
                            <div className="group relative p-10 bg-gradient-to-r from-brand-primary/10 to-transparent border border-brand-primary/20 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 animate-fade-in overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                    <Terminal size={160} />
                                </div>
                                <div className="flex items-center gap-8 text-brand-primary relative z-10">
                                    <div className="p-6 bg-brand-primary/10 rounded-[2rem] border border-brand-primary/20 shadow-inner">
                                        <Key size={40} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black uppercase tracking-widest leading-none mb-2">Multi-Modal Locked</p>
                                        <p className="text-sm opacity-60 font-medium italic">Project credentials required for real-time market synthesis and audio telemetry.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleActivateApis}
                                    className="relative z-10 px-12 py-6 bg-brand-primary text-slate-950 font-black uppercase tracking-[0.3em] text-xs rounded-2xl hover:bg-teal-400 hover:scale-105 transition-all shadow-2xl shadow-brand-primary/20 flex items-center gap-3"
                                >
                                    Initialize Neural Keys
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Market Triage" value={96} icon={Rocket} color="text-brand-primary" config={config} />
                            <MetricCard title="System Pulse" value={99} icon={Activity} color="text-status-green" config={config} />
                            <MetricCard title="Inference Fidelity" value={98} icon={Zap} color="text-status-yellow" config={config} />
                            <MetricCard title="Global Clusters" value={92} icon={Globe} color="text-brand-secondary" config={config} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                             <div className="lg:col-span-8 space-y-8">
                                <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/5 backdrop-blur-xl shadow-2xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-brand-primary/10 rounded-2xl border border-brand-primary/20">
                                              <Activity className="text-brand-primary" size={20} />
                                            </div>
                                            <div>
                                              <h3 className="font-black text-xs uppercase tracking-widest text-white">Stability Telemetry</h3>
                                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Cross-referencing 512 Nodes</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                          <span className="text-[10px] font-mono text-brand-primary block tracking-[0.2em]">HZ: 144.2</span>
                                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Active_Stream</span>
                                        </div>
                                    </div>
                                    <div className="h-72 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={MOCK_TELEMETRY}>
                                                <defs>
                                                    <linearGradient id="colorStab" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                                <XAxis dataKey="name" hide />
                                                <YAxis domain={[0, 100]} hide />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.5rem', padding: '12px' }}
                                                />
                                                <Area type="monotone" dataKey="stability" stroke="#2dd4bf" strokeWidth={4} fill="url(#colorStab)" animationDuration={2000} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SectionCard title="Active Protocols" icon={ShieldCheck}>
                                        <div className="space-y-4 mt-2">
                                            <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 group hover:border-brand-primary/20 transition-all">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Neural_Module</p>
                                                <p className="text-xs text-white font-mono flex items-center gap-3">
                                                    <div className="h-2 w-2 rounded-full bg-brand-primary shadow-[0_0_5px_#2dd4bf]"></div>
                                                    GEMINI_3_PRO_V1
                                                </p>
                                            </div>
                                            <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 group hover:border-brand-secondary/20 transition-all">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Vision_Engine</p>
                                                <p className="text-xs text-white font-mono flex items-center gap-3">
                                                    <div className="h-2 w-2 rounded-full bg-brand-secondary shadow-[0_0_5px_#a78bfa]"></div>
                                                    VEO_3.1_FAST
                                                </p>
                                            </div>
                                        </div>
                                    </SectionCard>
                                    <SectionCard title="Market Insight" icon={Sparkles}>
                                        <div className="p-6 bg-slate-950/40 rounded-[2rem] border border-white/5 h-full flex flex-col justify-center">
                                          <p className="text-xs text-slate-400 leading-relaxed italic text-center">
                                              "Market velocity across key urban clusters is showing a 12% divergence from historical regression models. Neural grounding recommended for next appraisal."
                                          </p>
                                        </div>
                                    </SectionCard>
                                </div>
                            </div>
                            <div className="lg:col-span-4 flex flex-col gap-8">
                                <ActionItems items={reportData.actionItems} />
                                <StatusCard title="Sub-System Telemetry" items={reportData.systemStatus.operational} icon={CheckCircle} />
                            </div>
                        </div>
                    </div>
                );
            case 'Interactive Book': return <InteractiveBook onOpenAssistant={() => setIsAiAssistantOpen(true)} />;
            case 'Sandbox': return <Sandbox isDarkMode={true} config={betaConfig} />;
            case 'Marketing Studio': return <MarketingStudio />;
            case 'Collaboration Room': return <CollaborationRoom />;
            case 'Business ROI': return <BusinessPlanner />;
            case 'User Manual': return <UserManual />;
            case 'Roadmap': return <Roadmap />;
            case 'Beta Admin': return <BetaAdmin config={betaConfig} onConfigChange={setBetaConfig} users={[user]} onUserStatusChange={() => {}} />;
            case 'System Manual': return <TechnicalManual />;
            case 'Technical Health': return <TechnicalHealth />;
            default: return null;
        }
    };

    const navItems: {id: Tab, icon: React.ElementType}[] = [
        { id: 'Overview', icon: LayoutDashboard },
        { id: 'Interactive Book', icon: BookOpen },
        { id: 'Sandbox', icon: Beaker },
        { id: 'Marketing Studio', icon: Video },
        { id: 'Collaboration Room', icon: Users },
        { id: 'Business ROI', icon: LineChart },
        { id: 'Roadmap', icon: RoadmapIcon },
        { id: 'Beta Admin', icon: Settings },
        { id: 'System Manual', icon: HardDrive },
        { id: 'Technical Health', icon: Activity }
    ];

    return (
        <div className={`min-h-screen bg-slate-950 text-slate-200 flex h-screen overflow-hidden ${isZenMode ? 'zen-mode' : ''}`}>
            {isSidebarOpen && !isZenMode && (
                <aside className="w-72 bg-slate-950 border-r border-white/5 flex flex-col transition-all z-50">
                    <div className="h-20 flex items-center px-8 border-b border-white/5">
                        <div className="h-10 w-10 bg-brand-primary/10 rounded-xl flex items-center justify-center mr-3 border border-brand-primary/20">
                            <Sparkles className="text-brand-primary" size={20} />
                        </div>
                        <span className="font-black text-2xl uppercase tracking-tighter italic text-white">Titan</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 space-y-2 custom-scrollbar">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative overflow-hidden ${activeTab === item.id ? 'bg-white/5 text-brand-primary border border-white/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                            >
                                <item.icon size={18} className={`${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                                <span className="font-black text-[10px] uppercase tracking-widest">{item.id}</span>
                                {activeTab === item.id && (
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-primary rounded-r-full shadow-[0_0_10px_#2dd4bf]"></div>
                                )}
                            </button>
                        ))}
                    </div>
                    {!hasApiKey && (
                        <div className="p-6 border-t border-white/5">
                             <button onClick={handleActivateApis} className="w-full py-4 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl text-brand-primary text-[10px] font-black uppercase tracking-widest animate-pulse hover:bg-brand-primary/20 transition-all">
                                <Key size={14} className="inline mr-2" /> Neural Handshake
                            </button>
                        </div>
                    )}
                </aside>
            )}

            <div className="flex-1 flex flex-col min-w-0 relative">
                <Header 
                    title={activeTab} onToggleTheme={() => {}} isDarkMode={true}
                    user={user} onLogout={() => setUser(null)} onStartTour={() => {}}
                    isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onToggleZen={() => setIsZenMode(!isZenMode)}
                />
                <main className="flex-1 overflow-y-auto p-8 lg:p-14 custom-scrollbar bg-slate-950/50">
                    <div className="max-w-7xl mx-auto">
                        <Suspense fallback={<div className="flex items-center justify-center h-full"><Zap className="animate-spin text-brand-primary" /></div>}>
                            <ErrorBoundary sectionName={activeTab}>
                                {renderContent()}
                            </ErrorBoundary>
                        </Suspense>
                    </div>
                </main>
                
                <button 
                    onClick={() => setIsAiAssistantOpen(true)}
                    className="fixed bottom-12 right-12 h-20 w-20 bg-slate-950 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-2 border-brand-primary overflow-hidden hover:scale-110 active:scale-95 transition-all z-50 group"
                >
                    <img src={MYA_AVATAR_B64} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all scale-110" alt="Mya" />
                    <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
            </div>

            <MyaAssistant 
                isOpen={isAiAssistantOpen} onClose={() => setIsAiAssistantOpen(false)} 
                reportData={reportData} betaConfig={betaConfig} user={user} 
                tourState={{isActive: false, currentStep: 'welcome'}} onUpdateTourStep={() => {}} onEndTour={() => {}}
            />
            <BetaBanner />
        </div>
    );
};

export default App;
