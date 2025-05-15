import { pipeline, env } from '@huggingface/transformers';
import { supabase } from "@/integrations/supabase/client";
import type { ApiUsageRpcResult } from "@/types/api";

// Configure transformers.js to optimize downloads
env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_IMAGE_DIMENSION = 1024;
const MONTHLY_API_LIMIT = 49; // Setting the limit to 49 calls per month

interface ApiUsageRow {
  count: number;
  month: number;
  year: number;
}

/**
 * Check the current month's API usage and determine if we can use the API
 * @returns A Promise resolving to a boolean indicating if the API can be used
 */
async function canUseRemoveBgApi(): Promise<boolean> {
  try {
    // Get the current month and year
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = now.getFullYear();
    
    // Check if we already have a record for the current month
    const { data: usageData, error: fetchError } = await supabase
      .rpc('get_api_usage', {
        api_name_param: 'remove_bg',
        month_param: currentMonth,
        year_param: currentYear
      }) as { data: ApiUsageRpcResult, error: any };
    
    if (fetchError) {
      // If there's an error, log it
      console.error('Error checking API usage:', fetchError);
      // Default to using the fallback method if there's an error
      return false;
    }
    
    // If we have data and the count is below the limit, we can use the API
    if (usageData && usageData.count !== undefined) {
      console.log(`Current remove.bg API usage: ${usageData.count}/${MONTHLY_API_LIMIT} for ${currentMonth}/${currentYear}`);
      return usageData.count < MONTHLY_API_LIMIT;
    } else {
      // No record for this month yet, so we're definitely under the limit
      console.log(`No API usage record found for ${currentMonth}/${currentYear}`);
      return true;
    }
  } catch (error) {
    console.error('Error in canUseRemoveBgApi:', error);
    return false;
  }
}

/**
 * Increment the API usage counter for the current month
 */
async function incrementApiUsage(): Promise<void> {
  try {
    // Get the current month and year
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // Update the counter for the current month
    const { error } = await supabase.rpc('increment_api_usage', { 
      api_name_param: 'remove_bg', 
      month_param: currentMonth, 
      year_param: currentYear 
    });
    
    if (error) {
      console.error('Error incrementing API usage:', error);
    } else {
      console.log('API usage incremented successfully');
    }
  } catch (error) {
    console.error('Error in incrementApiUsage:', error);
  }
}

/**
 * Removes background from an image using a remote API service
 * @param imageElement The HTML image element to process
 * @returns A Promise resolving to a Blob of the processed image
 */
export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    // Check if we can use the remove.bg API
    const canUseApi = await canUseRemoveBgApi();
    
    if (canUseApi) {
      console.log('Starting background removal process with remove.bg API...');
      
      // Convert the image to a canvas first
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Resize image if needed and draw it to canvas
      const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
      console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`);
      
      // Convert canvas to blob
      const imageBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob from canvas'));
        }, 'image/jpeg', 0.95);
      });
      
      // Create FormData to send to the API
      const formData = new FormData();
      formData.append('image_file', imageBlob, 'image.jpg');
      formData.append('size', 'auto');
      
      // Call the remove.bg API
      // NOTE: To use this service, you need to:
      // 1. Create an account at remove.bg
      // 2. Get your API key from https://www.remove.bg/api
      // 3. Replace the placeholder below with your actual API key
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': 'QgvdeZ7AYgxe5edQDs9sR4ge', // Using the provided API key
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      // Increment the API usage counter
      incrementApiUsage();
      
      // The API returns the image with background removed
      const processedImageBlob = await response.blob();
      console.log('Successfully processed image with remove.bg API');
      
      return processedImageBlob;
    } else {
      console.log('Monthly remove.bg API limit reached or error checking limit. Using fallback method...');
      return removeBackgroundWithHuggingFace(imageElement);
    }
  } catch (error) {
    console.error('Error removing background with API:', error);
    
    // Fallback to the HuggingFace method if the API fails
    console.log('Falling back to local processing method...');
    return removeBackgroundWithHuggingFace(imageElement);
  }
};

/**
 * Fallback method using HuggingFace transformers
 */
export const removeBackgroundWithHuggingFace = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting background removal with HuggingFace...');
    const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
      device: 'webgpu', 
    });
    
    // Convert HTMLImageElement to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Resize image if needed and draw it to canvas
    const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
    console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`);
    
    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    console.log('Image converted to base64');
    
    // Process the image with the segmentation model
    console.log('Processing with segmentation model...');
    const result = await segmenter(imageData);
    
    console.log('Segmentation result:', result);
    
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
      throw new Error('Invalid segmentation result');
    }
    
    // Create a new canvas for the masked image
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Apply the mask
    const outputImageData = outputCtx.getImageData(
      0, 0,
      outputCanvas.width,
      outputCanvas.height
    );
    const data = outputImageData.data;
    
    // Apply inverted mask to alpha channel
    for (let i = 0; i < result[0].mask.data.length; i++) {
      // Invert the mask value (1 - value) to keep the subject instead of the background
      const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
      data[i * 4 + 3] = alpha;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    console.log('Mask applied successfully');
    
    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Successfully created final blob');
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Error in HuggingFace background removal:', error);
    throw error;
  }
};

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Function to load an image from a URL
export const loadImageFromUrl = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // To handle CORS issues
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}
