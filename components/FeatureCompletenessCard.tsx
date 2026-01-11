
import React from 'react';
import type { FeatureStatus } from '../types';
import { Package } from 'lucide-react';

interface FeatureCompletenessCardProps {
    features: {
        core: FeatureStatus[];
        advanced: FeatureStatus[];
        admin: FeatureStatus[];
    };
}

const ProgressBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div>
        <div className="flex justify-between items-center mb-1 text-sm">
            <span className="text-slate-600 dark:text-gray-300">{label}</span>
            <span className="font-bold text-brand-secondary">{value}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-base-300 rounded-full h-2.5">
            <div
                className="bg-brand-secondary h-2.5 rounded-full"
                style={{ width: `${value}%` }}
            ></div>
        </div>
    </div>
);

export const FeatureCompletenessCard: React.FC<FeatureCompletenessCardProps> = ({ features }) => {
    return (
        <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-lg h-full">
            <div className="flex items-center mb-4">
                <Package className="h-6 w-6 text-brand-primary mr-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100">Feature Completeness</h3>
            </div>
            <div className="space-y-4">
                {features.core.map(f => <ProgressBar key={f.name} label={f.name} value={f.completeness} />)}
                {features.advanced.map(f => <ProgressBar key={f.name} label={f.name} value={f.completeness} />)}
                {features.admin.map(f => <ProgressBar key={f.name} label={f.name} value={f.completeness} />)}
            </div>
        </div>
    );
};