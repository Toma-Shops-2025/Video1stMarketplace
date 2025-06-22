-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies for admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to admins" ON public.admins
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage admins" ON public.admins
  FOR ALL USING (
    auth.uid() IN (
      SELECT auth.uid() 
      FROM auth.users 
      WHERE email IN (SELECT email FROM public.admins)
    )
  );

-- Add initial admin user
INSERT INTO public.admins (email)
VALUES ('tomaadkins@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Add status column to products if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE public.products 
    ADD COLUMN status TEXT NOT NULL DEFAULT 'active' 
    CHECK (status IN ('active', 'suspended'));
  END IF;
END $$;

-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_by UUID REFERENCES auth.users(id)
);

-- Create RLS policies for site_settings table
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to site settings
CREATE POLICY "Allow public read access to site_settings" ON public.site_settings
  FOR SELECT USING (true);

-- Allow admins to manage site settings
CREATE POLICY "Allow admins to manage site_settings" ON public.site_settings
  FOR ALL USING (
    auth.uid() IN (
      SELECT auth.uid() 
      FROM auth.users 
      WHERE email IN (SELECT email FROM public.admins)
    )
  );

-- Add initial demo video setting
INSERT INTO public.site_settings (key, value)
VALUES ('demo_video_url', 'https://drive.google.com/file/d/13e3wz4RKUEI_7K8ZyxSW1BbYJulWjzMd/view?usp=drivesdk')
ON CONFLICT (key) DO NOTHING; 