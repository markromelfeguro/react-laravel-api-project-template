import React from 'react';

type SpinnerType = 'circle' | 'loop' | 'dots' | 'wave' | 'progress' | 'pulse-grid';
type SpinnerSize = 'sm' | 'md' | 'lg' | 'xlg' | 'custom';

interface LoadingSpinnerProps {
  variant?: SpinnerType;
  size?: SpinnerSize;
  customSize?: string; 
  color?: string;      
  bg?: string;         
  height?: string;     
  text?: string;       
  logo?: string;       
  className?: string;  
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'circle',
  size = 'md',
  customSize,
  color = 'primary',
  bg = 'bg-transparent',
  height = '',
  text = '',
  logo = '',
  className = '',
}) => {
  
  const sizeClasses: Record<Exclude<SpinnerSize, 'custom'>, string> = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xlg: 'w-32 h-32',
  };

  const isCustom = size === 'custom' && customSize;
  
  const dimensions = isCustom 
    ? { width: customSize, height: customSize } 
    : {};

  const currentSizeClass = !isCustom 
    ? sizeClasses[size as keyof typeof sizeClasses] 
    : '';

  const textColorClass = color === 'white' ? 'text-white' : `text-${color}`;
  const bgColorClass = color === 'white' ? 'bg-white' : `bg-${color}`;

  return (
    <div className={`flex flex-col justify-center items-center gap-6 ${height} ${bg} ${className}`}>
      
      {/* LOGO SECTION */}
      {logo && (
        <div className="flex justify-center items-center mb-2">
          <img src={logo} alt="App Logo" className="h-12 w-12 object-contain" />
        </div>
      )}

      {/* SPINNER VARIANTS */}
      <div className="relative flex items-center justify-center">
        
        {/* CLASSIC CIRCLE */}
        {variant === 'circle' && (
          <div
            role="status"
            style={{ borderTopColor: 'currentColor', ...dimensions }}
            className={`
              ${currentSizeClass} 
              border-[3px] rounded-full animate-spin ${textColorClass} border-border/20 aspect-square
            `}
          />
        )}

        {/* LOOP ARROW */}
        {variant === 'loop' && (
          <div style={dimensions} className={`${currentSizeClass} animate-spin ${textColorClass} aspect-square`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
          </div>
        )}

        {/* PULSING DOTS */}
        {variant === 'dots' && (
          <div className="flex gap-2 items-center justify-center h-12">
            {[0, 1, 2].map((i) => (
              <div 
                key={i}
                className={`w-3 h-3 rounded-full ${bgColorClass} animate-bounce`} 
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}

        {/* WAVE */}
        {variant === 'wave' && (
          <div className="flex items-center justify-center gap-1.5 h-12">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full ${bgColorClass} animate-[wave_1s_ease-in-out_infinite]`}
                style={{ 
                  height: '100%',
                  animationDelay: `${i * 0.1}s` 
                }}
              />
            ))}
          </div>
        )}

        {/* PROGRESS BAR (FIXED) */}
        {variant === 'progress' && (
          // Container (Track)
          <div className="w-48 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative isolate">
            {/* Moving Bar */}
            <div 
                className={`absolute top-0 left-0 h-full w-full ${bgColorClass} origin-left animate-progress rounded-full`} 
            />
          </div>
        )}

        {/* PULSE GRID */}
        {variant === 'pulse-grid' && (
          <div className="grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 ${bgColorClass} rounded-sm animate-pulse`} 
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* TEXT SECTION */}
      {text && (
        <div className="space-y-1 text-center">
          <p className="text-sm font-bold tracking-[0.2em] uppercase text-main-text opacity-90">
            {text}
          </p>
          <div className="w-12 h-0.5 bg-primary/30 mx-auto rounded-full" />
        </div>
      )}
    </div>
  );
};