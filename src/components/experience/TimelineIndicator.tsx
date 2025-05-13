
import React from 'react';
import { cn } from '@/lib/utils';

interface TimelineIndicatorProps {
  className?: string;
}

const TimelineIndicator = ({ className }: TimelineIndicatorProps) => {
  return (
    <div className={cn("w-full h-1 bg-secondary", className)} />
  );
};

export default TimelineIndicator;
