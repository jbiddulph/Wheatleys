<script setup lang="ts">
import { business } from '~/utils/site'

const { storageUrl } = useStorageUrl()
const supabase = useSupabase()

const [{ data: reviews }, { data: gallery }, { data: services }] = await Promise.all([
  supabase.from('wheatleys_reviews').select('*').eq('published', true).order('sort_order'),
  supabase.from('wheatleys_gallery').select('*').order('sort_order'),
  supabase.from('wheatleys_services').select('*').order('sort_order'),
])

const whyUs = [
  'Excellent Workmanship',
  'Extremely Competitive Prices',
  'Free Estimates',
  'Free Local Collection And Delivery',
  'Discounts For Senior Citizens',
]

const insurers = [
  'Insurance-Logo-aviva.png',
  'Insurance-Logo-ageas.png',
  'Insurance-Logo-LV.png',
  'Insurance-Logo-saga.png',
]
</script>

<template>
  <div>
    <section class="hero">
      <div class="hero-media" aria-hidden="true">
        <img
          :src="storageUrl('instagram_workshop_2.jpg')"
          alt=""
          class="hero-image"
        />
        <div class="hero-scrim" />
      </div>

      <div class="page-shell hero-content">
        <p class="brand-mark reveal">Wheatley’s</p>
        <h1 class="hero-title reveal reveal-delay-1">
          Accident Repair Centre
        </h1>
        <p class="hero-copy reveal reveal-delay-2">
          At Wheatley’s Accident Repair Centre, delivering exceptional vehicle
          repair and car bodywork restoration at prices that won’t break the
          bank. With over 70 years of expertise in auto refinishing, our talented
          team of repair and spray painting specialists provide you and your
          vehicle with outstanding service.
        </p>
        <div class="hero-actions reveal reveal-delay-3">
          <NuxtLink to="/request-a-quote" class="btn btn-primary">
            Request a quote
          </NuxtLink>
          <a :href="`tel:${business.phoneTel}`" class="btn btn-ghost">
            Call {{ business.phone }}
          </a>
        </div>
      </div>
    </section>

    <section class="section page-shell intro">
      <div>
        <span class="section-label">The Wheatley’s difference</span>
        <h2 class="section-title">Flawless results. Fair prices.</h2>
        <p class="section-copy">
          Whether it’s a minor dent, insurance-approved accident repair, or a
          full respray service, we’re dedicated to getting you back on the
          road—not just satisfied, but thrilled with the flawless results!
        </p>
      </div>
      <ul class="why-list">
        <li v-for="(item, i) in whyUs" :key="item" :style="{ animationDelay: `${0.1 * i}s` }">
          <span class="tick" aria-hidden="true" />
          {{ item }}
        </li>
      </ul>
    </section>

    <section class="section services-band">
      <div class="page-shell">
        <span class="section-label">Services</span>
        <h2 class="section-title">Whatever your car needs</h2>
        <p class="section-copy">
          Whatever work your car needs to bring it back to perfection bring it to
          Wheatley’s. Don’t hesitate to get in touch, and we can have a chat about
          all your repair needs, or else use our online quotation request form.
        </p>

        <div class="service-grid">
          <NuxtLink
            v-for="service in services || []"
            :key="service.id"
            to="/services"
            class="service-card"
          >
            <img
              :src="storageUrl(service.image_path)"
              :alt="service.title"
              class="service-image"
            />
            <div>
              <h3>{{ service.title }}</h3>
              <p>{{ service.summary }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section page-shell">
      <div class="reviews-head">
        <div>
          <span class="section-label">Google reviews</span>
          <h2 class="section-title">Excellent</h2>
          <p class="section-copy">
            Based on {{ business.reviewCount }} reviews from customers who trusted
            Grant and the team with their vehicles.
          </p>
        </div>
        <img
          :src="storageUrl('Google-review.png')"
          alt="Google reviews"
          class="google-badge"
        />
      </div>

      <div class="review-rail">
        <article
          v-for="review in reviews || []"
          :key="review.id"
          class="review-card"
        >
          <div class="stars" aria-label="5 stars">★★★★★</div>
          <p>“{{ review.body }}”</p>
          <footer>
            <strong>{{ review.author_name }}</strong>
            <span>{{ review.source }}</span>
          </footer>
        </article>
      </div>
    </section>

    <section class="section gallery-band">
      <div class="page-shell">
        <span class="section-label">Latest from @wheat.leyarc</span>
        <h2 class="section-title">Workshop moments</h2>
        <div class="gallery-grid">
          <figure
            v-for="item in gallery || []"
            :key="item.id"
            class="gallery-item"
          >
            <img
              :src="storageUrl(item.image_path)"
              :alt="item.alt_text || item.title || 'Workshop photo'"
            />
          </figure>
        </div>
        <a
          :href="business.instagram"
          class="btn btn-ghost gallery-cta"
          target="_blank"
          rel="noopener"
        >
          Follow @wheat.leyarc on Instagram
        </a>
      </div>
    </section>

    <section class="section page-shell insurers">
      <span class="section-label">Insurance work</span>
      <h2 class="section-title">Trusted with major insurers</h2>
      <p class="section-copy">
        We deal with all major insurance companies including:
      </p>
      <div class="logo-row">
        <img
          v-for="logo in insurers"
          :key="logo"
          :src="storageUrl(logo)"
          :alt="logo.replace('Insurance-Logo-', '').replace('.png', '')"
        />
        <img
          :src="storageUrl('RentaCar-Logo-Enterprise.png')"
          alt="Enterprise Rent-A-Car"
        />
      </div>
    </section>

    <section class="cta-band">
      <div class="page-shell cta-inner">
        <h2 class="section-title">Ready to get your car looking brand new?</h2>
        <p class="section-copy">
          Please feel free to pop in and have a chat — or request a no-obligation,
          insurance-approved estimate online.
        </p>
        <div class="hero-actions">
          <NuxtLink to="/request-a-quote" class="btn btn-primary">
            Request a quote
          </NuxtLink>
          <NuxtLink to="/contact" class="btn btn-ghost">Contact us</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: grid;
  align-items: end;
  overflow: hidden;
}

