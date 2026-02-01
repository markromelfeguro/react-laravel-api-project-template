import React, { useId, useState, useEffect, useRef, useMemo } from 'react';
import { MaterialIcon } from '../MaterialIcon';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useDebounce } from '../../../hooks/useDebounceHook';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  error?: string;
  iconName?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, error, iconName, fullWidth = false, className = '', ...props }, ref) => {
    const id = useId();
    const baseInputStyles = "w-full bg-surface text-main-text border-border placeholder:text-muted rounded-2xl border-2 px-4 py-3 text-sm transition-all duration-300 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-40 disabled:cursor-not-allowed";

    return (
      <div className={`${fullWidth ? 'w-full' : 'w-72'} flex flex-col gap-1.5`}>
        {label && <label htmlFor={id} className="text-xs text-primary font-bold uppercase tracking-widest ml-1">{label}</label>}
        <div className="relative flex items-center">
          {iconName && <div className="absolute left-4 text-muted"><MaterialIcon iconName={iconName} size={18} /></div>}
          <input id={id} ref={ref} name={name} className={`${baseInputStyles} ${iconName ? 'pl-11' : ''} ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`} {...props} />
        </div>
        {error && <span className="text-[10px] font-bold text-red-500 ml-1 uppercase">{error}</span>}
      </div>
    );
  }
);

// --- SEARCH INPUT WITH SUGGESTIONS ---
interface SearchInputProps {
  suggestions: string[];
  onSelect: (value: string) => void;
  onDeleteSuggestion?: (value: string) => void;
  onClearHistory?: () => void; // New prop
  label?: string;
  name?: string;
  placeholder?: string;
}

export const SearchInput = ({ 
  suggestions, 
  onSelect, 
  onDeleteSuggestion, 
  onClearHistory,
  label, 
  name, 
  placeholder 
}: SearchInputProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 600);

  useEffect(() => {
    if (debouncedQuery !== undefined) {
      onSelect(debouncedQuery);
    }
  }, [debouncedQuery]);

  useOnClickOutside(containerRef, () => setIsOpen(false));

  const displaySuggestions = useMemo(() => {
    if (!query) return suggestions; 
    return suggestions.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    );
  }, [suggestions, query]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Input 
          label={label}
          name={name}
          placeholder={placeholder}
          iconName="search" 
          value={query} 
          onChange={(e) => { 
            setQuery(e.target.value); 
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          fullWidth
        />
        {/* CLEAR SEARCH INPUT BUTTON */}
        {query && (
          <button
            onClick={() => { setQuery(''); onSelect(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-primary transition-colors"
          >
            <MaterialIcon iconName="cancel" className="text-lg"/>
          </button>
        )}
      </div>

      {isOpen && displaySuggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 bg-surface border-2 border-border rounded-2xl shadow-main overflow-hidden">
          {!query && (
            <li className="flex items-center justify-between px-4 py-2 bg-main-bg/50 border-b border-border">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">Recent Searches</span>
              {/* CLEAR ALL HISTORY BUTTON */}
              {onClearHistory && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onClearHistory(); }}
                  className="text-[10px] font-bold text-red-500 hover:underline uppercase italic"
                >
                  Clear All
                </button>
              )}
            </li>
          )}
          
          {displaySuggestions.map((item) => (
            <li 
              key={item}
              className="group flex items-center justify-between px-4 py-2 text-sm hover:bg-primary/5 cursor-pointer text-main-text border-b border-border last:border-0 transition-colors">
              <div 
                className="flex-1 py-1 font-medium" 
                onClick={() => {
                  setQuery(item);
                  setIsOpen(false);
                  onSelect(item); 
                }}
              >
                {item}
              </div>

              {onDeleteSuggestion && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSuggestion(item);
                  }}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-muted hover:text-red-500 transition-all"
                >
                  <MaterialIcon iconName='close' className='text-sm'/>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


//PASSWORD INPUT WITH EYE ICON SHOW PASSWORD
export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, error, iconName = "lock", fullWidth = false, className = '', ...props }, ref) => {
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
            name={name}
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

//CUSTOM PHONE INPUT
interface PhoneInputProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  label?: string;
  name?: string;
  error?: string;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

export const CustomPhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, name, error, fullWidth = false, className = '', value, onChange, disabled }, ref) => {
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
            name={name}
            international
            withCountryCallingCode
            defaultCountry="PH"
            value={value}
            onChange={onChange}
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
  ({ label, name, error, className = '', ...props }, ref) => {
    const id = useId();
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label htmlFor={id} className="text-xs text-primary font-bold uppercase tracking-widest ml-1">{label}</label>}
        <textarea id={id} ref={ref} name={name} className={`w-full bg-surface text-main-text border-border rounded-2xl border-2 px-4 py-3 text-sm focus:outline-none focus:border-primary min-h-30 transition-all duration-300 ${error ? 'border-red-500' : ''} ${className}`} {...props} />
        {error && <span className="text-[10px] font-bold text-red-500 ml-1 uppercase">{error}</span>}
      </div>
    );
  }
);