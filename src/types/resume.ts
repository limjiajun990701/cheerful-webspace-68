
export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  upload_date: string;
  fileUrl?: string; // For compatibility with frontend components
  fileName?: string; // For compatibility with frontend components
}