.hero-media {
  position: absolute;
  inset: 0;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.04);
  animation: floaty 12s ease-in-out infinite;
}

.hero-scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(22, 32, 27, 0.35) 0%, rgba(22, 32, 27, 0.72) 55%, rgba(22, 32, 27, 0.92) 100%),
    linear-gradient(90deg, rgba(31, 42, 36, 0.62), transparent 58%);
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 5.5rem 0 5.5rem;
  max-width: 760px;
}

.brand-mark {
  font-family: var(--font-display);
  font-size: clamp(3.2rem, 11vw, 7.5rem);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--green-bright);
  line-height: 0.9;
  text-shadow: 0 10px 30px rgba(22, 32, 27, 0.4);
}

.hero-title {
  font-size: clamp(2rem, 6vw, 3.4rem);
  margin: 0.35rem 0 1.25rem;
  max-width: 14ch;
  color: var(--white);
  text-shadow: 0 8px 24px rgba(22, 32, 27, 0.4);
}

.hero-copy {
  color: rgba(255, 255, 255, 0.92);
  font-size: clamp(0.98rem, 2.4vw, 1.08rem);
  max-width: 54ch;
  margin-bottom: 1.35rem;
  text-shadow: 0 4px 16px rgba(22, 32, 27, 0.4);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.hero-actions :deep(.btn-ghost) {
  border-color: rgba(255, 255, 255, 0.7);
  background: rgba(22, 32, 27, 0.28);
  color: var(--white);
}

.hero-actions :deep(.btn-ghost):hover {
  border-color: var(--white);
  background: rgba(255, 255, 255, 0.12);
  color: var(--white);
}

.intro {
  display: grid;
  gap: 2rem;
}

.why-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.85rem;
}

