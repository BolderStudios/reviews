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
      business_categories: {
        Row: {
          context: string | null
          created_at: string
          id: string
          location_id: string
          mixed_mentions: number | null
          name: string
          negative_mentions: number | null
          positive_mentions: number | null
          review_id: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          id?: string
          location_id: string
          mixed_mentions?: number | null
          name: string
          negative_mentions?: number | null
          positive_mentions?: number | null
          review_id: string
        }
        Update: {
          context?: string | null
          created_at?: string
          id?: string
          location_id?: string
          mixed_mentions?: number | null
          name?: string
          negative_mentions?: number | null
          positive_mentions?: number | null
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_business_categories_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_business_categories_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      business_category_mentions: {
        Row: {
          business_category_id: string | null
          context: string | null
          created_at: string
          id: string
          review_id: string | null
          sentiment: string | null
        }
        Insert: {
          business_category_id?: string | null
          context?: string | null
          created_at?: string
          id?: string
          review_id?: string | null
          sentiment?: string | null
        }
        Update: {
          business_category_id?: string | null
          context?: string | null
          created_at?: string
          id?: string
          review_id?: string | null
          sentiment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_business_category_mentions_business_category_id_fkey"
            columns: ["business_category_id"]
            isOneToOne: false
            referencedRelation: "business_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_business_category_mentions_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          clerk_id: string | null
          created_at: string
          email_address: string | null
          first_name: string | null
          id: string
          location_id: string | null
          phone_number: string | null
        }
        Insert: {
          clerk_id?: string | null
          created_at?: string
          email_address?: string | null
          first_name?: string | null
          id?: string
          location_id?: string | null
          phone_number?: string | null
        }
        Update: {
          clerk_id?: string | null
          created_at?: string
          email_address?: string | null
          first_name?: string | null
          id?: string
          location_id?: string | null
          phone_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_customers_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      detailed_aspects: {
        Row: {
          aspect: string | null
          created_at: string
          detail: string | null
          id: string
          impact: string | null
          location_id: string | null
          review_id: string | null
          sentiment: string | null
        }
        Insert: {
          aspect?: string | null
          created_at?: string
          detail?: string | null
          id?: string
          impact?: string | null
          location_id?: string | null
          review_id?: string | null
          sentiment?: string | null
        }
        Update: {
          aspect?: string | null
          created_at?: string
          detail?: string | null
          id?: string
          impact?: string | null
          location_id?: string | null
          review_id?: string | null
          sentiment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_detailed_aspects_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_detailed_aspects_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      highlighted_words: {
        Row: {
          created_at: string
          id: string
          location_id: string | null
          review_id: string | null
          sentiment: string | null
          word: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          location_id?: string | null
          review_id?: string | null
          sentiment?: string | null
          word?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string | null
          review_id?: string | null
          sentiment?: string | null
          word?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_highlighted_words_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_highlighted_words_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      keywords: {
        Row: {
          business_category_id: string | null
          created_at: string
          id: string
          location_id: string | null
          name: string | null
          review_id: string | null
          sentiment: string | null
        }
        Insert: {
          business_category_id?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          name?: string | null
          review_id?: string | null
          sentiment?: string | null
        }
        Update: {
          business_category_id?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          name?: string | null
          review_id?: string | null
          sentiment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_keywords_business_category_id_fkey"
            columns: ["business_category_id"]
            isOneToOne: false
            referencedRelation: "business_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_keywords_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_keywords_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          clerk_id: string
          created_at: string
          google_place_coordinates: string | null
          google_place_id: string | null
          id: string
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
      needs_improvement: {
        Row: {
          created_at: string
          id: string
          label: string | null
          location_id: string | null
          review_excerpt: string | null
          review_id: string | null
          suggestion: string | null
          summary: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          location_id?: string | null
          review_excerpt?: string | null
          review_id?: string | null
          suggestion?: string | null
          summary?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          location_id?: string | null
          review_excerpt?: string | null
          review_id?: string | null
          suggestion?: string | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_needs_improvement_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_needs_improvement_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      people_dont_like: {
        Row: {
          created_at: string
          id: string
          label: string | null
          location_id: string | null
          review_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          location_id?: string | null
          review_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          location_id?: string | null
          review_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_people_dont_like_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_people_dont_like_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      people_hate: {
        Row: {
          created_at: string
          id: string
          label: string | null
          location_id: string | null
          review_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          location_id?: string | null
          review_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          location_id?: string | null
          review_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_people_hate_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_people_hate_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      people_love: {
        Row: {
          created_at: string
          id: string
          label: string | null
          location_id: string | null
          review_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          location_id?: string | null
          review_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          location_id?: string | null
          review_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_people_love_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_people_love_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      peoples_pains: {
        Row: {
          created_at: string
          id: string
          label: string | null
          location_id: string | null
          review_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          location_id?: string | null
          review_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          location_id?: string | null
          review_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_peoples_pains_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_peoples_pains_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      product_service_feedback: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          item: string | null
          location_id: string | null
          review_id: string | null
          sentiment: string | null
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: string
          item?: string | null
          location_id?: string | null
          review_id?: string | null
          sentiment?: string | null
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          item?: string | null
          location_id?: string | null
          review_id?: string | null
          sentiment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_product_service_feedback_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_product_service_feedback_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          bounced: boolean
          clicked: boolean
          created_at: string
          customer_email_address: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone_number: string | null
          date: string | null
          delivered: boolean
          email_id: string | null
          id: string
          location_id: string | null
          opened: boolean
          sent: boolean
          source: string | null
        }
        Insert: {
          bounced?: boolean
          clicked?: boolean
          created_at?: string
          customer_email_address?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone_number?: string | null
          date?: string | null
          delivered?: boolean
          email_id?: string | null
          id?: string
          location_id?: string | null
          opened?: boolean
          sent?: boolean
          source?: string | null
        }
        Update: {
          bounced?: boolean
          clicked?: boolean
          created_at?: string
          customer_email_address?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone_number?: string | null
          date?: string | null
          delivered?: boolean
          email_id?: string | null
          id?: string
          location_id?: string | null
          opened?: boolean
          sent?: boolean
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_email_campaigns_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_email_campaigns_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      review_topics: {
        Row: {
          count: number | null
          created_at: string
          id: string
          review_id: string | null
          topic: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string
          id?: string
          review_id?: string | null
          topic?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string
          id?: string
          review_id?: string | null
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_review_topics_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          customer_image_url: string | null
          customer_name: string | null
          customer_profile_url: string | null
          generated_response: string | null
          has_responded_to: boolean
          id: string
          location_id: string | null
          rating: number | null
          response_text: string | null
          response_timestamp: string | null
          return_likelihood: string | null
          review_text: string | null
          review_url: string | null
          sentiment: string | null
          source: string | null
          source_review_id: string | null
          summary: string | null
          timestamp: string | null
        }
        Insert: {
          created_at?: string
          customer_image_url?: string | null
          customer_name?: string | null
          customer_profile_url?: string | null
          generated_response?: string | null
          has_responded_to?: boolean
          id?: string
          location_id?: string | null
          rating?: number | null
          response_text?: string | null
          response_timestamp?: string | null
          return_likelihood?: string | null
          review_text?: string | null
          review_url?: string | null
          sentiment?: string | null
          source?: string | null
          source_review_id?: string | null
          summary?: string | null
          timestamp?: string | null
        }
        Update: {
          created_at?: string
          customer_image_url?: string | null
          customer_name?: string | null
          customer_profile_url?: string | null
          generated_response?: string | null
          has_responded_to?: boolean
          id?: string
          location_id?: string | null
          rating?: number | null
          response_text?: string | null
          response_timestamp?: string | null
          return_likelihood?: string | null
          review_text?: string | null
          review_url?: string | null
          sentiment?: string | null
          source?: string | null
          source_review_id?: string | null
          summary?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_reviews_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_mentions: {
        Row: {
          context: string | null
          created_at: string
          employee_name: string | null
          id: string
          location_id: string | null
          review_id: string | null
          sentiment: string | null
        }
        Insert: {
          context?: string | null
          created_at?: string
          employee_name?: string | null
          id?: string
          location_id?: string | null
          review_id?: string | null
          sentiment?: string | null
        }
        Update: {
          context?: string | null
          created_at?: string
          employee_name?: string | null
          id?: string
          location_id?: string | null
          review_id?: string | null
          sentiment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_staff_mentions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_staff_mentions_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      strengths: {
        Row: {
          created_at: string
          id: string
          location_id: string | null
          review_id: string | null
          strength: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          location_id?: string | null
          review_id?: string | null
          strength?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string | null
          review_id?: string | null
          strength?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_strengths_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_strengths_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
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
          business_category: string | null
          business_type: string | null
          clerk_email: string
          clerk_id: string
          created_at: string
          fetch_error_message: string | null
          id: string
          is_admin: boolean
          is_fetching: boolean
          is_onboarding_complete: boolean
          selected_location_id: string | null
          testimonial_process: string | null
        }
        Insert: {
          business_category?: string | null
          business_type?: string | null
          clerk_email: string
          clerk_id: string
          created_at?: string
          fetch_error_message?: string | null
          id?: string
          is_admin?: boolean
          is_fetching?: boolean
          is_onboarding_complete?: boolean
          selected_location_id?: string | null
          testimonial_process?: string | null
        }
        Update: {
          business_category?: string | null
          business_type?: string | null
          clerk_email?: string
          clerk_id?: string
          created_at?: string
          fetch_error_message?: string | null
          id?: string
          is_admin?: boolean
          is_fetching?: boolean
          is_onboarding_complete?: boolean
          selected_location_id?: string | null
          testimonial_process?: string | null
        }
        Relationships: []
      }
      weaknesses: {
        Row: {
          created_at: string
          id: string
          location_id: string | null
          review_id: string | null
          weakness: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          location_id?: string | null
          review_id?: string | null
          weakness?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string | null
          review_id?: string | null
          weakness?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_weaknesses_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_weaknesses_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
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

