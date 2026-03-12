# Supabase Setup

## Run the profiles migration

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Lumière project
3. Go to **SQL Editor** → **New query**
4. Copy the contents of `migrations/20250311000000_create_profiles.sql`
5. Paste and click **Run**

This creates the `profiles` table and a trigger that auto-creates a profile when a user signs up.
