
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { SUPABASE_CONFIG } from '@/config/supabase';

// Import the admin supabase client like this:
// import { adminSupabase } from "@/integrations/supabase/adminClient";

export const adminSupabase = createClient<Database>(SUPABASE_CONFIG.url, SUPABASE_CONFIG.serviceKey);

