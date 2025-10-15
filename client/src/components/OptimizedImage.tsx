import { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  fallback?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  thumbnail?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  lazy = true,
  fallback = '/images/placeholder.png',
  objectFit = 'cover',
  thumbnail = false
}) => {
  const optimizedSrc = useMemo(() => {
    if (!src || src.startsWith('/') || src.startsWith('data:')) {
      return src;
    }

    const isCloudinary = src.includes('cloudinary.com');
    
    if (isCloudinary && (width || height) && thumbnail) {
      const versionMatch = src.match(/\/upload\/v\d+\/([^?]+)/);
      if (versionMatch) {
        const publicIdWithExt = versionMatch[1];
        const publicId = publicIdWithExt.replace(/\.[^.]+$/, '');
        const thumbWidth = width ? Math.min(width, 400) : 400;
        const thumbHeight = height ? Math.min(height, 300) : 300;
        try {
          return getOptimizedImageUrl(publicId, thumbWidth, thumbHeight);
        } catch {
          return src;
        }
      }
    }

    return src;
  }, [src, width, height, thumbnail]);

  const [imageSrc, setImageSrc] = useState<string>(lazy ? fallback : optimizedSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!lazy) {
      setImageSrc(optimizedSrc);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(optimizedSrc);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [optimizedSrc, lazy]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    if (fallback && imageSrc !== fallback) {
      setImageSrc(fallback);
    }
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      loading={lazy ? 'lazy' : 'eager'}
      width={width}
      height={height}
      onLoad={handleLoad}
      onError={handleError}
      className={cn(
        'transition-opacity duration-300',
        isLoaded && !hasError ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        objectFit: objectFit,
      }}
    />
  );
};
