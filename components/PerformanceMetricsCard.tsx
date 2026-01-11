
import React from 'react';
import type { ElementType } from 'react';
import type { PerformanceMetric } from '../types';

interface PerformanceMetricsCardProps {
    title: string;
    metrics: PerformanceMetric[];
    icon: ElementType;
}

export const PerformanceMetricsCard: React.FC<PerformanceMetricsCardProps> = ({ title, metrics, icon: Icon }) => {
    return (
        <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-lg h-full">
            <div className="flex items-center mb-4">
                <Icon className="h-6 w-6 text-brand-primary mr-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100">{title}</h3>
            </div>
            <ul className="space-y-3">
                {metrics.map((metric, index) => (
                    <li key={index} className="flex justify-between items-baseline text-sm">
                        <span className="text-slate-500 dark:text-gray-400">{metric.name}</span>
                        <span className="font-semibold text-slate-900 dark:text-gray-100">{metric.value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};