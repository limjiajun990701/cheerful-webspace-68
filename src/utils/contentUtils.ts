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

/**
 * Fetches the single expertise content row (takes the first one).
 * Used in the index page and admin expertise manager.
 */
export async function getExpertiseContent() {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('page_name', 'home')
    .eq('section_name', 'expertise')
    .single();

  if (error) {
    console.error('Error fetching expertise content:', error);
    return null;
  }
  return data;
}

/**
 * Updates the expertise content row.
 */
export async function updateExpertiseContent(id: string | null, updates: { title?: string, subtitle?: string, description?: string }) {
  // If id is given, update. If not, insert new.
  if (id) {
    const { data, error } = await supabase
      .from('site_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating expertise content:", error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } else {
    // Insert new
    const input = {
      ...updates,
      page_name: 'home',
      section_name: 'expertise',
    };
    const { data, error } = await supabase
      .from('site_content')
      .insert([input])
      .select()
      .single();

    if (error) {
      console.error("Error inserting expertise content:", error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  }
}

/**
 * Fetch generic site content for a given page and section.
 */
export async function getSiteContent(pageName: string, sectionName: string) {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('page_name', pageName)
    .eq('section_name', sectionName)
    .single();
  if (error) {
    console.error('Error fetching site content:', error);
    return null;
  }
  return data;
}

/**
 * Fetch all skill groups (for About/Skills manager pages). Expects a site_content row per group with section_name = 'skills-group'.
 * Each group's description should be JSON with group info: { items: string[] }
 */
export async function getSkillGroups() {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('section_name', 'skills-group');

  if (error) {
    console.error("Error fetching skill groups:", error);
    return [];
  }
  // Map over data and parse items
  return (data || []).map((group: any) => {
    let items: string[] = [];
    try {
      const desc = group.description;
      if (desc) {
        const parsed = typeof desc === "string" ? JSON.parse(desc) : desc;
        items = Array.isArray(parsed?.items) ? parsed.items : [];
      }
    } catch {
      items = [];
    }
    return {
      id: group.id,
      category: group.title || "",
      items,
    };
  });
}

/**
 * EXPERIENCE SECTION
 * 
 * Work and Education Experiences are stored in site_content
 * with section_name = "experience" and a description field with
 * experience items in JSON array:
 * [
 *   { id, type, title, company, location, date, description }
 * ]
 * 
 * To keep data simple, we store all experiences in one row,
 * page_name = 'about', section_name = 'experience'.
 */

interface ExperienceItem {
  id: string;
  type: 'work' | 'education';
  title: string;
  company: string;
  location: string;
  date: string;
  description: string;
}

export async function getExperienceItems(): Promise<ExperienceItem[]> {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('page_name', 'about')
    .eq('section_name', 'experience')
    .maybeSingle();

  if (error) {
    console.error('Error fetching experience content:', error);
    return [];
  }
  if (!data || !data.description) return [];

  try {
    const parsed = typeof data.description === "string"
      ? JSON.parse(data.description)
      : data.description;
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

// Adds a new experience item. "type" is 'work'|'education'
export async function createExperienceItem(
  type: 'work' | 'education',
  item: Omit<ExperienceItem, 'id'|'type'> & { type?: 'work'|'education' }
): Promise<{ success: boolean }> {
  // Get existing
  const items = await getExperienceItems();
  const newItem: ExperienceItem = {
    id: uuidv4(),
    type,
    title: item.title,
    company: item.company,
    location: item.location,
    date: item.date,
    description: item.description,
  };
  const newItems = [newItem, ...items];

  // Upsert entire array
  const { error } = await supabase
    .from('site_content')
    .upsert([{
      page_name: 'about',
      section_name: 'experience',
      description: JSON.stringify(newItems),
      updated_at: new Date().toISOString(),
    }], { onConflict: ['page_name', 'section_name'] });

  if (error) {
    console.error('Error creating experience item:', error);
    return { success: false };
  }
  return { success: true };
}

export async function updateExperienceItem(id: string, updates: Partial<ExperienceItem>): Promise<{ success: boolean }> {
  // Get existing
  const items = await getExperienceItems();
  const updatedItems = items.map(item =>
    item.id === id ? { ...item, ...updates } : item
  );
  const { error } = await supabase
    .from('site_content')
    .upsert([{
      page_name: 'about',
      section_name: 'experience',
      description: JSON.stringify(updatedItems),
      updated_at: new Date().toISOString(),
    }], { onConflict: ['page_name', 'section_name'] });

  if (error) {
    console.error('Error updating experience item:', error);
    return { success: false };
  }
  return { success: true };
}

export async function deleteExperienceItem(id: string): Promise<{ success: boolean }> {
  const items = await getExperienceItems();
  const updatedItems = items.filter(item => item.id !== id);
  const { error } = await supabase
    .from('site_content')
    .upsert([{
      page_name: 'about',
      section_name: 'experience',
      description: JSON.stringify(updatedItems),
      updated_at: new Date().toISOString(),
    }], { onConflict: ['page_name', 'section_name'] });

  if (error) {
    console.error('Error deleting experience item:', error);
    return { success: false };
  }
  return { success: true };
}

/**
 * SKILLS SECTION
 * Each skill group is a row in site_content with section_name = "skills-group"
 * description = { items: string[] }
 */

export async function createSkillGroup(category: string) {
  const { error } = await supabase
    .from('site_content')
    .insert([{
      page_name: 'about',
      section_name: 'skills-group',
      title: category,
      description: JSON.stringify({ items: [] }),
      updated_at: new Date().toISOString(),
    }]);
  if (error) {
    console.error('Error creating skill group:', error);
    return { success: false };
  }
  return { success: true };
}

export async function updateSkillGroup(id: string, category: string, items: string[]) {
  const { error } = await supabase
    .from('site_content')
    .update({
      title: category,
      description: JSON.stringify({ items }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) {
    console.error('Error updating skill group:', error);
    return { success: false };
  }
  return { success: true };
}

export async function deleteSkillGroup(id: string) {
  const { error } = await supabase
    .from('site_content')
    .delete()
    .eq('id', id);
  if (error) {
    console.error('Error deleting skill group:', error);
    return { success: false };
  }
  return { success: true };
}
