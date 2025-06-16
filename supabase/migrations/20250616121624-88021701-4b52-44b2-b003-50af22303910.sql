
-- Create the site-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for the site-images bucket to allow uploads
CREATE POLICY "Allow public uploads to site-images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Allow public access to site-images" ON storage.objects
FOR SELECT USING (bucket_id = 'site-images');

CREATE POLICY "Allow public updates to site-images" ON storage.objects
FOR UPDATE USING (bucket_id = 'site-images');

CREATE POLICY "Allow public deletes from site-images" ON storage.objects
FOR DELETE USING (bucket_id = 'site-images');
