
import { supabase } from '@/integrations/supabase/client';

// Helper function to check if the bucket exists
export const setupSiteImagesBucket = async () => {
  try {
    // Check if the bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error checking storage buckets:', error);
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'site-images');
    
    if (bucketExists) {
      console.log('Site-images bucket exists');
      return true;
    } else {
      console.error('Site-images bucket not found');
      // Instead of trying to create it, just return false since we need admin privileges
      return false;
    }
  } catch (error) {
    console.error('Error checking site-images bucket:', error);
    return false;
  }
};

// Helper function to get dynamic site content
export const getSiteContent = async (pageName: string, sectionName: string) => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('page_name', pageName)
      .eq('section_name', sectionName)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching ${pageName}/${sectionName} content:`, error);
    return null;
  }
};

// Helper function to update site content
export const updateSiteContent = async (id: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error updating site content:', error);
    return { success: false, error };
  }
};

// Helper to upload an image to site-images bucket
export const uploadSiteImage = async (file: File, path: string): Promise<string | null> => {
  try {
    // Check if bucket exists first
    const bucketExists = await setupSiteImagesBucket();
    
    if (!bucketExists) {
      throw new Error('Storage bucket not available. Please contact administrator.');
    }
    
    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}-${timestamp}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    console.log(`Uploading image: ${filePath}`);
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from('site-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('site-images')
      .getPublicUrl(data.path);

    console.log('Image uploaded successfully:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error; // Re-throw to be handled by calling component
  }
};

// Helper to create a new skill group
export const createSkillGroup = async (categoryName: string, items: string[] = []) => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .insert({
        page_name: 'about',
        section_name: `skill_${Date.now()}`,
        title: categoryName,
        description: JSON.stringify(items),
        updated_by: 'admin'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error creating skill group:', error);
    return { success: false, error };
  }
};

// Helper to update a skill group
export const updateSkillGroup = async (id: string, categoryName: string, items: string[]) => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .update({
        title: categoryName,
        description: JSON.stringify(items),
        updated_by: 'admin',
        updated_at: new Date().toISOString() // Convert Date to ISO string
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error updating skill group:', error);
    return { success: false, error };
  }
};

// Helper to delete a skill group
export const deleteSkillGroup = async (id: string) => {
  try {
    const { error } = await supabase
      .from('site_content')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting skill group:', error);
    return { success: false, error };
  }
};

// Helper to get all skill groups
export const getSkillGroups = async () => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('page_name', 'about')
      .like('section_name', 'skill_%');

    if (error) {
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      section_name: item.section_name,
      category: item.title,
      items: item.description ? JSON.parse(item.description) : []
    }));
  } catch (error) {
    console.error('Error fetching skill groups:', error);
    return [];
  }
};

// Helper to create a new experience item
export const createExperienceItem = async (type: 'work' | 'education', data: any) => {
  try {
    const { error } = await supabase
      .from('site_content')
      .insert({
        page_name: 'experience',
        section_name: `${type}_${Date.now()}`,
        title: data.title,
        subtitle: data.company,
        description: data.description,
        image_url: JSON.stringify({
          location: data.location,
          date: data.date,
          type: type
        }),
        updated_by: 'admin'
      });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating experience item:', error);
    return { success: false, error };
  }
};

// Helper to get all experience items
export const getExperienceItems = async () => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('page_name', 'experience')
      .or('section_name.like.work_%,section_name.like.education_%');

    if (error) {
      throw error;
    }

    return data.map(item => {
      const metaData = item.image_url ? JSON.parse(item.image_url) : {};
      return {
        id: item.id,
        type: metaData.type || (item.section_name.startsWith('work_') ? 'work' : 'education'),
        title: item.title || '',
        company: item.subtitle || '',
        location: metaData.location || '',
        date: metaData.date || '',
        description: item.description || '',
      };
    });
  } catch (error) {
    console.error('Error fetching experience items:', error);
    return [];
  }
};

// Helper to update an experience item
export const updateExperienceItem = async (id: string, data: any) => {
  try {
    const { error } = await supabase
      .from('site_content')
      .update({
        title: data.title,
        subtitle: data.company,
        description: data.description,
        image_url: JSON.stringify({
          location: data.location,
          date: data.date,
          type: data.type
        }),
        updated_by: 'admin',
        updated_at: new Date().toISOString() // Convert Date to ISO string
      })
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating experience item:', error);
    return { success: false, error };
  }
};

// Helper to delete an experience item
export const deleteExperienceItem = async (id: string) => {
  try {
    const { error } = await supabase
      .from('site_content')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting experience item:', error);
    return { success: false, error };
  }
};
