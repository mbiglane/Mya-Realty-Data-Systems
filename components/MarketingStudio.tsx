
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Video, Image as ImageIcon, Wand2, Sparkles, Film, Loader2, Download, AlertCircle, CheckCircle, Sliders } from 'lucide-react';
import { Button } from './ui/Button';

export const MarketingStudio: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<'video' | 'image'>('video');
    const [outputUrl, setOutputUrl] = useState<string | null>(null);
    const [statusMsg, setStatusMsg] = useState('');
    const [resolution, setResolution] = useState<'1K' | '2K' | '4K'>('1K');

    const generateImage = async () => {
        setIsGenerating(true);
        setStatusMsg('Initializing Gemini 3 Pro Vision Engine...');
        try {
            // Fix: Implementing mandatory API key selection check for gemini-3-pro models
            if (!await window.aistudio.hasSelectedApiKey()) {
                await window.aistudio.openSelectKey();
            }
            
            // Fix: Creating fresh client right before call to capture updated key from dialog
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-image-preview',
                contents: { parts: [{ text: `A high-end professional real estate photograph of: ${prompt}. Cinematic lighting, architectural photography style, luxury modern staging, photorealistic textures.` }] },
                config: { 
                    imageConfig: { 
                        aspectRatio: "16:9",
                        imageSize: resolution
                    } 
                },
            });

            // Fix: Properly iterating through parts to find the image as per SDK guidelines
            for (const part of response.candidates?.[0].content.parts || []) {
                if (part.inlineData) {
                    setOutputUrl(`data:image/png;base64,${part.inlineData.data}`);
                    break;
                }
            }
        } catch (e) {
            console.error(e);
            setStatusMsg('Pro Inference failed. Check neural quotas.');
        } finally {
            setIsGenerating(false);
        }
    };

    const generateVideo = async () => {
        setIsGenerating(true);
        setStatusMsg('Initializing Veo 3.1 Cinema Engine...');
        try {
            // Fix: Mandatory API key selection for Veo video generation
            if (!await window.aistudio.hasSelectedApiKey()) {
                await window.aistudio.openSelectKey();
            }
            
            // Fix: Instantiate right before call to ensure newest environment key is used
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: `Cinematic property walkthrough: ${prompt}. Smooth drone movements, professional lighting, luxury feel.`,
                config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
            });

            while (!operation.done) {
                setStatusMsg('Veo is weaving pixels... (approx 30-60s)');
                await new Promise(r => setTimeout(r, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            // Fix: Appending API key to download link fetch as required by SDK guidelines
            const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            const blob = await res.blob();
            setOutputUrl(URL.createObjectURL(blob));
        } catch (e) {
            console.error(e);
            setStatusMsg('Video synthesis interrupted.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-white dark:bg-base-200 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-base-300 p-8 sm:p-12 animate-fade-in max-w-5xl mx-auto">
            <div className="flex items-center gap-6 mb-12">
                <div className="bg-brand-primary/10 p-5 rounded-3xl">
                    <Film className="h-10 w-10 text-brand-primary" />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-gray-100 tracking-tight">Marketing Studio</h2>
                    <p className="text-slate-500 dark:text-gray-400 font-medium">Generate cinematic property assets with Veo & Imagen.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                <div className="flex gap-4 bg-slate-50 dark:bg-base-300/30 p-2 rounded-2xl w-fit">
                    <button 
                        onClick={() => { setActiveTab('video'); setOutputUrl(null); }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'video' ? 'bg-white dark:bg-base-200 shadow-lg text-brand-primary' : 'text-slate-400'}`}
                    >
                        <Video size={18}/> Drone Sizzle Reel
                    </button>
                    <button 
                        onClick={() => { setActiveTab('image'); setOutputUrl(null); }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'image' ? 'bg-white dark:bg-base-200 shadow-lg text-brand-primary' : 'text-slate-400'}`}
                    >
                        <ImageIcon size={18}/> Virtual Staging
                    </button>
                </div>

                {activeTab === 'image' && (
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-base-300/30 p-2 rounded-2xl">
                        <Sliders size={14} className="text-slate-400 ml-2" />
                        <div className="flex gap-1">
                            {(['1K', '2K', '4K'] as const).map(res => (
                                <button
                                    key={res}
                                    onClick={() => setResolution(res)}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${resolution === res ? 'bg-brand-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {res}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-black text-slate-700 dark:text-gray-300 mb-2 uppercase tracking-widest">Creative Prompt</label>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={activeTab === 'video' ? "Describe the walkthrough drone path..." : "Describe the interior style and furniture..."}
                        className="w-full h-32 px-6 py-4 bg-slate-50 dark:bg-base-300/20 border-2 border-slate-200 dark:border-base-300 rounded-3xl focus:border-brand-primary outline-none transition-all font-medium text-lg"
                    />
                </div>

                <Button 
                    onClick={activeTab === 'video' ? generateVideo : generateImage}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full py-6 rounded-3xl text-xl shadow-[0_20px_40px_rgba(45,212,191,0.3)]"
                >
                    {isGenerating ? <><Loader2 className="animate-spin" /> {statusMsg}</> : <><Wand2 /> Synthesize Asset</>}
                </Button>
            </div>

            {outputUrl && (
                <div className="mt-12 animate-slide-in-up space-y-4">
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-base-300 aspect-video bg-black flex items-center justify-center">
                        {activeTab === 'video' ? (
                            <video src={outputUrl} controls autoPlay className="w-full h-full object-cover" />
                        ) : (
                            <img src={outputUrl} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute top-6 right-6">
                            <a href={outputUrl} download={`mya-marketing-${Date.now()}`} className="bg-white/90 backdrop-blur p-4 rounded-2xl text-slate-900 shadow-xl hover:scale-110 transition-transform flex items-center gap-2 font-bold text-sm">
                                <Download size={20}/> Download
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-status-green bg-green-50 dark:bg-green-900/10 p-4 rounded-2xl border border-green-100 dark:border-green-900/30">
                        <CheckCircle size={18}/>
                        <p className="text-sm font-bold">Inference Complete. {activeTab === 'image' && resolution !== '1K' ? `Exported at ${resolution} Industrial Fidelity.` : 'Asset ready for distribution.'}</p>
                    </div>
                </div>
            )}

            {!outputUrl && !isGenerating && (
                <div className="mt-12 border-2 border-dashed border-slate-200 dark:border-base-300 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center text-slate-300">
                    <Sparkles size={48} className="mb-4 opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-xs">Waiting for Generation Request</p>
                </div>
            )}
        </div>
    );
};
