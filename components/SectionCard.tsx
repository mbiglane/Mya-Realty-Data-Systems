
import React from 'react';
import type { ElementType, ReactNode } from 'react';

interface SectionCardProps {
    title: string;
    icon?: ElementType;
    children: ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, icon: Icon, children }) => {
    return (
        <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-lg h-full">
            <div className="flex items-center mb-4">
                {Icon && <Icon className="h-6 w-6 text-brand-primary mr-3" />}
                <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100">{title}</h3>
            </div>
            {children}
        </div>
    );
};