import { createClient } from '@supabase/supabase-js';

// fallbacks vazios evitam crash no build; em runtime as vars reais estarão presentes
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'placeholder',
);
