import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileDown, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CheatSheet, CheatSheetGroup } from "@/types/cheatsheet";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CheatSheetViewerProps {
  cheatSheet: {
    id: string;
    title: string;
    description: string | null;
    language: string;
  };
  isAdmin: boolean;
}

const CheatSheetViewer: React.FC<CheatSheetViewerProps> = ({ cheatSheet, isAdmin }) => {
  const { toast } = useToast();
  const [pdfExporting, setPdfExporting] = useState(false);
  
  // Fetch cheatsheet groups and entries
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['cheatsheet-groups', cheatSheet.id],
    queryFn: async () => {
      const { data: groupsData, error: groupsError } = await supabase
        .from('cheatsheet_groups')
        .select('*')
        .eq('cheatsheet_id', cheatSheet.id)
        .order('display_order', { ascending: true });

      if (groupsError) {
        console.error("Error fetching cheat sheet groups:", groupsError);
        throw new Error(groupsError.message);
      }

      // Fetch entries for each group
      const groupsWithEntries = await Promise.all(
        groupsData.map(async (group) => {
          const { data: entriesData, error: entriesError } = await supabase
            .from('cheatsheet_entries')
            .select('*')
            .eq('group_id', group.id)
            .order('display_order', { ascending: true });

          if (entriesError) {
            console.error("Error fetching cheat sheet entries:", entriesError);
            throw new Error(entriesError.message);
          }

          return {
            ...group,
            entries: entriesData
          };
        })
      );

      return groupsWithEntries as CheatSheetGroup[];
    }
  });

  const exportCheatSheetToPdf = async () => {
    setPdfExporting(true);
    toast({
      title: "Export Started",
      description: "Exporting as PDF...",
      duration: 2000,
    });
    
    try {
      const element = document.getElementById('cheatsheet-content');
      if (!element) {
        throw new Error("Could not find cheatsheet content");
      }
      
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions: 210mm x 297mm
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const imgWidth = 190;
      const pageHeight = 287;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 10; // Initial position from top
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if the content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${cheatSheet.title}.pdf`);
      
      toast({
        title: "Export Complete",
        description: "PDF has been downloaded",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting to PDF",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setPdfExporting(false);
    }
  };
  
  const printCheatSheet = () => {
    window.print();
  };
  
  return (
    <div className="space-y-6" id="cheatsheet-content">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{cheatSheet.title}</h1>
          <p className="text-muted-foreground">{cheatSheet.description}</p>
          <div className="mt-2">
            <span className="inline-block px-2 py-1 text-xs rounded-md bg-primary/10 text-primary">
              {cheatSheet.language}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 print:hidden">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportCheatSheetToPdf} 
            disabled={pdfExporting}
          >
            <FileDown className="h-4 w-4 mr-2" />
            {pdfExporting ? "Exporting..." : "Export as PDF"}
          </Button>
          <Button variant="outline" size="sm" onClick={printCheatSheet}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-muted-foreground">Loading cheat sheet content...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2">
          {groups.map((group) => (
            <Card key={group.id} className="print:break-inside-avoid">
              <CardContent className="p-0">
                <div className="p-4 bg-muted/50">
                  <h3 className="font-medium">{group.title}</h3>
                </div>
                <div className="divide-y">
                  {group.entries.map((entry) => (
                    <div key={entry.id} className="p-4">
                      <div className="space-y-1">
                        <div className="relative">
                          <pre className="text-sm font-mono bg-muted/30 p-2 rounded overflow-x-auto">
                            {entry.command || "Command not specified"}
                          </pre>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {entry.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                  ))}
                  {group.entries.length === 0 && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No entries in this group
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {groups.length === 0 && (
            <div className="p-4 text-center text-muted-foreground col-span-full">
              No groups found for this cheat sheet
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheatSheetViewer;
