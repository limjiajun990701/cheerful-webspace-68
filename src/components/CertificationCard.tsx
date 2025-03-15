
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Award, ExternalLink } from "lucide-react";
import { Certification } from "../utils/certificationData";
import { Button } from "./ui/button";

interface CertificationCardProps {
  certification: Certification;
}

const CertificationCard: React.FC<CertificationCardProps> = ({ certification }) => {
  const formattedDate = new Date(certification.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow overflow-hidden group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="mb-2">
            {certification.issuer}
          </Badge>
          <Award className="h-5 w-5 text-primary/70" />
        </div>
        <CardTitle className="line-clamp-2">{certification.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Issued: {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {certification.description}
        </p>
      </CardContent>
      {certification.credentialUrl && (
        <CardFooter className="pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-primary group-hover:bg-primary/5 transition-colors"
            onClick={() => window.open(certification.credentialUrl, "_blank")}
          >
            <span>View Credential</span>
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CertificationCard;
