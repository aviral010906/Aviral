
import { createClient } from '@supabase/supabase-js';

// These variables should be set in your Vercel Environment Variables settings
// Use the values from your Supabase Project Settings -> API
const supabaseUrl = process.env.SUPABASE_URL || 'https://johxcitxlbcduslgqkay.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvaHhjaXR4bGJjZHVzbGdxa2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDI5NzYsImV4cCI6MjA4MjY3ODk3Nn0.OQWpXv04USyNHV9XL9tsCc64CHXoUAeqRufiht7WttI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
