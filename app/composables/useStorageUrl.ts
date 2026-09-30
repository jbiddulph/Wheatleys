export function useStorageUrl() {
  const config = useRuntimeConfig()

  const storageUrl = (path?: string | null) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    const base = config.public.supabaseUrl.replace(/\/$/, '')
    const bucket = config.public.storageBucket
    return `${base}/storage/v1/object/public/${bucket}/${path.replace(/^\//, '')}`
  }

  return { storageUrl }
}
