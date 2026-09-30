<script setup lang="ts">
import { business } from '~/utils/site'
</script>

<template>
  <div class="call-bar" role="region" aria-label="Quick contact">
    <a :href="`tel:${business.phoneTel}`" class="call">
      Call {{ business.phone }}
    </a>
    <NuxtLink to="/request-a-quote" class="quote">
      Get a quote
    </NuxtLink>
  </div>
</template>

<style scoped>
.call-bar {
  position: fixed;
  left: 0.75rem;
  right: 0.75rem;
  bottom: 0.75rem;
  z-index: 50;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 0.5rem;
  padding: 0.45rem;
  border-radius: 999px;
  border: 1px solid rgba(232, 163, 23, 0.35);
  background: rgba(12, 14, 17, 0.92);
  backdrop-filter: blur(12px);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.35);
}

.call,
.quote {
  min-height: 2.7rem;
  display: grid;
  place-items: center;
  border-radius: 999px;
  font-weight: 650;
  font-size: 0.92rem;
}

.call {
  background: linear-gradient(135deg, var(--amber-bright), var(--amber));
  color: #1a1405;
}

.quote {
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--mist);
}

@media (min-width: 900px) {
  .call-bar {
    display: none;
  }
}
</style>
