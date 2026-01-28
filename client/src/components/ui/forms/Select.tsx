import { useState, useRef, useEffect } from 'react';
import { MaterialIcon } from '../MaterialIcon';
import { Input } from './Input';
import { Checkbox } from './SelectionControls';

import { useOnClickOutside } from '../../../hooks/useOnClickOutside';


// --- SEARCH INPUT WITH SUGGESTIONS ---
interface SearchInputProps {
  suggestions: string[];
  onSelect: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const SearchInput = ({ suggestions, onSelect, label, placeholder }: SearchInputProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = suggestions.filter(item => 
    item.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <Input 
        label={label}
        placeholder={placeholder}
        iconName="search" 
        value={query} 
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
        fullWidth
      />
      {isOpen && query && filtered.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 bg-surface border-2 border-border rounded-2xl shadow-main overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {filtered.map((item) => (
            <li 
              key={item}
              className="px-4 py-3 text-sm hover:bg-main-bg cursor-pointer text-main-text transition-colors border-b border-border last:border-0 font-medium"
              onClick={() => {
                setQuery(item);
                setIsOpen(false);
                onSelect(item);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- MULTI-SELECT DROPDOWN ---
interface MultiSelectProps {
  label?: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export const MultiSelect = ({ label, options, selectedValues, onChange }: MultiSelectProps) => {
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
        className="w-full flex items-center justify-between bg-surface text-main-text border-border rounded-2xl border-2 px-4 py-3 text-sm transition-all focus:border-primary"
      >
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
              onClick={() => toggleOption(opt.value)}
            >
              <Checkbox 
                label={opt.label} 
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