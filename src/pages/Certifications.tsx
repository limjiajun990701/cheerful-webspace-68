
import React, { useState, useEffect } from "react";
import { getAllCertifications } from "../utils/certificationData";
import { Certification } from "../types/database";
import CertificationCard from "../components/CertificationCard";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";

const Certifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [filteredCertifications, setFilteredCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIssuer, setSelectedIssuer] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const data = await getAllCertifications();
        setCertifications(data);
        setFilteredCertifications(data);
      } catch (error) {
        console.error("Error fetching certifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  useEffect(() => {
    let filtered = certifications;
    
    if (searchTerm) {
      filtered = filtered.filter(cert => 
        cert.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        cert.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedIssuer) {
      filtered = filtered.filter(cert => cert.issuer === selectedIssuer);
    }
    
    setFilteredCertifications(filtered);
  }, [searchTerm, selectedIssuer, certifications]);

  const issuers = Array.from(new Set(certifications.map(cert => cert.issuer)));

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

        <div className="mb-8">
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              className="pl-10" 
              placeholder="Search certifications..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge 
              variant={selectedIssuer === null ? "default" : "outline"} 
              className="cursor-pointer text-sm"
              onClick={() => setSelectedIssuer(null)}
            >
              All
            </Badge>
            {issuers.map(issuer => (
              <Badge 
                key={issuer} 
                variant={selectedIssuer === issuer ? "default" : "outline"} 
                className="cursor-pointer text-sm"
                onClick={() => setSelectedIssuer(issuer === selectedIssuer ? null : issuer)}
              >
                {issuer}
              </Badge>
            ))}
          </div>
        </div>

        {filteredCertifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No certifications found matching your search.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCertifications.map(certification => (
              <CertificationCard key={certification.id} certification={certification} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certifications;
