
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  fileUrl?: string;
  fileType?: 'image' | 'pdf';
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
}

// Get all projects
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      imageUrl: project.imageurl,
      fileUrl: project.fileurl,
      fileType: project.filetype as 'image' | 'pdf' | undefined,
      tags: project.tags,
      liveUrl: project.liveurl,
      githubUrl: project.githuburl
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

// Get a single project by ID
export const getProjectById = async (id: string): Promise<Project | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.imageurl,
      fileUrl: data.fileurl,
      fileType: data.filetype as 'image' | 'pdf' | undefined,
      tags: data.tags,
      liveUrl: data.liveurl,
      githubUrl: data.githuburl
    };
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    return null;
  }
};

// Add a new project
export const addProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        title: project.title,
        description: project.description,
        imageurl: project.imageUrl,
        fileurl: project.fileUrl,
        filetype: project.fileType,
        tags: project.tags,
        liveurl: project.liveUrl,
        githuburl: project.githubUrl
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.imageurl,
      fileUrl: data.fileurl,
      fileType: data.filetype as 'image' | 'pdf' | undefined,
      tags: data.tags,
      liveUrl: data.liveurl,
      githubUrl: data.githuburl
    };
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};

// Update an existing project
export const updateProject = async (project: Project): Promise<Project> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        title: project.title,
        description: project.description,
        imageurl: project.imageUrl,
        fileurl: project.fileUrl,
        filetype: project.fileType,
        tags: project.tags,
        liveurl: project.liveUrl,
        githuburl: project.githubUrl
      })
      .eq('id', project.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.imageurl,
      fileUrl: data.fileurl,
      fileType: data.filetype as 'image' | 'pdf' | undefined,
      tags: data.tags,
      liveUrl: data.liveurl,
      githubUrl: data.githuburl
    };
  } catch (error) {
    console.error(`Error updating project with ID ${project.id}:`, error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting project with ID ${id}:`, error);
    throw error;
  }
};
