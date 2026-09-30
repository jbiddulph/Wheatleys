import type { User } from '@supabase/supabase-js'

type AdminProfile = {
  id: string
  email: string
  full_name: string | null
  role: string
}

const sessionUser = ref<User | null>(null)
const profile = ref<AdminProfile | null>(null)
const loading = ref(true)
const ready = ref(false)
let subscribed = false

export function useAuth() {
  const supabase = useSupabase()

  async function refresh() {
    loading.value = true
    try {
      const { data } = await supabase.auth.getSession()
      sessionUser.value = data.session?.user ?? null
    } finally {
      loading.value = false
      ready.value = true
    }
  }

  function ensureListener() {
    if (subscribed || !import.meta.client) return
    subscribed = true
    supabase.auth.onAuthStateChange((_event, next) => {
      sessionUser.value = next?.user ?? null
      loading.value = false
      ready.value = true
    })
  }

  /**
   * Email/password against wheatleys_users (via RPC), then open a normal
   * Supabase session so existing admin RLS continues to work.
   */
  async function signIn(email: string, password: string) {
    const trimmed = email.trim().toLowerCase()
    const { data: rows, error: loginError } = await supabase.rpc(
      'wheatleys_admin_login',
      {
        p_email: trimmed,
        p_password: password,
      },
    )

    if (loginError) throw loginError

    const row = Array.isArray(rows) ? rows[0] : rows
    if (!row?.id) {
      throw new Error('Invalid login credentials')
    }

    profile.value = {
      id: row.id,
      email: row.email,
      full_name: row.full_name,
      role: row.role,
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: row.email || trimmed,
      password,
    })
    if (error) throw error

    sessionUser.value = data.user
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    sessionUser.value = null
    profile.value = null
  }

  ensureListener()
  if (import.meta.client && !ready.value) {
    void refresh()
  }

  return {
    user: sessionUser,
    profile,
    loading,
    ready,
    isAuthenticated: computed(() => !!sessionUser.value),
    refresh,
    signIn,
    signOut,
  }
}
