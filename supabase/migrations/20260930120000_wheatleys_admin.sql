-- Wheatleys admin bootstrap helpers.
-- Run in the UKpubs Supabase SQL editor if admin access is not yet wired.
-- Existing projects may already have is_wheatleys_admin().

create table if not exists public.wheatleys_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_wheatleys_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.wheatleys_users u
    where u.id = auth.uid()
      and u.role = 'admin'
  );
$$;

revoke all on function public.is_wheatleys_admin() from public;
grant execute on function public.is_wheatleys_admin() to anon, authenticated;

alter table public.wheatleys_users enable row level security;
alter table public.wheatleys_reviews enable row level security;
alter table public.wheatleys_gallery enable row level security;
alter table public.wheatleys_services enable row level security;
alter table public.wheatleys_inquiries enable row level security;

-- Admins can read their own user row (and all rows if they are admin).
drop policy if exists wheatleys_users_select_admin on public.wheatleys_users;
create policy wheatleys_users_select_admin
  on public.wheatleys_users
  for select
  to authenticated
  using (public.is_wheatleys_admin() or id = auth.uid());

-- Public read for published site content.
drop policy if exists wheatleys_reviews_public_read on public.wheatleys_reviews;
create policy wheatleys_reviews_public_read
  on public.wheatleys_reviews
  for select
  to anon, authenticated
  using (published = true or public.is_wheatleys_admin());

drop policy if exists wheatleys_gallery_public_read on public.wheatleys_gallery;
create policy wheatleys_gallery_public_read
  on public.wheatleys_gallery
  for select
  to anon, authenticated
  using (true);

drop policy if exists wheatleys_services_public_read on public.wheatleys_services;
create policy wheatleys_services_public_read
  on public.wheatleys_services
  for select
  to anon, authenticated
  using (true);

-- Public can submit inquiries; only admins can read them.
drop policy if exists wheatleys_inquiries_public_insert on public.wheatleys_inquiries;
create policy wheatleys_inquiries_public_insert
  on public.wheatleys_inquiries
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists wheatleys_inquiries_admin_read on public.wheatleys_inquiries;
create policy wheatleys_inquiries_admin_read
  on public.wheatleys_inquiries
  for select
  to authenticated
  using (public.is_wheatleys_admin());

-- Admin write access for content tables.
drop policy if exists wheatleys_reviews_admin_write on public.wheatleys_reviews;
create policy wheatleys_reviews_admin_write
  on public.wheatleys_reviews
  for all
  to authenticated
  using (public.is_wheatleys_admin())
  with check (public.is_wheatleys_admin());

drop policy if exists wheatleys_gallery_admin_write on public.wheatleys_gallery;
create policy wheatleys_gallery_admin_write
  on public.wheatleys_gallery
  for all
  to authenticated
  using (public.is_wheatleys_admin())
  with check (public.is_wheatleys_admin());

drop policy if exists wheatleys_services_admin_write on public.wheatleys_services;
create policy wheatleys_services_admin_write
  on public.wheatleys_services
  for all
  to authenticated
  using (public.is_wheatleys_admin())
  with check (public.is_wheatleys_admin());

drop policy if exists wheatleys_inquiries_admin_delete on public.wheatleys_inquiries;
create policy wheatleys_inquiries_admin_delete
  on public.wheatleys_inquiries
  for delete
  to authenticated
  using (public.is_wheatleys_admin());

-- Promote the first admin after creating the Auth user in the Supabase dashboard:
-- insert into public.wheatleys_users (id, email, full_name, role)
-- values ('AUTH_USER_UUID', 'you@example.com', 'Your Name', 'admin')
-- on conflict (id) do update set role = 'admin', email = excluded.email;
