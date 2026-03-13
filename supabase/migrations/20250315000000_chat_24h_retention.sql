-- Delete messages older than 24 hours to optimize storage
create or replace function public.delete_messages_older_than_24h()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.messages
  where created_at < now() - interval '24 hours';
$$;

-- Allow anon/authenticated to invoke (called from app when room loads)
grant execute on function public.delete_messages_older_than_24h() to anon;
grant execute on function public.delete_messages_older_than_24h() to authenticated;
