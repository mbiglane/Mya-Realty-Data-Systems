
import React from 'react';
import type { ElementType } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { AppConfig } from '../types';

interface MetricCardProps {
    title: string;
    value: number;
    icon: ElementType;
    color: string;
    config: AppConfig;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, color, config }) => {
    const data = [
        { name: 'value', value: value },
        { name: 'remaining', value: 100 - value },
    ];
    
    // Determine the hex color based on the Tailwind class passed in the `color` prop
    let chartColor = '#000000';
    if (color.includes('brand-primary')) chartColor = config.brandPrimary;
    else if (color.includes('brand-secondary')) chartColor = config.brandSecondary;
    else if (color.includes('status-green')) chartColor = '#22c55e';
    else if (color.includes('status-yellow')) chartColor = '#eab308';
    else if (color.includes('status-red')) chartColor = '#ef4444';

    return (
        <div className="bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg flex items-center space-x-4 transition-transform hover:scale-105">
            <div className="w-20 h-20 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            dataKey="value"
                            innerRadius={28}
                            outerRadius={35}
                            startAngle={90}
                            endAngle={450}
                            stroke="none"
                        >
                            <Cell key="value" fill={chartColor} />
                            <Cell key="remaining" className="pie-secondary-cell" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-slate-900 dark:text-gray-100">{value}</span>
                </div>
            </div>
            <div className="flex-1">
                <div className="flex items-center space-x-2">
                    <Icon className={`h-5 w-5 ${color}`} />
                    <h3 className="text-md font-semibold text-slate-600 dark:text-gray-300">{title}</h3>
                </div>
            </div>
        </div>
    );
};
