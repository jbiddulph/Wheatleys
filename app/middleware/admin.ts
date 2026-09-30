export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  if (to.path === '/admin/login') return

  const { isAuthenticated, ready, loading, refresh } = useAuth()
  const { requireAdmin } = useAdminAuth()

  if (!ready.value) {
    await refresh()
  }

  if (loading.value) {
    await new Promise<void>((resolve) => {
      const tick = () => {
        if (!loading.value) resolve()
        else setTimeout(tick, 40)
      }
      tick()
    })
  }

  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/admin/login',
      query: { redirect: to.fullPath },
    })
  }

  const ok = await requireAdmin()
  if (!ok) {
    return navigateTo({
      path: '/admin/login',
      query: { error: 'not-admin' },
    })
  }
})
