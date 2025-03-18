
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
export const mockCertifications: Certification[] = [
  {
    id: "1",
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services (AWS)",
    imageUrl: "/placeholder.svg",
    date: "2024-10-01",
    description: "Validated cloud fluency and foundational AWS knowledge. The certification covered AWS services, security, architecture, pricing, and support.",
    credentialUrl: "https://example.com/aws-certification"
  },
  {
    id: "2",
    name: "Microsoft Certified: Azure Fundamentals",
    issuer: "Microsoft",
    imageUrl: "/placeholder.svg",
    date: "2023-09-01",
    description: "Demonstrated understanding of cloud concepts, Azure services, Azure workloads, security, privacy, pricing, and support.",
    credentialUrl: "https://example.com/azure-certification"
  },
  {
    id: "3",
    name: "Oracle Cloud Infrastructure 2024 Foundations Associate",
    issuer: "Oracle",
    imageUrl: "/placeholder.svg",
    date: "2024-07-01",
    description: "Validated knowledge of Oracle Cloud Infrastructure services, architecture, pricing, and support.",
    credentialUrl: "https://example.com/oracle-certification"
  },
  {
    id: "4",
    name: "Responsible AI: Applying AI Principles with Google Cloud",
    issuer: "Google",
    imageUrl: "/placeholder.svg",
    date: "2024-05-01",
    description: "Certificate demonstrating understanding of responsible AI principles and their application with Google Cloud technologies.",
    credentialUrl: "https://example.com/google-certification"
  },
  {
    id: "5",
    name: "Introduction to Large Language Models",
    issuer: "Google",
    imageUrl: "/placeholder.svg",
    date: "2024-05-01",
    description: "Foundational knowledge on large language models, their capabilities, limitations, and applications.",
    credentialUrl: "https://example.com/google-llm"
  },
  {
    id: "6",
    name: "Introduction to Generative AI",
    issuer: "Google",
    imageUrl: "/placeholder.svg",
    date: "2024-05-01",
    description: "Understanding of generative AI concepts, technologies, and real-world applications.",
    credentialUrl: "https://example.com/google-genai"
  },
  {
    id: "7",
    name: "Introduction to Cybersecurity",
    issuer: "Cisco",
    imageUrl: "/placeholder.svg",
    date: "2024-04-01",
    description: "Validated understanding of cybersecurity concepts, principles, and best practices.",
    credentialUrl: "https://example.com/cisco-cybersecurity"
  },
  {
    id: "8",
    name: "Academy Accreditation - Generative AI Fundamentals",
    issuer: "Databricks",
    imageUrl: "/placeholder.svg",
    date: "2024-11-01",
    description: "Demonstrated understanding of generative AI fundamentals and their application within the Databricks platform.",
    credentialUrl: "https://example.com/databricks-genai"
  },
  {
    id: "9",
    name: "Academy Accreditation - Databricks Fundamentals",
    issuer: "Databricks",
    imageUrl: "/placeholder.svg",
    date: "2024-11-01",
    description: "Validated knowledge of Databricks platform fundamentals for data engineering and analysis.",
    credentialUrl: "https://example.com/databricks-fundamentals"
  },
  {
    id: "10",
    name: "Cybersecurity Essentials (LFC108)",
    issuer: "The Linux Foundation",
    imageUrl: "/placeholder.svg",
    date: "2023-10-01",
    description: "Comprehensive understanding of essential cybersecurity practices, principles, and tools with focus on Linux environments.",
    credentialUrl: "https://example.com/linux-cybersecurity"
  },
  {
    id: "11",
    name: "Software Engineering Basics for Embedded Systems (LFD116)",
    issuer: "The Linux Foundation",
    imageUrl: "/placeholder.svg",
    date: "2024-05-01",
    description: "Foundational knowledge in software engineering principles for embedded systems development.",
    credentialUrl: "https://example.com/linux-embedded"
  },
  {
    id: "12",
    name: "AI Aware Badge - AI untuk Rakyat",
    issuer: "MyDIGITAL Corporation",
    imageUrl: "/placeholder.svg",
    date: "2024-01-01",
    description: "Recognition of AI awareness and understanding of its implications for society.",
    credentialUrl: "https://example.com/mydigital-ai-aware"
  },
  {
    id: "13",
    name: "AI Appreciate Badge - AI untuk Rakyat",
    issuer: "MyDIGITAL Corporation",
    imageUrl: "/placeholder.svg",
    date: "2024-01-01",
    description: "Advanced understanding and appreciation of AI technologies and their applications.",
    credentialUrl: "https://example.com/mydigital-ai-appreciate"
  },
  {
    id: "14",
    name: "8th Innovative Research, Invention and Application Exhibition (IRIA 2023) – Bronze Medal",
    issuer: "Universiti Utara Malaysia (UUM)",
    imageUrl: "/placeholder.svg",
    date: "2023-08-01",
    description: "Recognition for innovative research and application in the field of information technology.",
    credentialUrl: "https://example.com/uum-iria"
  },
  {
    id: "15",
    name: "AWSome Day Online Conference",
    issuer: "Amazon Web Services (AWS)",
    imageUrl: "/placeholder.svg",
    date: "2024-07-01",
    description: "Participation certificate for AWS online learning event covering cloud concepts and services.",
    credentialUrl: "https://example.com/aws-awesome-day"
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
