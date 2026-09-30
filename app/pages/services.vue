<script setup lang="ts">
const { storageUrl } = useStorageUrl()
const supabase = useSupabase()

useSeoMeta({
  title: "Services | Wheatley's Accident Repair Centre",
})

const { data: services } = await supabase
  .from('wheatleys_services')
  .select('*')
  .order('sort_order')

const insurers = [
  'Insurance-Logo-aviva.png',
  'Insurance-Logo-ageas.png',
  'Insurance-Logo-LV.png',
  'Insurance-Logo-saga.png',
]
</script>

<template>
  <div>
    <section class="page-hero">
      <img
        :src="storageUrl('W-ARC-Services-SPRAY.png')"
        alt=""
        class="page-hero-image"
      />
      <div class="page-hero-scrim" />
      <div class="page-shell page-hero-content">
        <p class="brand-line">Wheatley’s</p>
        <h1>Services</h1>
      </div>
    </section>

    <section class="section page-shell">
      <p class="lead">
        Whatever work your car needs to bring it back to perfection bring it to
        Wheatley’s. Don’t hesitate to get in touch, and we can have a chat about
        all your repair needs, or else use our online quotation request form.
      </p>

      <div class="service-list">
        <article
          v-for="service in services || []"
          :key="service.id"
          class="service-block"
        >
          <img
            :src="storageUrl(service.image_path)"
            :alt="service.title"
            class="service-visual"
          />
          <div>
            <h2>{{ service.title }}</h2>
            <p
              v-for="(para, idx) in (service.body || '').split('\n\n')"
              :key="idx"
            >
              {{ para }}
            </p>
          </div>
        </article>
      </div>

      <div class="insurers">
        <h3>We deal with all major insurance companies including:</h3>
        <div class="logo-row">
          <img
            v-for="logo in insurers"
            :key="logo"
            :src="storageUrl(logo)"
            :alt="logo"
          />
          <img
            :src="storageUrl('RentaCar-Logo-Enterprise.png')"
            alt="Enterprise"
          />
        </div>
      </div>

      <NuxtLink to="/request-a-quote" class="btn btn-primary">
        Request a quote
      </NuxtLink>
    </section>
  </div>
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
}

.page-hero-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10, 12, 14, 0.35), rgba(10, 12, 14, 0.92));
}

.page-hero-content {
  position: relative;
  z-index: 1;
  padding: 5rem 0 2.5rem;
}

.brand-line {
  font-family: var(--font-display);
  color: var(--amber-bright);
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  line-height: 0.95;
}

.page-hero h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-top: 0.35rem;
}

.lead {
  font-size: 1.15rem;
  color: var(--fog);
  max-width: 65ch;
  margin-bottom: 2.5rem;
}

.service-list {
  display: grid;
  gap: 1.5rem;
}

.service-block {
  display: grid;
  gap: 1.25rem;
  padding: 1.25rem;
  border-radius: 1.4rem;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.03);
}

.service-visual {
  width: 100%;
  max-width: 280px;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 1rem;
}

.service-block h2 {
  font-family: var(--font-body);
  font-size: 1.6rem;
  font-weight: 650;
  margin-bottom: 0.75rem;
}

.service-block p {
  color: var(--fog);
  margin-bottom: 0.85rem;
  max-width: 65ch;
}

.insurers {
  margin: 2.5rem 0;
}

.insurers h3 {
  font-family: var(--font-body);
  font-size: 1.05rem;
  margin-bottom: 1rem;
}

.logo-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
  margin-bottom: 1.5rem;
}

.logo-row img {
  width: 100%;
  height: 70px;
  object-fit: contain;
  background: #fff;
  border-radius: 0.85rem;
  padding: 0.7rem;
}

@media (min-width: 800px) {
  .service-block {
    grid-template-columns: 240px 1fr;
    align-items: start;
  }

  .logo-row {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}
</style>
