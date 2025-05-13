
import React, { useState } from 'react';
import { removeBackground, loadImage } from '@/utils/imageProcessing';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BackgroundRemoverProps {
  onProcessedImage?: (processedImage: string) => void;
}

const BackgroundRemover = ({ onProcessedImage }: BackgroundRemoverProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    setSelectedFile(file);
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setProcessedImage(null);
    
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
      toast({
        title: "Processing image",
        description: "This may take a few moments...",
      });

      const img = await loadImage(selectedFile);
      const processedBlob = await removeBackground(img);
      const processedUrl = URL.createObjectURL(processedBlob);
      
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
      toast({
        title: "Processing failed",
        description: "There was an error removing the background",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
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
          className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-border py-6 text-center hover:border-primary"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {preview ? selectedFile?.name : "Select an image"}
            </span>
            {preview && (
              <img src={preview} alt="Preview" className="mt-2 max-h-40 object-contain" />
            )}
          </div>
        </label>
      </div>

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
        <div className="mt-4 rounded-md border border-border p-4">
          <h3 className="mb-2 font-medium">Processed Image</h3>
          <img
            src={processedImage}
            alt="Processed"
            className="max-h-60 w-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default BackgroundRemover;
