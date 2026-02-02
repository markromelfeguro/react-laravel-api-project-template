import React, { useState, useRef, useId } from 'react';
import { MaterialIcon } from '../MaterialIcon';
import { Checkbox } from './SelectionControls';

import { useOnClickOutside } from '../../../hooks/useOnClickOutside';


interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
  fullWidth?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, fullWidth = false, className = '', ...props }, ref) => {
    const id = useId();

    const baseSelectStyles = "w-full bg-surface text-main-text border-border rounded-2xl border-2 px-4 py-3 text-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-40 appearance-none";

    return (
      <div className={`${fullWidth ? 'w-full' : 'w-72'} flex flex-col gap-1.5`}>
        {label && (
          <label htmlFor={id} className="text-xs text-primary font-black uppercase tracking-widest ml-1 italic">
            {label}
          </label>
        )}
        <div className="relative w-full flex items-center group">
          <select
            id={id}
            ref={ref}
            className={`${baseSelectStyles} ${error ? 'border-red-500' : ''} ${className}`}
            {...props}>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-1 pointer-events-none text-muted">
            <MaterialIcon iconName='expand_more' />
          </div>
        </div>
        {error && <span className="text-[10px] font-black text-red-500 ml-1 uppercase italic">{error}</span>}
      </div>
    );
  }
);

// --- MULTI-SELECT DROPDOWN ---
interface MultiSelectProps {
  label?: string;
  name?: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export const MultiSelect = ({ label, name, options, selectedValues, onChange }: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => setIsOpen(false));

  const toggleOption = (val: string) => {
    const next = selectedValues.includes(val)
      ? selectedValues.filter(v => v !== val)
      : [...selectedValues, val];
    onChange(next);
  };

  return (
    <div ref={containerRef} className="relative w-full flex flex-col gap-1.5">
      {label && <label className="text-[10px] font-bold uppercase tracking-widest text-muted ml-1">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-surface text-main-text border-border rounded-2xl border-2 px-4 py-3 text-sm transition-all focus:border-primary">
        <span className="truncate">
          {selectedValues.length > 0 
            ? `${selectedValues.length} items selected` 
            : 'Select options...'}
        </span>
        <MaterialIcon iconName={isOpen ? 'expand_less' : 'expand_more'} size={20} className="text-muted" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-full mt-2 bg-surface border-2 border-border rounded-2xl shadow-main p-2 flex flex-col gap-1 max-h-60 overflow-y-auto">
          {options.map(opt => (
            <div 
              key={opt.value}
              className="flex items-center gap-2 p-2 hover:bg-main-bg rounded-xl transition-colors cursor-pointer"
              onClick={() => toggleOption(opt.value)}>
              <Checkbox 
                label={opt.label}
                name={name} 
                checked={selectedValues.includes(opt.value)} 
                onChange={() => {}}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};