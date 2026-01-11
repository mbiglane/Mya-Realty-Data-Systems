
import React from 'react';
import { CheckCircle, Award } from 'lucide-react';

interface Conclusion {
    title: string;
    summary: string;
    achievements: string[];
    recommendation: string;
}

interface ConclusionCardProps {
    conclusion: Conclusion;
}

export const ConclusionCard: React.FC<ConclusionCardProps> = ({ conclusion }) => {
    return (
        <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-lg border-t-4 border-brand-primary">
            <div className="flex items-center mb-4">
                <Award className="h-8 w-8 text-brand-primary mr-4" />
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-gray-100">{conclusion.title}</h2>
                    <p className="text-sm text-slate-500 dark:text-gray-400">{conclusion.summary}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                    <h4 className="font-semibold text-slate-800 dark:text-gray-200 mb-2">Key Achievements</h4>
                    <ul className="space-y-2 text-sm">
                        {conclusion.achievements.map((item, index) => (
                            <li key={index} className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-status-green mr-2 mt-0.5 shrink-0" />
                                <span className="text-slate-600 dark:text-gray-300">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-slate-100 dark:bg-base-100 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                    <h4 className="font-semibold text-slate-800 dark:text-gray-200">Final Recommendation</h4>
                    <p className="text-lg font-bold text-status-green mt-2 tracking-wider uppercase">
                        {conclusion.recommendation}
                    </p>
                </div>
            </div>
        </div>
    );
};