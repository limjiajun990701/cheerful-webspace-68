
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import AdminCertificationCard from "../AdminCertificationCard";
import { getAllCertifications, addCertification, updateCertification, deleteCertification } from "../../utils/certificationData";
import { Certification } from "../../types/database";
import CertificationEditor from "./CertificationEditor";

const CertificationManager = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      const allCertifications = await getAllCertifications();
      setCertifications(allCertifications);
    } catch (error) {
      toast({
        title: "Error Loading Certifications",
        description: "Failed to load certifications. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditCertification = (certification: Certification) => {
    setEditingId(certification.id);
    setIsEditing(true);
  };

  const handleSaveCertification = async (certificationData: Omit<Certification, 'id'>) => {
    try {
      if (editingId) {
        // Update existing certification
        await updateCertification({
          id: editingId,
          ...certificationData
        });
        
        toast({
          title: "Success",
          description: "Certification updated successfully!",
        });
      } else {
        // Create new certification
        await addCertification(certificationData);
        
        toast({
          title: "Success",
          description: "New certification added successfully!",
        });
      }

      resetCertificationForm();
      loadCertifications();
    } catch (error) {
      console.error("Error saving certification:", error);
      toast({
        title: "Error",
        description: "Failed to save the certification. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCertification = async (id: string) => {
    try {
      await deleteCertification(id);
      toast({
        title: "Success",
        description: "Certification deleted successfully!",
      });
      loadCertifications();
      
      if (editingId === id) {
        resetCertificationForm();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the certification. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetCertificationForm = () => {
    setEditingId(null);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <CertificationEditor 
          editingId={editingId}
          onSave={handleSaveCertification}
          onCancel={resetCertificationForm}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Certifications & Badges</h2>
            <Button onClick={() => setIsEditing(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Certification
            </Button>
          </div>

          {certifications.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No certifications found. Add your first certification!</p>
          ) : (
            <div className="grid gap-6">
              {certifications.map((certification) => (
                <AdminCertificationCard
                  key={certification.id}
                  certification={certification}
                  onEdit={() => handleEditCertification(certification)}
                  onDelete={() => handleDeleteCertification(certification.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CertificationManager;
