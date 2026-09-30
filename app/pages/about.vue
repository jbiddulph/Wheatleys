<script setup lang="ts">
import { business } from '~/utils/site'

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
    <PageHero title="About us" image="instagram_workshop_3.jpg" />

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
.about-grid {
  display: grid;
  gap: 2rem;
}

.lead {
  font-size: 1.2rem;
  color: var(--navy);
  margin-bottom: 1rem;
}

.body-copy {
  color: var(--muted);
  margin-bottom: 0.9rem;
  max-width: 60ch;
}

.emphasis {
  color: var(--blue);
  font-weight: 600;
}

.aside {
  padding: 1.5rem;
  border-radius: 1.4rem;
  border: 1px solid var(--line);
  background: var(--white);
  box-shadow: 0 12px 30px rgba(12, 38, 93, 0.05);
  height: fit-content;
}

.aside h2 {
  font-family: var(--font-body);
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.aside p {
  color: var(--muted);
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
  border-left: 3px solid var(--green);
  color: var(--navy);
}

@media (min-width: 900px) {
  .about-grid {
    grid-template-columns: 1.3fr 0.8fr;
    align-items: start;
  }
}
</style>
