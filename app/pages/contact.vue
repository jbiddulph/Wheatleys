<script setup lang="ts">
import { business } from '~/utils/site'

const { storageUrl } = useStorageUrl()
const supabase = useSupabase()

useSeoMeta({
  title: "Contact | Wheatley's Accident Repair Centre",
})

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  consent: false,
})

const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const errorMsg = ref('')

async function submit() {
  errorMsg.value = ''
  if (!form.consent) {
    errorMsg.value = 'Please agree to the Terms of Use and Privacy notice.'
    return
  }
  status.value = 'sending'
  const { error } = await supabase.from('wheatleys_inquiries').insert({
    inquiry_type: 'contact',
    name: form.name,
    email: form.email,
    phone: form.phone,
    subject: form.subject,
    message: form.message,
  })
  if (error) {
    status.value = 'error'
    errorMsg.value = error.message
    return
  }
  status.value = 'sent'
  form.name = ''
  form.email = ''
  form.phone = ''
  form.subject = ''
  form.message = ''
  form.consent = false
}
</script>

<template>
  <div>
    <section class="page-hero">
      <img
        :src="storageUrl('google-map-scaled.png')"
        alt=""
        class="page-hero-image"
      />
      <div class="page-hero-scrim" />
      <div class="page-shell page-hero-content">
        <p class="brand-line">Wheatley’s</p>
        <h1>Contact us</h1>
      </div>
    </section>

    <section class="section page-shell contact-grid">
      <div>
        <h2>General enquiry</h2>
        <p class="note">NB: please don’t use this form to request a quote</p>

        <form class="form" @submit.prevent="submit">
          <label>
            Name*
            <input v-model="form.name" required name="name" autocomplete="name" />
          </label>
          <label>
            Email*
            <input
              v-model="form.email"
              required
              type="email"
              name="email"
              autocomplete="email"
            />
          </label>
          <label>
            Phone*
            <input
              v-model="form.phone"
              required
              type="tel"
              name="phone"
              autocomplete="tel"
            />
          </label>
          <label>
            Subject*
            <input v-model="form.subject" required name="subject" />
          </label>
          <label>
            Your message*
            <textarea v-model="form.message" required rows="5" name="message" />
          </label>
          <label class="check">
            <input v-model="form.consent" type="checkbox" />
            <span>
              By using this form I agree with the handling of my data by
              Wheatley's Accident Repair Centre, in line with the website's
              <NuxtLink to="/terms-of-use">Terms of Use</NuxtLink>
              and the
              <NuxtLink to="/privacy-notice">Privacy notice</NuxtLink>.
            </span>
          </label>

          <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
          <p v-if="status === 'sent'" class="success">
            Thanks — your message has been sent.
          </p>

          <button class="btn btn-primary" type="submit" :disabled="status === 'sending'">
            {{ status === 'sending' ? 'Sending…' : 'Send message' }}
          </button>
        </form>
      </div>

      <aside class="aside">
        <a :href="business.mapUrl" target="_blank" rel="noopener" class="map-link">
          <img
            :src="storageUrl('google-map-scaled.png')"
            alt="Map showing Wheatley's Accident Repair Centre"
          />
          <span>Click on map to open in Google Maps</span>
        </a>

        <h3>Wheatley’s Accident Repair Centre</h3>
        <address>
          <template v-for="(line, i) in business.addressLines" :key="i">
            {{ line }}<br />
          </template>
        </address>
        <p>Please feel free to pop in and have a chat.</p>
        <h4>Opening times</h4>
        <p>{{ business.hours }}</p>
        <a :href="`tel:${business.phoneTel}`" class="phone">
          Tel: {{ business.phone }}
        </a>
      </aside>
    </section>
  </div>
</template>

<style scoped>
.page-hero {
  position: relative;
  min-height: 38vh;
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

.contact-grid {
  display: grid;
  gap: 2rem;
}

h2 {
  font-family: var(--font-body);
  font-size: 1.5rem;
  margin-bottom: 0.35rem;
}

.note {
  color: var(--amber);
  margin-bottom: 1.25rem;
}

.form {
  display: grid;
  gap: 0.9rem;
}

label {
  display: grid;
  gap: 0.4rem;
  font-size: 0.92rem;
  color: var(--fog);
}

input,
textarea {
  width: 100%;
  border-radius: 0.8rem;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.04);
  color: var(--mist);
  padding: 0.85rem 0.95rem;
}

.check {
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 0.7rem;
}

.check a {
  color: var(--amber-bright);
  text-decoration: underline;
}

.error { color: var(--danger); }
.success { color: var(--success); }

.aside {
  padding: 1.25rem;
  border-radius: 1.4rem;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.03);
}

.map-link {
  display: grid;
  gap: 0.55rem;
  margin-bottom: 1.25rem;
}

.map-link img {
  border-radius: 1rem;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.map-link span,
address,
.aside p {
  color: var(--fog);
  font-style: normal;
}

.aside h3,
.aside h4 {
  font-family: var(--font-body);
  margin: 1rem 0 0.4rem;
}

.phone {
  display: inline-block;
  margin-top: 0.75rem;
  font-weight: 650;
  color: var(--amber-bright);
}

@media (min-width: 900px) {
  .contact-grid {
    grid-template-columns: 1.15fr 0.85fr;
  }
}
</style>
