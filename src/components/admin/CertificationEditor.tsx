
import { useState, useEffect } from "react";
import { Award, Save } from "lucide-react";
import { Certification, getCertificationById } from "../../utils/certificationData";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { useToast } from "../../hooks/use-toast";
import { Label } from "../ui/label";

interface CertificationEditorProps {
  editingId: string | null;
  onSave: (certification: Omit<Certification, 'id'>) => void;
  onCancel: () => void;
}

const CertificationEditor = ({ editingId, onSave, onCancel }: CertificationEditorProps) => {
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load certification data when editing an existing certification
  useEffect(() => {
    const loadCertificationData = async () => {
      if (editingId) {
        setIsLoading(true);
        try {
          const certification = await getCertificationById(editingId);
          
          if (certification) {
            setName(certification.name);
            setIssuer(certification.issuer);
            setImageUrl(certification.imageUrl || "");
            setDescription(certification.description);
            setDate(certification.date);
            setCredentialUrl(certification.credentialUrl || "");
          }
        } catch (error) {
          console.error("Error loading certification data:", error);
          toast({
            title: "Error",
            description: "Failed to load certification data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadCertificationData();
  }, [editingId, toast]);

  const handleSave = () => {
    if (!name || !issuer || !date) {
      toast({
        title: "Missing Fields",
        description: "Name, issuer, and date are required.",
        variant: "destructive",
      });
      return;
    }

    onSave({
      name,
      issuer,
      imageUrl: imageUrl || "/placeholder.svg",
      description,
      date,
      credentialUrl: credentialUrl || undefined,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium mb-1">
              Certification Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter certification name"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="issuer" className="block text-sm font-medium mb-1">
              Issuer *
            </Label>
            <Input
              id="issuer"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="Organization that issued the certification"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
              Badge Image URL
            </Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter badge image URL"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what the certification validates"
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="date" className="block text-sm font-medium mb-1">
              Issue Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="credentialUrl" className="block text-sm font-medium mb-1">
              Credential URL (optional)
            </Label>
            <Input
              id="credentialUrl"
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              placeholder="Link to verify the credential"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {editingId ? "Update" : "Add"} Certification
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificationEditor;
