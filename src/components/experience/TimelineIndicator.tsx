
import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface TimelineIndicatorProps {
  durationInMonths: number;
  maxDuration?: number;
  className?: string;
}

const TimelineIndicator = ({ durationInMonths, maxDuration = 36, className }: TimelineIndicatorProps) => {
  // Calculate the percentage, capped at 100%
  const percentage = Math.min((durationInMonths / maxDuration) * 100, 100);
  
  // Define color based on duration
  const getColorClass = () => {
    if (durationInMonths < 6) return 'bg-yellow-500';
    if (durationInMonths < 12) return 'bg-blue-500';
    if (durationInMonths < 24) return 'bg-green-500';
    return 'bg-purple-500';
  };

  return (
    <div className={cn("w-full space-y-1", className)}>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{durationInMonths} month{durationInMonths !== 1 ? 's' : ''}</span>
        <span className="text-right">{percentage.toFixed(0)}%</span>
      </div>
      <Progress 
        value={percentage} 
        className="h-1.5"
        indicatorClassName={getColorClass()}
      />
    </div>
  );
};

export default TimelineIndicator;
