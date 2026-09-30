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

Admin access uses Supabase Auth plus `wheatleys_users.role = 'admin'` (checked via `is_wheatleys_admin()`).

1. Create the user under Authentication in the UKpubs Supabase project
2. Promote them in SQL:

```sql
insert into public.wheatleys_users (id, email, full_name, role)
values ('AUTH_USER_UUID', 'you@example.com', 'Your Name', 'admin')
on conflict (id) do update
set role = 'admin', email = excluded.email, full_name = excluded.full_name;
```

Optional policy helpers live in `supabase/migrations/20260930120000_wheatleys_admin.sql`.

## Supabase assets

Public media URL pattern:

`https://isprmebbahzjnrekkvxv.supabase.co/storage/v1/object/public/WheatleysACR/<filename>`
