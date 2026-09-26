-- Generation jobs: server-side record of every take, so history is per-user
-- (never shared browser storage) and the job's state decides what can be
-- refunded.
--
-- Lifecycle (all transitions are `where status = 'running'`, so exactly one
-- of them wins a race):
--   start_generation   charge + insert row as 'running'
--   finish_generation  running -> complete (results attached)
--   fail_generation    running -> failed    + refund
--   cancel_generation  running -> cancelled + refund (finished jobs: refused)

create table public.generations (
  id text primary key check (id ~ '^[A-Za-z0-9_-]{6,64}$'),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null check (type in ('image', 'video')),
  model text not null,
  prompt text not null,
  params jsonb not null,
  cost integer not null check (cost > 0),
  status text not null default 'running'
    check (status in ('running', 'complete', 'failed', 'cancelled')),
  -- Who produced the media: real Pollinations output, the scripted video
  -- mock, or demo samples substituted when Pollinations was unavailable.
  provider text not null
    check (provider in ('pollinations', 'pollinations+fallback', 'mock', 'mock-fallback')),
  results jsonb not null default '[]'::jsonb,
  error text,
  -- Mock video jobs complete once this passes (lazily, on the next poll);
  -- a real image job still running well past it has lost its worker.
  due_at timestamptz not null,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index generations_user_idx on public.generations (user_id, created_at desc);
create index generations_created_at_idx on public.generations (created_at desc);
create index generations_running_idx on public.generations (user_id) where status = 'running';

alter table public.generations enable row level security;

create policy "generations: read own or admin"
  on public.generations for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

revoke insert, update, delete on public.generations from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Job transitions (service_role only)
-- ---------------------------------------------------------------------------

-- Charge for a job and record it, in one transaction. Caps concurrent
-- running jobs per user so one account can't flood the image provider.
create or replace function public.start_generation(
  p_user uuid,
  p_id text,
  p_type text,
  p_model text,
  p_prompt text,
  p_params jsonb,
  p_cost integer,
  p_provider text,
  p_due_at timestamptz
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  max_running constant integer := 3;
  running_count integer;
  new_balance integer;
begin
  -- Lock the profile row so two concurrent starts can't both pass the cap.
  perform 1 from public.profiles where id = p_user for update;

  select count(*) into running_count
    from public.generations
   where user_id = p_user and status = 'running';

  if running_count >= max_running then
    raise exception 'too_many_jobs';
  end if;

  new_balance := public.spend_credits(p_user, p_cost, p_id);

  insert into public.generations (id, user_id, type, model, prompt, params, cost, provider, due_at)
  values (p_id, p_user, p_type, p_model, p_prompt, p_params, p_cost, p_provider, p_due_at);

  return new_balance;
end;
$$;

-- Attach results. Returns false if the job stopped running meanwhile
-- (cancelled or failed), so the caller can discard what it produced.
create or replace function public.finish_generation(p_id text, p_results jsonb, p_provider text default null)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.generations
     set status = 'complete',
         results = p_results,
         provider = coalesce(p_provider, provider),
         completed_at = now()
   where id = p_id and status = 'running';
  return found;
end;
$$;

-- Mark a running job failed and refund it. Returns the new balance, or null
-- if the job was no longer running (nothing changed).
create or replace function public.fail_generation(p_id text, p_error text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner uuid;
begin
  update public.generations
     set status = 'failed', error = left(p_error, 500), completed_at = now()
   where id = p_id and status = 'running'
  returning user_id into owner;

  if owner is null then
    return null;
  end if;

  return public.refund_credits(owner, p_id);
end;
$$;

-- User-initiated cancel: refunds only a job that is still running.
create or replace function public.cancel_generation(p_user uuid, p_id text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner uuid;
begin
  update public.generations
     set status = 'cancelled', completed_at = now()
   where id = p_id and user_id = p_user and status = 'running'
  returning user_id into owner;

  if owner is null then
    if exists (select 1 from public.generations where id = p_id and user_id = p_user) then
      raise exception 'not_cancellable';
    end if;
    raise exception 'unknown_job';
  end if;

  return public.refund_credits(p_user, p_id);
end;
$$;

revoke all on function public.start_generation(uuid, text, text, text, text, jsonb, integer, text, timestamptz)
  from public, anon, authenticated;
revoke all on function public.finish_generation(text, jsonb, text) from public, anon, authenticated;
revoke all on function public.fail_generation(text, text) from public, anon, authenticated;
revoke all on function public.cancel_generation(uuid, text) from public, anon, authenticated;
grant execute on function public.start_generation(uuid, text, text, text, text, jsonb, integer, text, timestamptz)
  to service_role;
grant execute on function public.finish_generation(text, jsonb, text) to service_role;
grant execute on function public.fail_generation(text, text) to service_role;
grant execute on function public.cancel_generation(uuid, text) to service_role;

-- ---------------------------------------------------------------------------
-- Storage: generated images. Public read (paths are {user}/{job}/{i}.jpg with
-- unguessable ids); only the server (service role) writes.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('generations', 'generations', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
