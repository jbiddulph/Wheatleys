<script setup lang="ts">
import { damagedAreaOptions, damageTypeOptions } from '~/utils/site'

const supabase = useSupabase()
const config = useRuntimeConfig()

useSeoMeta({
  title: "Request a quote | Wheatley's Accident Repair Centre",
})

const form = reactive({
  name: '',
  email: '',
  phone: '',
  town_city: '',
  vehicle_registration: '',
  vehicle_make_model: '',
  damaged_areas: [] as string[],
  damage_types: [] as string[],
  additional_info: '',
  consent: false,
})

const files = ref<File[]>([])
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const errorMsg = ref('')

function onFiles(event: Event) {
  const input = event.target as HTMLInputElement
  const selected = Array.from(input.files || []).slice(0, 5)
  files.value = selected.filter((f) => f.size <= 1024 * 1024)
}

async function submit() {
  errorMsg.value = ''
  if (!form.consent) {
    errorMsg.value = 'Please agree to the Terms of Use and Privacy notice.'
    return
  }
  if (!form.damaged_areas.length || !form.damage_types.length) {
    errorMsg.value = 'Please specify damaged areas and type of damage.'
    return
  }

  status.value = 'sending'
  const photoPaths: string[] = []

  for (const file of files.value) {
    const path = `quotes/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const { error } = await supabase.storage
      .from(config.public.storageBucket)
      .upload(path, file, { upsert: false, contentType: file.type })
    if (error) {
      status.value = 'error'
      errorMsg.value = error.message
      return
    }
    photoPaths.push(path)
  }

  const { error } = await supabase.from('wheatleys_inquiries').insert({
    inquiry_type: 'quote',
    name: form.name,
    email: form.email,
    phone: form.phone,
    town_city: form.town_city,
    vehicle_registration: form.vehicle_registration,
    vehicle_make_model: form.vehicle_make_model,
    damaged_areas: form.damaged_areas,
    damage_types: form.damage_types,
    additional_info: form.additional_info,
    photo_paths: photoPaths,
    message: form.additional_info,
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
  form.town_city = ''
  form.vehicle_registration = ''
  form.vehicle_make_model = ''
  form.damaged_areas = []
  form.damage_types = []
  form.additional_info = ''
  form.consent = false
  files.value = []
}
</script>

<template>
  <div>
    <PageHero title="Request a quote" image="instagram_workshop_4.jpg" />

    <section class="section page-shell">
      <p class="lead">
        Please use the form below to give us as much detail as possible so we can
        provide you with an accurate estimate.
      </p>
      <p class="lead muted">
        You should hear from us within 24 hours (Monday to Friday).
      </p>

      <form class="form" @submit.prevent="submit">
        <div class="two-col">
          <label>
            Name*
            <input v-model="form.name" required name="name" autocomplete="name" />
          </label>
          <label>
            Email*
            <input v-model="form.email" required type="email" name="email" />
          </label>
          <label>
            Phone*
            <input v-model="form.phone" required type="tel" name="phone" />
          </label>
          <label>
            Town/city*
            <input v-model="form.town_city" required name="town" />
          </label>
          <label>
            Vehicle registration*
            <input v-model="form.vehicle_registration" required name="reg" />
          </label>
          <label>
            Vehicle make and model*
            <input v-model="form.vehicle_make_model" required name="vehicle" />
          </label>
        </div>

        <fieldset>
          <legend>Please specify any damaged areas*</legend>
          <div class="checks">
            <label v-for="option in damagedAreaOptions" :key="option" class="check">
              <input v-model="form.damaged_areas" type="checkbox" :value="option" />
              <span>{{ option }}</span>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Please specify type of damage*</legend>
          <div class="checks">
            <label v-for="option in damageTypeOptions" :key="option" class="check">
              <input v-model="form.damage_types" type="checkbox" :value="option" />
              <span>{{ option }}</span>
            </label>
          </div>
        </fieldset>

        <label>
          Additional info
          <textarea v-model="form.additional_info" rows="4" name="info" />
        </label>

        <label>
          Upload photos of the damage
          <input
            type="file"
            accept=".jpg,.jpeg,.pdf,.png,.heic,image/*"
            multiple
            @change="onFiles"
          />
          <span class="hint">
            Accepted file types: jpg, jpeg, pdf, png, heic. Max. file size: 1MB.
            Max. number: 5 files.
          </span>
        </label>
        <ul v-if="files.length" class="file-list">
          <li v-for="file in files" :key="file.name + file.size">
            {{ file.name }}
            <span>({{ Math.round(file.size / 1024) }} KB)</span>
          </li>
        </ul>

        <label class="check consent">
          <input v-model="form.consent" type="checkbox" />
          <span>
            By using this form I agree with the handling of my data by Wheatley's
            Accident Repair Centre, in line with the website's
            <NuxtLink to="/terms-of-use">Terms of Use</NuxtLink>
            and the
            <NuxtLink to="/privacy-notice">Privacy notice</NuxtLink>.
          </span>
        </label>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <p v-if="status === 'sent'" class="success">
          Thanks — your quote request has been sent. We’ll be in touch within 24
          hours (Monday to Friday).
        </p>

        <button class="btn btn-primary" type="submit" :disabled="status === 'sending'">
          {{ status === 'sending' ? 'Sending…' : 'Submit quote request' }}
        </button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.lead {
  font-size: 1.1rem;
  color: var(--mist);
  max-width: 60ch;
}

.lead.muted {
  color: var(--fog);
  margin: 0.5rem 0 2rem;
}

.form {
  display: grid;
  gap: 1.1rem;
  max-width: 860px;
}

.two-col {
  display: grid;
  gap: 0.9rem;
}

label,
fieldset {
  display: grid;
  gap: 0.45rem;
  color: var(--fog);
  font-size: 0.92rem;
}

fieldset {
  border: 1px solid var(--line);
  border-radius: 1rem;
  padding: 1rem;
}

legend {
  padding: 0 0.35rem;
  color: var(--mist);
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

.checks {
  display: grid;
  gap: 0.45rem;
}

.check {
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 0.65rem;
}

.consent a {
  color: var(--amber-bright);
  text-decoration: underline;
}

.hint {
  font-size: 0.82rem;
  color: var(--fog);
}

.file-list {
  list-style: none;
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 0.9rem;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.03);
  display: grid;
  gap: 0.4rem;
  color: var(--mist);
  font-size: 0.9rem;
}

.file-list span {
  color: var(--fog);
  margin-left: 0.35rem;
}

.error { color: var(--danger); }
.success { color: var(--success); }

@media (min-width: 700px) {
  .two-col {
    grid-template-columns: 1fr 1fr;
  }

  .checks {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
