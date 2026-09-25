-- Higgsfield backend: profiles, credits ledger, Stripe transactions.
--
-- Security model:
--   * RLS on every table. Users read only their own rows; admins read all.
--   * No client-side INSERT/UPDATE policies. Credits, role and billing
--     fields change only through the security-definer functions below,
--     which are executable by service_role only (i.e. our server).

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  provider text not null default 'email',
  role text not null default 'user' check (role in ('user', 'admin')),
  credits integer not null default 0 check (credits >= 0),
  plan_id text,
  plan_interval text check (plan_interval in ('monthly', 'annual')),
  subscription_status text,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_email_idx on public.profiles (email);
create index profiles_created_at_idx on public.profiles (created_at desc);

create table public.credit_ledger (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  delta integer not null,
  reason text not null check (reason in ('signup', 'purchase', 'generation', 'refund', 'admin')),
  ref text not null,
  created_at timestamptz not null default now(),
  -- One debit per job, one refund per job, one grant per payment.
  unique (reason, ref)
);

create index credit_ledger_user_idx on public.credit_ledger (user_id, created_at desc);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  -- Stripe invoice id (subscriptions) or checkout session id (credit packs).
  -- Unique so webhook retries can't record the same payment twice.
  stripe_object_id text not null unique,
  stripe_event_id text not null,
  stripe_customer_id text,
  kind text not null check (kind in ('subscription', 'renewal', 'credit_pack')),
  plan_id text,
  plan_interval text,
  amount integer not null,
  currency text not null,
  credits_granted integer not null default 0,
  customer_email text,
  created_at timestamptz not null default now()
);

create index transactions_created_at_idx on public.transactions (created_at desc);
create index transactions_user_idx on public.transactions (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- New auth user → profile with the signup bonus, recorded in the ledger.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  signup_bonus constant integer := 120;
begin
  insert into public.profiles (id, email, full_name, avatar_url, provider, credits)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    coalesce(new.raw_app_meta_data ->> 'provider', 'email'),
    signup_bonus
  );
  insert into public.credit_ledger (user_id, delta, reason, ref)
  values (new.id, signup_bonus, 'signup', new.id::text);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Credit operations (service_role only)
-- ---------------------------------------------------------------------------

-- Debit credits for a generation job. Atomic: fails if the balance is short.
create or replace function public.spend_credits(p_user uuid, p_amount integer, p_ref text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_balance integer;
begin
  if p_amount <= 0 then
    raise exception 'invalid_amount';
  end if;

  update public.profiles
     set credits = credits - p_amount
   where id = p_user and credits >= p_amount
  returning credits into new_balance;

  if new_balance is null then
    raise exception 'insufficient_credits';
  end if;

  -- unique (reason, ref) rejects a second debit for the same job, rolling
  -- back the update above.
  insert into public.credit_ledger (user_id, delta, reason, ref)
  values (p_user, -p_amount, 'generation', p_ref);

  return new_balance;
end;
$$;

-- Refund a cancelled job: exactly the amount it was charged, at most once.
create or replace function public.refund_credits(p_user uuid, p_ref text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  charged integer;
  new_balance integer;
begin
  select -delta into charged
    from public.credit_ledger
   where user_id = p_user and reason = 'generation' and ref = p_ref;

  if charged is null then
    raise exception 'unknown_job';
  end if;

  insert into public.credit_ledger (user_id, delta, reason, ref)
  values (p_user, charged, 'refund', p_ref)
  on conflict (reason, ref) do nothing;

  if not found then
    -- Already refunded: report the current balance, change nothing.
    select credits into new_balance from public.profiles where id = p_user;
    return new_balance;
  end if;

  update public.profiles set credits = credits + charged
   where id = p_user
  returning credits into new_balance;

  return new_balance;
end;
$$;

-- Grant credits for a payment or an admin adjustment. Idempotent per ref.
-- Returns the new balance, or null if this ref was already applied.
create or replace function public.grant_credits(p_user uuid, p_amount integer, p_reason text, p_ref text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_balance integer;
begin
  if p_reason not in ('purchase', 'admin') then
    raise exception 'invalid_reason';
  end if;

  insert into public.credit_ledger (user_id, delta, reason, ref)
  values (p_user, p_amount, p_reason, p_ref)
  on conflict (reason, ref) do nothing;

  if not found then
    return null;
  end if;

  update public.profiles
     set credits = greatest(0, credits + p_amount)
   where id = p_user
  returning credits into new_balance;

  return new_balance;
end;
$$;

revoke all on function public.spend_credits(uuid, integer, text) from public, anon, authenticated;
revoke all on function public.refund_credits(uuid, text) from public, anon, authenticated;
revoke all on function public.grant_credits(uuid, integer, text, text) from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.spend_credits(uuid, integer, text) to service_role;
grant execute on function public.refund_credits(uuid, text) to service_role;
grant execute on function public.grant_credits(uuid, integer, text, text) to service_role;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.transactions enable row level security;

create policy "profiles: read own or admin"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

create policy "ledger: read own or admin"
  on public.credit_ledger for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "transactions: read own or admin"
  on public.transactions for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

-- Clients never write these tables directly.
revoke insert, update, delete on public.profiles from anon, authenticated;
revoke insert, update, delete on public.credit_ledger from anon, authenticated;
revoke insert, update, delete on public.transactions from anon, authenticated;
