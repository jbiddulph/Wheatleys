// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: "Wheatley's Accident Repair Centre",
      htmlAttrs: { lang: 'en-GB' },
      meta: [
        {
          name: 'description',
          content:
            "Exceptional vehicle repair and car bodywork restoration in Lancing, West Sussex. Over 70 years of expertise in auto refinishing.",
        },
        { name: 'theme-color', content: '#0c265d' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Anton&family=Outfit:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
      storageBucket: process.env.NUXT_PUBLIC_STORAGE_BUCKET || 'WheatleysACR',
    },
  },
})
