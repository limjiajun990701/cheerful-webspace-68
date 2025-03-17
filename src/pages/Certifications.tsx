
import React, { useState, useEffect } from "react";
import { getAllCertifications, Certification } from "../utils/certificationData";
import CertificationCard from "../components/CertificationCard";
import { Badge } from "../components/ui/badge";

const Certifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const data = await getAllCertifications();
        setCertifications(data);
      } catch (error) {
        console.error("Error fetching certifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg border border-border p-6 h-64">
                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/3 mt-6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Certifications & Badges</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional qualifications and achievements that validate my expertise in various technologies and domains.
          </p>
        </div>

        {certifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No certifications found.</p>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {Array.from(new Set(certifications.map(cert => cert.issuer))).map(issuer => (
                <Badge key={issuer} variant="outline" className="text-sm">
                  {issuer}
                </Badge>
              ))}
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {certifications.map(certification => (
                <CertificationCard key={certification.id} certification={certification} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certifications;
