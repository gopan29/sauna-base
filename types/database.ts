export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          level: number
          total_points: number
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          level?: number
          total_points?: number
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          level?: number
          total_points?: number
        }
        Relationships: []
      }
      sauna_records: {
        Row: {
          id: string
          user_id: string
          date: string
          facility_name: string
          memo: string | null
          sets: number
          sauna_temp: number
          water_temp: number
          rest_style: 'outdoor' | 'indoor' | 'rest_only' | 'none'
          subjective_rating: number
          body_condition: 'great' | 'normal' | 'tired' | 'sick'
          total_minutes: number | null
          notes: string | null
          score: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          facility_name: string
          memo?: string | null
          sets: number
          sauna_temp: number
          water_temp: number
          rest_style: 'outdoor' | 'indoor' | 'rest_only' | 'none'
          subjective_rating: number
          body_condition: 'great' | 'normal' | 'tired' | 'sick'
          total_minutes?: number | null
          notes?: string | null
          score: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          facility_name?: string
          memo?: string | null
          sets?: number
          sauna_temp?: number
          water_temp?: number
          rest_style?: 'outdoor' | 'indoor' | 'rest_only' | 'none'
          subjective_rating?: number
          body_condition?: 'great' | 'normal' | 'tired' | 'sick'
          total_minutes?: number | null
          notes?: string | null
          score?: number
        }
        Relationships: []
      }
      sauna_facilities: {
        Row: {
          id: string
          name: string
          address: string | null
          lat: number | null
          lng: number | null
          prefecture: string | null
          city: string | null
          status: string
          record_count: number
          avg_sauna_temp: number | null
          avg_water_temp: number | null
          source: string
          osm_id: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          lat?: number | null
          lng?: number | null
          prefecture?: string | null
          city?: string | null
          status?: string
          record_count?: number
          avg_sauna_temp?: number | null
          avg_water_temp?: number | null
          source?: string
          osm_id?: number | null
          created_at?: string
        }
        Update: {
          name?: string
          address?: string | null
          lat?: number | null
          lng?: number | null
          prefecture?: string | null
          city?: string | null
          status?: string
          record_count?: number
          avg_sauna_temp?: number | null
          avg_water_temp?: number | null
        }
        Relationships: []
      }
      sauna_profiles: {
        Row: {
          user_id: string
          type_name: string | null
          totonoi_code: string | null
          preferred_sauna_temp: string | null
          preferred_water_temp: string | null
          outdoor_preference: number
          crowd_tolerance: number
          visit_frequency: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          type_name?: string | null
          totonoi_code?: string | null
          preferred_sauna_temp?: string | null
          preferred_water_temp?: string | null
          outdoor_preference?: number
          crowd_tolerance?: number
          visit_frequency?: string | null
          updated_at?: string
        }
        Update: {
          type_name?: string | null
          totonoi_code?: string | null
          preferred_sauna_temp?: string | null
          preferred_water_temp?: string | null
          outdoor_preference?: number
          crowd_tolerance?: number
          visit_frequency?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
