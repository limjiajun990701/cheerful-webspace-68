
-- Create the 'site-images' bucket and make it public.
-- The ON CONFLICT clause makes this operation safe to run even if the bucket already exists.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('site-images', 'site-images', true, 5242880, '{"image/jpeg","image/png","image/gif","image/webp","image/svg+xml","image/bmp"}')
ON CONFLICT (id) DO NOTHING;
