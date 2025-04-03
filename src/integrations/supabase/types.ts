export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      amenities: {
        Row: {
          created_at: string
          icon: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          checkin_date: string
          checkout_date: string
          created_at: string
          currency: string
          guests: number
          id: string
          payment_id: string | null
          payment_order_id: string | null
          payment_signature: string | null
          payment_status: string | null
          status: string | null
          stay_id: string
          stay_image: string
          stay_location: string
          stay_name: string
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          checkin_date: string
          checkout_date: string
          created_at?: string
          currency: string
          guests: number
          id?: string
          payment_id?: string | null
          payment_order_id?: string | null
          payment_signature?: string | null
          payment_status?: string | null
          status?: string | null
          stay_id: string
          stay_image: string
          stay_location: string
          stay_name: string
          total_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          checkin_date?: string
          checkout_date?: string
          created_at?: string
          currency?: string
          guests?: number
          id?: string
          payment_id?: string | null
          payment_order_id?: string | null
          payment_signature?: string | null
          payment_status?: string | null
          status?: string | null
          stay_id?: string
          stay_image?: string
          stay_location?: string
          stay_name?: string
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          amenities: string[] | null
          created_at: string | null
          description: string | null
          gender_preference: string | null
          id: string
          is_available: boolean | null
          location: string
          rent: number
          roommates_needed: number
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amenities?: string[] | null
          created_at?: string | null
          description?: string | null
          gender_preference?: string | null
          id?: string
          is_available?: boolean | null
          location: string
          rent: number
          roommates_needed: number
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amenities?: string[] | null
          created_at?: string | null
          description?: string | null
          gender_preference?: string | null
          id?: string
          is_available?: boolean | null
          location?: string
          rent?: number
          roommates_needed?: number
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          created_at: string
          id: string
          latitude: number
          longitude: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      preferences: {
        Row: {
          created_at: string
          id: string
          notification_preferences: Json
          search_preferences: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notification_preferences?: Json
          search_preferences?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notification_preferences?: Json
          search_preferences?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          gender: string | null
          id: string
          name: string | null
          phone_number: string | null
          profession: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          gender?: string | null
          id: string
          name?: string | null
          phone_number?: string | null
          profession?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          gender?: string | null
          id?: string
          name?: string | null
          phone_number?: string | null
          profession?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          listing_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          listing_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          listing_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string
          id: string
          language_settings: Json
          notification_settings: Json
          privacy_settings: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language_settings?: Json
          notification_settings?: Json
          privacy_settings?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language_settings?: Json
          notification_settings?: Json
          privacy_settings?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_rows: {
        Args: {
          table_name: string
        }
        Returns: number
      }
      cube:
        | {
            Args: {
              "": number[]
            }
            Returns: unknown
          }
        | {
            Args: {
              "": number
            }
            Returns: unknown
          }
      cube_dim: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      cube_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      cube_is_point: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      cube_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      cube_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      cube_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      cube_size: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      earth: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      gc_to_sec: {
        Args: {
          "": number
        }
        Returns: number
      }
      get_nearby_locations: {
        Args: {
          lat: number
          lng: number
          radius: number
        }
        Returns: {
          created_at: string
          id: string
          latitude: number
          longitude: number
          name: string
          updated_at: string
        }[]
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      latitude: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      longitude: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      search_locations: {
        Args: {
          query: string
        }
        Returns: {
          created_at: string
          id: string
          latitude: number
          longitude: number
          name: string
          updated_at: string
        }[]
      }
      sec_to_gc: {
        Args: {
          "": number
        }
        Returns: number
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
