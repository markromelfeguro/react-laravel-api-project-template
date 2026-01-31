import React from "react";

export type SpinnerType =
  | "circle"
  | "loop"
  | "dots"
  | "wave"
  | "progress"
  | "pulse-grid";
type SpinnerSize = "sm" | "md" | "lg" | "xlg" | "custom";

interface LoadingSpinnerProps {
  variant?: SpinnerType;
  size?: SpinnerSize;
  customSize?: string;
  color?: "primary" | "white" | "current" | "secondary";
  bg?: string;
  height?: string;
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = "circle",
  size = "md",
  customSize,
  color = "primary",
  bg = "bg-transparent",
  height = "",
  text = "",
  className = "",
}) => {
  const sizeClasses: Record<Exclude<SpinnerSize, "custom">, string> = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xlg: "w-16 h-16",
  };

  // Maps the 'color' prop to specific Tailwind utility classes
  const colorMap = {
    primary: "text-primary fill-primary stroke-primary",
    white: "text-white fill-white stroke-white",
    current: "text-current fill-current stroke-current",
    secondary: "text-main-text fill-main-text stroke-main-text",
  };

  const bgColorMap = {
    primary: "bg-primary",
    white: "bg-white",
    current: "bg-current",
    secondary: "bg-main-text",
  };

  const isCustom = size === "custom" && customSize;
  const dimensions = isCustom ? { width: customSize, height: customSize } : {};
  const currentSizeClass = !isCustom ? sizeClasses[size as keyof typeof sizeClasses] : "";

  const textColorClass = colorMap[color];
  const bgColorClass = bgColorMap[color];

  return (
    <div className={`flex flex-row items-center justify-center gap-2 ${height} ${bg} ${className} ${textColorClass}`}>
      <div className="relative flex items-center justify-center">
        
        {variant === "circle" && (
        <div
          role="status"
          style={{ ...dimensions }}
          className={`${currentSizeClass} border-2 rounded-full animate-spin border-t-transparent border-current aspect-square`}
        />
        )}

        
        {variant === "loop" && (
        <div style={dimensions} className={`${currentSizeClass} animate-spin`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        </div>
        )}
        
        {variant === "dots" && (
        <div className="flex gap-1 items-center justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${bgColorClass} animate-bounce`}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        )}

        {variant === "wave" && (
        <div className="flex items-center justify-center gap-1 h-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-1 rounded-full ${bgColorClass} animate-[wave_1s_ease-in-out_infinite]`}
              style={{
                height: "100%",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
        )}

        {/* PROGRESS BAR */}
        {variant === "progress" && (
        <div className="w-24 h-1 bg-current/20 rounded-full overflow-hidden relative isolate">
          <div className={`absolute top-0 left-0 h-full w-full ${bgColorClass} origin-left animate-progress rounded-full`} />
        </div>
        )}

        {/* PULSE GRID */}
        {variant === "pulse-grid" && (
        <div className="grid grid-cols-3 gap-0.5">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 ${bgColorClass} rounded-sm animate-pulse`}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        )}
      </div>

      {text && (
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase whitespace-nowrap">
          {text}
        </span>
      )}
    </div>
  );
};