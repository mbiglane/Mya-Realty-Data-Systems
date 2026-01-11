
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { DollarSign, CheckCircle, BarChart, XCircle, Info, Target, TrendingUp } from 'lucide-react';

interface ValuationResult {
    noi: number;
    capRate: number;
    comps: {
        address: string;
        salePrice: number;
        noi: number;
    }[];
    analysis: string;
}

export const ValuationChallenge: React.FC = () => {
    const [address, setAddress] = useState('');
    const [income, setIncome] = useState('');
    const [expenses, setExpenses] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ValuationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setError(null);

        if (!address || !income || !expenses) {
            setError("Missing critical parameters. Please complete the financial input.");
            setLoading(false);
            return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        const prompt = `
            Act as a senior commercial real estate appraiser with 20 years of experience.
            Analyze this property valuation request:
            - Target Address: ${address}
            - Self-Reported Annual Gross Income: $${income}
            - Self-Reported Operating Expenses: $${expenses}

            Detailed Tasks:
            1. Calculate NOI (Net Operating Income).
            2. Estimate a market-appropriate Cap Rate for the specific sub-market implied by the address.
            3. Synthesize 3 realistic Comparable Sales (Comps) including calculated Cap Rates for those sales.
            4. Provide a professional 'Appraisal Summary' analyzing the investment viability.

            YOU MUST RETURN A VALID JSON OBJECT ONLY.
        `;
        
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3-pro-preview",
                contents: prompt,
                config: {
                  responseMimeType: "application/json",
                  thinkingConfig: { thinkingBudget: 2048 },
                  responseSchema: {
                     type: Type.OBJECT,
                     properties: {
                       noi: { type: Type.NUMBER, description: "Net Operating Income" },
                       capRate: { type: Type.NUMBER, description: "The estimated capitalization rate as a decimal (e.g. 0.055)" },
                       comps: {
                         type: Type.ARRAY,
                         items: {
                           type: Type.OBJECT,
                           properties: {
                             address: { type: Type.STRING },
                             salePrice: { type: Type.NUMBER },
                             noi: { type: Type.NUMBER },
                           },
                           required: ["address", "salePrice", "noi"]
                         }
                       },
                       analysis: { type: Type.STRING, description: "Professional analytical summary" },
                     },
                     required: ["noi", "capRate", "comps", "analysis"]
                   },
                },
            });

            const jsonResponse = JSON.parse(response.text);
            setResult(jsonResponse);

        } catch (err) {
            console.error(err);
            setError("Technical fault in the AI Inference layer. Please verify input data and retry.");
        } finally {
            setLoading(false);
        }
    };

    const handleNumericVoiceInput = (text: string, setter: (val: string) => void) => {
        const numericValue = text.replace(/[^0-9.]/g, '');
        setter(numericValue);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4 bg-brand-primary/10 border-l-4 border-brand-primary p-4 rounded-r-lg shadow-sm">
                <Info className="h-5 w-5 text-brand-primary mt-1 shrink-0" />
                <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
                    <strong>Analytical Protocol:</strong> Provide the subject property financial profile. Mya will cross-reference regional sub-market data to derive an estimated asset valuation and risk profile.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 border border-slate-200 dark:border-base-300 rounded-xl bg-white dark:bg-base-300/10 shadow-lg space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <Input
                        id="address"
                        label="Property Location / Sub-market"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onVoiceInput={setAddress}
                        placeholder="e.g., 555 Montgomery St, San Francisco, CA"
                        disabled={loading}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Input
                            id="income"
                            label="Annual Gross Potential Income"
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                            onVoiceInput={(text) => handleNumericVoiceInput(text, setIncome)}
                            placeholder="0.00"
                            disabled={loading}
                        />
                        <Input
                            id="expenses"
                            label="Total Annual Operating Expenses"
                            type="number"
                            value={expenses}
                            onChange={(e) => setExpenses(e.target.value)}
                            onVoiceInput={(text) => handleNumericVoiceInput(text, setExpenses)}
                            placeholder="0.00"
                            disabled={loading}
                        />
                    </div>
                </div>
                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={loading} className="px-8 py-3 rounded-lg shadow-brand-primary/20 shadow-lg">
                        {loading ? <><Loader /> Running Simulation...</> : "Initialize Appraisal"}
                    </Button>
                </div>
            </form>
            
            {error && (
                <div className="animate-fade-in p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-300 flex items-center gap-3">
                    <XCircle size={20} className="shrink-0" /> {error}
                </div>
            )}

            {result && (
                <div className="animate-slide-in-up space-y-8 pt-4 border-t border-slate-200 dark:border-base-300">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="p-6 bg-slate-50 dark:bg-base-300/40 rounded-xl border border-slate-100 dark:border-base-300 shadow-sm text-center">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold">Estimated NOI</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-gray-100">${result.noi.toLocaleString()}</p>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-base-300/40 rounded-xl border border-slate-100 dark:border-base-300 shadow-sm text-center">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold">Implied Cap Rate</p>
                            <p className="text-3xl font-black text-brand-primary">{(result.capRate * 100).toFixed(2)}%</p>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-base-300/40 rounded-xl border border-slate-100 dark:border-base-300 shadow-sm text-center">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold">Asset Valuation</p>
                            <p className="text-3xl font-black text-brand-secondary">${Math.round(result.noi / result.capRate).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-base-300/20 p-6 rounded-xl border border-slate-200 dark:border-base-300 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Target className="text-brand-primary h-5 w-5" />
                            <h4 className="font-bold text-slate-800 dark:text-gray-100">Professional Analysis Summary</h4>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{result.analysis}</p>
                    </div>

                     <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="text-brand-secondary h-5 w-5" />
                            <h4 className="font-bold text-slate-800 dark:text-gray-100">Comparable Market Set</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                           {result.comps.map((comp, index) => (
                               <div key={index} className="group p-4 bg-slate-50 dark:bg-base-200/50 hover:bg-white dark:hover:bg-base-200 rounded-xl border border-slate-100 dark:border-base-300/50 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-2 shadow-sm">
                                   <div>
                                        <p className="font-bold text-slate-800 dark:text-gray-100 group-hover:text-brand-primary transition-colors">{comp.address}</p>
                                        <p className="text-xs text-slate-500">Sub-market Data Point #{index + 1}</p>
                                   </div>
                                   <div className="flex items-center gap-4 sm:text-right">
                                       <div className="hidden sm:block">
                                            <p className="text-[10px] uppercase text-slate-400 font-bold">NOI</p>
                                            <p className="text-sm font-medium text-slate-700 dark:text-gray-300">${comp.noi.toLocaleString()}</p>
                                       </div>
                                       <div>
                                            <p className="text-[10px] uppercase text-slate-400 font-bold">Final Sale</p>
                                            <p className="text-lg font-black text-brand-secondary">${comp.salePrice.toLocaleString()}</p>
                                       </div>
                                   </div>
                               </div>
                           ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
