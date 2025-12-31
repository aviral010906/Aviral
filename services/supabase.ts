
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://johxcitxlbcduslgqkay.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvaHhjaXR4bGJjZHVzbGdxa2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDI5NzYsImV4cCI6MjA4MjY3ODk3Nn0.OQWpXv04USyNHV9XL9tsCc64CHXoUAeqRufiht7WttI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
