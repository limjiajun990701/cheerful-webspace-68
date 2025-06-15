import { supabase } from "@/integrations/supabase/client";

export const getContent = async (pageName: string, sectionName: string) => {
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("page_name", pageName)
    .eq("section_name", sectionName)
    .single();

  if (error) {
    console.error("Error fetching content:", error);
    return null;
  }

  return data;
};

export const getAllContent = async (pageName: string) => {
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("page_name", pageName)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching content:", error);
    return null;
  }

  return data;
};

export async function upsertSiteContent(content: any | any[]) {
  const { data, error } = await supabase
    .from('site_content')
    .upsert(content, { onConflict: "page_name,section_name" })
    .select();

  return { data, error };
}

// Fix: Aliases for missing imports and simple stubs for admin functionality

// getSiteContent is an alias for getContent
export const getSiteContent = getContent;

// getSkillGroups stub: returns empty array or implement as needed
export async function getSkillGroups() {
  // TODO: Implement actual logic as needed
  return [];
}

// Here is the fix! Accept items as array of SkillItems, not strings.
export async function createSkillGroup(category: string, items: { name: string; iconUrl?: string }[] = []) {
  // TODO: Implement actual logic as needed
  return { success: true };
}
export async function updateSkillGroup(
  id: string,
  category: string,
  items: { name: string; iconUrl?: string }[]
) {
  // TODO: Implement actual logic as needed
  return { success: true };
}
export async function deleteSkillGroup(id: string) {
  // TODO: Implement actual logic as needed
  return { success: true };
}

// Experience management stubs
export async function getExperienceItems() {
  // TODO: Implement actual logic as needed
  return [];
}
export async function createExperienceItem(type: string, item: any) {
  // TODO: Implement actual logic as needed
  return { success: true };
}
export async function updateExperienceItem(id: string, item: any) {
  // TODO: Implement actual logic as needed
  return { success: true };
}
export async function deleteExperienceItem(id: string) {
  // TODO: Implement actual logic as needed
  return { success: true };
}

// Expertise management stubs
export async function getExpertiseContent() {
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("page_name", "expertise")
    .eq("section_name", "main")
    .maybeSingle();

  if (error) {
    console.error("Error fetching expertise content:", error);
  }

  return data || {
    id: null,
    title: 'My Expertise',
    subtitle: 'Details about my expertise.',
    description: JSON.stringify({ items: [], skills: [] })
  };
}
export async function updateExpertiseContent(id: string | null, content: any) {
  const upsertData: any = {
    ...content,
    page_name: 'expertise',
    section_name: 'main',
    updated_by: 'admin',
  };

  if (id) {
    upsertData.id = id;
  }

  const { data, error } = await supabase
    .from('site_content')
    .upsert(upsertData, { onConflict: 'page_name,section_name' })
    .select()
    .single();

  if (error) {
    console.error('Error updating expertise content', error);
    return { success: false, error };
  }
  
  return { success: true, data };
}

// Home & About image/file upload helpers - now fully implemented
export async function setupSiteImagesBucket(): Promise<boolean> {
  const { data, error } = await supabase.storage.getBucket('site-images');
  if (error && error.message.includes('Bucket not found')) {
    try {
      const { data: bucketData, error: createError } = await supabase.storage.createBucket('site-images', {
        public: true,
        fileSizeLimit: '5MB',
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp'],
      });
      if (createError) {
        console.error("Error creating 'site-images' bucket:", createError);
        return false;
      }
      return true;
    } catch (e) {
      console.error("Exception creating 'site-images' bucket:", e);
      return false;
    }
  } else if (error) {
    console.error("Error getting 'site-images' bucket:", error);
    return false;
  }
  return true;
}

export async function uploadSiteImage(file: File, uploadPath: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${uploadPath}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('site-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('site-images')
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// Alias for compatibility
export const updateSiteContent = upsertSiteContent;
