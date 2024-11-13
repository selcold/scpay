import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_ACCOUNT_URL!,
    process.env.SUPABASE_ACCOUNT_SECRET_KEY!
  )
}