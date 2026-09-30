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

## Supabase assets

Public media URL pattern:

`https://isprmebbahzjnrekkvxv.supabase.co/storage/v1/object/public/WheatleysACR/<filename>`
