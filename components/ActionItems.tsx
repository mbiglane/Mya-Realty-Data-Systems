
import React from 'react';
import { Priority, type ActionItem } from '../types';
import { Clock } from 'lucide-react';

interface ActionItemsProps {
    items: ActionItem[];
}

const priorityMap = {
    [Priority.High]: {
        bgColor: 'bg-status-red/10',
        borderColor: 'border-status-red',
        textColor: 'text-status-red',
    },
    [Priority.Medium]: {
        bgColor: 'bg-status-yellow/10',
        borderColor: 'border-status-yellow',
        textColor: 'text-status-yellow',
    },
    [Priority.Low]: {
        bgColor: 'bg-brand-secondary/10',
        borderColor: 'border-brand-secondary',
        textColor: 'text-brand-secondary',
    },
};

export const ActionItems: React.FC<ActionItemsProps> = ({ items }) => {
    return (
        <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100 mb-4">Next Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, index) => {
                    const styles = priorityMap[item.priority];
                    
                    return (
                        <div key={index} className={`p-4 rounded-lg border-l-4 ${styles.bgColor} ${styles.borderColor}`}>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className={`font-bold ${styles.textColor}`}>{item.priority} Priority</h4>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${styles.bgColor} ${styles.textColor}`}>{item.priority}</span>
                            </div>
                            <p className="font-semibold text-slate-800 dark:text-gray-200">{item.title}</p>
                            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">{item.details}</p>
                            <div className="flex items-center text-xs text-slate-500 dark:text-gray-500 mt-3">
                                <Clock className="h-3 w-3 mr-1.5" />
                                Estimated time: {item.time}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
