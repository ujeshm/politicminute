-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  role text check (role in ('admin', 'member')) default 'member',
  avatar_url text,
  updated_at timestamp with time zone
);

-- Turn on Row Level Security for profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for minutes
create table minutes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  meeting_date date not null,
  meeting_time time without time zone,
  title text not null,
  attendees text[], -- Array of names or user IDs
  agenda text,
  discussion text,
  decisions text,
  action_items jsonb, -- Stores action items as structured data
  author_id uuid references profiles(id) not null
);

-- Turn on Row Level Security for minutes
alter table minutes enable row level security;

-- Policy: Everyone can read minutes (or restrict to members if needed)
create policy "Minutes are viewable by authenticated users." on minutes
  for select using (auth.role() = 'authenticated');

-- Policy: Only members/admins can create minutes
-- Policy: Restricted creation (Super Admin, Keeper, Editor)
create policy "Authorized users can insert minutes." on minutes
  for insert with check (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'minute_keeper', 'minute_editor')
    )
  );

-- Policy: Super Admins can delete minutes
create policy "Super Admins can delete minutes." on minutes
  for delete using (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Policy: Authors or Admins can update minutes (Simplified: Authors only for now)
create policy "Authors can update their own minutes." on minutes
  for update using (auth.uid() = author_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'member');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
