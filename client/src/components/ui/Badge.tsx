import React from 'react';

type BadgeVariant = 'brand' | 'alternative' | 'gray' | 'danger' | 'success' | 'warning';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'gray', 
  className = '' 
}) => {
  
  const variants = {
    brand: "bg-primary/10 text-primary border-primary/20",
    alternative: "bg-accent/10 text-accent border-accent/20",
    gray: "bg-surface text-muted border-border",
    danger: "bg-red-500/10 text-red-600 border-red-500/20",
    success: "bg-green-500/10 text-green-600 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  };

  return (
    <span className={`
      inline-flex items-center justify-center
      px-2 py-0.5 rounded-lg border
      text-[10px] font-black uppercase italic tracking-tighter
      transition-all duration-300
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
};