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

function paragraphs(body?: string | null) {
  return (body || '')
    .replace(/\\n/g, '\n')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}
</script>

<template>
  <div>
    <PageHero title="Services" image="W-ARC-Services-SPRAY.png" />

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
              v-for="(para, idx) in paragraphs(service.body)"
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
.lead {
  font-size: 1.15rem;
  color: var(--muted);
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
  background: var(--white);
  box-shadow: 0 12px 30px rgba(12, 38, 93, 0.05);
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
  color: var(--navy);
}

.service-block p {
  color: var(--muted);
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
