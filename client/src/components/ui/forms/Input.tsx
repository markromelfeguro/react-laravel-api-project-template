import React, { useId } from 'react';
import { MaterialIcon } from '../MaterialIcon';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconName?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, iconName, fullWidth = false, className = '', ...props }, ref) => {
    const id = useId();
    const baseInputStyles = "w-full bg-surface text-main-text border-border placeholder:text-muted rounded-2xl border-2 px-4 py-3 text-sm transition-all duration-300 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-40 disabled:cursor-not-allowed";

    return (
      <div className={`${fullWidth ? 'w-full' : 'w-72'} flex flex-col gap-1.5`}>
        {label && <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">{label}</label>}
        <div className="relative flex items-center">
          {iconName && <div className="absolute left-4 text-muted"><MaterialIcon iconName={iconName} size={18} /></div>}
          <input id={id} ref={ref} className={`${baseInputStyles} ${iconName ? 'pl-11' : ''} ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`} {...props} />
        </div>
        {error && <span className="text-[10px] font-bold text-red-500 ml-1 uppercase">{error}</span>}
      </div>
    );
  }
);

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }>(
  ({ label, error, className = '', ...props }, ref) => {
    const id = useId();
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">{label}</label>}
        <textarea id={id} ref={ref} className={`w-full bg-surface text-main-text border-border rounded-2xl border-2 px-4 py-3 text-sm focus:outline-none focus:border-primary min-h-30 transition-all duration-300 ${error ? 'border-red-500' : ''} ${className}`} {...props} />
        {error && <span className="text-[10px] font-bold text-red-500 ml-1 uppercase">{error}</span>}
      </div>
    );
  }
);