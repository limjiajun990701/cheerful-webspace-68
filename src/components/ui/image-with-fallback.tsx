
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  showSkeleton?: boolean;
  aspectRatio?: "square" | "video" | "auto" | number;
}

const ImageWithFallback = ({
  src,
  alt,
  className,
  fallback,
  showSkeleton = true,
  aspectRatio = "auto",
  ...props
}: ImageWithFallbackProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Calculate aspect ratio padding if provided as number
  const aspectRatioPadding = typeof aspectRatio === 'number' 
    ? `${(1 / aspectRatio) * 100}%` 
    : aspectRatio === 'square' 
      ? '100%' 
      : aspectRatio === 'video' 
        ? '56.25%' // 16:9 ratio
        : 'auto';

  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        aspectRatio !== 'auto' && "w-full",
        className
      )}
      style={
        aspectRatio !== 'auto' 
          ? { paddingBottom: aspectRatioPadding } 
          : undefined
      }
    >
      {isLoading && showSkeleton && (
        <Skeleton 
          className={cn(
            "absolute inset-0 w-full h-full bg-muted animate-pulse",
            hasError ? "hidden" : "block"
          )}
        />
      )}

      {hasError ? (
        <div className="flex items-center justify-center w-full h-full min-h-[100px] bg-muted/20 border border-dashed border-muted rounded-md p-4">
          {fallback || (
            <div className="flex flex-col items-center text-muted-foreground">
              <ImageOff className="h-10 w-10 mb-2 opacity-50" />
              <span className="text-sm">Failed to load image</span>
            </div>
          )}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            aspectRatio !== 'auto' ? "absolute inset-0 h-full w-full object-cover" : "max-w-full h-auto"
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
};

export { ImageWithFallback };
