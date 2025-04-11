
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

// Get the current user's resume
export const getCurrentResume = async (): Promise<(Resume & { fileUrl: string; fileName: string }) | null> => {
  try {
    // First check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("No authenticated user, returning default resume");
      return DEFAULT_RESUME;
    }

    // Query the resumes table for the current user
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      console.error("Error fetching resume:", error);
      return null;
    }

    if (!data) {
      console.log("No resume found for user");
      return null;
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
    return null;
  }
};

// Upload a new resume
export const uploadResume = async (file: File): Promise<Resume & { fileUrl: string; fileName: string }> => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // Create a custom error with more descriptive message
      const error = new Error('Authentication required. Please sign in to upload a resume.');
      error.name = 'AuthenticationRequiredError';
      throw error;
    }

    const userId = session.user.id;
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${uuidv4()}.${fileExt}`;
    
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

    // Check if user already has a resume
    const { data: existingResumes, error: existingError } = await supabase
      .from('resumes')
      .select('id')
      .eq('user_id', userId);

    if (existingError) {
      console.error("Database error:", existingError);
      throw existingError;
    }

    // Define the resume data for database insertion/update
    const resumeData = {
      user_id: userId,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      upload_date: new Date().toISOString()
    };
    
    let resumeResult;

    if (existingResumes && existingResumes.length > 0) {
      // Update existing resume
      const { data, error } = await supabase
        .from('resumes')
        .update(resumeData)
        .eq('id', existingResumes[0].id)
        .select()
        .single();
        
      if (error) {
        console.error("Update error:", error);
        throw error;
      }
      resumeResult = data;
    } else {
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
      resumeResult = data;
    }
    
    if (!resumeResult) {
      throw new Error("No data returned from insert/update");
    }
    
    return {
      ...resumeResult,
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
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User is not authenticated');
    }

    const userId = session.user.id;

    // Get the resume record first
    const { data, error: fetchError } = await supabase
      .from('resumes')
      .select('file_path')
      .eq('user_id', userId)
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
        .eq('user_id', userId);

      if (deleteError) {
        throw deleteError;
      }
    }
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw error;
  }
};
