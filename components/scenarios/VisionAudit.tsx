
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { Camera, Upload, Wand2, ShieldCheck, AlertTriangle, Hammer, CheckCircle2, Layout, Sparkles } from 'lucide-react';
import type { VisionAuditResult } from '../../types';

export const VisionAudit: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isStaging, setIsStaging] = useState(false);
    const [result, setResult] = useState<VisionAuditResult | null>(null);
    const [stagedImage, setStagedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setResult(null);
                setStagedImage(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const runAnalysis = async () => {
        if (!image) return;
        setIsAnalyzing(true);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const base64Data = image.split(',')[1];
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [
                    {
                        parts: [
                            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
                            { text: "Act as a professional real estate structural auditor and interior designer. Analyze this room photo. Identify structural or cosmetic repairs needed, estimate their costs in a professional range, and suggest a modern staging style. Return only JSON." }
                        ]
                    }
                ],
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            analysis: { type: Type.STRING },
                            repairs: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        item: { type: Type.STRING },
                                        severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
                                        estimatedCost: { type: Type.STRING }
                                    },
                                    required: ['item', 'severity', 'estimatedCost']
                                }
                            },
                            suggestedStyle: { type: Type.STRING }
                        },
                        required: ['analysis', 'repairs', 'suggestedStyle']
                    }
                }
            });

            const data = JSON.parse(response.text);
            setResult(data);
        } catch (err) {
            console.error(err);
            setError("Neural analysis failed. Ensure the image is clear and try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const runStaging = async () => {
        if (!image || !result) return;
        setIsStaging(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const base64Data = image.split(',')[1];
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
                        { text: `Virtually stage this room in a ${result.suggestedStyle} style. Fix all visible damages, add modern luxury furniture, high-end lighting, and professional decor. The result should look like a professional real estate magazine photo.` }
                    ]
                },
                config: {
                    imageConfig: { aspectRatio: "16:9" }
                }
            });

            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    setStagedImage(`data:image/png;base64,${part.inlineData.data}`);
                    break;
                }
            }
        } catch (err) {
            console.error(err);
            setError("Virtual staging engine timed out. The neural cluster is under heavy load.");
        } finally {
            setIsStaging(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-10">
            {/* Header Info */}
            <div className="bg-brand-primary/10 p-6 rounded-[2rem] border border-brand-primary/20 flex items-start gap-4">
                <Sparkles className="text-brand-primary shrink-0" size={24} />
                <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-gray-100 uppercase tracking-tight">Vision Audit Terminal</h3>
                    <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                        Industry-leading visual intelligence. Upload a property photo to identify ROI-positive repairs and generate high-fidelity virtual staging assets.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Workspace */}
                <div className="space-y-6">
                    <div className="relative aspect-video rounded-[2.5rem] bg-slate-900 overflow-hidden border-2 border-dashed border-white/10 group">
                        {image ? (
                            <>
                                <img src={stagedImage || image} className="w-full h-full object-cover transition-all duration-700" alt="Audit Target" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button onClick={() => fileInputRef.current?.click()} className="bg-white text-slate-900 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform">
                                        <Upload size={24} />
                                    </button>
                                </div>
                                {isAnalyzing && (
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-brand-primary shadow-[0_0_15px_#2dd4bf] animate-[scan_2s_infinite]"></div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <Camera size={48} className="text-white/20 mb-4" />
                                <p className="text-white/40 font-black uppercase text-xs tracking-widest">Select Property Photo</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                    </div>

                    <div className="flex gap-4">
                        <Button 
                            onClick={runAnalysis} 
                            disabled={!image || isAnalyzing} 
                            className="flex-1 h-14 rounded-2xl shadow-xl shadow-brand-primary/20 font-black uppercase tracking-widest"
                        >
                            {isAnalyzing ? <><Loader /> Auditing...</> : <><ShieldCheck size={20}/> Start Visual Audit</>}
                        </Button>
                        {result && (
                            <Button 
                                onClick={runStaging} 
                                disabled={isStaging} 
                                className="flex-1 h-14 rounded-2xl bg-brand-secondary hover:bg-violet-600 shadow-xl shadow-brand-secondary/20 font-black uppercase tracking-widest"
                            >
                                {isStaging ? <><Loader /> Staging Room...</> : <><Wand2 size={20}/> Generate Staging</>}
                            </Button>
                        )}
                    </div>

                    {error && (
                        <div className="p-4 bg-status-red/10 border border-status-red/20 rounded-2xl text-status-red text-xs font-bold flex items-center gap-2">
                            <AlertTriangle size={16} /> {error}
                        </div>
                    )}
                </div>

                {/* Analysis Results */}
                <div className="space-y-6">
                    {!result ? (
                        <div className="h-full bg-slate-50 dark:bg-base-300/30 rounded-[2.5rem] border border-slate-200 dark:border-base-300 flex flex-col items-center justify-center text-center p-10">
                            <Layout size={48} className="text-slate-200 dark:text-base-300 mb-4" />
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Awaiting Neural Link Processing</p>
                        </div>
                    ) : (
                        <div className="animate-fade-in space-y-6">
                            <div className="bg-white dark:bg-base-200 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-base-300">
                                <h4 className="font-black text-brand-primary uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                                    <Hammer size={16} /> Repair Matrix
                                </h4>
                                <div className="space-y-4">
                                    {result.repairs.map((r, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-base-300/50 rounded-2xl border border-slate-100 dark:border-base-100">
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 dark:text-white">{r.item}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`h-1.5 w-1.5 rounded-full ${r.severity === 'high' ? 'bg-status-red' : r.severity === 'medium' ? 'bg-status-yellow' : 'bg-status-green'}`}></span>
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase">{r.severity} Priority</span>
                                                </div>
                                            </div>
                                            <p className="text-brand-primary font-black text-sm">{r.estimatedCost}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-brand-primary/5 p-8 rounded-[2rem] border-2 border-brand-primary/20 shadow-inner">
                                <h4 className="font-black text-brand-primary uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                                    <Sparkles size={16} /> Strategic Conclusion
                                </h4>
                                <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed italic">
                                    "{result.analysis}"
                                </p>
                                <div className="mt-6 pt-6 border-t border-brand-primary/10 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Recommended Style</p>
                                        <p className="text-slate-800 dark:text-white font-black">{result.suggestedStyle}</p>
                                    </div>
                                    <div className="h-10 w-10 bg-brand-primary/20 rounded-xl flex items-center justify-center text-brand-primary">
                                        <CheckCircle2 size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { transform: translateY(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(280px); opacity: 0; }
                }
            `}</style>
        </div>
    );
};
