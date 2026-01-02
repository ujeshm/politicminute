-- Instructions: Run this script in your Supabase SQL Editor to create a Super Admin user.
-- NOTE: Requires the `pgcrypto` extension for password hashing. Supabase usually has this enabled by default.

-- 1. Enable pgcrypto if not already
create extension if not exists "pgcrypto";

-- 2. Insert into auth.users and profiles
DO $$
DECLARE
  -- CHANGE THESE VALUES
  user_email text := 'admin@alpas.com.np'; 
  user_password text := 'admin123';
  user_name text := 'Super Admin';
  
  -- Internal variables
  new_uid uuid := gen_random_uuid();
BEGIN
  -- Insert user into auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  VALUES (
    new_uid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    user_email,
    crypt(user_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('full_name', user_name),
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  -- Insert into profiles or update if trigger already created it
  -- The trigger 'on_auth_user_created' might create a member profile automatically.
  -- We want to ensure this user is an admin.
  
  -- Attempt to update first (in case trigger fired)
  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = new_uid;
  
  -- If no row was updated (trigger didn't fire), insert manually
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (new_uid, user_email, user_name, 'admin');
  END IF;
  
  RAISE NOTICE 'Superadmin created successfully: %', user_email;

END $$;
