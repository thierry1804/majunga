// Supabase a été complètement supprimé - l'application utilise maintenant uniquement l'API Madabooking
// Ce fichier est conservé pour la compatibilité avec les imports existants mais ne fait plus rien

export const supabase = null

// Types pour la base de données
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'editor' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'editor' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'editor' | 'user'
          created_at?: string
          updated_at?: string
        }
      }
      tours: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          duration: string
          highlights: string[]
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          duration: string
          highlights: string[]
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          duration?: string
          highlights?: string[]
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          tour_id: string
          user_email: string
          user_name: string
          booking_date: string
          participants: number
          total_price: number
          status: 'pending' | 'confirmed' | 'cancelled'
          payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tour_id: string
          user_email: string
          user_name: string
          booking_date: string
          participants: number
          total_price: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tour_id?: string
          user_email?: string
          user_name?: string
          booking_date?: string
          participants?: number
          total_price?: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      shuttle_schedules: {
        Row: {
          id: string
          departure_time: string
          arrival_time: string
          route: string
          price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          departure_time: string
          arrival_time: string
          route: string
          price: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          departure_time?: string
          arrival_time?: string
          route?: string
          price?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
