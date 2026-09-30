<script setup lang="ts">
defineProps<{
  title: string
  image: string
}>()

const { storageUrl } = useStorageUrl()
</script>

<template>
  <section class="page-hero">
    <img :src="storageUrl(image)" alt="" class="page-hero-image" />
    <div class="page-hero-scrim" />
    <div class="page-shell page-hero-content">
      <p class="brand-line reveal">Wheatley’s</p>
      <h1 class="reveal reveal-delay-1">{{ title }}</h1>
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  position: relative;
  min-height: 42vh;
  display: grid;
  align-items: end;
  overflow: hidden;
}

.page-hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.03);
}

.page-hero-scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(22, 32, 27, 0.3), rgba(22, 32, 27, 0.84)),
    linear-gradient(90deg, rgba(31, 42, 36, 0.55), transparent 60%);
}

.page-hero-content {
  position: relative;
  z-index: 1;
  padding: 5rem 0 2.5rem;
}

.brand-line {
  font-family: var(--font-display);
  color: var(--green-bright);
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  line-height: 0.95;
}

h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-top: 0.35rem;
  color: var(--white);
}
</style>
