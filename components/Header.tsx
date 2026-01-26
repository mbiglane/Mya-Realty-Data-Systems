
import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, LogOut, User as UserIcon, PlayCircle, Zap, 
  Maximize, Minimize, LayoutDashboard, PanelLeftClose, 
  PanelLeft, Activity, Monitor
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
    title, onToggleTheme, isDarkMode, user, onLogout, onStartTour, 
    isSidebarOpen, onToggleSidebar, onToggleZen 
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 shrink-0 z-40 transition-all">
            <div className="flex items-center gap-6">
                <button 
                    onClick={onToggleSidebar}
                    className="text-slate-500 hover:text-white transition-all hover:scale-110"
                    title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    {isSidebarOpen ? <PanelLeftClose size={22} /> : <PanelLeft size={22} />}
                </button>
                <div className="flex flex-col">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">
                        {title}
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse"></span>
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">In_System_Context</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                {/* Status Indicator */}
                <div className="hidden md:flex items-center gap-4 bg-black/40 px-4 py-2 rounded-2xl border border-white/5">
                    <Activity className="text-brand-primary animate-pulse" size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node_Stable</span>
                </div>

                {/* Control Group */}
                <div className="flex items-center bg-slate-800/50 rounded-2xl p-1 border border-white/5">
                    <button
                        onClick={toggleFullscreen}
                        className="p-2.5 rounded-xl hover:bg-white/10 transition-all text-slate-400 hover:text-brand-primary group"
                        title={isFullscreen ? "Exit Full Screen" : "Enter Native Full Screen"}
                    >
                        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} className="group-hover:scale-110" />}
                    </button>
                    
                    <button
                        onClick={onToggleZen}
                        className="p-2.5 rounded-xl hover:bg-white/10 transition-all text-slate-400 hover:text-brand-secondary"
                        title="Immersive Zen Mode"
                    >
                        <Monitor size={18} />
                    </button>

                    <button
                        onClick={onToggleTheme}
                        className="p-2.5 rounded-xl hover:bg-white/10 transition-all"
                        title="Toggle Theme"
                    >
                        {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-400" />}
                    </button>
                </div>

                {/* Tour Trigger */}
                <button 
                    onClick={onStartTour}
                    className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all group font-black uppercase text-[10px] tracking-widest"
                >
                    <PlayCircle size={14} className="group-hover:rotate-12 transition-transform" />
                    System Tour
                </button>

                {/* User HUD */}
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <div className="hidden sm:block text-right">
                        <p className="text-xs font-black uppercase text-white tracking-tight leading-none">{user?.name}</p>
                        <p className="text-[9px] text-brand-primary font-bold uppercase mt-1 leading-none">{user?.role}</p>
                    </div>
                    <div className="relative group cursor-pointer" onClick={onLogout}>
                        <img src={MYA_AVATAR_B64} className="h-10 w-10 rounded-xl border border-white/10 group-hover:border-red-500/50 transition-all" alt="User" />
                        <div className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity">
                            <LogOut size={16} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
