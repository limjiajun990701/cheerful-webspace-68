
export interface TimelineItem {
  id: string;
  type: 'work';
  title: string;
  company: string;
  location: string | null;
  date: string | null;
  description: string;
}
