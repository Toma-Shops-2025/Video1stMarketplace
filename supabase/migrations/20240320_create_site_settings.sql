-- Create the site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert initial demo video URL if it doesn't exist
INSERT INTO public.site_settings (key, value)
VALUES ('demo_video_url', 'https://example.com/demo.mp4')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access to site settings
DROP POLICY IF EXISTS "Allow public read access to site_settings" ON public.site_settings;
CREATE POLICY "Allow public read access to site_settings"
ON public.site_settings
FOR SELECT
TO public
USING (true);

-- Allow admins to update site settings
DROP POLICY IF EXISTS "Allow admin update of site_settings" ON public.site_settings;
CREATE POLICY "Allow admin update of site_settings"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.email = auth.jwt()->>'email'
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.email = auth.jwt()->>'email'
));

-- Create an update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 