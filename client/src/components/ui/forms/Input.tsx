import React, { useId } from 'react';
import { MaterialIcon } from '../MaterialIcon';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconName?: string;
  fullWidth?: boolean;
}

interface PhoneInputProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  label?: string;
  error?: string;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, iconName, fullWidth = false, className = '', ...props }, ref) => {
    const id = useId();
    const baseInputStyles = "w-full bg-surface text-main-text border-border placeholder:text-muted rounded-2xl border-2 px-4 py-3 text-sm transition-all duration-300 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-40 disabled:cursor-not-allowed";

    return (
      <div className={`${fullWidth ? 'w-full' : 'w-72'} flex flex-col gap-1.5`}>
        {label && <label htmlFor={id} className="text-xs text-primary font-bold uppercase tracking-widest ml-1">{label}</label>}
        <div className="relative flex items-center">
          {iconName && <div className="absolute left-4 text-muted"><MaterialIcon iconName={iconName} size={18} /></div>}
          <input id={id} ref={ref} className={`${baseInputStyles} ${iconName ? 'pl-11' : ''} ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`} {...props} />
        </div>
        {error && <span className="text-[10px] font-bold text-red-500 ml-1 uppercase">{error}</span>}
      </div>
    );
  }
);

export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, iconName = "lock", fullWidth = false, className = '', ...props }, ref) => {
    const id = useId();
    const [showPassword, setShowPassword] = React.useState(false);

    const toggleVisibility = () => setShowPassword(!showPassword);

    const baseInputStyles = "w-full bg-surface text-main-text border-border placeholder:text-muted rounded-2xl border-2 px-4 py-3 text-sm transition-all duration-300 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-40 disabled:cursor-not-allowed";

    return (
      <div className={`${fullWidth ? 'w-full' : 'w-72'} flex flex-col gap-1.5`}>
        {label && (
          <label htmlFor={id} className="text-xs text-primary font-black uppercase tracking-widest ml-1 italic">
            {label}
          </label>
        )}
        
        <div className="relative flex items-center group">
          
          {iconName && (
            <div className="absolute left-4 text-muted group-focus-within:text-primary transition-colors">
              <MaterialIcon iconName={iconName} size={18} />
            </div>
          )}

          <input
            id={id}
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={`
              ${baseInputStyles} 
              ${iconName ? 'pl-11' : ''} 
              pr-12 
              ${error ? 'border-red-500 focus:border-red-500' : ''} 
              ${className}
            `}
            {...props}
          />

          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute right-4 text-muted hover:text-primary transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <MaterialIcon 
              iconName={showPassword ? "visibility_off" : "visibility"} 
              size={18} 
            />
          </button>
        </div>

        {error && (
          <span className="text-[10px] font-black text-red-500 ml-1 uppercase italic tracking-tighter animate-in fade-in slide-in-from-left-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

export const CustomPhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, fullWidth = false, className = '', value, onChange, disabled }, ref) => {
    const id = useId();
    
    // Exact styles from your standard Input
    const baseInputStyles = "w-full bg-surface text-main-text border-border rounded-2xl border-2 px-4 py-3 text-sm transition-all duration-300 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10";
    const borderStyles = error ? 'border-red-500 focus-within:border-red-500' : 'border-border';

    return (
      <div className={`${fullWidth ? 'w-full' : 'w-72'} flex flex-col gap-1.5`}>
        {label && (
          <label htmlFor={id} className="text-xs text-primary font-bold uppercase tracking-widest ml-1">
            {label}
          </label>
        )}

        <div className={`relative flex items-center group ${baseInputStyles} ${borderStyles} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}>
          <PhoneInput
            id={id}
            inputRef={ref}
            international
            withCountryCallingCode
            defaultCountry="PH"
            value={value}
            onChange={onChange} // Pass value directly
            disabled={disabled}
            smartCaret={true}
            placeholder="+63 000 0000 0000"
            className="custom-phone-wrapper PhoneInputInput"
          />
        </div>

        {error && (
          <span className="text-[10px] font-black text-red-500 ml-1 uppercase italic tracking-tighter animate-in fade-in slide-in-from-left-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);



export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }>(
  ({ label, error, className = '', ...props }, ref) => {
    const id = useId();
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label htmlFor={id} className="text-xs text-primary font-bold uppercase tracking-widest ml-1">{label}</label>}
        <textarea id={id} ref={ref} className={`w-full bg-surface text-main-text border-border rounded-2xl border-2 px-4 py-3 text-sm focus:outline-none focus:border-primary min-h-30 transition-all duration-300 ${error ? 'border-red-500' : ''} ${className}`} {...props} />
        {error && <span className="text-[10px] font-bold text-red-500 ml-1 uppercase">{error}</span>}
      </div>
    );
  }
);