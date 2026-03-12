# Supabase Setup

## Run migrations

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Lumière project
3. Go to **SQL Editor** → **New query**
4. Run each migration in order:

- `migrations/20250311000000_create_profiles.sql` — profiles table + signup trigger
- `migrations/20250311000001_fix_profiles_username_trigger.sql` — username handling
- `migrations/20250312000000_create_rooms.sql` — rooms table
- `migrations/20250313000000_create_queue_items.sql` — queue items + Realtime
- `migrations/20250314000000_create_messages.sql` — chat messages + Realtime
