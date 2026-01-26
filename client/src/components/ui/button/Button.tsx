import React from 'react';
import { MaterialIcon } from '../MaterialIcon';
import { LoadingSpinner } from '../LoadingSpinner';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';
type IconPosition = 'left' | 'right';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  iconName?: string;
  iconType?: 'filled' | 'outlined' | 'rounded' | 'sharp' | 'two-tone';
  iconPosition?: IconPosition;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    iconName, 
    iconType = 'rounded',
    iconPosition = 'left',
    fullWidth = false,
    className = '', 
    disabled,
    ...props 
  }, ref) => {

    const baseStyles = "relative inline-flex items-center justify-center font-bold uppercase tracking-tighter transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:active:scale-100 disabled:cursor-not-allowed rounded-2xl gap-2 overflow-hidden";

    const variants = {
      primary: "bg-primary text-main-bg hover:opacity-90 shadow-main", 
      secondary: "bg-surface text-main-text hover:bg-main-bg border border-border shadow-sm", 
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-main",
      outline: "border-2 border-primary text-primary hover:bg-primary hover:text-main-bg",
      ghost: "bg-transparent hover:bg-surface text-main-text",
    };

    const sizes = {
      sm: "px-4 py-2 text-[10px] tracking-widest min-h-[36px]",
      md: "px-6 py-3 text-xs tracking-widest min-h-[48px]",
      lg: "px-10 py-4 text-sm tracking-widest min-h-[60px]",
    };

    const spinnerSizeMap: Record<ButtonSize, string> = {
      sm: '14px', md: '18px', lg: '22px',
    };

    const useInheritedColor = ['primary', 'danger', 'outline'].includes(variant);
    const widthStyle = fullWidth ? 'w-full' : '';
    
    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`.trim();

    const renderIcon = () => (
      !isLoading && iconName && (
        <MaterialIcon 
          iconName={iconName} 
          type={iconType} 
          size={size === 'sm' ? 14 : 18} 
          className="text-current flex items-center justify-center" 
          style={{ color: 'inherit' }}
        />
      )
    );

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit">
             <LoadingSpinner 
               size="custom" 
               customSize={spinnerSizeMap[size]} 
               color={useInheritedColor ? undefined : 'primary'}
               className={useInheritedColor ? 'text-current' : ''}
             />
          </div>
        )}

        <div className={`flex items-center gap-2 transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          {iconPosition === 'left' && renderIcon()}
          {children && <span>{children}</span>}
          {iconPosition === 'right' && renderIcon()}
        </div>
      </button>
    );
  }
);

Button.displayName = "Button";