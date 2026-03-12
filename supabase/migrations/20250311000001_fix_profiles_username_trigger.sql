-- Fix: ensure username from raw_user_meta_data is used correctly
-- Handles empty strings and improves fallback to email prefix
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'username'), ''),
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$ language plpgsql security definer;

-- Allow users to insert/update their own profile (for signup flow)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);
