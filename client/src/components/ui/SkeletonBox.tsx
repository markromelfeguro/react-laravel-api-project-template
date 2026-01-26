import React from 'react';

type SkeletonBoxProps = {
  width?: string;
  height?: string;
  rounded?: string;
  margin?: string;
  className?: string;
  children?: React.ReactNode;
};

const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  width = "w-full",
  height = "h-4",
  rounded = "rounded-md",
  margin = "",
  className = "",
  children,
}) => {
  return (
    <div
      className={`
        relative overflow-hidden 
        bg-gray-200 dark:bg-gray-800 
        ${width} ${height} ${rounded} ${margin} ${className}
      `}>
        
      <div className="absolute inset-0 z-0">
        <div className={`
          h-full w-full animate-shimmer 
          bg-linear-to-r from-transparent 
          via-white/30 dark:via-white/10
          to-transparent
        `} 
        
        style={{ width: '200%', marginLeft: '-100%' }}
        />
      </div>
    
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default SkeletonBox;