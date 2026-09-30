<script setup lang="ts">
definePageMeta({
  layout: false,
})

useSeoMeta({
  title: "Reset password | Wheatley's Admin",
  robots: 'noindex, nofollow',
})

const { storageUrl } = useStorageUrl()
const { updatePassword, refresh, ready, isAuthenticated, signOut } = useAuth()
const { refreshAdmin } = useAdminAuth()

const password = ref('')
const confirm = ref('')
const loading = ref(false)
const errorMsg = ref('')
const infoMsg = ref('')
const linkReady = ref(false)

onMounted(async () => {
  // Recovery links land with tokens in the URL hash; Supabase client parses them.
  if (!ready.value) await refresh()
  // Give the auth client a moment to exchange the recovery hash.
  await new Promise((r) => setTimeout(r, 250))
  if (!ready.value) await refresh()
  linkReady.value = isAuthenticated.value
  if (!linkReady.value) {
    errorMsg.value =
      'Open this page from the password reset email link. If the link expired, request a new one from the login page.'
  }
})

async function submit() {
  errorMsg.value = ''
  infoMsg.value = ''
  if (password.value.length < 8) {
    errorMsg.value = 'Use a password of at least 8 characters.'
    return
  }
  if (password.value !== confirm.value) {
    errorMsg.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  try {
    await updatePassword(password.value)
    const ok = await refreshAdmin()
    infoMsg.value = 'Password updated.'
    if (ok) {
      await navigateTo('/admin')
    } else {
      await signOut()
      await navigateTo('/admin/login')
    }
  } catch (err: unknown) {
    errorMsg.value =
      err instanceof Error ? err.message : 'Could not update password.'
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
        <p>Choose a new password for your staff account.</p>
      </div>
    </div>

    <main class="login-panel">
      <form class="login-card reveal" @submit.prevent="submit">
        <p class="section-label">Staff access</p>
        <h2>Reset password</h2>
        <p class="lede">Set a new password, then sign in to the admin area.</p>

        <p v-if="errorMsg" class="error" role="alert">{{ errorMsg }}</p>
        <p v-if="infoMsg" class="info" role="status">{{ infoMsg }}</p>

        <label>
          New password
          <input
            v-model="password"
            type="password"
            name="password"
            autocomplete="new-password"
            required
            minlength="8"
            :disabled="loading || !linkReady"
          />
        </label>

        <label>
          Confirm password
          <input
            v-model="confirm"
            type="password"
            name="confirm"
            autocomplete="new-password"
            required
            minlength="8"
            :disabled="loading || !linkReady"
          />
        </label>

        <button class="btn btn-primary" type="submit" :disabled="loading || !linkReady">
          {{ loading ? 'Saving…' : 'Save password' }}
        </button>

        <NuxtLink to="/admin/login" class="back-link">← Back to sign in</NuxtLink>
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
}
.login-brand h1 {
  color: var(--white);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  margin-bottom: 0.7rem;
}
.login-brand p:last-child {
  color: rgba(255, 255, 255, 0.78);
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
  box-shadow: 0 18px 50px rgba(31, 42, 36, 0.08);
}
.login-card h2 { font-size: 2.4rem; }
.lede { color: var(--muted); }
label {
  display: grid;
  gap: 0.4rem;
  font-size: 0.92rem;
  font-weight: 600;
}
input {
  width: 100%;
  min-height: 2.9rem;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 0.7rem 0.9rem;
  background: var(--white);
}
.error, .info {
  margin: 0;
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  font-size: 0.92rem;
}
.error { background: #fdecec; color: #9b2f2f; }
.info { background: #e8f6ec; color: #256b3b; }
.btn { width: 100%; }
.back-link {
  text-align: center;
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 600;
}
@media (max-width: 900px) {
  .login-page { grid-template-columns: 1fr; }
  .login-media { min-height: 38vh; }
}
</style>
