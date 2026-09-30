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

**Important:** logging into the Supabase Dashboard is separate from logging into the Wheatleys app. The app uses **Authentication → Users** in the UKpubs project (`isprmebbahzjnrekkvxv`), not your dashboard password.

### One-time setup

1. Confirm your Auth user exists (Authentication → Users). Email `john.mbiddulph@gmail.com` already does.
2. Promote that user to admin in the SQL Editor:

```sql
insert into public.wheatleys_users (id, email, full_name, role)
select id, email, 'John Biddulph', 'admin'
from auth.users
where email = 'john.mbiddulph@gmail.com'
on conflict (id) do update
set role = 'admin',
    email = excluded.email,
    full_name = excluded.full_name;
```

3. Set an **app password** (dashboard password will not work). Either:
   - Use **Continue with Google** on `/admin/login`, or
   - Click **Forgot password?** on `/admin/login`, or
   - Run this in the SQL Editor (pick your own password):

```sql
update auth.users
set
  encrypted_password = crypt('ChooseAStrongPassword123!', gen_salt('bf')),
  email_confirmed_at = coalesce(email_confirmed_at, now())
where email = 'john.mbiddulph@gmail.com';
```

4. In Supabase Auth URL config, allow redirects:
   - `https://wheatleys.vercel.app/**`
   - `http://localhost:3000/**` (local)

Optional policy helpers live in `supabase/migrations/20260930120000_wheatleys_admin.sql`.

## Supabase assets

Public media URL pattern:

`https://isprmebbahzjnrekkvxv.supabase.co/storage/v1/object/public/WheatleysACR/<filename>`
