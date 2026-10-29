'use client';

import { useState } from 'react';
import { getImagePath } from '@/lib/asset-paths';
import Image, { ImageProps } from 'next/image';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { envVars } from '@/env';

export interface FallbackImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string | undefined | null;
  alt: string;
  fallbackSrc?: string;
  showLoadingIndicator?: boolean;
  containerClassName?: string;
  errorClassName?: string;
}

export function FallbackImage({
  src: srcProp,
  alt,
  fallbackSrc = getImagePath('placeholder.png'),
  className = '',
  containerClassName = '',
  errorClassName = '',
  showLoadingIndicator = true,
  width,
  height,
  onLoadingComplete,
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(srcProp || undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      console.warn(`Failed to load image: ${srcProp}`);
    }
  };
  
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    if (onLoadingComplete) {
      // Cast the event target to HTMLImageElement
      onLoadingComplete(e.currentTarget);
    }
  };

  const showFallback = hasError || !imgSrc;
  const displaySrc = showFallback ? fallbackSrc : imgSrc;

  // Remove loading prop if priority is set to avoid conflicts
  const imageProps = { ...props };
  if (imageProps.priority) {
    delete imageProps.loading; // Remove loading prop when priority is set
  } else {
    imageProps.loading = 'lazy'; // Default to lazy loading
  }

  return (
    <div className={cn('relative', containerClassName)}>
      {/* Loading State */}
      {isLoading && showLoadingIndicator && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" className="text-primary-500" />
        </div>
      )}

      {/* Main Image */}
      {displaySrc && (
        <Image
          {...imageProps}
          src={displaySrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'transition-opacity duration-300',
            className,
            isLoading ? 'opacity-0' : 'opacity-100',
            hasError && 'hidden'
          )}
          onLoad={handleLoad}
          onError={handleError}
          quality={imageProps.quality || 85}
          unoptimized={envVars.NODE_ENV !== 'production'}
        />
      )}

      {/* Fallback UI */}
      {showFallback && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-muted',
            errorClassName,
            !isLoading ? 'opacity-100' : 'opacity-0',
            'rounded-md overflow-hidden'
          )}
        >
          <ImageOff className="w-6 h-6 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

export default FallbackImage;
