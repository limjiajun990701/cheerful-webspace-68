
import React, { useState } from 'react';
import { removeBackground, loadImage } from '@/utils/imageProcessing';
import { Button } from '@/components/ui/button';
import { Loader2, Image, ImageOff, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { cn } from '@/lib/utils';

interface BackgroundRemoverProps {
  onProcessedImage?: (processedImage: string) => void;
}

const BackgroundRemover = ({ onProcessedImage }: BackgroundRemoverProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();
  
  // Processing stages for better UX
  const [processingStage, setProcessingStage] = useState<
    'idle' | 'loading' | 'processing' | 'finalizing' | 'complete'
  >('idle');
  
  // Simulate progress updates
  const simulateProgress = () => {
    setProcessingProgress(0);
    setProcessingStage('loading');
    
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        
        // Update processing stage based on progress
        if (prev > 10 && prev <= 30) {
          setProcessingStage('processing');
        } else if (prev > 30 && prev < 90) {
          setProcessingStage('processing');
        } else if (prev >= 90) {
          setProcessingStage('finalizing');
        }
        
        return prev + Math.random() * 10;
      });
    }, 300);
    
    return interval;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    setSelectedFile(file);
    
    // Reset states
    setProcessedImage(null);
    setProcessingProgress(0);
    setProcessingStage('idle');
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Clean up previous URL
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleRemoveBackground = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Start progress simulation
      const progressInterval = simulateProgress();
      
      toast({
        title: "Processing image",
        description: "This may take a few moments...",
      });

      const img = await loadImage(selectedFile);
      const processedBlob = await removeBackground(img);
      const processedUrl = URL.createObjectURL(processedBlob);
      
      // Complete progress
      clearInterval(progressInterval);
      setProcessingProgress(100);
      setProcessingStage('complete');
      
      setProcessedImage(processedUrl);
      
      if (onProcessedImage) {
        onProcessedImage(processedUrl);
      }
      
      toast({
        title: "Success!",
        description: "Background removed successfully",
      });
    } catch (error) {
      console.error("Error removing background:", error);
      setProcessingStage('idle');
      setProcessingProgress(0);
      toast({
        title: "Processing failed",
        description: "There was an error removing the background",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderProcessingIndicator = () => {
    if (!isProcessing) return null;
    
    const stageText = {
      'idle': 'Preparing...',
      'loading': 'Loading image...',
      'processing': 'Removing background...',
      'finalizing': 'Finalizing image...',
      'complete': 'Completed!'
    };
    
    return (
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{stageText[processingStage]}</span>
          <span className="text-sm font-medium">{Math.round(processingProgress)}%</span>
        </div>
        <Progress value={processingProgress} className="h-2" />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isProcessing}
          id="image-upload"
          className="hidden"
        />
        <label
          htmlFor="image-upload"
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-6 px-4 transition-colors",
            preview ? "hover:border-muted-foreground" : "hover:border-primary",
            isProcessing && "opacity-50 cursor-not-allowed"
          )}
        >
          {!preview ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-full bg-background p-3 shadow-sm">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Click to upload an image</p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG or WEBP (max 10MB)
              </p>
            </div>
          ) : (
            <div className="w-full">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {selectedFile?.name}
              </p>
              <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md border border-border">
                <ImageWithFallback
                  src={preview}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          )}
        </label>
      </div>

      {renderProcessingIndicator()}

      {preview && (
        <Button
          onClick={handleRemoveBackground}
          disabled={isProcessing || !selectedFile}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Remove Background"
          )}
        </Button>
      )}

      {processedImage && (
        <div className="mt-6 rounded-lg border border-border p-4">
          <h3 className="mb-3 font-medium">Processed Image</h3>
          <div className="overflow-hidden rounded-md border border-border">
            <AspectRatio ratio={16 / 9}>
              <ImageWithFallback
                src={processedImage}
                alt="Processed"
                className="object-contain w-full h-full"
              />
            </AspectRatio>
          </div>
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Create a download link
                const link = document.createElement('a');
                link.href = processedImage;
                link.download = `processed-${selectedFile?.name || 'image'}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundRemover;
