
export interface Project {
  id: string;
  title: string;
  description: string;
  imageurl?: string;
  fileurl?: string;
  filetype?: 'image' | 'pdf';
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
  excerpt: string;
  imageUrl?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  imageUrl?: string;
}

export interface Resume {
  id: string;
  file_name: string;
  fileUrl: string;
  upload_date: string;
  fileName?: string;
}

export interface Profile {
  id: string;
  username: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}
