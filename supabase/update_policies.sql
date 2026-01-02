-- SAFE UPDATE SCRIPT
-- Run this to update your security policies without errors about existing tables.

-- 1. Creation Policy: Drop old ones first to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can insert minutes." ON minutes;
DROP POLICY IF EXISTS "Authorized users can insert minutes." ON minutes;

CREATE POLICY "Authorized users can insert minutes." ON minutes
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'minute_keeper', 'minute_editor')
  )
);

-- 2. Deletion Policy
DROP POLICY IF EXISTS "Super Admins can delete minutes." ON minutes;

CREATE POLICY "Super Admins can delete minutes." ON minutes
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'super_admin'
  )
);
