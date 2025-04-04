
import React, { useState, useEffect } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getCurrentResume } from '@/utils/resumeData';
import { Resume } from '@/types/resume';

const ResumeButton = () => {
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    setResume(getCurrentResume());
  }, []);

  if (!resume) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-primary">
          <FileText size={18} />
          <span className="hidden sm:inline">Resume</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <a 
            href={resume.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex w-full cursor-pointer items-center"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View PDF
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a 
            href={resume.fileUrl} 
            download={resume.fileName}
            className="flex w-full cursor-pointer items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ResumeButton;
