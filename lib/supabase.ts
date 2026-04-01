import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !url.startsWith('http')) {
    // Return a dummy client for build/prerender purposes if env is missing
    return {} as any
  }

  return createBrowserClient(url, key!)
}
