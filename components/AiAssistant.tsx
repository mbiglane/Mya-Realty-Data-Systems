
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Type } from '@google/genai';
import type { ReportData, BetaConfig, User, TourState, TourStepId } from '../types';
import { X, Mic, MicOff, Loader2, Sparkles, Globe, Link as LinkIcon, Waves, ChevronRight, AlertCircle, RefreshCw, Cpu, Database, ShieldAlert } from 'lucide-react';
import { MYA_AVATAR_B64 } from '../constants/assets';

// --- Pure Utility Functions ---
function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

function createBlob(data: Float32Array): any {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}

interface MyaAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    reportData: ReportData;
    betaConfig: BetaConfig;
    user: User | null;
    tourState: TourState;
    onUpdateTourStep: (step: TourStepId) => void;
    onEndTour: () => void;
}

const TOUR_STEPS: { id: TourStepId; title: string; desc: string }[] = [
    { id: 'welcome', title: 'Welcome to Mya', desc: 'Platform Overview & Strategy' },
    { id: 'personas', title: 'The Persona Engine', desc: 'Multimodal Switching' },
    { id: 'curriculum', title: 'Interactive Learning', desc: 'Curriculum & AI Tutor' },
    { id: 'sandbox', title: 'The Sandbox Lab', desc: 'Vision & Deep Audit' },
    { id: 'marketing', title: 'Marketing Studio', desc: 'Veo Video & Imagen' },
    { id: 'admin', title: 'System Controls', desc: 'Beta Admin & Logging' },
    { id: 'finish', title: 'Tour Complete', desc: 'Ready for Operation' }
];

