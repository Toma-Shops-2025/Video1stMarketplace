-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public read access to admins" ON public.admins;

-- Create the policy fresh
CREATE POLICY "Allow public read access to admins"
ON public.admins
FOR SELECT
TO public
USING (true);

-- Ensure RLS is enabled
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY; 