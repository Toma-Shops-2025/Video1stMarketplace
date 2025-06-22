-- Add shipping columns to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS allow_shipping BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS local_pickup_only BOOLEAN DEFAULT false;

-- Update RLS policies to include new columns
ALTER POLICY "Enable read access for all users" ON public.products
    USING (true);

ALTER POLICY "Enable insert for authenticated users only" ON public.products
    WITH CHECK (auth.uid() = seller_id);

ALTER POLICY "Enable update for users based on seller_id" ON public.products
    USING (auth.uid() = seller_id)
    WITH CHECK (auth.uid() = seller_id); 