import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-base-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: 'bg-brand-primary text-white hover:bg-teal-500 focus:ring-brand-primary',
        ghost: 'bg-transparent text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-base-300 focus:ring-brand-secondary',
    };

    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};
