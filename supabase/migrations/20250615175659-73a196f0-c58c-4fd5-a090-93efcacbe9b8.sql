
-- Table to store homepage/about "Who Am I?" section content
CREATE TABLE public.about_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL, -- E.g. 'about_me', 'who_am_i'
  title text,
  body text,
  tags text[], -- Array of tag/label (e.g. ['Full-stack', 'Web & Mobile', ...])
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS: allow unrestricted access for now (adjust as needed)
ALTER TABLE public.about_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Select About Section"
  ON public.about_sections
  FOR SELECT
  USING (true);

CREATE POLICY "Public Insert About Section"
  ON public.about_sections
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public Update About Section"
  ON public.about_sections
  FOR UPDATE
  USING (true);

CREATE POLICY "Public Delete About Section"
  ON public.about_sections
  FOR DELETE
  USING (true);
