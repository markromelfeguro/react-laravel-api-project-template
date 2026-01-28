import React from 'react';
import { MaterialIcon } from '../MaterialIcon';

type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'custom';

interface BaseProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  size?: ComponentSize;
  customSize?: string;
}

const getSizeClasses = (size: ComponentSize, customSize?: string) => {
  const sizes = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };
  return size === 'custom' && customSize ? customSize : (sizes[size as keyof typeof sizes] || sizes.md);
};

const getInnerSize = (size: ComponentSize) => {
  const icons = { sm: 14, md: 18, lg: 24 };
  return icons[size as keyof typeof icons] || 18;
};

export const Checkbox = ({ 
  label, 
  size = 'md', 
  customSize, 
  className = '', 
  ...props 
}: BaseProps) => {
  const dimensionClass = getSizeClasses(size, customSize);
  const iconSize = getInnerSize(size);

  return (
    <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      <div className="relative flex items-center justify-center">
        <input 
          type="checkbox" 
          className={`peer appearance-none border-2 border-primary rounded-sm bg-surface checked:bg-accent checked:border-primary transition-all duration-300 ${dimensionClass}`} 
          {...props} 
        />
        <div className="absolute text-accent opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
          <MaterialIcon iconName="check" size={iconSize} />
        </div>
      </div>
      <span className="text-xs font-bold uppercase tracking-tight text-main-text group-hover:text-primary transition-colors">
        {label}
      </span>
    </label>
  );
};

export const Radio = ({ 
  label, 
  name, 
  size = 'md', 
  customSize, 
  className = '', 
  ...props 
}: BaseProps) => {
  const dimensionClass = getSizeClasses(size, customSize);
  
  const dotSizes = {xs: 'w-3 h-3', sm: 'w-5 h-5', md: 'w-6 h-6', lg: 'w-8 h-8' };
  const dotClass = size === 'custom' ? 'w-1/2 h-1/2' : (dotSizes[size as keyof typeof dotSizes] || dotSizes.md);

  return (
    <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      <div className="relative flex items-center justify-center">
        <input 
          type="radio" 
          name={name} 
          className={`peer appearance-none border-2 border-primary rounded-full bg-surface checked:border-accent transition-all duration-300 ${dimensionClass}`} 
          {...props} 
        />
        <div className={`${dotClass} bg-accent border-2 border-primary rounded-full absolute scale-0 peer-checked:scale-100 transition-transform duration-300`} />
      </div>
      <span className="text-sm font-bold uppercase tracking-tight text-main-text group-hover:text-primary transition-colors">
        {label}
      </span>
    </label>
  );
};