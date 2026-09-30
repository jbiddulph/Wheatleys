<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

useSeoMeta({
  title: "Inquiries | Wheatley's Admin",
  robots: 'noindex, nofollow',
})

const supabase = useSupabase()
const { storageUrl } = useStorageUrl()

type Inquiry = {
  id: string
  inquiry_type: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string | null
  town_city: string | null
  vehicle_registration: string | null
  vehicle_make_model: string | null
  damaged_areas: string[] | null
  damage_types: string[] | null
  additional_info: string | null
  photo_paths: string[] | null
  created_at: string
}

const loading = ref(true)
const errorMsg = ref('')
const items = ref<Inquiry[]>([])
const selected = ref<Inquiry | null>(null)
const filter = ref<'all' | 'contact' | 'quote'>('all')

const filtered = computed(() => {
  if (filter.value === 'all') return items.value
  return items.value.filter((i) => i.inquiry_type === filter.value)
})

async function load() {
  loading.value = true
  errorMsg.value = ''
  try {
    const { data, error } = await supabase
      .from('wheatleys_inquiries')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    items.value = (data || []) as Inquiry[]
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Failed to load inquiries.'
  } finally {
    loading.value = false
  }
}

onMounted(load)

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function photoUrl(path: string) {
  if (path.startsWith('http')) return path
  return storageUrl(path)
}
</script>

<template>
  <div>
    <header class="page-head">
      <div>
        <p class="section-label">Inbox</p>
        <h2>Inquiries</h2>
      </div>
      <div class="filters">
        <button
          v-for="opt in [
            { id: 'all', label: 'All' },
            { id: 'contact', label: 'Contact' },
            { id: 'quote', label: 'Quotes' },
          ]"
          :key="opt.id"
          type="button"
          class="chip"
          :class="{ active: filter === opt.id }"
          @click="filter = opt.id as typeof filter"
        >
          {{ opt.label }}
        </button>
      </div>
    </header>

    <p v-if="errorMsg" class="error" role="alert">{{ errorMsg }}</p>
    <p v-else-if="loading" class="muted">Loading inquiries…</p>
    <p v-else-if="!filtered.length" class="muted">No inquiries in this view.</p>

    <div v-else class="inbox">
      <ul class="list">
        <li
          v-for="item in filtered"
          :key="item.id"
          :class="{ active: selected?.id === item.id }"
          @click="selected = item"
        >
          <p class="title">{{ item.name }}</p>
          <p class="meta">
            <span class="type">{{ item.inquiry_type }}</span>
            · {{ formatWhen(item.created_at) }}
          </p>
          <p class="preview">{{ item.subject || item.message || item.additional_info }}</p>
        </li>
      </ul>

      <article v-if="selected" class="detail">
        <h3>{{ selected.name }}</h3>
        <p class="meta">
          {{ selected.inquiry_type }} · {{ formatWhen(selected.created_at) }}
        </p>
        <dl>
          <div><dt>Email</dt><dd><a :href="`mailto:${selected.email}`">{{ selected.email }}</a></dd></div>
          <div v-if="selected.phone"><dt>Phone</dt><dd><a :href="`tel:${selected.phone}`">{{ selected.phone }}</a></dd></div>
          <div v-if="selected.subject"><dt>Subject</dt><dd>{{ selected.subject }}</dd></div>
          <div v-if="selected.town_city"><dt>Town / city</dt><dd>{{ selected.town_city }}</dd></div>
          <div v-if="selected.vehicle_registration"><dt>Registration</dt><dd>{{ selected.vehicle_registration }}</dd></div>
          <div v-if="selected.vehicle_make_model"><dt>Vehicle</dt><dd>{{ selected.vehicle_make_model }}</dd></div>
          <div v-if="selected.damaged_areas?.length"><dt>Damaged areas</dt><dd>{{ selected.damaged_areas.join(', ') }}</dd></div>
          <div v-if="selected.damage_types?.length"><dt>Damage types</dt><dd>{{ selected.damage_types.join(', ') }}</dd></div>
          <div v-if="selected.message"><dt>Message</dt><dd class="body">{{ selected.message }}</dd></div>
          <div v-if="selected.additional_info"><dt>Additional info</dt><dd class="body">{{ selected.additional_info }}</dd></div>
        </dl>

        <div v-if="selected.photo_paths?.length" class="photos">
          <p class="photos-label">Photos</p>
          <div class="photo-grid">
            <a
              v-for="path in selected.photo_paths"
              :key="path"
              :href="photoUrl(path)"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img :src="photoUrl(path)" :alt="`Quote photo ${path}`" />
            </a>
          </div>
        </div>
      </article>
      <div v-else class="detail empty">
        <p class="muted">Select an inquiry to view details.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.page-head h2 {
  font-size: clamp(2rem, 4vw, 2.8rem);
}

.filters {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.chip {
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.85);
  border-radius: 999px;
  padding: 0.45rem 0.85rem;
  font: inherit;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
}

.chip.active {
  background: var(--charcoal);
  border-color: var(--charcoal);
  color: var(--white);
}

.error {
  padding: 0.8rem 1rem;
  border-radius: 12px;
  background: #fdecec;
  color: #9b2f2f;
}

.muted {
  color: var(--muted);
}

.inbox {
  display: grid;
  grid-template-columns: minmax(240px, 0.9fr) 1.2fr;
  gap: 0.9rem;
  align-items: start;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  overflow: hidden;
  max-height: 70vh;
  overflow-y: auto;
}

.list li {
  padding: 0.95rem 1rem;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
}

.list li:last-child {
  border-bottom: 0;
}

.list li:hover,
.list li.active {
  background: rgba(101, 188, 123, 0.1);
}

.title {
  font-weight: 700;
}

.meta {
  color: var(--muted);
  font-size: 0.86rem;
  margin-top: 0.2rem;
}

.type {
  text-transform: capitalize;
  color: var(--copper-deep);
  font-weight: 700;
}

.preview {
  margin-top: 0.35rem;
  color: var(--muted);
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.detail {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.95);
  padding: 1.2rem;
  min-height: 320px;
}

.detail h3 {
  font-size: 1.8rem;
  margin-bottom: 0.25rem;
}

.detail.empty {
  display: grid;
  place-items: center;
}

dl {
  margin: 1rem 0 0;
  display: grid;
  gap: 0.75rem;
}

dl > div {
  display: grid;
  gap: 0.2rem;
}

dt {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 700;
}

dd {
  margin: 0;
  color: var(--charcoal);
}

dd.body {
  white-space: pre-wrap;
}

.photos {
  margin-top: 1.25rem;
}

.photos-label {
  font-weight: 700;
  margin-bottom: 0.55rem;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.55rem;
}

.photo-grid img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid var(--line);
}

@media (max-width: 800px) {
  .inbox {
    grid-template-columns: 1fr;
  }

  .list {
    max-height: 280px;
  }
}
</style>
