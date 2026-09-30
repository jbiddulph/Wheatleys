<script setup lang="ts">
const route = useRoute()
const { signOut } = useAuth()
const { storageUrl } = useStorageUrl()

const links = [
  { to: '/admin', label: 'Dashboard', exact: true },
  { to: '/admin/inquiries', label: 'Inquiries' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/services', label: 'Services' },
]

function isActive(link: (typeof links)[number]) {
  if (link.exact) return route.path === link.to
  return route.path === link.to || route.path.startsWith(`${link.to}/`)
}

async function logout() {
  await signOut()
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="admin-shell">
    <header class="admin-top">
      <div class="admin-brand">
        <img
          :src="storageUrl('wheatleys_logo_CMYK.png')"
          alt="Wheatley's"
          class="admin-logo"
        />
        <div>
          <p class="admin-eyebrow">Wheatley’s</p>
          <h1>Admin</h1>
        </div>
      </div>

      <nav class="admin-nav" aria-label="Admin">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="admin-nav-link"
          :class="{ active: isActive(link) }"
        >
          {{ link.label }}
        </NuxtLink>
        <NuxtLink to="/" class="admin-nav-link muted">View site</NuxtLink>
        <button type="button" class="admin-nav-link logout" @click="logout">
          Sign out
        </button>
      </nav>
    </header>

    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background:
    radial-gradient(900px 420px at 0% 0%, rgba(101, 188, 123, 0.16), transparent 55%),
    linear-gradient(180deg, #f4f8f5 0%, #eef3ef 100%);
}

.admin-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--charcoal-deep);
  color: var(--white);
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.admin-logo {
  width: 52px;
  height: 52px;
  object-fit: contain;
  background: var(--white);
  border-radius: 10px;
  padding: 0.35rem;
}

.admin-eyebrow {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.admin-brand h1 {
  margin: 0.1rem 0 0;
  color: var(--white);
  font-size: 1.55rem;
}

.admin-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.admin-nav-link {
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.72);
  padding: 0.55rem 0.85rem;
  border-radius: 999px;
  font: inherit;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
}

.admin-nav-link:hover,
.admin-nav-link.active {
  background: rgba(255, 255, 255, 0.12);
  color: var(--white);
}

.admin-nav-link.muted {
  color: rgba(255, 255, 255, 0.45);
}

.admin-nav-link.logout {
  color: #f0c9a8;
}

.admin-main {
  width: min(100% - 2rem, 1100px);
  margin: 0 auto;
  padding: 1.75rem 0 3rem;
}
</style>
