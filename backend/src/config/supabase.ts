import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// We initialize client even if keys are placeholders, avoiding crash on load
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
  auth: {
    persistSession: false
  }
});
