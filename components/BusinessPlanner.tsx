
import React, { useMemo } from 'react';
import { TrendingUp, Users, DollarSign, PieChart as PieIcon, BarChart3, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, PieChart, Pie } from 'recharts';

interface TierData {
    users: number;
    label: string;
    monthlyRevenue: number;
    annualRevenue: number;
    aiCosts: number;
    opEx: number;
    noi: number;
    valuation: number;
}

export const BusinessPlanner: React.FC = () => {
    const PRICE_PER_USER = 149; // Competitive threshold for modern real estate firms
    const AI_COST_PER_USER = 5.50; // Gemini 3 + Veo + Grounding
    const VALUATION_MULTIPLE = 10; // 10x ARR for high-growth AI SaaS

    const tiers: TierData[] = useMemo(() => {
        const userTiers = [1000, 5000, 10000];
        return userTiers.map(count => {
            const monthlyRev = count * PRICE_PER_USER;
            const annualRev = monthlyRev * 12;
            const aiMonthlyCost = count * AI_COST_PER_USER;
            
            // Scaled OpEx (Fixed costs + support staff + hosting)
            // Tier 1: Small team, basic cloud. Tier 3: Full support, enterprise cloud.
            const scaledOpEx = count === 1000 ? 45000 : count === 5000 ? 120000 : 200000;
            
            const monthlyNOI = monthlyRev - aiMonthlyCost - scaledOpEx;
            const annualNOI = monthlyNOI * 12;

            return {
                users: count,
                label: `${count.toLocaleString()} Users`,
                monthlyRevenue: monthlyRev,
                annualRevenue: annualRev,
                aiCosts: aiMonthlyCost,
                opEx: scaledOpEx,
                noi: annualNOI,
                valuation: annualRev * VALUATION_MULTIPLE
            };
        });
    }, []);

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);

    return (
        <div className="space-y-12 animate-fade-in max-w-7xl mx-auto pb-20">
            {/* Executive ROI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tiers.map((tier, idx) => (
                    <div key={idx} className={`p-8 rounded-[2.5rem] border-2 transition-all hover:scale-105 shadow-2xl ${idx === 2 ? 'bg-slate-900 text-white border-brand-primary' : 'bg-white dark:bg-base-200 border-slate-200 dark:border-base-300'}`}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 rounded-2xl bg-brand-primary/10">
                                <Users className="text-brand-primary" size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-brand-primary text-white rounded-full">Tier {idx + 1}</span>
                        </div>
                        <h3 className="text-2xl font-black mb-1">{tier.label}</h3>
                        <p className={`text-sm mb-6 ${idx === 2 ? 'text-slate-400' : 'text-slate-500'}`}>Enterprise Platform Scale</p>
                        
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Annual NOI</p>
                                <p className="text-3xl font-black text-brand-primary">{formatCurrency(tier.noi)}</p>
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-base-300/20">
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Market Valuation (10x)</p>
                                <p className="text-4xl font-black text-brand-secondary">{formatCurrency(tier.valuation)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Financial Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-base-200 p-8 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-base-300">
                    <div className="flex items-center gap-3 mb-8">
                        <BarChart3 className="text-brand-primary" />
                        <h3 className="font-black text-xl uppercase tracking-tight">Revenue vs NOI Growth</h3>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={tiers}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <YAxis tickFormatter={(v) => `$${v/1000000}M`} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(45,212,191,0.05)'}}
                                    contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}}
                                />
                                <Legend />
                                <Bar dataKey="annualRevenue" name="Gross Revenue" fill="#2dd4bf" radius={[10, 10, 0, 0]} />
                                <Bar dataKey="noi" name="Net Operating Income" fill="#60a5fa" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-base-200 p-8 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-base-300">
                    <div className="flex items-center gap-3 mb-8">
                        <PieIcon className="text-brand-primary" />
                        <h3 className="font-black text-xl uppercase tracking-tight">Cost Threshold Breakdown</h3>
                    </div>
                    <div className="h-80 w-full flex items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Profit (NOI)', value: tiers[2].noi / 12 },
                                        { name: 'AI API Costs', value: tiers[2].aiCosts },
                                        { name: 'OpEx / Support', value: tiers[2].opEx },
                                    ]}
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill="#2dd4bf" />
                                    <Cell fill="#60a5fa" />
                                    <Cell fill="#f43f5e" />
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Strategic Analysis */}
            <div className="bg-brand-primary/5 p-10 rounded-[3rem] border-2 border-brand-primary/20">
                <div className="flex items-center gap-4 mb-6">
                    <ShieldCheck className="text-brand-primary h-8 w-8" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Technology Excellence Audit</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-full bg-brand-primary flex items-center justify-center text-white shrink-0 font-bold">1</div>
                            <div>
                                <h4 className="font-black text-slate-800 dark:text-gray-100 uppercase text-sm tracking-widest mb-1">Newest Tech Edge</h4>
                                <p className="text-sm text-slate-600 dark:text-gray-400">By leveraging Gemini 3 Flash for high-frequency triage and Gemini 3 Pro for deep reasoning, we maintain a COGS of less than 4% of total revenue. Legacy PropTech firms struggle with 15-20% costs on older infrastructure.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-full bg-brand-primary flex items-center justify-center text-white shrink-0 font-bold">2</div>
                            <div>
                                <h4 className="font-black text-slate-800 dark:text-gray-100 uppercase text-sm tracking-widest mb-1">Average Firm Affordability</h4>
                                <p className="text-sm text-slate-600 dark:text-gray-400">Our $149/mo price point sits exactly at the "Middle Management" approval limit for most US real estate firms, allowing for friction-less rapid adoption without corporate board sign-off.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-base-100/40 p-8 rounded-3xl border border-slate-200 dark:border-base-300">
                        <h4 className="font-black text-brand-secondary uppercase text-xs tracking-widest mb-4">Investment Verdict</h4>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-5xl font-black tracking-tighter">$17.8M</span>
                            <span className="text-slate-500 font-bold">ARR</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                            At 10,000 users, Mya Realty Data Systems transitions from a startup to a **$178M Valuation Asset**. The efficiency of the AI-First architecture ensures a 70%+ Net Profit Margin, which is 3x the industry average for Real Estate software.
                        </p>
                        <button className="mt-8 w-full bg-brand-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2">
                            Scale to Phase 3 <ArrowUpRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
