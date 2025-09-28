import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      jams: {
        Row: {
          id: string
          code: string
          host_user_id: string
          created_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          code: string
          host_user_id: string
          created_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          code?: string
          host_user_id?: string
          created_at?: string
          is_active?: boolean
        }
      }
      jam_participants: {
        Row: {
          id: string
          jam_id: string
          user_id: string
          user_name: string
          user_avatar: string | null
          spotify_track_id: string | null
          is_playing: boolean
          last_updated: string
          joined_at: string
        }
        Insert: {
          id?: string
          jam_id: string
          user_id: string
          user_name: string
          user_avatar?: string | null
          spotify_track_id?: string | null
          is_playing?: boolean
          last_updated?: string
          joined_at?: string
        }
        Update: {
          id?: string
          jam_id?: string
          user_id?: string
          user_name?: string
          user_avatar?: string | null
          spotify_track_id?: string | null
          is_playing?: boolean
          last_updated?: string
          joined_at?: string
        }
      }
    }
  }
}