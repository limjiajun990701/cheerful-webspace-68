
import { v4 as uuidv4 } from 'uuid';
import { Resume } from '@/types/resume';

const STORAGE_KEY = 'portfolio_resume';
const DEFAULT_RESUME: Resume = {
  id: 'default',
  fileUrl: '/resume-sample.pdf', // Default placeholder
  fileName: 'resume.pdf',
  uploadDate: new Date().toISOString(),
};

// Get the current resume data
export const getCurrentResume = (): Resume => {
  try {
    const storedResume = localStorage.getItem(STORAGE_KEY);
    if (storedResume) {
      return JSON.parse(storedResume);
    }
    return DEFAULT_RESUME;
  } catch (error) {
    console.error("Error fetching resume:", error);
    return DEFAULT_RESUME;
  }
};

// Upload a new resume
export const uploadResume = async (file: File): Promise<Resume> => {
  return new Promise((resolve, reject) => {
    try {
      // In a real app, this would upload to a server or storage service
      // For now we'll use a local URL
      const fileReader = new FileReader();
      
      fileReader.onload = () => {
        const newResume: Resume = {
          id: uuidv4(),
          fileUrl: URL.createObjectURL(file),
          fileName: file.name,
          uploadDate: new Date().toISOString(),
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newResume));
        resolve(newResume);
      };
      
      fileReader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      
      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      reject(error);
    }
  });
};

// Delete resume
export const deleteResume = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error deleting resume:", error);
  }
};
