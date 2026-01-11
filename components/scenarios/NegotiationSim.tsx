
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { Send } from 'lucide-react';
import { VoiceInput } from '../ui/VoiceInput';

interface SimMessage {
    role: 'user' | 'model';
    text: string;
}

const SCENARIO_PROMPT = `You are a potential home buyer named David. You are interested in a property listed for $500,000, but you have concerns. Your primary concern is the roof, which appears to be over 15 years old. Your secondary concern is that the kitchen appliances are outdated. Your goal is to negotiate a lower price or get credits for repairs. You are a savvy but fair negotiator. Do not agree to the first offer. Push back reasonably. Start the conversation by greeting the agent and stating your interest in the property.`;

export const NegotiationSim: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<SimMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    useEffect(() => {
        async function initChat() {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const newChat = ai.chats.create({
                    model: 'gemini-3-pro-preview',
                    config: {
                        systemInstruction: SCENARIO_PROMPT,
                        thinkingConfig: { thinkingBudget: 1024 } // Enable thinking for better negotiation tactics
                    },
                });
                setChat(newChat);

                const initialResponse = await newChat.sendMessage({ message: "Hello, let's begin." });
                setMessages([{ role: 'model', text: initialResponse.text }]);
            } catch(err) {
                console.error("Chat initialization failed:", err);
                setError("Failed to start simulation. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        initChat();
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chat || loading) return;

        const userMessage: SimMessage = { role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setLoading(true);

        try {
            let modelResponseText = '';
            const stream = await chat.sendMessageStream({ message: userInput });
            
            // Add a placeholder for streaming
            setMessages(prev => [...prev, { role: 'model', text: '' }]);
            
            for await (const chunk of stream) {
                const c = chunk as GenerateContentResponse;
                modelResponseText += c.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', text: modelResponseText };
                    return newMessages;
                });
            }
        } catch (err) {
            console.error("Send message failed:", err);
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered a communication error. Let's try that again." }]);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col h-[60vh]">
            <div className="p-4 bg-slate-50 dark:bg-base-300/20 rounded-lg text-sm text-slate-700 dark:text-gray-300 mb-4">
                <strong>Your Role:</strong> You are the seller's agent for a property listed at $500,000. Your goal is to get the best possible deal for your client. Address the buyer's (MYA's) concerns and negotiate effectively.
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm mb-4">
                    {error}
                </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                            msg.role === 'user' 
                                ? 'bg-brand-secondary text-white' 
                                : 'bg-slate-100 dark:bg-base-300 text-slate-800 dark:text-gray-200'
                        }`}>
                           {msg.text || <span className="inline-block w-2 h-4 bg-slate-500 dark:bg-gray-400 animate-pulse rounded-full"></span>}
                        </div>
                    </div>
                ))}
                 {loading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                     <div className="flex items-end gap-2">
                        <div className="bg-slate-100 dark:bg-base-300 rounded-lg px-3 py-2">
                           <Loader />
                        </div>
                    </div>
                 )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your response..."
                        disabled={loading || !chat}
                        className="w-full px-3 py-2 pr-10 bg-slate-100 dark:bg-base-300 border border-slate-300 dark:border-base-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary disabled:opacity-50"
                    />
                     <div className="absolute right-1 top-1/2 -translate-y-1/2">
                        <VoiceInput onInput={setUserInput} disabled={loading || !chat} />
                    </div>
                </div>
                <Button type="submit" disabled={loading || !chat || !userInput.trim()}>
                   <Send size={16} />
                </Button>
            </form>
        </div>
    );
};
