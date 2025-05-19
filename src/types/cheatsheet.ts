
export interface CheatSheet {
  id: string;
  title: string;
  description: string | null;
  language: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface CheatSheetGroup {
  id: string;
  cheatsheet_id: string;
  title: string;
  display_order: number;
  entries: CheatSheetEntry[];
}

export interface CheatSheetEntry {
  id: string;
  group_id: string;
  command: string | null;
  description: string | null;
  display_order: number;
}
