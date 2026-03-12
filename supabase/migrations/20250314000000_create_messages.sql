-- Chat messages for rooms
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  room_id text not null references public.rooms(id) on delete cascade,
  user_id uuid references auth.users on delete set null,
  nickname text not null,
  content text not null,
  created_at timestamptz default now() not null
);

create index messages_room_id_idx on public.messages(room_id);
create index messages_room_created_idx on public.messages(room_id, created_at);

-- RLS
alter table public.messages enable row level security;

-- Anyone can read messages in a room
create policy "Messages are viewable by everyone"
  on public.messages for select
  using (true);

-- Anyone can send messages
create policy "Anyone can send messages"
  on public.messages for insert
  with check (true);

-- Enable Realtime for messages
alter publication supabase_realtime add table public.messages;
