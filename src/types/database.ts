
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

// Export other existing interfaces...
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  excerpt: string;
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
}

export interface Profile {
  id: string;
  username: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}
