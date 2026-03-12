-- Queue items for room playback
create table public.queue_items (
  id uuid primary key default gen_random_uuid(),
  room_id text not null references public.rooms(id) on delete cascade,
  title text not null,
  src text not null,
  position integer not null default 0,
  added_by uuid references auth.users on delete set null,
  created_at timestamptz default now() not null
);

create index queue_items_room_id_idx on public.queue_items(room_id);
create index queue_items_room_position_idx on public.queue_items(room_id, position);

-- RLS
alter table public.queue_items enable row level security;

-- Anyone can read queue items (to view the queue)
create policy "Queue items are viewable by everyone"
  on public.queue_items for select
  using (true);

-- Anyone can add to queue (room members)
create policy "Anyone can add to queue"
  on public.queue_items for insert
  with check (true);

-- Function to set position on insert (append to end)
create or replace function public.queue_items_set_position()
returns trigger as $$
begin
  new.position := coalesce((select max(position) + 1 from public.queue_items where room_id = new.room_id), 0);
  return new;
end;
$$ language plpgsql;

create trigger queue_items_before_insert
  before insert on public.queue_items
  for each row execute procedure public.queue_items_set_position();

-- Enable Realtime for queue_items
alter publication supabase_realtime add table public.queue_items;