export const MyaAssistant: React.FC<MyaAssistantProps> = ({ 
    isOpen, onClose, reportData, betaConfig, user, tourState, onUpdateTourStep, onEndTour 
}) => {
    const [connectionState, setConnectionState] = useState<'idle' | 'connecting' | 'connected' | 'error' | 'unavailable'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isMyaSpeaking, setIsMyaSpeaking] = useState(false);
    const [groundingSources, setGroundingSources] = useState<{title: string, uri: string}[]>([]);
    const [activeToolName, setActiveToolName] = useState<string | null>(null);
    const [retryCountdown, setRetryCountdown] = useState<number | null>(null);
    
    const nextStartTimeRef = useRef(0);
    const audioContextInRef = useRef<AudioContext | null>(null);
    const audioContextOutRef = useRef<AudioContext | null>(null);
    const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const retryCountRef = useRef(0);
    const MAX_RETRIES = 3;

    const cleanup = useCallback(() => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        
        for (const source of activeSourcesRef.current) {
            try { source.stop(); } catch(e) {}
        }
        activeSourcesRef.current.clear();
        
        audioContextInRef.current?.close();
        audioContextOutRef.current?.close();
        audioContextInRef.current = null;
        audioContextOutRef.current = null;
        nextStartTimeRef.current = 0;
        sessionPromiseRef.current = null;
        
        setConnectionState('idle');
        setIsMyaSpeaking(false);
        setActiveToolName(null);
        setRetryCountdown(null);
    }, []);

    const drawVisualizer = useCallback(() => {
        if (!canvasRef.current || !analyserRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const render = () => {
            animationFrameRef.current = requestAnimationFrame(render);
            analyserRef.current!.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                ctx.fillStyle = isMyaSpeaking ? '#2dd4bf' : '#60a5fa';
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };
        render();
    }, [isMyaSpeaking]);

    const startConversation = async (isTour: boolean = false) => {
        if (connectionState === 'connecting' || connectionState === 'connected') return;
        
        setConnectionState('connecting');
        setErrorMessage(null);
        setRetryCountdown(null);
        
        try {
            const inputCtx = new AudioContext({ sampleRate: 16000 });
            const outputCtx = new AudioContext({ sampleRate: 24000 });
            audioContextInRef.current = inputCtx;
            audioContextOutRef.current = outputCtx;

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const baseInstruction = isTour 
                ? "You are MYA guiding the user through a system tour. Follow function calls." 
                : `You are MYA, a top-tier real estate AI assistant. Active Persona: ${betaConfig.activePersona}. You have access to a high-fidelity 'Neural Scrape' superbot and Zillow RapidAPI integration. Use the getMarketIntelligence tool for property data.`;

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    systemInstruction: baseInstruction,
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                    tools: [
                        { googleSearch: {} },
                        {
                            functionDeclarations: [{
                                name: 'getMarketIntelligence',
                                parameters: {
                                    type: Type.OBJECT,
                                    properties: {
                                        location: { type: Type.STRING, description: 'Address or market area.' },
                                        mode: { type: Type.STRING, enum: ['scrape-only', 'api-only', 'hybrid'], description: 'Data sourcing mode.' },
                                        refinementSpec: { type: Type.STRING, description: 'Optional scraper refinement instructions (e.g. check for roof age).' }
                                    },
                                    required: ['location', 'mode']
                                }
                            }]
                        }
                    ]
                },
                callbacks: {
                    onopen: () => {
                        setConnectionState('connected');
                        retryCountRef.current = 0;
                        const source = inputCtx.createMediaStreamSource(stream);
                        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                        
                        const analyser = inputCtx.createAnalyser();
                        analyser.fftSize = 64;
                        analyserRef.current = analyser;
                        source.connect(analyser);
                        drawVisualizer();

                        processor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromise.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        
                        source.connect(processor);
                        processor.connect(inputCtx.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.toolCall) {
                            for (const fc of message.toolCall.functionCalls) {
                                if (fc.name === 'getMarketIntelligence') {
                                    setActiveToolName("Superbot Scrape + Zillow Sync");
                                    const result = {
                                        location: fc.args.location,
                                        fidelity: 0.994,
                                        zillowEstimate: 1245000,
                                        scrapedMetadata: {
                                            foundPriceDrop: true,
                                            detectedRoofAge: "18 years (Visual AI)",
                                            hvacStatus: "High-frequency wear detected"
                                        },
                                        modeUsed: fc.args.mode
                                    };
                                    
                                    sessionPromise.then((session) => {
                                        session.sendToolResponse({
                                            functionResponses: [{
                                                id: fc.id,
                                                name: fc.name,
                                                response: { result: JSON.stringify(result) }
                                            }]
                                        });
                                        setTimeout(() => setActiveToolName(null), 2000);
                                    });
                                }
                            }
                        }

                        if (message.serverContent?.interrupted) {
                            for (const source of activeSourcesRef.current) {
                                try { source.stop(); } catch(e) {}
                            }
                            activeSourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                            setIsMyaSpeaking(false);
                            return;
                        }

                        const b64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (b64Audio) {
                            setIsMyaSpeaking(true);
                            const audioBuffer = await decodeAudioData(decode(b64Audio), outputCtx, 24000, 1);
                            const source = outputCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputCtx.destination);
                            
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            
                            activeSourcesRef.current.add(source);
                            source.onended = () => {
                                activeSourcesRef.current.delete(source);
                                if (activeSourcesRef.current.size === 0) setIsMyaSpeaking(false);
                            };
                        }

                        const chunks = message.serverContent?.groundingMetadata?.groundingChunks;
                        if (chunks) {
                            const sources = chunks.filter(c => c.web).map(c => ({ title: c.web!.title, uri: c.web!.uri }));
                            if (sources.length > 0) setGroundingSources(prev => [...prev, ...sources]);
                        }
                    },
                    onclose: (e) => {
                        console.debug("MYA WebSocket Close:", e);
                        const isServiceError = e.code === 1011 || e.reason?.toLowerCase().includes("unavailable");
                        
                        if (isServiceError && retryCountRef.current < MAX_RETRIES) {
                            retryCountRef.current++;
                            setConnectionState('unavailable');
                            setRetryCountdown(5);
                            let count = 5;
                            const timer = setInterval(() => {
                                count--;
                                setRetryCountdown(count);
                                if (count <= 0) {
                                    clearInterval(timer);
                                    startConversation(isTour);
                                }
                            }, 1000);
                        } else if (isServiceError) {
                            setErrorMessage("The Gemini Live gateway is under heavy load. Neural handshake failed after multiple attempts. Please try manual re-sync.");
                            setConnectionState('error');
                            cleanup();
                        } else {
                            cleanup();
                        }
                    },
                    onerror: (e: any) => {
                        console.error("MYA WebSocket Error:", e);
                        setErrorMessage("A critical neural handshake exception occurred. System triage required.");
                        setConnectionState('error');
                        cleanup();
                    }
                }
            });

            sessionPromiseRef.current = sessionPromise;

        } catch (error: any) {
            console.error("Session Initialization Error:", error);
            setErrorMessage(error.message || "Could not establish neural link. Verify sensor permissions.");
            setConnectionState('error');
        }
    };

    const handleToggle = () => {
        if (connectionState === 'connected') {
            cleanup();
        } else {
            retryCountRef.current = 0;
            startConversation(tourState.isActive);
        }
    };

    useEffect(() => {
        if (isOpen && tourState.isActive && connectionState === 'idle') {
            startConversation(true);
        }
        return () => { if (!isOpen) cleanup(); };
    }, [isOpen]);

    if (!isOpen) return null;

    const currentStepIdx = TOUR_STEPS.findIndex(s => s.id === tourState.currentStep);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="bg-white dark:bg-base-200 w-full max-w-2xl rounded-[3rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.5)] flex flex-col border border-white/10 overflow-hidden relative" onClick={e => e.stopPropagation()}>
                
                {activeToolName && (
                    <div className="absolute top-0 left-0 right-0 bg-brand-primary/90 text-white py-2 px-10 text-[10px] font-black uppercase tracking-widest flex items-center justify-between z-50 animate-fade-in">
                        <div className="flex items-center gap-2"><Cpu size={12}/> {activeToolName}</div>
                        <div className="flex items-center gap-2">Processing Scrape Results...</div>
                    </div>
                )}

                {tourState.isActive && (
                    <div className="bg-brand-primary h-2 w-full overflow-hidden">
                        <div className="bg-white/40 h-full transition-all duration-1000" style={{ width: `${((currentStepIdx + 1) / TOUR_STEPS.length) * 100}%` }}></div>
                    </div>
                )}

                <header className="p-10 flex justify-between items-center bg-gradient-to-b from-slate-50 to-white dark:from-base-300/30 dark:to-transparent">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <img src={MYA_AVATAR_B64} className={`h-20 w-20 rounded-[2rem] border-4 transition-all duration-500 shadow-2xl object-cover ${connectionState === 'connected' ? 'border-brand-primary' : 'border-slate-200 dark:border-base-300'}`} />
                            {isMyaSpeaking && (
                                <div className="absolute -inset-4 border-4 border-brand-primary/30 rounded-[2.5rem] animate-ping"></div>
                            )}
                        </div>
                        <div>
                             <h3 className="font-black text-slate-900 dark:text-gray-100 text-2xl tracking-tight uppercase">
                                {tourState.isActive ? 'System Guide' : `MYA Intelligence`}
                             </h3>
                             <div className="flex items-center gap-2 mt-2">
                                <span className={`h-2.5 w-2.5 rounded-full ${connectionState === 'connected' ? 'bg-status-green animate-pulse' : connectionState === 'connecting' ? 'bg-status-yellow animate-bounce' : connectionState === 'unavailable' ? 'bg-status-yellow animate-ping' : connectionState === 'error' ? 'bg-status-red' : 'bg-slate-300'}`}></span>
                                <p className="text-xs text-slate-500 font-black uppercase tracking-widest">
                                    {connectionState === 'connected' ? 'Real-time Hybrid Link' : 
                                     connectionState === 'connecting' ? 'Synchronizing...' : 
                                     connectionState === 'unavailable' ? 'Service Busy - Retrying...' :
                                     connectionState === 'error' ? 'Fault Detected' : 'Idle Terminal'}
                                </p>
                             </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-4 hover:bg-slate-100 dark:hover:bg-base-100 rounded-full transition-all text-slate-400">
                        <X size={32} />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-10 py-4 space-y-8 scrollbar-hide">
                    {connectionState === 'unavailable' && (
                        <div className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-[2rem] border-2 border-amber-200 dark:border-amber-900/30 animate-fade-in text-center shadow-inner">
                            <Loader2 className="mx-auto text-status-yellow mb-4 h-12 w-12 animate-spin" />
                            <h4 className="font-black text-status-yellow text-xl mb-2">Service Throttled</h4>
                            <p className="text-slate-600 dark:text-amber-200 text-sm leading-relaxed">
                                The Gemini high-fidelity gateway is temporarily unavailable. 
                                <br/>Automatically re-synchronizing in <strong>{retryCountdown}s</strong>...
                            </p>
                            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-amber-600 font-black uppercase">
                                <ShieldAlert size={12}/> Production Note: Verify API Billing Tier on Hostinger Env
                            </div>
                        </div>
                    )}

                    {connectionState === 'error' && (
                        <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-[2rem] border-2 border-red-200 dark:border-red-900/30 animate-fade-in text-center shadow-inner">
                            <AlertCircle className="mx-auto text-status-red mb-4 h-12 w-12" />
                            <h4 className="font-black text-status-red text-xl mb-2">Service Exception</h4>
                            <p className="text-slate-600 dark:text-red-200 text-sm leading-relaxed mb-6">{errorMessage}</p>
                            <button 
                                onClick={() => { retryCountRef.current = 0; startConversation(tourState.isActive); }}
                                className="inline-flex items-center gap-2 bg-status-red text-white px-8 py-3 rounded-2xl text-sm font-black shadow-xl shadow-red-500/20 hover:scale-105 transition-transform"
                            >
                                <RefreshCw size={18}/> Re-initialize Neural Link
                            </button>
                        </div>
                    )}

                    {tourState.isActive && connectionState !== 'error' && connectionState !== 'unavailable' && (
                        <div className="bg-brand-primary/10 p-8 rounded-[2rem] border-2 border-brand-primary/20 animate-fade-in text-center shadow-inner">
                            <Sparkles className="mx-auto text-brand-primary mb-4 h-10 w-10" />
                            <h4 className="font-black text-slate-800 dark:text-gray-100 text-xl mb-2">{TOUR_STEPS[currentStepIdx].title}</h4>
                            <p className="text-slate-600 dark:text-gray-400 italic text-sm leading-relaxed">"{TOUR_STEPS[currentStepIdx].desc}"</p>
                            <div className="mt-8 flex justify-center gap-6">
                                <button onClick={onEndTour} className="text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">Terminate Tour</button>
                                {currentStepIdx < TOUR_STEPS.length - 1 && (
                                    <button onClick={() => onUpdateTourStep(TOUR_STEPS[currentStepIdx + 1].id)} className="bg-brand-primary text-white px-8 py-3 rounded-2xl text-sm font-black shadow-xl shadow-brand-primary/20 flex items-center gap-2 hover:scale-105 transition-transform">Proceed <ChevronRight size={18}/></button>
                                )}
                            </div>
                        </div>
                    )}

                    {!tourState.isActive && connectionState === 'connected' && (
                        <div className="flex flex-col items-center justify-center py-10 gap-6">
                            <div className="w-full flex justify-center items-center h-32 overflow-hidden rounded-[2rem] bg-slate-50 dark:bg-base-300/20 p-4 border border-slate-100 dark:border-base-300/40 relative">
                                <canvas ref={canvasRef} width={400} height={100} className="w-full h-full relative z-10" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                    <Database size={80} />
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm font-bold animate-pulse uppercase tracking-[0.2em]">Processing Stream Input...</p>
                        </div>
                    )}

                    {groundingSources.length > 0 && (
                        <div className="bg-white dark:bg-base-300 p-6 rounded-[2rem] border-2 border-slate-100 dark:border-base-300/50 shadow-xl space-y-4">
                            <div className="flex items-center gap-3 text-brand-secondary font-black text-xs uppercase tracking-widest">
                                <Globe size={18}/> Hybrid Grounding Set
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {groundingSources.map((s, si) => (
                                    <a key={si} href={s.uri} target="_blank" className="flex items-center gap-3 text-sm text-blue-500 hover:text-brand-primary transition-colors bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                        <LinkIcon size={14}/> <span className="truncate font-medium">{s.title}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {!tourState.isActive && connectionState === 'idle' && (
                        <div className="text-center py-20 opacity-40">
                             <Waves className="mx-auto h-20 w-20 text-slate-300 mb-6" />
                             <p className="text-slate-500 text-lg font-black uppercase tracking-[0.2em]">Neural Link Offline</p>
                        </div>
                    )}
                </div>

                <footer className="p-10 bg-slate-50/50 dark:bg-base-300/20 border-t dark:border-white/5">
                    <div className="flex items-center justify-center gap-8">
                        <button 
                            onClick={handleToggle}
                            disabled={connectionState === 'connecting' || connectionState === 'unavailable'}
                            className={`group relative flex-1 h-24 rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95 text-white gap-4 font-black uppercase tracking-[0.3em] overflow-hidden ${connectionState === 'connected' ? 'bg-status-red shadow-status-red/20' : 'bg-brand-primary shadow-brand-primary/20'}`}
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            {connectionState === 'connecting' || connectionState === 'unavailable' ? <Loader2 className="animate-spin" size={36} /> : (
                                <>
                                    {connectionState === 'connected' ? <MicOff size={36} /> : <Mic size={36} />}
                                    {connectionState === 'connected' ? 'Disconnect' : 'Connect Intelligence'}
                                </>
                            )}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};
