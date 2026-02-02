
import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, LogOut, Maximize, Minimize, 
  PanelLeftClose, PanelLeft, Activity, Monitor, ShieldCheck, Zap
} from 'lucide-react';
import { User } from '../types';
import { MYA_AVATAR_B64 } from '../constants/assets';

interface HeaderProps {
    title: string;
    onToggleTheme: () => void;
    isDarkMode: boolean;
    user: User | null;
    onLogout: () => void;
    onStartTour: () => void;
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    onToggleZen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    title, onToggleTheme, isDarkMode, user, onLogout, 
    isSidebarOpen, onToggleSidebar, onToggleZen 
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <header className="h-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 shrink-0 z-40 transition-all">
            <div className="flex items-center gap-6">
                <button 
                    onClick={onToggleSidebar}
                    className="text-slate-500 hover:text-white transition-all hover:scale-110 p-2 hover:bg-white/5 rounded-xl"
                >
                    {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
                </button>
                <div className="flex flex-col">
                    <h2 className="text-lg font-black text-white uppercase tracking-tighter italic leading-tight">
                        {title}
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-1 w-3 rounded-full ${i <= 2 ? 'bg-brand-primary' : 'bg-slate-800'}`}></div>
                            ))}
                        </div>
                        <span className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">Context_Link: Native</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center gap-6 px-6 py-2 bg-slate-900 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2">
                        <Zap size={14} className="text-brand-primary" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inference: 14ms</span>
                    </div>
                    <div className="h-4 w-px bg-white/10"></div>
                    <div className="flex items-center gap-2 text-status-green">
                        <ShieldCheck size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Security: Optimal</span>
                    </div>
                </div>

                <div className="flex items-center bg-slate-900 rounded-2xl p-1 industrial-border">
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-xl hover:bg-white/5 transition-all text-slate-500 hover:text-brand-primary"
                        title="Fullscreen"
                    >
                        {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                    </button>
                    
                    <button
                        onClick={onToggleZen}
                        className="p-2 rounded-xl hover:bg-white/5 transition-all text-slate-500 hover:text-brand-secondary"
                        title="Zen Mode"
                    >
                        <Monitor size={16} />
                    </button>

                    <button
                        onClick={onToggleTheme}
                        className="p-2 rounded-xl hover:bg-white/5 transition-all text-slate-500 hover:text-yellow-400"
                    >
                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                </div>

                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                    <div className="hidden sm:block text-right">
                        <p className="text-[10px] font-black uppercase text-white tracking-tight leading-none">{user?.name}</p>
                        <p className="text-[8px] text-brand-primary font-bold uppercase mt-1 leading-none tracking-widest">{user?.role}</p>
                    </div>
                    <button onClick={onLogout} className="relative group p-0.5 rounded-xl industrial-border hover:border-red-500/50 transition-all">
                        <img src={MYA_AVATAR_B64} className="h-9 w-9 rounded-[10px] object-cover" alt="User" />
                        <div className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 rounded-[10px] flex items-center justify-center transition-opacity">
                            <LogOut size={14} className="text-white" />
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};
