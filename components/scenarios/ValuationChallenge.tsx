import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { DollarSign, CheckCircle, BarChart, XCircle, Info, Target, TrendingUp, Loader2, Home, Ruler, Calendar, Bed, Bath } from 'lucide-react';

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
    const [sqft, setSqft] = useState('');
    const [yearBuilt, setYearBuilt] = useState('');
    const [beds, setBeds] = useState('');
    const [baths, setBaths] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [thinkingProgress, setThinkingProgress] = useState(0);
    const [result, setResult] = useState<ValuationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let interval: any;
        if (loading) {
            setThinkingProgress(0);
            interval = setInterval(() => {
                setThinkingProgress(prev => {
                    if (prev >= 98) return 98;
                    return prev + (prev < 60 ? 10 : 2);
                });
            }, 300);
        } else {
            setThinkingProgress(0);
            if (interval) clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [loading]);

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
            - Living Area: ${sqft} sqft
            - Construction Year: ${yearBuilt}
            - Layout: ${beds} Bedrooms / ${baths} Bathrooms
            - Self-Reported Annual Gross Income: $${income}
            - Self-Reported Operating Expenses: $${expenses}

            Detailed Tasks:
            1. Calculate Net Operating Income (NOI).
            2. Estimate a market-appropriate Cap Rate for this specific asset type and age.
            3. Synthesize 3 realistic Comparable Sales based on location and specs.
            4. Provide a professional 'Appraisal Summary' explaining the valuation logic.

            RETURN VALID JSON OBJECT ONLY.
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
                       noi: { type: Type.NUMBER },
                       capRate: { type: Type.NUMBER },
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
                       analysis: { type: Type.STRING },
                     },
                     required: ["noi", "capRate", "comps", "analysis"]
                   },
                },
            });

            const jsonResponse = JSON.parse(response.text);
            setResult(jsonResponse);

        } catch (err) {
            console.error(err);
            setError("Technical fault in the AI Inference layer.");
        } finally {
            setLoading(false);
            setThinkingProgress(100);
        }
    };

    const handleNumericVoiceInput = (text: string, setter: (val: string) => void) => {
        const numericValue = text.replace(/[^0-9.]/g, '');
        setter(numericValue);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4 bg-brand-primary/10 border-l-4 border-brand-primary p-6 rounded-r-3xl shadow-sm">
                <Info className="h-5 w-5 text-brand-primary mt-1 shrink-0" />
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    <strong className="text-brand-primary uppercase tracking-widest text-[10px] block mb-1">Analytical Protocol</strong>
                    Provide property specifications and financial profile. Mya will cross-reference regional data to derive a multi-modal valuation report.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 border border-white/5 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl shadow-2xl space-y-8 relative overflow-hidden">
                {loading && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                        <div className="h-full bg-brand-primary transition-all duration-300 shadow-[0_0_10px_#2dd4bf]" style={{ width: `${thinkingProgress}%` }}></div>
                    </div>
                )}
                
                <div className="space-y-6">
                    <Input
                        id="address"
                        label="Property Location / Sub-market"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onVoiceInput={setAddress}
                        placeholder="e.g., 555 Montgomery St, San Francisco, CA"
                        disabled={loading}
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <Input
                            id="sqft"
                            label="Total Area (SQFT)"
                            type="number"
                            value={sqft}
                            onChange={(e) => setSqft(e.target.value)}
                            onVoiceInput={(text) => handleNumericVoiceInput(text, setSqft)}
                            placeholder="0"
                            disabled={loading}
                        />
                        <Input
                            id="yearBuilt"
                            label="Year Built"
                            type="number"
                            value={yearBuilt}
                            onChange={(e) => setYearBuilt(e.target.value)}
                            onVoiceInput={(text) => handleNumericVoiceInput(text, setYearBuilt)}
                            placeholder="YYYY"
                            disabled={loading}
                        />
                        <Input
                            id="beds"
                            label="Bedrooms"
                            type="number"
                            value={beds}
                            onChange={(e) => setBeds(e.target.value)}
                            onVoiceInput={(text) => handleNumericVoiceInput(text, setBeds)}
                            placeholder="0"
                            disabled={loading}
                        />
                        <Input
                            id="baths"
                            label="Bathrooms"
                            type="number"
                            value={baths}
                            onChange={(e) => setBaths(e.target.value)}
                            onVoiceInput={(text) => handleNumericVoiceInput(text, setBaths)}
                            placeholder="0"
                            disabled={loading}
                        />
                    </div>

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

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    {loading ? (
                        <div className="flex items-center gap-3 text-brand-primary animate-pulse">
                            <Loader2 className="animate-spin" size={18} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cross-Referencing Nodes: {thinkingProgress}%</span>
                        </div>
                    ) : <div></div>}
                    
                    <Button type="submit" disabled={loading} className="px-10 py-4 bg-brand-primary text-slate-950 font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-primary/20 hover:scale-105 transition-all">
                        {loading ? "Processing..." : "Run Valuation"}
                    </Button>
                </div>
            </form>
            
            {error && (
                <div className="animate-fade-in p-6 bg-status-red/10 border border-status-red/20 rounded-2xl text-xs font-black uppercase tracking-widest text-status-red flex items-center gap-4">
                    <XCircle size={20} className="shrink-0" /> {error}
                </div>
            )}

            {result && (
                <div className="animate-slide-in-up space-y-8 pt-8 border-t border-white/5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="p-8 bg-slate-900/60 backdrop-blur-md rounded-[2.5rem] border border-white/5 shadow-2xl text-center group hover:border-brand-primary/20 transition-all">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-black">Net Operating Income</p>
                            <p className="text-3xl font-black text-white italic tracking-tighter">${result.noi.toLocaleString()}</p>
                        </div>
                        <div className="p-8 bg-slate-900/60 backdrop-blur-md rounded-[2.5rem] border border-white/5 shadow-2xl text-center group hover:border-brand-primary/20 transition-all">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-black">Market Cap Rate</p>
                            <p className="text-3xl font-black text-brand-primary italic tracking-tighter">{(result.capRate * 100).toFixed(2)}%</p>
                        </div>
                        <div className="p-8 bg-slate-900/60 backdrop-blur-md rounded-[2.5rem] border border-white/5 shadow-2xl text-center group hover:border-brand-primary/20 transition-all">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-black">Asset Valuation</p>
                            <p className="text-3xl font-black text-brand-secondary italic tracking-tighter">${Math.round(result.noi / result.capRate).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/5 backdrop-blur-xl shadow-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <Target className="text-brand-primary h-6 w-6" />
                            <h4 className="font-black text-xs uppercase tracking-widest text-white">Appraisal Logic Summary</h4>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed italic whitespace-pre-wrap">"{result.analysis}"</p>
                    </div>

                     <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <TrendingUp className="text-brand-secondary h-6 w-6" />
                            <h4 className="font-black text-xs uppercase tracking-widest text-white">Synthesized Market Comps</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                           {result.comps.map((comp, index) => (
                               <div key={index} className="group p-6 bg-slate-950/40 hover:bg-slate-900/60 rounded-[2rem] border border-white/5 hover:border-brand-primary/20 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-xl">
                                   <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-brand-primary font-black uppercase text-[10px]">
                                            0{index + 1}
                                        </div>
                                        <p className="font-bold text-white tracking-tight text-sm">{comp.address}</p>
                                   </div>
                                   <div className="flex items-center gap-10 sm:text-right pl-14 sm:pl-0">
                                       <div>
                                            <p className="text-[9px] uppercase text-slate-500 font-black tracking-widest mb-1">Final Price</p>
                                            <p className="text-xl font-black text-brand-secondary italic">${comp.salePrice.toLocaleString()}</p>
                                       </div>
                                       <div>
                                            <p className="text-[9px] uppercase text-slate-500 font-black tracking-widest mb-1">Inferred NOI</p>
                                            <p className="text-xl font-black text-white italic opacity-40">${comp.noi.toLocaleString()}</p>
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