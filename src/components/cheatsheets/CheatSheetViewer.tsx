
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileDown, Copy, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CheatSheetViewerProps {
  cheatSheet: {
    id: string;
    title: string;
    description: string;
    language: string;
    content?: any;
  };
}

const CheatSheetViewer: React.FC<CheatSheetViewerProps> = ({ cheatSheet }) => {
  const { toast } = useToast();
  
  // For now using placeholder content since we don't have actual content from the database
  const dummyContent = [
    {
      title: "Basic Commands",
      entries: [
        { command: "git init", description: "Initialize a new Git repository" },
        { command: "git clone [url]", description: "Clone a repository from URL" },
        { command: "git add [file]", description: "Add file to staging area" },
        { command: "git commit -m \"[message]\"", description: "Commit changes with message" }
      ]
    },
    {
      title: "Branch & Merge",
      entries: [
        { command: "git branch", description: "List all branches" },
        { command: "git branch [branch-name]", description: "Create a new branch" },
        { command: "git checkout [branch-name]", description: "Switch to a branch" },
        { command: "git merge [branch-name]", description: "Merge branch into current branch" }
      ]
    }
  ];
  
  const exportCheatSheet = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting as ${format}...`,
    });
  };
  
  const copyToClipboard = () => {
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };
  
  const printCheatSheet = () => {
    window.print();
  };
  
  return (
    <div className="space-y-6">
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
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => exportCheatSheet("pdf")}>
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={printCheatSheet}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2">
        {dummyContent.map((group, index) => (
          <Card key={index} className="print:break-inside-avoid">
            <CardContent className="p-0">
              <div className="p-4 bg-muted/50">
                <h3 className="font-medium">{group.title}</h3>
              </div>
              <div className="divide-y">
                {group.entries.map((entry, entryIdx) => (
                  <div key={entryIdx} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="relative group">
                          <pre className="text-sm font-mono bg-muted/30 p-2 rounded overflow-x-auto">
                            {entry.command}
                          </pre>
                          <button 
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                            onClick={() => {
                              navigator.clipboard.writeText(entry.command);
                              toast({
                                title: "Copied",
                                description: "Command copied to clipboard",
                                duration: 2000
                              });
                            }}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CheatSheetViewer;
