import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function useSupabase() {
  const config = useRuntimeConfig()

  if (!client) {
    client = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey,
    )
  }

  return client
}
