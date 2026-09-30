<script setup lang="ts">
import { business, navLinks } from '~/utils/site'

const { storageUrl } = useStorageUrl()
const open = ref(false)
const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    open.value = false
  },
)
</script>

<template>
  <header class="header">
    <div class="page-shell header-inner">
      <NuxtLink to="/" class="brand" aria-label="Wheatley's home">
        <img
          :src="storageUrl('wheatleys_logo_CMYK.png')"
          alt="Wheatley's Accident Repair Centre"
          class="brand-logo"
          width="180"
          height="50"
        />
      </NuxtLink>

      <nav class="desktop-nav" aria-label="Primary">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <a :href="`tel:${business.phoneTel}`" class="phone-pill">
        {{ business.phone }}
      </a>

      <button
        class="menu-btn"
        type="button"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        @click="open = !open"
      >
        <span />
        <span />
      </button>
    </div>

    <div v-if="open" id="mobile-nav" class="mobile-nav page-shell">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="mobile-link"
      >
        {{ link.label }}
      </NuxtLink>
      <a :href="`tel:${business.phoneTel}`" class="btn btn-primary">
        Call {{ business.phone }}
      </a>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(14px);
  background: rgba(12, 14, 17, 0.78);
  border-bottom: 1px solid var(--line);
}

.header-inner {
  min-height: 4.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  margin-right: auto;
}

.brand-logo {
  width: clamp(140px, 22vw, 180px);
  height: auto;
  filter: brightness(1.05);
}

.desktop-nav {
  display: none;
  gap: 1.35rem;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--fog);
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--mist);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.45rem;
  height: 2px;
  background: var(--amber);
  transform-origin: left;
  animation: sweep 0.45s var(--ease);
}

.phone-pill {
  display: none;
  padding: 0.55rem 0.95rem;
  border-radius: 999px;
  border: 1px solid rgba(232, 163, 23, 0.45);
  color: var(--amber-bright);
  font-weight: 600;
  font-size: 0.92rem;
}

.menu-btn {
  width: 2.6rem;
  height: 2.6rem;
  border: 1px solid var(--line);
  border-radius: 0.7rem;
  background: rgba(255, 255, 255, 0.03);
  display: grid;
  place-content: center;
  gap: 0.35rem;
  cursor: pointer;
}

.menu-btn span {
  display: block;
  width: 1.1rem;
  height: 2px;
  background: var(--mist);
}

.mobile-nav {
  display: grid;
  gap: 0.85rem;
  padding-bottom: 1.25rem;
}

.mobile-link {
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--line);
  font-weight: 500;
}

@media (min-width: 900px) {
  .desktop-nav,
  .phone-pill {
    display: flex;
  }

  .menu-btn,
  .mobile-nav {
    display: none;
  }
}
</style>
