import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality, Blob, LiveServerMessage } from '@google/genai';
import type { ReportData, BetaConfig, User, TourState, TourStepId } from '../types';
import { X, Mic, Loader2, Sparkles, Waves, AlertCircle, RefreshCw } from 'lucide-react';
import { MYA_AVATAR_B64 } from '../constants/assets';

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

function createBlob(data: Float32Array): Blob {
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

export const MyaAssistant: React.FC<MyaAssistantProps> = ({ 
    isOpen, onClose, user, betaConfig
}) => {
    const [connectionState, setConnectionState] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isMyaSpeaking, setIsMyaSpeaking] = useState(false);
    
    const nextStartTimeRef = useRef(0);
    const audioContextInRef = useRef<AudioContext | null>(null);
    const audioContextOutRef = useRef<AudioContext | null>(null);
    const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const sessionPromiseRef = useRef<Promise<any> | null>(null);

    const cleanup = useCallback(() => {
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
    }, []);

    const startConversation = async () => {
        if (connectionState === 'connecting' || connectionState === 'connected') return;
        setConnectionState('connecting');
        setErrorMessage(null);
        try {
            const inputCtx = new AudioContext({ sampleRate: 16000 });
            const outputCtx = new AudioContext({ sampleRate: 24000 });
            audioContextInRef.current = inputCtx;
            audioContextOutRef.current = outputCtx;
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                config: {
                    systemInstruction: `You are MYA, a high-level real estate intelligence agent. User name: ${user?.name}. Voice only.`,
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
                },
                callbacks: {
                    onopen: () => {
                        setConnectionState('connected');
                        const source = inputCtx.createMediaStreamSource(stream);
                        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                        source.connect(processor);
                        processor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            sessionPromise.then((session) => {
                                if (session) session.sendRealtimeInput({ media: createBlob(inputData) });
                            });
                        };
                        processor.connect(inputCtx.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const b64 = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (b64) {
                            setIsMyaSpeaking(true);
                            const buf = await decodeAudioData(decode(b64), outputCtx, 24000, 1);
                            const src = outputCtx.createBufferSource();
                            src.buffer = buf;
                            src.connect(outputCtx.destination);
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            src.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += buf.duration;
                            activeSourcesRef.current.add(src);
                            src.onended = () => {
                                activeSourcesRef.current.delete(src);
                                if (activeSourcesRef.current.size === 0) setIsMyaSpeaking(false);
                            };
                        }
                    },
                    onclose: () => cleanup(),
                    onerror: (e) => { 
                        setConnectionState('error'); 
                        setErrorMessage("Neural link disconnected.");
                        cleanup(); 
                    }
                }
            });
            sessionPromiseRef.current = sessionPromise;
        } catch (e) { 
            setConnectionState('error'); 
            setErrorMessage("Audio capture restricted.");
        }
    };

    const handleToggle = () => (connectionState === 'connected' ? cleanup() : startConversation());

    useEffect(() => { if (!isOpen) cleanup(); }, [isOpen, cleanup]);

    return (
        <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-slate-950 border-l border-white/5 flex flex-col transform transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <header className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img src={MYA_AVATAR_B64} className={`h-12 w-12 rounded-2xl border-2 transition-all ${connectionState === 'connected' ? 'border-brand-primary' : 'border-slate-800'}`} alt="Mya" />
                            {connectionState === 'connected' && <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-status-green rounded-full border-2 border-slate-950"></span>}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Mya Intelligence</h3>
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{connectionState.toUpperCase()}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white"><X size={20} /></button>
                </header>

                <div className="flex-1 p-8 flex flex-col justify-center items-center text-center">
                    {connectionState === 'connected' ? (
                        <div className="space-y-8 w-full">
                            <div className="flex justify-center gap-1.5 h-12 items-center">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={`w-1.5 bg-brand-primary rounded-full transition-all duration-300 ${isMyaSpeaking ? 'h-12' : 'h-3'}`} style={{ transitionDelay: `${i * 100}ms` }}></div>
                                ))}
                            </div>
                            <p className="text-slate-400 italic text-sm">"Real-time voice handshake established. How can I assist with your market strategy?"</p>
                        </div>
                    ) : (
                        <div className="opacity-30 flex flex-col items-center">
                            <Waves className="h-16 w-16 text-slate-600 mb-6 animate-pulse" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Initialize Neural Link</p>
                        </div>
                    )}
                </div>

                <footer className="p-8 border-t border-white/5 bg-slate-900/20">
                    {errorMessage && <div className="mb-4 text-[10px] text-status-red font-black uppercase tracking-widest flex items-center gap-2"><AlertCircle size={14}/> {errorMessage}</div>}
                    <button 
                        onClick={handleToggle}
                        disabled={connectionState === 'connecting'}
                        className={`w-full h-16 rounded-3xl flex items-center justify-center gap-4 text-white font-black uppercase tracking-widest transition-all ${connectionState === 'connected' ? 'bg-slate-800' : 'bg-brand-primary shadow-2xl shadow-brand-primary/20'}`}
                    >
                        {connectionState === 'connecting' ? <Loader2 className="animate-spin" /> : (connectionState === 'connected' ? <><RefreshCw size={20}/> End Link</> : <><Mic size={20}/> Begin Session</>)}
                    </button>
                </footer>
            </div>
        </div>
    );
};