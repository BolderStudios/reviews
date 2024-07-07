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
      locations: {
        Row: {
          clerk_id: string
          created_at: string
          google_place_coordinates: string | null
          google_place_id: string | null
          id: string
          is_competitor: boolean
          is_google_configured: boolean
          is_primary: boolean
          is_yelp_configured: boolean
          name_of_contact: string
          organization_name: string
          position_of_contact: string
          user_id: string
          yelp_profile_url: string | null
        }
        Insert: {
          clerk_id: string
          created_at?: string
          google_place_coordinates?: string | null
          google_place_id?: string | null
          id?: string
          is_competitor?: boolean
          is_google_configured?: boolean
          is_primary?: boolean
          is_yelp_configured?: boolean
          name_of_contact: string
          organization_name: string
          position_of_contact: string
          user_id: string
          yelp_profile_url?: string | null
        }
        Update: {
          clerk_id?: string
          created_at?: string
          google_place_coordinates?: string | null
          google_place_id?: string | null
          id?: string
          is_competitor?: boolean
          is_google_configured?: boolean
          is_primary?: boolean
          is_yelp_configured?: boolean
          name_of_contact?: string
          organization_name?: string
          position_of_contact?: string
          user_id?: string
          yelp_profile_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: number | null
          cancel_at_period_end: boolean
          canceled_at: number | null
          clerk_user_id: string
          created_at: string
          current_period_end: number
          current_period_start: number
          id: string
          plan_amount: number
          start_date: number
          stripe_customer_id: string
          stripe_price_id: string
          stripe_subscription_id: string
          subscription_status: string
          trial_end: number | null
          trial_start: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: number | null
          cancel_at_period_end?: boolean
          canceled_at?: number | null
          clerk_user_id: string
          created_at?: string
          current_period_end: number
          current_period_start: number
          id?: string
          plan_amount: number
          start_date: number
          stripe_customer_id: string
          stripe_price_id: string
          stripe_subscription_id: string
          subscription_status: string
          trial_end?: number | null
          trial_start?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: number | null
          cancel_at_period_end?: boolean
          canceled_at?: number | null
          clerk_user_id?: string
          created_at?: string
          current_period_end?: number
          current_period_start?: number
          id?: string
          plan_amount?: number
          start_date?: number
          stripe_customer_id?: string
          stripe_price_id?: string
          stripe_subscription_id?: string
          subscription_status?: string
          trial_end?: number | null
          trial_start?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      usernames: {
        Row: {
          created_at: string
          id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          username?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          clerk_email: string
          clerk_id: string
          created_at: string
          customer_retention_challenges: string | null
          employee_count: number | null
          fetching_error_message: string | null
          id: string
          is_admin: boolean
          is_fetching: boolean
          is_onboarding_complete: boolean
          location_count: number | null
          organization_industry: string | null
          selected_location_id: string | null
        }
        Insert: {
          clerk_email: string
          clerk_id: string
          created_at?: string
          customer_retention_challenges?: string | null
          employee_count?: number | null
          fetching_error_message?: string | null
          id?: string
          is_admin?: boolean
          is_fetching?: boolean
          is_onboarding_complete?: boolean
          location_count?: number | null
          organization_industry?: string | null
          selected_location_id?: string | null
        }
        Update: {
          clerk_email?: string
          clerk_id?: string
          created_at?: string
          customer_retention_challenges?: string | null
          employee_count?: number | null
          fetching_error_message?: string | null
          id?: string
          is_admin?: boolean
          is_fetching?: boolean
          is_onboarding_complete?: boolean
          location_count?: number | null
          organization_industry?: string | null
          selected_location_id?: string | null
        }
        Relationships: []
      }
      yelp_fetch_tasks: {
        Row: {
          attempts: number | null
          created_at: string
          id: string
          status: string | null
          task_id: string | null
          yelp_business_link: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string
          id?: string
          status?: string | null
          task_id?: string | null
          yelp_business_link?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string
          id?: string
          status?: string | null
          task_id?: string | null
          yelp_business_link?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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

