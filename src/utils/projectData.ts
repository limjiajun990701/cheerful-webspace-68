
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/database';

// Get all projects
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }

    return data as Project[] || [];
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
      console.error(`Error fetching project with ID ${id}:`, error);
      throw error;
    }

    return data as Project;
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
      .insert([project])
      .select()
      .single();

    if (error) {
      console.error("Error adding project:", error);
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from insert");
    }

    return data as Project;
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
      .update(project)
      .eq('id', project.id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating project with ID ${project.id}:`, error);
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from update");
    }

    return data as Project;
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
      console.error(`Error deleting project with ID ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting project with ID ${id}:`, error);
    throw error;
  }
};
