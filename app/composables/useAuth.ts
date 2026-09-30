import type { Session, User } from '@supabase/supabase-js'

const session = ref<Session | null>(null)
const user = ref<User | null>(null)
const loading = ref(true)
const ready = ref(false)
let subscribed = false

export function useAuth() {
  const supabase = useSupabase()

  async function refresh() {
    loading.value = true
    try {
      const { data } = await supabase.auth.getSession()
      session.value = data.session
      user.value = data.session?.user ?? null
    } finally {
      loading.value = false
      ready.value = true
    }
  }

  function ensureListener() {
    if (subscribed || !import.meta.client) return
    subscribed = true
    supabase.auth.onAuthStateChange((_event, next) => {
      session.value = next
      user.value = next?.user ?? null
      loading.value = false
      ready.value = true
    })
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    session.value = data.session
    user.value = data.user
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    session.value = null
    user.value = null
  }

  ensureListener()
  if (import.meta.client && !ready.value) {
    void refresh()
  }

  return {
    session,
    user,
    loading,
    ready,
    isAuthenticated: computed(() => !!session.value),
    refresh,
    signIn,
    signOut,
  }
}
