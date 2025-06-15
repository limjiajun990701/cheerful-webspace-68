
import type { Database } from "@/integrations/supabase/types";

type TablesWithRows<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];

// Export our database interfaces with proper property names
export interface Project {
  id: string;
  title: string;
  description: string;
  imageurl?: string;
  fileurl?: string;
  filetype?: 'image' | 'pdf' | null;
  tags: string[];
  liveurl?: string;
  githuburl?: string;
  date?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  excerpt?: string;
  imageurl?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  fileurl: string;
  filetype: 'image' | 'pdf';
  description?: string;
  credentialurl?: string;
}

export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  upload_date?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface Profile {
  id: string;
  username: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SkillItem {
  id: string;
  skill_id: string;
  image_url: string;
  label: string;
  description: string | null;
  animation_type: string | null;
  display_order: number | null;
  created_at?: string;
  updated_at?: string;
}
