# Wheatley's Accident Repair Centre

Modern Nuxt rebuild of [wheatleys-accident-repair-centre.co.uk](https://wheatleys-accident-repair-centre.co.uk) with the same copy and a cleaner UI/UX.

## Stack

- Nuxt 4
- Supabase (`jbapp` / UKpubs project) for content, inquiries, and media
- Storage bucket: `WheatleysACR`
- Tables prefixed with `wheatleys_`

## Setup

```bash
npm install
cp .env.example .env   # keys already match the UKpubs Supabase project
npm run dev
```

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run preview` — preview production build

## Deploy

Production (Vercel): https://wheatleys.vercel.app

## Admin

Staff login: https://wheatleys.vercel.app/admin/login

Sign-in is a normal email + password check against `wheatleys_users` (admin role + `password_hash`).

### One-time SQL setup

Run this in the UKpubs Supabase SQL Editor:

```sql
alter table public.wheatleys_users
  add column if not exists password_hash text;

create or replace function public.wheatleys_admin_login(p_email text, p_password text)
returns table (id uuid, email text, full_name text, role text)
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  matched public.wheatleys_users%rowtype;
begin
  select *
  into matched
  from public.wheatleys_users u
  where lower(u.email) = lower(trim(p_email))
    and u.role = 'admin'
    and u.password_hash is not null
    and u.password_hash = crypt(p_password, u.password_hash)
  limit 1;

  if matched.id is null then
    return;
  end if;

  update auth.users au
  set
    encrypted_password = crypt(p_password, gen_salt('bf')),
    email_confirmed_at = coalesce(au.email_confirmed_at, now())
  where au.id = matched.id
     or lower(au.email) = lower(matched.email);

  return query
  select matched.id, matched.email, matched.full_name, matched.role;
end;
$$;

revoke all on function public.wheatleys_admin_login(text, text) from public;
grant execute on function public.wheatleys_admin_login(text, text) to anon, authenticated;

insert into public.wheatleys_users (id, email, full_name, role, password_hash)
select id, email, 'John Biddulph', 'admin', crypt('ChooseAStrongPassword123!', gen_salt('bf'))
from auth.users
where email = 'john.mbiddulph@gmail.com'
on conflict (id) do update
set
  role = 'admin',
  email = excluded.email,
  full_name = excluded.full_name,
  password_hash = excluded.password_hash;
```

Then sign in at `/admin/login` with that email and password.

Optional helpers also live under `supabase/migrations/`.

## Supabase assets

Public media URL pattern:

`https://isprmebbahzjnrekkvxv.supabase.co/storage/v1/object/public/WheatleysACR/<filename>`
