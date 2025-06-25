-- Create digital_products table
CREATE TABLE IF NOT EXISTS public.digital_products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  price numeric,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and allow public read access
dO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'Allow public read access to digital_products') THEN
    ALTER TABLE public.digital_products ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Allow public read access to digital_products"
      ON public.digital_products
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and allow public read access for cart_items
do $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'Allow public read access to cart_items') THEN
    ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Allow public read access to cart_items"
      ON public.cart_items
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL
);

-- Enable RLS and allow public read access for admins
do $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'Allow public read access to admins') THEN
    ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Allow public read access to admins"
      ON public.admins
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$; 