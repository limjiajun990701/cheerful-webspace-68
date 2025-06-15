
-- Drop tables if they exist
drop table if exists public.cheatsheet_entries cascade;
drop table if exists public.cheatsheet_groups cascade;
drop table if exists public.cheatsheets cascade;

-- Create cheatsheets table
create table public.cheatsheets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  language text not null,
  created_by uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create cheatsheet_groups table
create table public.cheatsheet_groups (
  id uuid primary key default gen_random_uuid(),
  cheatsheet_id uuid not null references public.cheatsheets(id) on delete cascade,
  title text not null,
  display_order integer not null
);

-- Create cheatsheet_entries table
create table public.cheatsheet_entries (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.cheatsheet_groups(id) on delete cascade,
  command text,
  description text,
  display_order integer not null
);

-- Indexes for efficient searching
create index if not exists idx_cheatsheets_language on public.cheatsheets(language);
create index if not exists idx_cheatsheet_groups_cheatsheet_id on public.cheatsheet_groups(cheatsheet_id);
create index if not exists idx_cheatsheet_entries_group_id on public.cheatsheet_entries(group_id);

