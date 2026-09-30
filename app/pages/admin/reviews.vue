<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

useSeoMeta({
  title: "Reviews | Wheatley's Admin",
  robots: 'noindex, nofollow',
})

const supabase = useSupabase()

type Review = {
  id: string
  author_name: string
  rating: number
  body: string
  source: string | null
  sort_order: number
  published: boolean
}

const loading = ref(true)
const saving = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const items = ref<Review[]>([])

const blank = (): Omit<Review, 'id'> => ({
  author_name: '',
  rating: 5,
  body: '',
  source: 'Google',
  sort_order: 0,
  published: true,
})

const form = reactive(blank())
const editingId = ref<string | null>(null)

async function load() {
  loading.value = true
  errorMsg.value = ''
  try {
    const { data, error } = await supabase
      .from('wheatleys_reviews')
      .select('*')
      .order('sort_order')
    if (error) throw error
    items.value = (data || []) as Review[]
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Failed to load reviews.'
  } finally {
    loading.value = false
  }
}

onMounted(load)

function startCreate() {
  editingId.value = null
  Object.assign(form, blank())
  form.sort_order = (items.value.at(-1)?.sort_order || 0) + 1
  successMsg.value = ''
}

function startEdit(item: Review) {
  editingId.value = item.id
  Object.assign(form, {
    author_name: item.author_name,
    rating: item.rating,
    body: item.body,
    source: item.source,
    sort_order: item.sort_order,
    published: item.published,
  })
  successMsg.value = ''
}

async function save() {
  saving.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const payload = {
      author_name: form.author_name.trim(),
      rating: Number(form.rating),
      body: form.body.trim(),
      source: form.source?.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      published: !!form.published,
    }
    if (editingId.value) {
      const { error } = await supabase
        .from('wheatleys_reviews')
        .update(payload)
        .eq('id', editingId.value)
      if (error) throw error
      successMsg.value = 'Review updated.'
    } else {
      const { error } = await supabase.from('wheatleys_reviews').insert(payload)
      if (error) throw error
      successMsg.value = 'Review added.'
      startCreate()
    }
    await load()
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Failed to save review.'
  } finally {
    saving.value = false
  }
}

async function remove(item: Review) {
  if (!confirm(`Delete review by ${item.author_name}?`)) return
  errorMsg.value = ''
  const { error } = await supabase.from('wheatleys_reviews').delete().eq('id', item.id)
  if (error) {
    errorMsg.value = error.message
    return
  }
  if (editingId.value === item.id) startCreate()
  await load()
}
</script>

<template>
  <div>
    <header class="page-head">
      <div>
        <p class="section-label">Content</p>
        <h2>Reviews</h2>
      </div>
      <button type="button" class="btn btn-ghost" @click="startCreate">New review</button>
    </header>

    <p v-if="errorMsg" class="error" role="alert">{{ errorMsg }}</p>
    <p v-if="successMsg" class="success">{{ successMsg }}</p>

    <div class="grid">
      <form class="panel form" @submit.prevent="save">
        <h3>{{ editingId ? 'Edit review' : 'Add review' }}</h3>
        <label>Author<input v-model="form.author_name" required /></label>
        <label>Rating<input v-model.number="form.rating" type="number" min="1" max="5" step="0.5" required /></label>
        <label>Source<input v-model="form.source" /></label>
        <label>Sort order<input v-model.number="form.sort_order" type="number" /></label>
        <label>Body<textarea v-model="form.body" rows="5" required /></label>
        <label class="check"><input v-model="form.published" type="checkbox" /> Published</label>
        <button class="btn btn-primary" type="submit" :disabled="saving">
          {{ saving ? 'Saving…' : editingId ? 'Update' : 'Create' }}
        </button>
      </form>

      <div class="panel">
        <p v-if="loading" class="muted">Loading…</p>
        <ul v-else class="list">
          <li v-for="item in items" :key="item.id">
            <div>
              <p class="title">{{ item.author_name }} · {{ item.rating }}★</p>
              <p class="meta">
                {{ item.source || '—' }} · sort {{ item.sort_order }}
                · {{ item.published ? 'published' : 'hidden' }}
              </p>
              <p class="preview">{{ item.body }}</p>
            </div>
            <div class="actions">
              <button type="button" @click="startEdit(item)">Edit</button>
              <button type="button" class="danger" @click="remove(item)">Delete</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1.25rem;
}
.page-head h2 { font-size: clamp(2rem, 4vw, 2.8rem); }
.grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 0.9rem; align-items: start; }
.panel {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.94);
  padding: 1.1rem;
}
.form { display: grid; gap: 0.75rem; }
.form h3 { font-size: 1.4rem; }
label { display: grid; gap: 0.35rem; font-weight: 600; font-size: 0.9rem; }
input, textarea {
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 0.65rem 0.8rem;
  font: inherit;
}
.check { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; }
.list { list-style: none; margin: 0; padding: 0; }
.list li {
  display: flex; justify-content: space-between; gap: 0.8rem;
  padding: 0.85rem 0; border-top: 1px solid var(--line);
}
.list li:first-child { border-top: 0; }
.title { font-weight: 700; }
.meta, .muted, .preview { color: var(--muted); font-size: 0.88rem; }
.preview { margin-top: 0.35rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.actions { display: flex; flex-direction: column; gap: 0.35rem; }
.actions button {
  border: 1px solid var(--line); background: var(--white); border-radius: 999px;
  padding: 0.35rem 0.7rem; font: inherit; font-weight: 600; cursor: pointer;
}
.actions .danger { color: var(--danger); }
.error, .success { padding: 0.75rem 1rem; border-radius: 12px; margin-bottom: 0.85rem; }
.error { background: #fdecec; color: #9b2f2f; }
.success { background: #e8f6ec; color: #256b3b; }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
</style>