.why-list li {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.95rem 1.1rem;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 1rem;
  color: var(--navy);
  opacity: 0;
  animation: rise 0.7s var(--ease) forwards;
  box-shadow: 0 8px 24px rgba(31, 42, 36, 0.05);
}

.tick {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 0 6px rgba(101, 188, 123, 0.18);
  flex: 0 0 auto;
}

.services-band,
.gallery-band {
  background: rgba(232, 240, 234, 0.65);
  border-block: 1px solid var(--line);
}

.service-grid {
  margin-top: 2rem;
  display: grid;
  gap: 1rem;
}

.service-card {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-radius: 1.25rem;
  border: 1px solid var(--line);
  background: var(--white);
  box-shadow: 0 10px 28px rgba(31, 42, 36, 0.05);
  transition:
    transform 0.35s var(--ease),
    border-color 0.35s var(--ease);
}

.service-card:hover {
  transform: translateY(-4px);
  border-color: rgba(101, 188, 123, 0.55);
}

.service-image {
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: 0.9rem;
}

.service-card h3 {
  font-family: var(--font-body);
  font-size: 1.2rem;
  font-weight: 650;
  margin-bottom: 0.3rem;
  color: var(--navy);
}

.service-card p {
  color: var(--muted);
  font-size: 0.95rem;
}

.reviews-head {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.75rem;
}

.google-badge {
  width: min(220px, 45vw);
  height: auto;
}

.review-rail {
  display: grid;
  gap: 1rem;
  grid-auto-flow: column;
  grid-auto-columns: minmax(280px, 1fr);
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scroll-snap-type: x mandatory;
}

.review-card {
  scroll-snap-align: start;
  padding: 1.35rem;
  border-radius: 1.25rem;
  border: 1px solid var(--line);
  background: var(--white);
  box-shadow: 0 12px 30px rgba(31, 42, 36, 0.06);
  min-height: 100%;
  display: grid;
  gap: 0.9rem;
}

.stars {
  color: var(--green);
  letter-spacing: 0.12em;
}

.review-card p {
  color: var(--text);
  font-size: 0.98rem;
}

.review-card footer {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  color: var(--muted);
  font-size: 0.88rem;
}

.gallery-grid {
  margin-top: 1.75rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.gallery-item {
  margin: 0;
  overflow: hidden;
  border-radius: 1rem;
  aspect-ratio: 1;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s var(--ease);
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.gallery-cta {
  margin-top: 1.5rem;
}

.logo-row {
  margin-top: 1.75rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.logo-row img {
  width: 100%;
  height: 72px;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 0.9rem;
  padding: 0.75rem 1rem;
}

.cta-band {
  padding: 4rem 0 5rem;
}

.cta-inner {
  padding: clamp(1.75rem, 4vw, 2.75rem);
  border-radius: 1.75rem;
  border: 1px solid rgba(196, 120, 59, 0.22);
  background:
    radial-gradient(500px 220px at 0% 0%, rgba(101, 188, 123, 0.2), transparent 60%),
    radial-gradient(420px 200px at 100% 0%, rgba(196, 120, 59, 0.14), transparent 55%),
    var(--white);
  box-shadow: 0 16px 40px rgba(31, 42, 36, 0.06);
}

.cta-inner .section-title {
  max-width: 16ch;
}

.cta-inner .section-copy {
  margin-bottom: 1.5rem;
}

@media (min-width: 800px) {
  .hero-content {
    padding: 7rem 0 4.5rem;
  }

  .intro {
    grid-template-columns: 1.1fr 0.9fr;
    align-items: center;
  }

  .service-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .logo-row {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .hero {
    min-height: 100svh;
  }

  .hero-content {
    padding-bottom: 6.5rem;
  }

  .hero-copy {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>
