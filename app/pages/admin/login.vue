<script setup lang="ts">
definePageMeta({
  layout: false,
})

useSeoMeta({
  title: "Admin login | Wheatley's Accident Repair Centre",
  robots: 'noindex, nofollow',
})

const route = useRoute()
const { storageUrl } = useStorageUrl()
const { signIn, signOut, isAuthenticated, refresh, ready } = useAuth()
const { requireAdmin, refreshAdmin } = useAdminAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

if (route.query.error === 'not-admin') {
  errorMsg.value = 'Your account is signed in but is not an admin.'
}

onMounted(async () => {
  if (!ready.value) await refresh()
  if (isAuthenticated.value) {
    const ok = await requireAdmin()
    if (ok) {
      await navigateTo((route.query.redirect as string) || '/admin')
    }
  }
})

async function submit() {
  errorMsg.value = ''
  loading.value = true
  try {
    await signIn(email.value.trim(), password.value)
    const ok = await refreshAdmin()
    if (!ok) {
      await signOut()
      errorMsg.value = 'This account does not have admin access.'
      return
    }
    await navigateTo((route.query.redirect as string) || '/admin')
  } catch (err: unknown) {
    errorMsg.value =
      err instanceof Error ? err.message : 'Unable to sign in. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-media" aria-hidden="true">
      <img :src="storageUrl('instagram_workshop_2.jpg')" alt="" />
      <div class="login-scrim" />
      <div class="login-brand reveal">
        <p class="brand-mark">Wheatley’s</p>
        <h1>Admin</h1>
        <p>Manage inquiries, reviews, gallery, and services.</p>
      </div>
    </div>

    <main class="login-panel">
      <form class="login-card reveal" @submit.prevent="submit">
        <p class="section-label">Staff access</p>
        <h2>Sign in</h2>
        <p class="lede">Sign in with your Wheatley’s admin email and password.</p>

        <p v-if="errorMsg" class="error" role="alert">{{ errorMsg }}</p>

        <label>
          Email
          <input
            v-model="email"
            type="email"
            name="email"
            autocomplete="username"
            required
            :disabled="loading"
          />
        </label>

        <label>
          Password
          <input
            v-model="password"
            type="password"
            name="password"
            autocomplete="current-password"
            required
            :disabled="loading"
          />
        </label>

        <button class="btn btn-primary" type="submit" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>

        <NuxtLink to="/" class="back-link">← Back to website</NuxtLink>
      </form>
    </main>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
}

.login-media {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: var(--charcoal-deep);
}

.login-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.04);
}

.login-scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(160deg, rgba(22, 32, 27, 0.55), rgba(22, 32, 27, 0.82)),
    linear-gradient(0deg, rgba(22, 32, 27, 0.55), transparent 45%);
}

.login-brand {
  position: absolute;
  left: clamp(1.5rem, 4vw, 3rem);
  bottom: clamp(1.5rem, 5vw, 3.5rem);
  z-index: 1;
  color: var(--white);
  max-width: 18rem;
}

.brand-mark {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 6vw, 4.2rem);
  line-height: 0.9;
  margin: 0 0 0.4rem;
  letter-spacing: 0.02em;
}

.login-brand h1 {
  color: var(--white);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  margin-bottom: 0.7rem;
}

.login-brand p:last-child {
  color: rgba(255, 255, 255, 0.78);
  max-width: 28ch;
}

.login-panel {
  display: grid;
  place-items: center;
  padding: 2rem 1.25rem;
  background:
    radial-gradient(700px 360px at 100% 0%, rgba(196, 120, 59, 0.12), transparent 55%),
    linear-gradient(180deg, #fbfcfb, #eef5f0);
}

.login-card {
  width: min(100%, 420px);
  display: grid;
  gap: 0.9rem;
  padding: 1.75rem;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(8px);
  box-shadow: 0 18px 50px rgba(31, 42, 36, 0.08);
}

.login-card h2 {
  font-size: 2.4rem;
}

.lede {
  color: var(--muted);
  margin-bottom: 0.35rem;
}

label {
  display: grid;
  gap: 0.4rem;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--charcoal);
}

input {
  width: 100%;
  min-height: 2.9rem;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 0.7rem 0.9rem;
  background: var(--white);
}

input:disabled {
  opacity: 0.65;
}

.error {
  margin: 0;
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  background: #fdecec;
  color: #9b2f2f;
  font-size: 0.92rem;
}

.btn {
  margin-top: 0.35rem;
  width: 100%;
}

.back-link {
  text-align: center;
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 600;
}

.back-link:hover {
  color: var(--copper-deep);
}

@media (max-width: 900px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .login-media {
    min-height: 38vh;
  }

  .login-brand {
    bottom: 1.25rem;
    left: 1.25rem;
  }
}
</style>
