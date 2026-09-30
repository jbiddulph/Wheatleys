const isAdmin = ref(false)
const checked = ref(false)
const checking = ref(false)

export function useAdminAuth() {
  const supabase = useSupabase()
  const { user, isAuthenticated, ready, loading: authLoading } = useAuth()

  async function refreshAdmin() {
    checking.value = true
    try {
      if (!isAuthenticated.value || !user.value) {
        isAdmin.value = false
        return false
      }

      const { data, error } = await supabase.rpc('is_wheatleys_admin')
      if (error) {
        console.error('is_wheatleys_admin failed', error)
        isAdmin.value = false
        return false
      }

      isAdmin.value = data === true
      return isAdmin.value
    } finally {
      checked.value = true
      checking.value = false
    }
  }

  async function requireAdmin() {
    if (!ready.value || authLoading.value) {
      await untilReady()
    }
    if (!isAuthenticated.value) return false
    if (checked.value && isAdmin.value) return true
    return refreshAdmin()
  }

  async function untilReady() {
    if (ready.value && !authLoading.value) return
    await new Promise<void>((resolve) => {
      const tick = () => {
        if (ready.value && !authLoading.value) resolve()
        else setTimeout(tick, 40)
      }
      tick()
    })
  }

  return {
    isAdmin,
    checked,
    checking,
    refreshAdmin,
    requireAdmin,
  }
}
