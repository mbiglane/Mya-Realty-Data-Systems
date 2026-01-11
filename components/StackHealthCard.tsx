
import React from 'react';
import { type TechStackItem } from '../types';

interface StackHealthCardProps {
    title: string;
    stack: TechStackItem[];
}

export const StackHealthCard: React.FC<StackHealthCardProps> = ({ title, stack }) => {
    return (
        <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-lg h-full">
            <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100 mb-4">{title}</h3>
            <ul className="space-y-3">
                {stack.map((item, index) => (
                    <li key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                             <span className="mr-3">{item.status}</span>
                            <span className="text-slate-800 dark:text-gray-200">{item.name}</span>
                        </div>
                        {item.version && <span className="font-mono text-xs text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-base-300 px-2 py-0.5 rounded">{item.version}</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};