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

export async function upsertSiteContent(contentArray: any) {
  if (Array.isArray(contentArray)) {
    return supabase
      .from('site_content')
      .upsert(contentArray, { onConflict: "page_name,section_name" });
  }
  return supabase
    .from('site_content')
    .upsert(contentArray);
}

// Fix: Aliases for missing imports and simple stubs for admin functionality

// getSiteContent is an alias for getContent
export const getSiteContent = getContent;

// getSkillGroups stub: returns empty array or implement as needed
export async function getSkillGroups() {
  // TODO: Implement actual logic as needed
  return [];
}
export async function createSkillGroup(category: string) {
  // TODO: Implement actual logic as needed
  return { success: true };
}
export async function updateSkillGroup(id: string, category: string, items: string[]) {
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
export async function createExperienceItem(item: any) {
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
  // TODO: Implement actual logic as needed
  return [];
}
export async function updateExpertiseContent(id: string, content: any) {
  // TODO: Implement actual logic as needed
  return { success: true };
}

// Home & About image/file upload helpers - just stubs for now
export async function uploadSiteImage(file: File, uploadPath: string) {
  // TODO: Implement actual logic as needed
  return null;
}
export async function setupSiteImagesBucket() {
  // TODO: Implement actual logic as needed
  return true;
}

// Alias for compatibility
export const updateSiteContent = upsertSiteContent;
