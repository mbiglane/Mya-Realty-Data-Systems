
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality, Type, Blob } from '@google/genai';
import type { ReportData, BetaConfig, User, TourState, TourStepId } from '../types';
import { X, Mic, MicOff, Loader2, Sparkles, Waves, AlertCircle, RefreshCw } from 'lucide-react';
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
    isOpen, onClose, user, reportData, betaConfig, tourState, onUpdateTourStep, onEndTour
}) => {
    const [connectionState, setConnectionState] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isMyaSpeaking, setIsMyaSpeaking] = useState(false);
    
    const nextStartTimeRef = useRef(0);
    const audioContextInRef = useRef<AudioContext | null>(null);
    const audioContextOutRef = useRef<AudioContext | null>(null);
    const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);

    const cleanup = useCallback(() => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        for (const source of activeSourcesRef.current) {
            try { source.stop(); } catch(e) {}
        }
        activeSourcesRef.current.clear();
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        audioContextInRef.current?.close();
        audioContextOutRef.current?.close();
        audioContextInRef.current = null;
        audioContextOutRef.current = null;
        nextStartTimeRef.current = 0;
        sessionPromiseRef.current = null;
        setConnectionState('idle');
        setIsMyaSpeaking(false);
    }, []);

    const handleStopSpeaking = useCallback(() => {
        for (const source of activeSourcesRef.current) {
            try { source.stop(); } catch(e) {}
        }
        activeSourcesRef.current.clear();
        nextStartTimeRef.current = 0;
        setIsMyaSpeaking(false);
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
            if (analyserRef.current) {
                analyserRef.current.getByteFrequencyData(dataArray);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const barWidth = (canvas.width / bufferLength) * 2;
                let barHeight;
                let x = 0;
                for (let i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i] / 3;
                    ctx.fillStyle = isMyaSpeaking ? '#2dd4bf' : '#334155';
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                    x += barWidth + 2;
                }
            }
        };
        render();
    }, [isMyaSpeaking]);

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
            mediaStreamRef.current = stream;
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                config: {
                    systemInstruction: `You are MYA, a high-level real estate intelligence agent. User name: ${user?.name}.`,
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
                },
                callbacks: {
                    onopen: () => {
                        setConnectionState('connected');
                        const source = inputCtx.createMediaStreamSource(stream);
                        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                        const analyser = inputCtx.createAnalyser();
                        analyser.fftSize = 64;
                        analyserRef.current = analyser;
                        source.connect(analyser);
                        drawVisualizer();
                        processor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            sessionPromise.then((session) => {
                                if (session) session.sendRealtimeInput({ media: createBlob(inputData) });
                            });
                        };
                        source.connect(processor);
                        processor.connect(inputCtx.destination);
                    },
                    onmessage: async (m: any) => {
                        if (m.serverContent?.interrupted) handleStopSpeaking();
                        const b64 = m.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
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
                    onerror: () => { 
                        setConnectionState('error'); 
                        setErrorMessage("Neural link disconnected.");
                        cleanup(); 
                    }
                }
            });
            sessionPromiseRef.current = sessionPromise;
        } catch (e) { 
            setConnectionState('error'); 
            setErrorMessage("Audio access denied.");
        }
    };

    const handleToggle = () => (connectionState === 'connected' ? cleanup() : startConversation());

    useEffect(() => { 
        if (!isOpen) cleanup(); 
    }, [isOpen, cleanup]);

    return (
        <div className={`fixed inset-0 z-[100] pointer-events-none transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`absolute inset-0 bg-slate-950/40 pointer-events-auto transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>
            
            <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-slate-950 shadow-2xl border-l border-white/5 pointer-events-auto transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
                <header className="p-6 pb-4 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img src={MYA_AVATAR_B64} className={`h-12 w-12 rounded-xl border-2 transition-all ${connectionState === 'connected' ? 'border-brand-primary' : 'border-slate-800'}`} alt="Mya" />
                            {connectionState === 'connected' && (
                                <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-status-green rounded-full border-2 border-slate-950"></span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Mya Intelligence</h3>
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                {connectionState === 'idle' ? 'LINK_OFFLINE' : connectionState.toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    {connectionState === 'connected' ? (
                        <div className="space-y-4 animate-fade-in">
                            <div className="h-20 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center justify-center p-2">
                                <canvas ref={canvasRef} width={300} height={60} className="w-full h-full" />
                            </div>
                            <div className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/10">
                                <p className="text-xs text-brand-primary font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Sparkles size={12}/> Connection Stable
                                </p>
                                <p className="text-sm text-slate-400 leading-relaxed italic">
                                    "I am ready. How can I help with your property analysis today?"
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                            <Waves className="h-12 w-12 text-slate-700 mb-4 animate-pulse" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Awaiting Handshake</p>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="p-4 bg-status-red/10 border border-status-red/20 rounded-xl text-status-red text-[10px] font-bold flex items-center gap-2">
                            <AlertCircle size={14} /> {errorMessage}
                        </div>
                    )}
                </div>

                <footer className="p-6 border-t border-white/5 bg-slate-900/20">
                    <button 
                        onClick={handleToggle}
                        disabled={connectionState === 'connecting'}
                        className={`w-full h-14 rounded-xl flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest transition-all ${
                            connectionState === 'connected' ? 'bg-slate-800' : 'bg-brand-primary hover:bg-teal-500'
                        }`}
                    >
                        {connectionState === 'connecting' ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                {connectionState === 'connected' ? <RefreshCw size={16} /> : <Mic size={16} />}
                                <span>{connectionState === 'connected' ? 'Close Session' : 'Start Session'}</span>
                            </>
                        )}
                    </button>
                </footer>
            </div>
        </div>
    );
};
