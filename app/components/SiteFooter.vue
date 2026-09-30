<script setup lang="ts">
import { business, navLinks } from '~/utils/site'

const { storageUrl } = useStorageUrl()
</script>

<template>
  <footer class="footer">
    <div class="page-shell footer-grid">
      <div>
        <img
          :src="storageUrl('wheatleys_logo_CMYK.png')"
          alt="Wheatley's"
          class="footer-logo"
          width="160"
          height="44"
        />
        <p class="footer-copy">
          Lancing, West Sussex. Over 70 years of expertise in auto refinishing —
          exceptional repair at prices that won’t break the bank.
        </p>
      </div>

      <div>
        <h3 class="footer-heading">Explore</h3>
        <div class="footer-links">
          <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to">
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>

      <div>
        <h3 class="footer-heading">Visit</h3>
        <address>
          <template v-for="(line, i) in business.addressLines" :key="i">
            {{ line }}<br v-if="i < business.addressLines.length - 1" />
          </template>
        </address>
        <p class="hours">{{ business.hours }}</p>
        <a :href="`tel:${business.phoneTel}`" class="footer-phone">
          Tel: {{ business.phone }}
        </a>
      </div>
    </div>

    <div class="page-shell legal-row">
      <span>© {{ new Date().getFullYear() }} {{ business.name }}</span>
      <div class="legal-links">
        <NuxtLink to="/privacy-notice">Privacy notice</NuxtLink>
        <NuxtLink to="/cookie-policy">Cookie policy</NuxtLink>
        <NuxtLink to="/terms-of-use">Terms of use</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 4rem;
  border-top: 1px solid var(--line);
  background: rgba(0, 0, 0, 0.28);
  padding: 3rem 0 1.5rem;
}

.footer-grid {
  display: grid;
  gap: 2rem;
}

.footer-logo {
  width: 160px;
  margin-bottom: 1rem;
}

.footer-copy,
address,
.hours {
  color: var(--fog);
  font-style: normal;
  font-size: 0.95rem;
}

.footer-heading {
  font-family: var(--font-body);
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--amber);
  margin-bottom: 0.9rem;
}

.footer-links {
  display: grid;
  gap: 0.55rem;
}

.footer-links a:hover,
.legal-links a:hover,
.footer-phone:hover {
  color: var(--amber-bright);
}

.footer-phone {
  display: inline-block;
  margin-top: 0.75rem;
  font-weight: 600;
  color: var(--mist);
}

.legal-row {
  margin-top: 2.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--line);
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  justify-content: space-between;
  color: var(--fog);
  font-size: 0.85rem;
}

.legal-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

@media (min-width: 800px) {
  .footer-grid {
    grid-template-columns: 1.4fr 0.8fr 1fr;
  }
}
</style>
