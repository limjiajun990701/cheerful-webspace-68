import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { TablesUpdate } from "@/integrations/supabase/types";

/**
 * Uploads a site image to Supabase storage.
 * @param file The image file to upload.
 * @param uploadPath The path in the storage bucket where the image will be stored.
 * @returns The public URL of the uploaded image, or null if the upload fails.
 */
export async function uploadSiteImage(file: File, uploadPath: string): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${uploadPath}/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from('site-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${data.path}`;
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

/**
 * Updates site content in the Supabase database.
 * @param id The ID of the site content to update.
 * @param updates An object containing the fields to update.
 * @returns An object with a success flag and an optional error message.
 */
export async function updateSiteContent(id: string, updates: TablesUpdate<"site_content">): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('site_content')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error("Error updating site content:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating site content:", error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Ensures the Supabase "site-images" bucket exists and is accessible.
 * Returns true if ready, false otherwise.
 */
export async function setupSiteImagesBucket(): Promise<boolean> {
  try {
    // Try to create the bucket (Supabase throws if already exists)
    // @ts-ignore Supabase v2 typing
    const { error: createError } = await supabase.storage.createBucket('site-images', { public: true });

    if (createError) {
      // If already exists, treat as success
      if (
        createError.message.includes('already exists') ||
        createError.message.toLowerCase().includes('duplicate key')
      ) {
        // Bucket exists! Check access to confirm it's ready
        const { data: bucket, error: listError } = await supabase.storage.getBucket('site-images');
        if (bucket && !listError) {
          return true;
        }
        // If cannot list/access bucket, still return false
        return false;
      } else {
        // Any other error means the bucket is not ready
        return false;
      }
    }
    // Bucket created successfully
    return true;
  } catch (err: any) {
    // Log for debugging, fail safe: not ready
    console.error('setupSiteImagesBucket unexpected error:', err);
    return false;
  }
}
