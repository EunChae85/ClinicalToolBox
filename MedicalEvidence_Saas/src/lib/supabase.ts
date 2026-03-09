import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// Mock environment variables for MVP since no actual DB is set up yet
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase-url.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
