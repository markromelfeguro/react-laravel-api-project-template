import React, { useState } from 'react';
import { MaterialIcon, SkeletonBox } from './index';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackIcon?: string;
  containerClassName?: string;
  aspectRatio?: string;
}

export const Image: React.FC<ImageProps> = ({ 
  src, 
  alt = "image description", 
  fallbackIcon = "image", 
  className = "", 
  containerClassName = "",
  aspectRatio = "aspect-auto",
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-main-bg border border-border rounded-2xl ${aspectRatio} ${containerClassName}`}>
      
      {!isLoaded && !hasError && (
        <SkeletonBox width="w-full" height="h-full" className="absolute inset-0 z-10" />
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted bg-surface">
          <MaterialIcon iconName={fallbackIcon} size={32} />
          <span className="text-[10px] font-black uppercase italic tracking-tighter">Image Unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`
            w-full h-full object-cover transition-all duration-700
            ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
            ${className}
          `}
          {...props}
        />
      )}
    </div>
  );
};