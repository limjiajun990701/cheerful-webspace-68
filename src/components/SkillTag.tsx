
import React from 'react';
import { cn } from '@/lib/utils';

interface SkillTagProps {
  tag: string;
  className?: string;
}

const SkillTag = ({ tag, className }: SkillTagProps) => {
  // Generate a consistent color based on the tag name
  const generateTagColor = (tag: string) => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    ];
    
    // Hash the tag into an index for the colors array
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mr-2 mb-2",
        generateTagColor(tag),
        className
      )}
    >
      {tag}
    </span>
  );
};

export default SkillTag;
