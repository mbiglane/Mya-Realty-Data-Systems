
import React from 'react';
import type { ElementType } from 'react';
import { Status, type StatusItem } from '../types';
import { CheckCircle, AlertTriangle, Wrench } from 'lucide-react';

interface StatusCardProps {
    title: string;
    items: StatusItem[];
    icon: ElementType;
}

const statusMap = {
    [Status.Operational]: { icon: CheckCircle, color: 'text-status-green', label: 'Operational' },
    [Status.Fixed]: { icon: Wrench, color: 'text-brand-secondary', label: 'Fixed' },
    [Status.NeedsAttention]: { icon: AlertTriangle, color: 'text-status-yellow', label: 'Needs Attention' },
    [Status.Warning]: { icon: AlertTriangle, color: 'text-status-yellow', label: 'Warning' },
};

export const StatusCard: React.FC<StatusCardProps> = ({ title, items }) => {
    return (
        <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-lg h-full">
            <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100 mb-4">{title}</h3>
            <ul className="space-y-3">
                {items.map((item, index) => {
                    const { icon: Icon, color, label } = statusMap[item.status];
                    return (
                        <li key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <Icon className={`h-5 w-5 mr-3 ${color}`} />
                                <div>
                                    <p className="text-slate-800 dark:text-gray-200">{item.name}</p>
                                    {item.details && <p className="text-xs text-slate-500 dark:text-gray-400">{item.details}</p>}
                                </div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-opacity-20 ${color.replace('text-', 'bg-')} ${color}`}>{label}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};