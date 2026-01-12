import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/env';

export const supabase = createBrowserClient(
  env.VITE_SUPABASE_URL as string,
  env.VITE_SUPABASE_ANON_KEY as string,
);