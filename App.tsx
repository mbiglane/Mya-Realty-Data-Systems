
import React, { useState, useEffect, useCallback } from 'react';
import { reportData as initialReportData } from './constants/reportData';
import type { ReportData, AppConfig, User, BetaConfig, Tab, MyaPersona, TourState, TourStepId } from './types';
import { Header } from './components/Header';
import { MetricCard } from './components/MetricCard';
import { StatusCard } from './components/StatusCard';
import { ActionItems } from './components/ActionItems';
import { SectionCard } from './components/SectionCard';
import { TabNavigation } from './components/TabNavigation';
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
import { UserManual } from './components/UserManual';
import { BetaAdmin } from './components/BetaAdmin';
import { TechnicalHealth } from './components/TechnicalHealth';
import { Roadmap } from './components/Roadmap';

import { 
  ShieldCheck, Zap, BarChart2, CheckCircle, Activity, Rocket, 
  ClipboardList, Fingerprint, Phone, ClipboardCheck, Sparkles, 
  Film, LayoutDashboard, BookOpen, Beaker, Video, Users, 
  LineChart, Settings, HardDrive, HelpCircle, Map as RoadmapIcon
} from 'lucide-react';

const DEFAULT_CONFIG: AppConfig = {
    title: 'Mya Intelligence',
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
        voiceAssistant: true,
        marketAnalysis: true,
        negotiationSim: true,
        valuationTool: true,
        visionAudit: true,
        marketingGen: true,
    },
    apiIntegration: {
        enabled: true,
        endpointUrl: '',
        apiKey: ''
    }
};

const INITIAL_USERS: User[] = [
    { id: 'admin-001', name: 'System Admin', email: 'admin@platform.ai', role: 'admin', status: 'active', joinedAt: new Date().toISOString() },
    { id: 'user-001', name: 'Beta Tester', email: 'tester@platform.ai', role: 'user', status: 'active', joinedAt: new Date().toISOString() }
];

const STORAGE_KEY_USER = 'ai_platform_user_v3';
const STORAGE_KEY_DB = 'ai_platform_users_db_v3';

