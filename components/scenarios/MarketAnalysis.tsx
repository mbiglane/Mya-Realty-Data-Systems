
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { XCircle, TrendingUp, Users, Home } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface MarketData {
    analysis: string;
    keyMetrics: {
        medianPrice: number;
        population: number;
        yearOverYearGrowth: number;
    };
    priceHistory: {
        year: string;
        price: number;
    }[];
}

interface MarketAnalysisProps {
    isDarkMode: boolean;
}

export const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ isDarkMode }) => {
    const [location, setLocation] = useState('Austin, TX');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MarketData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setError(null);

        if (!location) {
            setError("Please enter a location.");
            setLoading(false);
            return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        const prompt = `
            Act as a senior market research analyst for a real estate firm.
            Provide a detailed market trend analysis for ${location}.
            
            1. Write a concise, insightful analysis paragraph covering key trends, opportunities, and risks.
            2. Provide key metrics: current median home price, population, and year-over-year price growth percentage.
            3. Generate a fictional but realistic price history for the last 5 years (as an array of objects with 'year' and 'price').

            Return the entire response in a valid JSON format.
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
                      analysis: { type: Type.STRING },
                      keyMetrics: {
                        type: Type.OBJECT,
                        properties: {
                            medianPrice: { type: Type.NUMBER },
                            population: { type: Type.NUMBER },
                            yearOverYearGrowth: { type: Type.NUMBER }
                        },
                        required: ["medianPrice", "population", "yearOverYearGrowth"]
                      },
                      priceHistory: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            year: { type: Type.STRING },
                            price: { type: Type.NUMBER }
                          },
                          required: ["year", "price"]
                        }
                      }
                    },
                    required: ["analysis", "keyMetrics", "priceHistory"]
                  },
                },
            });

            const jsonResponse = JSON.parse(response.text);
            setResult(jsonResponse);

        } catch (err) {
            console.error(err);
            setError("MYA could not complete the market analysis. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => `$${(value / 1000).toFixed(0)}k`;

    const tooltipStyle = {
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
        color: isDarkMode ? '#e2e8f0' : '#1e293b',
        borderRadius: '0.5rem'
    };

    return (
        <div className="space-y-6">
            <p className="text-sm text-slate-600 dark:text-gray-300">
                Enter a location (e.g., city, state) and MYA will generate a comprehensive market trend report with historical data.
            </p>
            <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-slate-50 dark:bg-base-300/20 dark:border-base-300 flex items-end gap-4">
                <div className="flex-grow">
                    <Input
                        id="location"
                        label="Target Market Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onVoiceInput={setLocation}
                        placeholder="e.g., Austin, TX"
                        disabled={loading}
                    />
                </div>
                <Button type="submit" disabled={loading} className="h-10">
                    {loading ? <><Loader /> Analyzing...</> : "Analyze Market"}
                </Button>
            </form>
            
            {error && <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-sm text-red-700 dark:text-red-300 flex items-center gap-2"><XCircle size={16}/> {error}</div>}

            {result && (
                <div className="mt-6 animate-fade-in space-y-6">
                    <div>
                        <h4 className="font-semibold mb-2 text-slate-800 dark:text-gray-200">MYA's Market Summary</h4>
                        <p className="text-sm p-4 bg-slate-50 dark:bg-base-300/20 rounded-lg text-slate-700 dark:text-gray-300">{result.analysis}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-100 dark:bg-base-300/40 rounded-lg">
                            <div className="flex items-center text-sm text-slate-500 dark:text-gray-400 mb-1"><Home size={14} className="mr-2"/> Median Price</div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">${result.keyMetrics.medianPrice.toLocaleString()}</p>
                        </div>
                         <div className="p-4 bg-slate-100 dark:bg-base-300/40 rounded-lg">
                            <div className="flex items-center text-sm text-slate-500 dark:text-gray-400 mb-1"><Users size={14} className="mr-2"/> Population</div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{result.keyMetrics.population.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-slate-100 dark:bg-base-300/40 rounded-lg">
                            <div className="flex items-center text-sm text-slate-500 dark:text-gray-400 mb-1"><TrendingUp size={14} className="mr-2"/> YoY Growth</div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">{(result.keyMetrics.yearOverYearGrowth * 100).toFixed(1)}%</p>
                        </div>
                    </div>

                    <div>
                         <h4 className="font-semibold mb-2 text-slate-800 dark:text-gray-200">Historical Median Price</h4>
                         <div className="h-64 w-full p-2 bg-slate-50 dark:bg-base-300/20 rounded-lg">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={result.priceHistory} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                                    <XAxis dataKey="year" tick={{fill: 'currentColor', fontSize: 12}} />
                                    <YAxis tickFormatter={formatCurrency} tick={{fill: 'currentColor', fontSize: 12}} />
                                    <Tooltip
                                        contentStyle={tooltipStyle}
                                        formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value)}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="price" name="Median Price" stroke="#60a5fa" fillOpacity={1} fill="url(#colorPrice)" />
                                </AreaChart>
                            </ResponsiveContainer>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};
