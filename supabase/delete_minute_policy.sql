-- Create a specific delete policy for Super Admins
CREATE POLICY "Super Admins can delete minutes." ON minutes
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'super_admin'
  )
);
