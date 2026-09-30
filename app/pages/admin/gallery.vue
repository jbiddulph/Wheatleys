<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

useSeoMeta({
  title: "Gallery | Wheatley's Admin",
  robots: 'noindex, nofollow',
})

const supabase = useSupabase()
const { storageUrl } = useStorageUrl()

type GalleryItem = {
  id: string
  title: string
  image_path: string
  alt_text: string | null
  sort_order: number
}

const loading = ref(true)
const saving = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const items = ref<GalleryItem[]>([])

const blank = (): Omit<GalleryItem, 'id'> => ({
  title: '',
  image_path: '',
  alt_text: '',
  sort_order: 0,
})

const form = reactive(blank())
const editingId = ref<string | null>(null)

async function load() {
  loading.value = true
  errorMsg.value = ''
  try {
    const { data, error } = await supabase
      .from('wheatleys_gallery')
      .select('*')
      .order('sort_order')
    if (error) throw error
    items.value = (data || []) as GalleryItem[]
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Failed to load gallery.'
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

function startEdit(item: GalleryItem) {
  editingId.value = item.id
  Object.assign(form, {
    title: item.title,
    image_path: item.image_path,
    alt_text: item.alt_text || '',
    sort_order: item.sort_order,
  })
  successMsg.value = ''
}

async function save() {
  saving.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const payload = {
      title: form.title.trim(),
      image_path: form.image_path.trim(),
      alt_text: form.alt_text?.trim() || null,
      sort_order: Number(form.sort_order) || 0,
    }
    if (editingId.value) {
      const { error } = await supabase
        .from('wheatleys_gallery')
        .update(payload)
        .eq('id', editingId.value)
      if (error) throw error
      successMsg.value = 'Gallery item updated.'
    } else {
      const { error } = await supabase.from('wheatleys_gallery').insert(payload)
      if (error) throw error
      successMsg.value = 'Gallery item added.'
      startCreate()
    }
    await load()
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Failed to save gallery item.'
  } finally {
    saving.value = false
  }
}

async function remove(item: GalleryItem) {
  if (!confirm(`Delete “${item.title}”?`)) return
  const { error } = await supabase.from('wheatleys_gallery').delete().eq('id', item.id)
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
        <h2>Gallery</h2>
      </div>
      <button type="button" class="btn btn-ghost" @click="startCreate">New item</button>
    </header>

    <p v-if="errorMsg" class="error" role="alert">{{ errorMsg }}</p>
    <p v-if="successMsg" class="success">{{ successMsg }}</p>

    <div class="grid">
      <form class="panel form" @submit.prevent="save">
        <h3>{{ editingId ? 'Edit item' : 'Add item' }}</h3>
        <label>Title<input v-model="form.title" required /></label>
        <label>
          Image path
          <input v-model="form.image_path" required placeholder="instagram_workshop_1.jpg" />
        </label>
        <label>Alt text<input v-model="form.alt_text" /></label>
        <label>Sort order<input v-model.number="form.sort_order" type="number" /></label>
        <div v-if="form.image_path" class="preview-wrap">
          <img :src="storageUrl(form.image_path)" :alt="form.alt_text || form.title" />
        </div>
        <button class="btn btn-primary" type="submit" :disabled="saving">
          {{ saving ? 'Saving…' : editingId ? 'Update' : 'Create' }}
        </button>
      </form>

      <div class="panel">
        <p v-if="loading" class="muted">Loading…</p>
        <ul v-else class="list">
          <li v-for="item in items" :key="item.id">
            <img :src="storageUrl(item.image_path)" :alt="item.alt_text || item.title" />
            <div class="copy">
              <p class="title">{{ item.title }}</p>
              <p class="meta">{{ item.image_path }} · sort {{ item.sort_order }}</p>
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
  display: flex; justify-content: space-between; gap: 1rem; align-items: end; margin-bottom: 1.25rem;
}
.page-head h2 { font-size: clamp(2rem, 4vw, 2.8rem); }
.grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 0.9rem; align-items: start; }
.panel {
  border: 1px solid var(--line); border-radius: 18px; background: rgba(255, 255, 255, 0.94); padding: 1.1rem;
}
.form { display: grid; gap: 0.75rem; }
.form h3 { font-size: 1.4rem; }
label { display: grid; gap: 0.35rem; font-weight: 600; font-size: 0.9rem; }
input {
  border: 1px solid var(--line); border-radius: 12px; padding: 0.65rem 0.8rem; font: inherit;
}
.preview-wrap img {
  width: 100%; max-height: 180px; object-fit: cover; border-radius: 12px; border: 1px solid var(--line);
}
.list { list-style: none; margin: 0; padding: 0; }
.list li {
  display: grid; grid-template-columns: 72px 1fr auto; gap: 0.75rem; align-items: center;
  padding: 0.75rem 0; border-top: 1px solid var(--line);
}
.list li:first-child { border-top: 0; }
.list img {
  width: 72px; height: 72px; object-fit: cover; border-radius: 10px; border: 1px solid var(--line);
}
.title { font-weight: 700; }
.meta, .muted { color: var(--muted); font-size: 0.86rem; }
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