const hexToRgbString = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r} ${g} ${b}`;
};

const App: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
    const [activeTab, setActiveTab] = useState<Tab>('Overview');
    const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
    const [reportData] = useState<ReportData>(initialReportData);
    const [betaConfig, setBetaConfig] = useState<BetaConfig>(DEFAULT_BETA_CONFIG);
    const [isSecurityChecking, setIsSecurityChecking] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    const [tourState, setTourState] = useState<TourState>({
        isActive: false,
        currentStep: 'welcome'
    });
    
    const config = DEFAULT_CONFIG;

    // Handle Magic Links / Auto-Login via URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const access = params.get('access');
        const code = params.get('code');

        // If magic link detected (e.g., ?access=admin&code=BETA1.0)
        if (access && code?.toUpperCase() === 'BETA1.0') {
            const targetEmail = access === 'admin' ? 'admin@platform.ai' : 'tester@platform.ai';
            const targetUser = allUsers.find(u => u.email === targetEmail);
            
            if (targetUser) {
                handleAuthAttempt(targetUser.email, targetUser.name);
                // Clean up URL after successful detection
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeTab]);

    useEffect(() => {
        const storedUser = localStorage.getItem(STORAGE_KEY_USER);
        if (storedUser) {
            try { setUser(JSON.parse(storedUser)); } catch (e) {}
        }
    }, []);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const root = document.documentElement;
            root.style.setProperty('--color-brand-primary', hexToRgbString(config.brandPrimary));
            root.style.setProperty('--color-brand-secondary', hexToRgbString(config.brandSecondary));
        }
    }, [config]);

    const handleAuthAttempt = (email: string, name: string) => {
        const existingUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            setIsSecurityChecking(true);
            setTimeout(() => {
                setIsSecurityChecking(false);
                setUser(existingUser);
                localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(existingUser));
            }, 1000);
            return { success: true, user: existingUser };
        }
        return { success: false, message: 'Unauthorized entry.' };
    };

    const handleLogout = () => {
        setUser(null);
        setActiveTab('Overview');
        localStorage.removeItem(STORAGE_KEY_USER);
    };

    const startTour = () => {
        setTourState({ isActive: true, currentStep: 'welcome' });
        setActiveTab('Overview');
        setIsAiAssistantOpen(true);
    };

    const updateTourStep = useCallback((step: TourStepId) => {
        setTourState(prev => ({ ...prev, currentStep: step as TourStepId }));
        const stepTabs: Record<string, Tab> = {
            curriculum: 'Interactive Book',
            sandbox: 'Sandbox',
            marketing: 'Marketing Studio',
            admin: 'Beta Admin',
            welcome: 'Overview',
            personas: 'Overview'
        };
        if (stepTabs[step]) setActiveTab(stepTabs[step]);
        if (step === 'finish') {
            setActiveTab('Overview');
            setTimeout(() => setTourState({ isActive: false, currentStep: 'welcome' }), 2000);
        }
    }, []);

    const sidebarItems = [
        { id: 'Overview', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'Interactive Book', icon: BookOpen, label: 'Curriculum' },
        { id: 'Sandbox', icon: Beaker, label: 'AI Lab' },
        { id: 'Marketing Studio', icon: Video, label: 'Studio' },
        { id: 'Collaboration Room', icon: Users, label: 'Neural Hub' },
        { id: 'Business ROI', icon: LineChart, label: 'Business' },
        { id: 'Roadmap', icon: RoadmapIcon, label: 'Horizon' },
        { id: 'User Manual', icon: HelpCircle, label: 'Support' }
    ];

    const adminItems = [
        { id: 'Technical Health', icon: Activity, label: 'Telemetry' },
        { id: 'System Manual', icon: HardDrive, label: 'Infrastructure' },
        { id: 'Beta Admin', icon: Settings, label: 'Admin' }
    ];

    if (isSecurityChecking) return (
        <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-4 z-[100]">
             <Fingerprint className="h-20 w-20 text-brand-primary animate-pulse mb-8" />
             <h2 className="text-white text-3xl font-black uppercase tracking-widest text-center">Neural Shielding<br/>Protocol Engaged</h2>
             <div className="mt-12 w-80 h-1 bg-slate-900 overflow-hidden rounded-full"><div className="w-full h-full bg-brand-primary animate-[shimmer_1s_infinite]"></div></div>
        </div>
    );

    if (!user) return <LoginScreen onAuthAttempt={handleAuthAttempt} />;

    const NavButton = ({ item }: { item: any }) => (
        <button
            onClick={() => setActiveTab(item.id as Tab)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${activeTab === item.id ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
        >
            <item.icon size={20} className={`${activeTab === item.id ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
            {isSidebarOpen && <span className="font-bold text-sm uppercase tracking-wider">{item.label}</span>}
        </button>
    );

    return (
        <div className="flex h-screen bg-slate-950 text-gray-200 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-white/5 flex flex-col transition-all duration-500 z-50`}>
                <div className="p-6 flex items-center justify-center border-b border-white/5">
                    <div className="bg-brand-primary h-10 w-10 rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                        <Sparkles className="text-white" size={24} />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2 scrollbar-hide">
                    {sidebarItems.map(item => <NavButton key={item.id} item={item} />)}
                    
                    {user?.role === 'admin' && (
                        <div className="pt-6 mt-6 border-t border-white/5 space-y-2">
                            {isSidebarOpen && <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Internal Telemetry</p>}
                            {adminItems.map(item => <NavButton key={item.id} item={item} />)}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-white/5">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                        <Settings size={20} />
                        {isSidebarOpen && <span className="font-bold text-sm uppercase tracking-wider">Log Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
                <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 shrink-0 z-40">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            <LayoutDashboard size={24} />
                        </button>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">
                            {activeTab}
                        </h2>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4 bg-black/40 px-4 py-2 rounded-2xl border border-white/5">
                            <Activity className="text-brand-primary animate-pulse" size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node_Stable</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <img src={MYA_AVATAR_B64} className="h-10 w-10 rounded-xl border border-white/10" alt="Admin" />
                            <div className="hidden lg:block text-left">
                                <p className="text-xs font-black uppercase text-white tracking-tight">{user.name}</p>
                                <p className="text-[10px] text-brand-primary font-bold uppercase">{user.role}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 relative scroll-smooth custom-scrollbar">
                    <div className="max-w-7xl mx-auto w-full">
                        {activeTab === 'Overview' && (
                            <div className="space-y-12 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <MetricCard config={config} title="Launch Readiness" value={reportData.businessReadiness.featureCompleteness} icon={Rocket} color="text-brand-primary" />
                                    <MetricCard config={config} title="System Integrity" value={98} icon={Activity} color="text-status-green" />
                                    <MetricCard config={config} title="Inference Score" value={99} icon={Zap} color="text-status-yellow" />
                                    <MetricCard config={config} title="Privacy Score" value={100} icon={ShieldCheck} color="text-brand-secondary" />
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    <div className="lg:col-span-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <StatusCard title="Platform Health" items={reportData.systemStatus.operational} icon={CheckCircle} />
                                            <SectionCard title="Neural Scrape Protocol" icon={ClipboardList}>
                                                <div className="space-y-4">
                                                    <div className="p-4 bg-slate-900 rounded-2xl border border-white/5">
                                                        <h4 className="text-[10px] font-black text-brand-primary uppercase mb-2">Hybrid Verification</h4>
                                                        <p className="text-xs text-slate-400">Grounding engine successfully cross-referencing Zillow with live scraper nodes.</p>
                                                    </div>
                                                    <div className="p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl">
                                                        <h4 className="text-[10px] font-black text-brand-primary uppercase mb-2">Active Persona</h4>
                                                        <p className="text-xs text-slate-400 uppercase font-black italic">Mya: senior_analyst</p>
                                                    </div>
                                                </div>
                                            </SectionCard>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-4">
                                        <ActionItems items={reportData.actionItems} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Interactive Book' && <InteractiveBook onOpenAssistant={() => setIsAiAssistantOpen(true)} />}
                        {activeTab === 'Sandbox' && <Sandbox isDarkMode={isDarkMode} config={betaConfig} />}
                        {activeTab === 'Marketing Studio' && <MarketingStudio />}
                        {activeTab === 'Collaboration Room' && <CollaborationRoom />}
                        {activeTab === 'Business ROI' && <BusinessPlanner />}
                        {activeTab === 'User Manual' && <UserManual />}
                        {activeTab === 'Technical Health' && <TechnicalHealth />}
                        {activeTab === 'System Manual' && <TechnicalManual />}
                        {activeTab === 'Roadmap' && <Roadmap />}
                        {activeTab === 'Beta Admin' && (
                            <BetaAdmin 
                                config={betaConfig} 
                                onConfigChange={setBetaConfig} 
                                users={allUsers} 
                                onUserStatusChange={(id, s) => setAllUsers(allUsers.map(u => u.id === id ? {...u, status: s} : u))} 
                            />
                        )}
                    </div>
                </main>

                {/* Immersive AI FAB */}
                <button 
                    onClick={() => setIsAiAssistantOpen(true)}
                    className="fixed bottom-12 right-12 group z-[60]"
                >
                    <div className="absolute -inset-4 bg-brand-primary/20 rounded-full animate-ping"></div>
                    <div className="relative h-20 w-20 bg-slate-900 rounded-[2rem] shadow-2xl shadow-brand-primary/40 flex items-center justify-center border-2 border-brand-primary overflow-hidden hover:scale-110 transition-transform duration-500">
                        <img src={MYA_AVATAR_B64} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Mya" />
                        <div className="absolute bottom-2 right-2 h-4 w-4 bg-status-green rounded-full border-2 border-slate-900"></div>
                    </div>
                    <div className="absolute -top-12 right-0 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                        Open Mya Assistant
                    </div>
                </button>
            </div>

            <MyaAssistant 
                isOpen={isAiAssistantOpen} 
                onClose={() => setIsAiAssistantOpen(false)} 
                reportData={reportData} 
                betaConfig={betaConfig} 
                user={user} 
                tourState={tourState}
                onUpdateTourStep={updateTourStep}
                onEndTour={() => setTourState({ isActive: false, currentStep: 'welcome' })}
            />
            <BetaBanner />
        </div>
    );
};

export default App;
