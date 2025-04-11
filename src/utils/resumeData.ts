
import { supabase } from '@/integrations/supabase/client';
import { Resume } from '@/types/database';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_BUCKET = 'resumes';
const DEFAULT_RESUME: Resume & { fileUrl: string; fileName: string } = {
  id: 'default',
  user_id: '',
  file_name: 'resume.pdf',
  file_path: '/resume-sample.pdf',
  file_size: 0,
  upload_date: new Date().toISOString(),
  fileUrl: '/resume-sample.pdf', // Default placeholder
  fileName: 'resume.pdf',
};

// Get the current resume
export const getCurrentResume = async (): Promise<(Resume & { fileUrl: string; fileName: string }) | null> => {
  try {
    // Query the resumes table for the most recent resume
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .order('upload_date', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching resume:", error);
      return DEFAULT_RESUME;
    }

    if (!data) {
      console.log("No resume found");
      return DEFAULT_RESUME;
    }

    // Get the public URL for the file
    const { data: publicUrlData } = supabase
      .storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.file_path);

    // Return the resume with fileUrl for compatibility
    return {
      ...data,
      fileUrl: publicUrlData.publicUrl,
      fileName: data.file_name
    };
  } catch (error) {
    console.error("Error in getCurrentResume:", error);
    return DEFAULT_RESUME;
  }
};

// Upload a new resume
export const uploadResume = async (file: File): Promise<Resume & { fileUrl: string; fileName: string }> => {
  try {
    // Generate a unique ID for the resume
    const resumeId = uuidv4();
    const fileExt = file.name.split('.').pop();
    const filePath = `public/${resumeId}.${fileExt}`;
    
    // Check if the storage bucket exists first
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);
    
    // If bucket doesn't exist, create it
    if (!bucketExists) {
      const { error: createBucketError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true
      });
      
      if (createBucketError) {
        console.error("Error creating bucket:", createBucketError);
        throw createBucketError;
      }
    }
    
    // Upload the file to storage
    const { error: storageError } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (storageError) {
      console.error("Storage error:", storageError);
      throw storageError;
    }

    // Get the public URL
    const { data: publicUrlData } = supabase
      .storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    // Define the resume data for database insertion/update
    const resumeData = {
      user_id: 'public', // Use a fixed value instead of user ID
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      upload_date: new Date().toISOString()
    };
    
    // Insert new resume
    const { data, error } = await supabase
      .from('resumes')
      .insert(resumeData)
      .select()
      .single();
      
    if (error) {
      console.error("Insert error:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("No data returned from insert");
    }
    
    return {
      ...data,
      fileUrl: publicUrlData.publicUrl,
      fileName: file.name
    };
  } catch (error) {
    console.error("Error uploading resume:", error);
    throw error;
  }
};

// Delete resume
export const deleteResume = async (): Promise<void> => {
  try {
    // Get the most recent resume record first
    const { data, error: fetchError } = await supabase
      .from('resumes')
      .select('id, file_path')
      .order('upload_date', { ascending: false })
      .limit(1)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (data) {
      // Delete the file from storage
      const { error: storageError } = await supabase
        .storage
        .from(STORAGE_BUCKET)
        .remove([data.file_path]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
      }

      // Delete the resume record
      const { error: deleteError } = await supabase
        .from('resumes')
        .delete()
        .eq('id', data.id);

      if (deleteError) {
        throw deleteError;
      }
    }
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw error;
  }
};
