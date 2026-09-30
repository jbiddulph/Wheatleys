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
  background: rgba(255, 255, 255, 0.9);
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
}

.desktop-nav {
  display: none;
  gap: 1.35rem;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--muted);
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--navy);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.45rem;
  height: 2px;
  background: var(--green);
  transform-origin: left;
  animation: sweep 0.45s var(--ease);
}

.phone-pill {
  display: none;
  padding: 0.55rem 0.95rem;
  border-radius: 999px;
  border: 1px solid rgba(0, 104, 160, 0.35);
  color: var(--blue);
  font-weight: 600;
  font-size: 0.92rem;
  background: rgba(86, 159, 247, 0.08);
}

.menu-btn {
  width: 2.6rem;
  height: 2.6rem;
  border: 1px solid var(--line);
  border-radius: 0.7rem;
  background: var(--white);
  display: grid;
  place-content: center;
  gap: 0.35rem;
  cursor: pointer;
}

.menu-btn span {
  display: block;
  width: 1.1rem;
  height: 2px;
  background: var(--navy);
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
  color: var(--navy);
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
