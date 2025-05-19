
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CheatSheetPreviewProps {
  title: string;
  description: string;
  language: string;
  groups: any[];
}

const CheatSheetPreview: React.FC<CheatSheetPreviewProps> = ({
  title,
  description,
  language,
  groups
}) => {
  const { toast } = useToast();
  
  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    toast({
      title: "Copied",
      description: "Command copied to clipboard",
      duration: 2000
    });
  };
  
  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold">{title || "Untitled Cheat Sheet"}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
        <div className="mt-2">
          <span className="inline-block px-2 py-1 text-xs rounded-md bg-primary/10 text-primary">
            {language}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="print:break-inside-avoid">
            <CardContent className="p-0">
              <div className="p-4 bg-muted/50">
                <h3 className="font-medium">{group.title}</h3>
              </div>
              <div className="divide-y">
                {group.entries.map((entry: any) => (
                  <div key={entry.id} className="p-4">
                    <div className="space-y-1">
                      <div className="relative group">
                        <pre className="text-sm font-mono bg-muted/30 p-2 rounded overflow-x-auto">
                          {entry.command || "Command not specified"}
                        </pre>
                        <button 
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                          onClick={() => copyCommand(entry.command)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
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
            No groups added to this cheat sheet yet
          </div>
        )}
      </div>
    </div>
  );
};

export default CheatSheetPreview;
