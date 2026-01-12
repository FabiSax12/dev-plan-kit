import { createServerClient } from '@supabase/ssr';
import { env } from '@/env';
import { getCookies, setCookie } from '@tanstack/react-start/server';

export const getSupabaseServerClient  = () => createServerClient(
  env.SUPABASE_URL!,
  env.SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({
          name,
          value,
        }))
      },
      setAll(cookies) {
        cookies.forEach((cookie) => {
          setCookie(cookie.name, cookie.value)
        })
      },
    },
  },
)