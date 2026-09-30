<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

useSeoMeta({
  title: "Admin | Wheatley's Accident Repair Centre",
  robots: 'noindex, nofollow',
})

const supabase = useSupabase()
const loading = ref(true)
const errorMsg = ref('')

const stats = reactive({
  inquiries: 0,
  reviews: 0,
  gallery: 0,
  services: 0,
})

type InquiryRow = {
  id: string
  inquiry_type: string
  name: string
  email: string
  subject: string | null
  created_at: string
}

const recent = ref<InquiryRow[]>([])

onMounted(async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const [inq, reviews, gallery, services, latest] = await Promise.all([
      supabase.from('wheatleys_inquiries').select('id', { count: 'exact', head: true }),
      supabase.from('wheatleys_reviews').select('id', { count: 'exact', head: true }),
      supabase.from('wheatleys_gallery').select('id', { count: 'exact', head: true }),
      supabase.from('wheatleys_services').select('id', { count: 'exact', head: true }),
      supabase
        .from('wheatleys_inquiries')
        .select('id, inquiry_type, name, email, subject, created_at')
        .order('created_at', { ascending: false })
        .limit(8),
    ])

    const firstError =
      inq.error || reviews.error || gallery.error || services.error || latest.error
    if (firstError) throw firstError

    stats.inquiries = inq.count || 0
    stats.reviews = reviews.count || 0
    stats.gallery = gallery.count || 0
    stats.services = services.count || 0
    recent.value = (latest.data || []) as InquiryRow[]
  } catch (err: unknown) {
    errorMsg.value =
      err instanceof Error ? err.message : 'Failed to load admin dashboard.'
  } finally {
    loading.value = false
  }
})

const cards = computed(() => [
  { label: 'Inquiries', value: stats.inquiries, to: '/admin/inquiries', cta: 'Review inbox' },
  { label: 'Reviews', value: stats.reviews, to: '/admin/reviews', cta: 'Manage reviews' },
  { label: 'Gallery', value: stats.gallery, to: '/admin/gallery', cta: 'Edit gallery' },
  { label: 'Services', value: stats.services, to: '/admin/services', cta: 'Edit services' },
])

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}
</script>

<template>
  <div>
    <header class="page-head">
      <p class="section-label">Dashboard</p>
      <h2>Site overview</h2>
      <p class="lede">Content and inquiries stored in the Wheatleys Supabase project.</p>
    </header>

    <p v-if="errorMsg" class="error" role="alert">{{ errorMsg }}</p>
    <p v-else-if="loading" class="muted">Loading stats…</p>

    <div v-else class="stat-grid">
      <NuxtLink v-for="card in cards" :key="card.to" :to="card.to" class="stat-card">
        <p class="stat-label">{{ card.label }}</p>
        <p class="stat-value">{{ card.value }}</p>
        <p class="stat-cta">{{ card.cta }} →</p>
      </NuxtLink>
    </div>

    <section v-if="!loading" class="panel">
      <div class="panel-head">
        <h3>Latest inquiries</h3>
        <NuxtLink to="/admin/inquiries">View all</NuxtLink>
      </div>
      <p v-if="!recent.length" class="muted">No inquiries yet.</p>
      <ul v-else class="list">
        <li v-for="item in recent" :key="item.id">
          <div>
            <p class="item-title">{{ item.name }}</p>
            <p class="item-meta">
              {{ item.inquiry_type }} · {{ item.email }}
              <template v-if="item.subject"> · {{ item.subject }}</template>
            </p>
          </div>
          <time>{{ formatWhen(item.created_at) }}</time>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.page-head {
  margin-bottom: 1.5rem;
}

.page-head h2 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  margin-bottom: 0.4rem;
}

.lede,
.muted {
  color: var(--muted);
}

.error {
  padding: 0.8rem 1rem;
  border-radius: 12px;
  background: #fdecec;
  color: #9b2f2f;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
  margin-bottom: 1.25rem;
}

.stat-card {
  display: block;
  padding: 1.1rem 1.15rem;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.9);
  transition: transform 0.25s var(--ease), border-color 0.25s var(--ease);
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: rgba(196, 120, 59, 0.45);
}

.stat-label {
  color: var(--muted);
  font-size: 0.88rem;
  font-weight: 600;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 2.4rem;
  margin: 0.25rem 0 0.55rem;
  color: var(--charcoal);
}

.stat-cta {
  color: var(--copper-deep);
  font-size: 0.86rem;
  font-weight: 700;
}

.panel {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  padding: 1.1rem 1.2rem;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.panel-head h3 {
  font-size: 1.4rem;
}

.panel-head a {
  color: var(--copper-deep);
  font-weight: 700;
  font-size: 0.9rem;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 0;
  border-top: 1px solid var(--line);
}

.list li:first-child {
  border-top: 0;
}

.item-title {
  font-weight: 700;
  color: var(--charcoal);
}

.item-meta,
time {
  color: var(--muted);
  font-size: 0.88rem;
}

time {
  white-space: nowrap;
}

@media (max-width: 900px) {
  .stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .stat-grid {
    grid-template-columns: 1fr;
  }

  .list li {
    flex-direction: column;
  }
}
</style>
