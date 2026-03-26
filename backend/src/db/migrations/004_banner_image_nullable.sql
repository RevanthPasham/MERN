-- Allow banner image_url to be null (admin can remove image)
ALTER TABLE banners ALTER COLUMN image_url DROP NOT NULL;
