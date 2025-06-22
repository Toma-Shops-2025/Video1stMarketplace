-- Allow sellers or admins to update products
ALTER POLICY "Enable update for users based on seller_id" ON public.products
  USING (
    auth.uid() = seller_id
    OR
    auth.uid() IN (
      SELECT auth.uid()
      FROM auth.users
      WHERE email IN (SELECT email FROM public.admins)
    )
  )
  WITH CHECK (
    auth.uid() = seller_id
    OR
    auth.uid() IN (
      SELECT auth.uid()
      FROM auth.users
      WHERE email IN (SELECT email FROM public.admins)
    )
  );

-- Allow sellers or admins to delete products
CREATE POLICY IF NOT EXISTS "Enable delete for sellers and admins" ON public.products
  FOR DELETE
  USING (
    auth.uid() = seller_id
    OR
    auth.uid() IN (
      SELECT auth.uid()
      FROM auth.users
      WHERE email IN (SELECT email FROM public.admins)
    )
  ); 