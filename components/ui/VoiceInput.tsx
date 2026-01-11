
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
    onInput: (text: string) => void;
    className?: string;
    disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onInput, className = "", disabled }) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => setIsListening(true);
            recognitionRef.current.onend = () => setIsListening(false);
            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };
            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                onInput(transcript);
            };
        }
    }, [onInput]);

    const toggleListening = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    if (!recognitionRef.current) return null;

    return (
        <button
            type="button"
            onClick={toggleListening}
            disabled={disabled}
            className={`p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                isListening 
                    ? 'bg-red-100 text-red-600 animate-pulse' 
                    : 'text-slate-400 hover:text-brand-primary hover:bg-slate-100 dark:hover:bg-base-300'
            } ${className}`}
            title="Voice Input"
            aria-label={isListening ? "Stop recording" : "Start recording"}
        >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
    );
};
