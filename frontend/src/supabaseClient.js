import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hnekyjpgcbmnqhqfhods.supabase.co' // from step 2
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuZWt5anBnY2JtbnFocWZob2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNDgyOTEsImV4cCI6MjA2OTYyNDI5MX0.NvNgOQbOrwtO-wQ604LBE7tRh7-N775EnbBIC7gASYQ' // from step 2

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
