
import React, { useMemo } from 'react';
import type { ElementType } from 'react';
import type { AppConfig } from '../types';

interface MetricCardProps {
    title: string;
    value: number;
    icon: ElementType;
    color: string;
    config: AppConfig;
}

export const MetricCard: React.FC<MetricCardProps> = React.memo(({ title, value, icon: Icon, color, config }) => {
    const strokeDasharray = useMemo(() => {
        const radius = 30;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (value / 100) * circumference;
        return { circumference, offset };
    }, [value]);

    let hexColor = '#2dd4bf';
    if (color.includes('brand-secondary')) hexColor = config.brandSecondary;
    else if (color.includes('status-green')) hexColor = '#22c55e';
    else if (color.includes('status-yellow')) hexColor = '#eab308';
    else if (color.includes('status-red')) hexColor = '#ef4444';

    return (
        <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 shadow-xl group hover:border-brand-primary/20 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-slate-950 industrial-border ${color} group-hover:scale-110 transition-transform`}>
                    <Icon size={20} />
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">{title}</p>
                </div>
            </div>
            
            <div className="flex items-end justify-between gap-4">
                <div className="relative h-16 w-16">
                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 80 80">
                        <circle
                            cx="40"
                            cy="40"
                            r="30"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-white/5"
                        />
                        <circle
                            cx="40"
                            cy="40"
                            r="30"
                            stroke={hexColor}
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={strokeDasharray.circumference}
                            strokeDashoffset={strokeDasharray.offset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-black text-white">{value}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</span>
                    <span className="text-[10px] font-black text-white uppercase italic">Optimal_Band</span>
                </div>
            </div>
        </div>
    );
});
