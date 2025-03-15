
// Define certification types
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  imageUrl: string;
  description: string;
  date: string;
  credentialUrl?: string;
}

// Mock data array for certifications
const mockCertifications: Certification[] = [
  {
    id: "cert-1",
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    imageUrl: "/placeholder.svg",
    description: "Validates expertise in designing and deploying scalable systems on AWS.",
    date: "2023-03-15",
    credentialUrl: "https://aws.amazon.com/certification/"
  },
  {
    id: "cert-2",
    name: "Google Professional Cloud Architect",
    issuer: "Google Cloud",
    imageUrl: "/placeholder.svg",
    description: "Certifies ability to design, develop, and manage robust Google Cloud infrastructure.",
    date: "2022-11-10",
    credentialUrl: "https://cloud.google.com/certification/cloud-architect"
  }
];

// Helper functions for CRUD operations
export const getAllCertifications = async (): Promise<Certification[]> => {
  // In a real app, this would be an API call
  return Promise.resolve(mockCertifications);
};

export const getCertificationById = async (id: string): Promise<Certification | undefined> => {
  // In a real app, this would be an API call
  return Promise.resolve(mockCertifications.find(cert => cert.id === id));
};

export const addCertification = async (cert: Omit<Certification, "id">): Promise<Certification> => {
  // In a real app, this would be an API call
  const newCertification: Certification = {
    id: `cert-${Date.now()}`,
    ...cert
  };
  
  mockCertifications.push(newCertification);
  return Promise.resolve(newCertification);
};

export const updateCertification = async (updatedCert: Certification): Promise<Certification> => {
  // In a real app, this would be an API call
  const index = mockCertifications.findIndex(cert => cert.id === updatedCert.id);
  
  if (index !== -1) {
    mockCertifications[index] = updatedCert;
    return Promise.resolve(updatedCert);
  }
  
  throw new Error("Certification not found");
};

export const deleteCertification = async (id: string): Promise<void> => {
  // In a real app, this would be an API call
  const index = mockCertifications.findIndex(cert => cert.id === id);
  
  if (index !== -1) {
    mockCertifications.splice(index, 1);
    return Promise.resolve();
  }
  
  throw new Error("Certification not found");
};
