
import { supabase } from '@/integrations/supabase/client';
import { Resume } from '@/types/resume';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_BUCKET = 'resumes';
const DEFAULT_RESUME: Resume = {
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
export const getCurrentResume = async (): Promise<Resume | null> => {
  try {
    // First check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("No authenticated user, returning default resume");
      return DEFAULT_RESUME;
    }

    // Query the resumes table for the current user
    const { data: resumeData, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (resumeError) {
      console.error("Error fetching resume:", resumeError);
      return null;
    }

    if (!resumeData) {
      console.log("No resume found for user");
      return null;
    }

    // Get the public URL for the file
    const { data: publicUrlData } = supabase
      .storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(resumeData.file_path);

    // Return the resume with fileUrl for compatibility
    return {
      ...resumeData,
      fileUrl: publicUrlData.publicUrl,
      fileName: resumeData.file_name
    } as Resume;
  } catch (error) {
    console.error("Error in getCurrentResume:", error);
    return null;
  }
};

// Upload a new resume
export const uploadResume = async (file: File): Promise<Resume> => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User is not authenticated');
    }

    const userId = session.user.id;
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${uuidv4()}.${fileExt}`;
    
    // Upload the file to storage
    const { error: storageError } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (storageError) {
      throw storageError;
    }

    // Get the public URL
    const { data: publicUrlData } = supabase
      .storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    // Check if user already has a resume
    const { data: existingResume } = await supabase
      .from('resumes')
      .select('id')
      .eq('user_id', userId)
      .single();

    // Define the resume data for database insertion/update
    const resumeData = {
      user_id: userId,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      upload_date: new Date().toISOString()
    };
    
    let resumeResult;

    if (existingResume) {
      // Update existing resume
      const { data, error } = await supabase
        .from('resumes')
        .update(resumeData)
        .eq('id', existingResume.id)
        .select()
        .single();
        
      if (error) throw error;
      resumeResult = data;
    } else {
      // Insert new resume
      const { data, error } = await supabase
        .from('resumes')
        .insert(resumeData)
        .select()
        .single();
        
      if (error) throw error;
      resumeResult = data;
    }
    
    return {
      ...resumeResult,
      fileUrl: publicUrlData.publicUrl,
      fileName: file.name
    } as Resume;
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
    const { data: resumeData, error: fetchError } = await supabase
      .from('resumes')
      .select('file_path')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (resumeData) {
      // Delete the file from storage
      const { error: storageError } = await supabase
        .storage
        .from(STORAGE_BUCKET)
        .remove([resumeData.file_path]);

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
