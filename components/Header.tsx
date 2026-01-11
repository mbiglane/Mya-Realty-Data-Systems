
import React from 'react';
import { BookOpen, Sun, Moon, FlaskConical, LogOut, User as UserIcon, PlayCircle, Zap } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
    title: string;
    onToggleTheme: () => void;
    isDarkMode: boolean;
    user: User | null;
    onLogout: () => void;
    onStartTour: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onToggleTheme, isDarkMode, user, onLogout, onStartTour }) => {
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-4 gap-4 md:gap-0 border-b border-transparent">
            <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-brand-primary flex-shrink-0" />
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-gray-100">{title}</h1>
                    <span className="inline-flex w-fit items-center px-3 py-1 rounded-full text-[10px] font-black bg-brand-primary/20 text-brand-primary border border-brand-primary/40 shadow-[0_0_15px_rgba(45,212,191,0.3)] animate-pulse">
                        <Zap size={10} className="mr-1 fill-brand-primary" /> BETA 1.0 UNLEASHED
                    </span>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                {user && (
                    <button 
                        onClick={onStartTour}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all group"
                    >
                        <PlayCircle size={16} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-wider">System Tour</span>
                    </button>
                )}

                {user && (
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-base-300 border border-slate-200 dark:border-base-100">
                        <div className="p-1 bg-brand-primary/20 rounded-full">
                            <UserIcon size={14} className="text-brand-primary" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-gray-200">
                            {user.name}
                        </span>
                    </div>
                )}

                <button
                    onClick={onToggleTheme}
                    className="p-2 rounded-full bg-slate-100 dark:bg-base-200 hover:bg-slate-200 dark:hover:bg-base-300 transition-colors"
                    aria-label="Toggle theme"
                >
                    {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
                </button>

                {user && (
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-200 dark:bg-base-300 text-slate-700 dark:text-gray-300 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
                        title="Sign Out"
                    >
                        <LogOut size={18} />
                        <span className="hidden md:inline">Sign Out</span>
                    </button>
                )}
            </div>
        </header>
    );
};
