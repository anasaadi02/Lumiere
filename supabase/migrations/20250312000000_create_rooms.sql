-- Rooms table for screening rooms
create table public.rooms (
  id text primary key,
  name text not null,
  password_hash text,
  created_by uuid references auth.users on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  max_members integer,
  current_video_src text,
  current_video_title text
);

-- RLS
alter table public.rooms enable row level security;

-- Anyone can read rooms (to join)
create policy "Rooms are viewable by everyone"
  on public.rooms for select
  using (true);

-- Anyone (including guests) can create rooms
create policy "Anyone can create rooms"
  on public.rooms for insert
  with check (true);

-- Room creator can update their room; guests (created_by null) have no updater
create policy "Creators can update own room"
  on public.rooms for update
  using (auth.uid() = created_by);
