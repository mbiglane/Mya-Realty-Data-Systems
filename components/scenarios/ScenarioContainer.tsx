import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface ScenarioContainerProps {
    title: string;
    onExit: () => void;
    children: React.ReactNode;
}

export const ScenarioContainer: React.FC<ScenarioContainerProps> = ({ title, onExit, children }) => {
    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100">{title}</h3>
                <Button onClick={onExit} variant="ghost">
                    <ArrowLeft size={16} className="mr-2" />
                    Exit Scenario
                </Button>
            </div>
            <div className="mt-4 p-4 border-t border-slate-200 dark:border-base-300">
                {children}
            </div>
        </div>
    );
};
