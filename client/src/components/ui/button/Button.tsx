import React from 'react';
import { MaterialIcon } from '../MaterialIcon';
import { LoadingSpinner, type SpinnerType } from '../LoadingSpinner';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';
type IconPosition = 'left' | 'right';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingType?: SpinnerType;
  loadingText?: string;
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
    loadingType = 'circle',
    loadingText = '',
    iconName, 
    iconType = 'rounded',
    iconPosition = 'left',
    fullWidth = false,
    className = '', 
    disabled,
    ...props 
  }, ref) => {

    const baseStyles = "relative inline-flex items-center justify-center font-bold uppercase tracking-tighter transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed rounded-2xl gap-2 overflow-hidden";

    const variants = {
      
      primary: "bg-primary text-main-bg hover:opacity-90 shadow-lg", 
      secondary: "bg-surface text-main-text hover:bg-main-bg border border-border shadow-sm", 
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-lg",
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

    const shouldUseInheritedColor = ['primary', 'danger', 'outline'].includes(variant);
    const widthStyle = fullWidth ? 'w-full' : '';
    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`.trim();

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit z-10">
             <LoadingSpinner 
                size="custom"
                variant={loadingType}
                text={loadingText}
                customSize={spinnerSizeMap[size]} 
                color={shouldUseInheritedColor ? 'current' : 'primary'}
             />
          </div>
        )}

        <div className={`flex items-center gap-2 transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          
          {iconPosition === 'left' && !isLoading && iconName && (
            <MaterialIcon 
              iconName={iconName} 
              type={iconType} 
              size={size === 'sm' ? 14 : 18} 
              className="text-current" 
            />
          )}
          
          {children && <span>{children}</span>}
          
          {iconPosition === 'right' && !isLoading && iconName && (
            <MaterialIcon 
              iconName={iconName} 
              type={iconType} 
              size={size === 'sm' ? 14 : 18} 
              className="text-current"
            />
          )}
        </div>
      </button>
    );
  }
);

Button.displayName = "Button";