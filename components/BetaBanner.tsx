
import React, { useState } from 'react';
import { AlertCircle, X, MessageSquare, Activity } from 'lucide-react';

export const BetaBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const handleFeedback = () => {
        window.open('mailto:beta-feedback@platform.ai?subject=Beta Feedback: AI Real Estate Platform');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 dark:bg-base-300/95 text-white backdrop-blur-md z-40 border-t border-brand-primary/40 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] animate-slide-in-up">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-green opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-status-green"></span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <span className="bg-brand-primary text-[10px] font-black px-2 py-0.5 rounded tracking-tighter uppercase shadow-sm">Beta 0.9.1</span>
                        <p className="text-xs sm:text-sm text-slate-300 font-medium">
                            Authorized Beta Access: Systems are nominal. <span className="hidden md:inline opacity-60">Session recording active for training purposes.</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                    <button 
                        onClick={handleFeedback}
                        className="text-xs sm:text-sm font-bold text-brand-secondary hover:text-white transition-all flex items-center gap-2 group"
                    >
                        <MessageSquare size={14} className="group-hover:scale-110 transition-transform" /> 
                        <span className="hidden sm:inline">Submit Bug</span>
                    </button>
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="text-slate-500 hover:text-white transition-colors p-1"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
