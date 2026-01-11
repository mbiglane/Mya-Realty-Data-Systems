
import React from 'react';
import { BookOpen, Users, Mic, TrendingUp, HelpCircle, ShieldCheck } from 'lucide-react';
import { SectionCard } from './SectionCard';

export const UserManual: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="border-l-4 border-brand-primary pl-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100">Platform User Guide</h2>
                <p className="text-slate-600 dark:text-gray-400 mt-1">
                    Welcome to the AI Real Estate Platform Beta. This guide outlines features, workflows, and our commitment to your data security.
                </p>
            </div>

            <SectionCard title="1. Interactive Learning" icon={BookOpen}>
                <div className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed space-y-4">
                    <p>
                        Navigate to the <strong>Interactive Book</strong> tab to access the core curriculum. This isn't just a static PDF; it's a modular learning environment designed to adapt to your pace.
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                        <li><strong>Modules:</strong> Click on chapters in the left sidebar to navigate.</li>
                        <li><strong>Tracking:</strong> Your progress is automatically saved as you complete sections.</li>
                        <li><strong>Contextual AI:</strong> Use the "Ask Mya" button inside any chapter to get clarification on specific real estate concepts mentioned in the text.</li>
                    </ul>
                </div>
            </SectionCard>

            <SectionCard title="2. The Sandbox Scenarios" icon={TrendingUp}>
                <div className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed space-y-4">
                    <p>
                        The <strong>Sandbox</strong> is where theory meets practice. We have enabled three AI-driven simulations for this beta:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-slate-50 dark:bg-base-300/30 p-4 rounded-lg border border-slate-200 dark:border-base-300">
                            <h4 className="font-bold text-brand-primary mb-2">Valuation Tool</h4>
                            <p>Input raw financial data (Income/Expense) and let the AI act as a senior appraiser to calculate NOI, Cap Rates, and generate comparable properties.</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-base-300/30 p-4 rounded-lg border border-slate-200 dark:border-base-300">
                            <h4 className="font-bold text-brand-primary mb-2">Negotiation Sim</h4>
                            <p>Roleplay against an AI buyer who has specific objections about a property. Test your ability to close the deal without giving away too much.</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-base-300/30 p-4 rounded-lg border border-slate-200 dark:border-base-300">
                            <h4 className="font-bold text-brand-primary mb-2">Market Analysis</h4>
                            <p>Generate comprehensive market reports for any city in the US, complete with demographic trends and historical price charts.</p>
                        </div>
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="3. Meet Mya (Voice Assistant)" icon={Mic}>
                <div className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed space-y-4">
                    <p>
                        <strong>Mya</strong> is your always-on AI tutor. You can access her by clicking the floating avatar button in the bottom right corner of the screen.
                    </p>
                    <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-100 dark:bg-base-300 p-4 rounded-lg">
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 dark:text-gray-200 mb-2">Capabilities</h4>
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>Real-time Voice:</strong> Speak naturally. Mya listens and responds instantly.</li>
                                <li><strong>Calculations:</strong> Ask her to "Calculate the mortgage on a $500k loan".</li>
                                <li><strong>Live Data:</strong> Ask for "Current market trends in Austin, TX".</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="4. Security & Data Privacy" icon={ShieldCheck}>
                <div className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed space-y-4">
                    <p>
                        Your trust is paramount. We have implemented enterprise-grade security to ensure your data and sessions remain private.
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                        <li><strong>Ephemeral Voice Data:</strong> Audio processed by Mya is streamed for inference only and is never stored permanently on our servers.</li>
                        <li><strong>Bot Protection:</strong> Our system actively monitors for automated scraping or unusual traffic patterns to ensure platform stability.</li>
                        <li><strong>Proprietary Tech:</strong> The system manual and core algorithmic details are strictly segregated from standard user access to prevent unauthorized IP exposure.</li>
                    </ul>
                </div>
            </SectionCard>

            <SectionCard title="5. Support & Feedback" icon={HelpCircle}>
                <div className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
                    <p className="mb-4">
                        This is a Beta Release (v0.9). We highly value your feedback.
                    </p>
                    <p>
                        If you encounter bugs or have feature requests, please use the <strong>Report Issue</strong> button located in the bottom banner or email us directly at <a href="mailto:beta-feedback@platform.ai" className="text-brand-secondary hover:underline">beta-feedback@platform.ai</a>.
                    </p>
                </div>
            </SectionCard>
        </div>
    );
};
