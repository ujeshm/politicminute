-- 1. Drop the existing permissive policy
DROP POLICY IF EXISTS "Authenticated users can insert minutes." ON minutes;

-- 2. Create a restricted policy
-- This checks if the user's ID exists in the profiles table with an allowed role.
CREATE POLICY "Authorized users can insert minutes." ON minutes
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'minute_keeper', 'minute_editor')
  )
);

-- 3. Update the Update policy to also be restricted if not already
-- Existing: "Authors can update their own minutes." (auth.uid() = author_id)
-- This is fine, but if we want to allow Editors to edit ANY minute, we might need to change it later.
-- For now, we only restrict CREATION as requested.
