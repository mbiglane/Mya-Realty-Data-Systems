import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Video, Image as ImageIcon, Wand2, Sparkles, Film, Loader2, Download, ShieldCheck, Key, Camera } from 'lucide-react';

export const MarketingStudio: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<'video' | 'image'>('video');
    const [outputUrl, setOutputUrl] = useState<string | null>(null);
    const [statusMsg, setStatusMsg] = useState('');
    const [progress, setProgress] = useState(0);
    const [resolution, setResolution] = useState<'1K' | '2K' | '4K'>('1K');
    const [startImage, setStartImage] = useState<string | null>(null);
    const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const checkKey = async () => {
            if (typeof window.aistudio !== 'undefined') {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setHasApiKey(hasKey);
            }
        };
        checkKey();
    }, []);

    const handleLoadApis = async () => {
        if (typeof window.aistudio !== 'undefined') {
            await window.aistudio.openSelectKey();
            setHasApiKey(true);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setStartImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const generateImage = async () => {
        setIsGenerating(true);
        setStatusMsg('Initializing Gemini 3 Pro Vision Engine...');
        setProgress(10);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            setProgress(30);
            
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
            setProgress(80);

            for (const part of response.candidates?.[0].content.parts || []) {
                if (part.inlineData) {
                    setOutputUrl(`data:image/png;base64,${part.inlineData.data}`);
                    setProgress(100);
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
        setProgress(5);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            setProgress(15);

            const videoConfig: any = {
                model: 'veo-3.1-fast-generate-preview',
                prompt: `Cinematic property walkthrough: ${prompt}. Smooth drone movements, professional lighting, luxury feel.`,
                config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
            };

            if (startImage) {
                videoConfig.image = {
                    imageBytes: startImage.split(',')[1],
                    mimeType: 'image/png'
                };
                setStatusMsg('Linking Start Frame to Neural Sequence...');
            }

            let operation = await ai.models.generateVideos(videoConfig);

            let pollingCount = 0;
            while (!operation.done) {
                pollingCount++;
                const fakeProgress = Math.min(20 + pollingCount * 10, 95);
                setProgress(fakeProgress);
                setStatusMsg(fakeProgress < 50 ? 'Weaving Motion Vectors...' : 'Rendering Sub-Pixel Fidelity...');
                
                await new Promise(r => setTimeout(r, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            const blob = await res.blob();
            setOutputUrl(URL.createObjectURL(blob));
            setProgress(100);
        } catch (e) {
            console.error(e);
            setStatusMsg('Video synthesis interrupted.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-slate-900 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/5 p-8 sm:p-16 animate-fade-in max-w-6xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 blur-[120px] -mr-48 -mt-48 rounded-full"></div>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16 relative z-10">
                <div className="flex items-center gap-8">
                    <div className="bg-brand-primary h-16 w-16 rounded-3xl flex items-center justify-center shadow-2xl shadow-brand-primary/30">
                        <Film className="text-white" size={32} />
                    </div>
                    <div>
                        <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Studio</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Neural Asset Synthesis Protocol</p>
                    </div>
                </div>
                
                <div className="flex gap-4 bg-black/40 p-2 rounded-3xl border border-white/5">
                    <button 
                        onClick={() => { setActiveTab('video'); setOutputUrl(null); }}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'video' ? 'bg-brand-primary text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
                    >
                        <Video size={16}/> Cinematic Video
                    </button>
                    <button 
                        onClick={() => { setActiveTab('image'); setOutputUrl(null); }}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'image' ? 'bg-brand-secondary text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
                    >
                        <ImageIcon size={16}/> Industrial Vision
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                <div className="lg:col-span-7 space-y-10">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inference Prompt</label>
                            <span className="text-[9px] text-brand-primary/60 font-mono">LLM_REFINEMENT_ACTIVE</span>
                        </div>
                        <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={activeTab === 'video' ? "Example: Slow panning drone shot of a white modern mansion on a cliff, sunset lighting, architectural focus..." : "Example: Modern living room with white marble floors, floor-to-ceiling windows, minimalist furniture..."}
                            className="w-full h-40 px-8 py-6 bg-black/40 border border-white/10 rounded-[2.5rem] focus:border-brand-primary outline-none transition-all font-bold text-xl text-white placeholder:text-slate-800"
                        />
                    </div>

                    {activeTab === 'video' && (
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Starting Reference (Optional)</label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="h-24 bg-black/40 border-2 border-dashed border-white/10 rounded-[2rem] flex items-center justify-center cursor-pointer hover:border-brand-primary transition-all overflow-hidden"
                            >
                                {startImage ? (
                                    <div className="flex items-center gap-4 px-6 w-full">
                                        <img src={startImage} className="h-16 w-16 rounded-xl object-cover border border-white/20" alt="Ref" />
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-white uppercase">Reference Image Loaded</p>
                                            <p className="text-[9px] text-slate-500">Veo will start the drone sequence from this view.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Camera size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Link Starting Image</span>
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                        </div>
                    )}

                    <div className="pt-6">
                        {!hasApiKey ? (
                            <div className="flex flex-col items-center gap-6 p-10 bg-brand-primary/10 border border-brand-primary/20 rounded-[2.5rem]">
                                <Key className="text-brand-primary animate-pulse" size={32} />
                                <div className="text-center">
                                    <p className="text-white font-black uppercase tracking-widest text-lg">APIs Not Initialized</p>
                                    <p className="text-slate-500 text-xs mt-1">Select a paid project key to enable high-quality generation.</p>
                                </div>
                                <button 
                                    onClick={handleLoadApis}
                                    className="px-10 py-5 bg-brand-primary text-slate-950 font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-teal-400 transition-all shadow-xl shadow-brand-primary/20"
                                >
                                    Setup API Keys
                                </button>
                            </div>
                        ) : isGenerating ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-end mb-2">
                                    <p className="text-xs font-black text-brand-primary uppercase tracking-widest animate-pulse">{statusMsg}</p>
                                    <span className="text-[10px] font-mono text-slate-500">{progress}%</span>
                                </div>
                                <div className="h-4 bg-black/40 rounded-full overflow-hidden p-1 border border-white/5">
                                    <div 
                                        className="h-full bg-brand-primary rounded-full transition-all duration-1000 animate-shimmer" 
                                        style={{ width: `${progress}%`, backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(to right, #2dd4bf 0%, #14b8a6 50%, #2dd4bf 100%)' }}
                                    ></div>
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={activeTab === 'video' ? generateVideo : generateImage}
                                disabled={!prompt.trim()}
                                className={`w-full py-8 rounded-[2.5rem] text-xl font-black uppercase tracking-[0.4em] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 ${activeTab === 'video' ? 'bg-brand-primary text-white shadow-brand-primary/20' : 'bg-brand-secondary text-white shadow-brand-secondary/20'} disabled:opacity-20`}
                            >
                                <Wand2 /> Initialize Synthesis
                            </button>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-5 flex flex-col">
                    <div className="flex-1 bg-black/40 border border-white/10 rounded-[3rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px]">
                        {outputUrl ? (
                            <div className="w-full h-full animate-fade-in group">
                                {activeTab === 'video' ? (
                                    <video src={outputUrl} controls autoPlay loop className="w-full h-full object-cover rounded-2xl" />
                                ) : (
                                    <img src={outputUrl} className="w-full h-full object-cover rounded-2xl" />
                                )}
                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a href={outputUrl} download={`TITAN_ASSET_${Date.now()}`} className="bg-white text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-110 transition-transform">
                                        <Download size={16} /> Save Export
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="opacity-20 flex flex-col items-center gap-4">
                                <Sparkles size={64} className="text-slate-500" />
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Inference_Queue_Empty</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] border border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <ShieldCheck className="text-brand-primary" size={16} />
                            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Quality Assurance</h4>
                        </div>
                        <p className="text-[10px] text-slate-600 font-bold leading-relaxed">
                            Assets are generated with watermark protection during beta. All exports meet high-fidelity architectural visualization standards.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};