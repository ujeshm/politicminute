-- 1. Drop the existing check constraint on 'role'
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Update existing 'admin' users to 'super_admin' (Migration)
-- CRITICAL : We must do this BEFORE adding the new constraint, 
-- because 'admin' is not valid in the new constraint.
UPDATE public.profiles
SET role = 'super_admin'
WHERE role = 'admin';

-- 3. Add the new check constraint with expanded roles
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check
CHECK (role IN ('super_admin', 'minute_keeper', 'minute_editor', 'member'));
