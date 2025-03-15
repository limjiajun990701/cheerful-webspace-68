
import React, { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { getAllCertifications, Certification } from "../utils/certificationData";
import CertificationCard from "./CertificationCard";
import { useMediaQuery } from "../hooks/use-media-query";

const CertificationsSection: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

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
      <div className="py-16 text-center">
        <div className="animate-pulse h-48 w-full max-w-md mx-auto bg-muted rounded-lg"></div>
      </div>
    );
  }

  if (certifications.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-accent">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Certifications & Credentials</h2>
        
        <Carousel 
          opts={{
            align: "start",
            loop: certifications.length > 3,
          }}
          className="w-full max-w-5xl mx-auto px-4"
        >
          <CarouselContent>
            {certifications.map((certification) => (
              <CarouselItem 
                key={certification.id} 
                className={isMobile ? "basis-full" : isTablet ? "basis-1/2" : "basis-1/3"}
              >
                <div className="p-1">
                  <CertificationCard certification={certification} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 lg:-left-12" />
          <CarouselNext className="right-0 lg:-right-12" />
        </Carousel>
      </div>
    </section>
  );
};

export default CertificationsSection;
