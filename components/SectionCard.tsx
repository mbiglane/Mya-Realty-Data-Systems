import React from 'react';
import type { ElementType, ReactNode } from 'react';

interface SectionCardProps {
    title: string;
    icon?: ElementType;
    children: ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, icon: Icon, children }) => {
    return (
        <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/5 backdrop-blur-xl shadow-2xl h-full flex flex-col group hover:border-white/10 transition-all duration-500">
            <div className="flex items-center gap-5 mb-8">
                {Icon && (
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-brand-primary/20 transition-all">
                        <Icon size={20} className="text-brand-primary group-hover:scale-110 transition-transform" />
                    </div>
                )}
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">{title}</h3>
                  <div className="h-0.5 w-8 bg-brand-primary/20 mt-1 rounded-full group-hover:w-16 transition-all"></div>
                </div>
            </div>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
};