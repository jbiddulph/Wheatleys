<script setup lang="ts">
import { business } from '~/utils/site'

const { storageUrl } = useStorageUrl()

useSeoMeta({
  title: "About us | Wheatley's Accident Repair Centre",
})

const whyUs = [
  'Excellent Workmanship',
  'Extremely Competitive Prices',
  'Free Estimates',
  'Free Local Collection And Delivery',
  'Discounts For Senior Citizens',
]
</script>

<template>
  <div>
    <section class="page-hero">
      <img
        :src="storageUrl('instagram_workshop_3.jpg')"
        alt=""
        class="page-hero-image"
      />
      <div class="page-hero-scrim" />
      <div class="page-shell page-hero-content">
        <p class="brand-line">Wheatley’s</p>
        <h1>About us</h1>
      </div>
    </section>

    <section class="section page-shell about-grid">
      <div>
        <span class="section-label">Our story</span>
        <p class="lead">
          At Wheatley’s, we believe in delivering exceptional quality at prices
          that won’t break the bank. With more than 70 years of expertise in the
          refinishing industry, our talented team is meticulously trained to
          provide you and your vehicle with outstanding service.
        </p>
        <p class="body-copy">
          We’re dedicated to ensuring you’re back on the road, not just
          satisfied, but thrilled with the results!
        </p>
        <p class="body-copy">
          Whether you need a complete respray, minor smart repairs or solutions
          for bumper scuffs, we’ve got you covered.
        </p>
        <p class="body-copy">
          Plus, we offer free courtesy cars and convenient collection and
          delivery services right to your door.
        </p>
        <p class="body-copy">
          To top it off, we provide no-obligation, insurance-approved estimates
          at no cost.
        </p>
        <p class="body-copy emphasis">
          Trust us to revitalise your vehicle—experience the Wheatley’s
          difference today.
        </p>
      </div>

      <aside class="aside">
        <h2>Why come to us?</h2>
        <p>Because we will offer you:</p>
        <ul>
          <li v-for="item in whyUs" :key="item">{{ item }}</li>
        </ul>
        <a :href="`tel:${business.phoneTel}`" class="btn btn-primary">
          Call {{ business.phone }}
        </a>
      </aside>
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
  background: linear-gradient(180deg, rgba(10, 12, 14, 0.25), rgba(10, 12, 14, 0.9));
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

.about-grid {
  display: grid;
  gap: 2rem;
}

.lead {
  font-size: 1.2rem;
  color: var(--mist);
  margin-bottom: 1rem;
}

.body-copy {
  color: var(--fog);
  margin-bottom: 0.9rem;
  max-width: 60ch;
}

.emphasis {
  color: var(--amber-bright);
  font-weight: 600;
}

.aside {
  padding: 1.5rem;
  border-radius: 1.4rem;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.03);
  height: fit-content;
}

.aside h2 {
  font-family: var(--font-body);
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.aside p {
  color: var(--fog);
  margin-bottom: 1rem;
}

.aside ul {
  margin: 0 0 1.4rem;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.7rem;
}

.aside li {
  padding-left: 1rem;
  border-left: 3px solid var(--amber);
}

@media (min-width: 900px) {
  .about-grid {
    grid-template-columns: 1.3fr 0.8fr;
    align-items: start;
  }
}
</style>
