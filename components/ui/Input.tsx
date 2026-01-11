
import React from 'react';
import { VoiceInput } from './VoiceInput';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    onVoiceInput?: (text: string) => void;
}

export const Input: React.FC<InputProps> = ({ label, id, onVoiceInput, ...props }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    className={`w-full px-3 py-2 bg-white dark:bg-base-100 border border-slate-300 dark:border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary disabled:bg-slate-200 dark:disabled:bg-base-300 disabled:opacity-70 ${onVoiceInput ? 'pr-10' : ''}`}
                    {...props}
                />
                {onVoiceInput && (
                    <div className="absolute right-1 top-1/2 -translate-y-1/2">
                        <VoiceInput onInput={onVoiceInput} disabled={props.disabled} />
                    </div>
                )}
            </div>
        </div>
    );
};
