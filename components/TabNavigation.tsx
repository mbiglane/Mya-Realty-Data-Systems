
import React from 'react';
import { Tab } from '../types';

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <nav className="border-b border-slate-200 dark:border-base-300 overflow-x-auto">
            <ul className="flex items-center -mb-px space-x-6 min-w-max px-2">
                {tabs.map(tab => (
                    <li key={tab}>
                        <button
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 px-1 font-medium text-sm transition-colors whitespace-nowrap
                                ${activeTab === tab 
                                    ? 'text-brand-primary border-b-2 border-brand-primary' 
                                    : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 border-b-2 border-transparent'
                                }`}
                            aria-current={activeTab === tab ? 'page' : undefined}
                        >
                            {tab}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
