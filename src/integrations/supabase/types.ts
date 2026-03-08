export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      insights: {
        Row: {
          generated_at: string | null
          id: string
          insight_text: string | null
          statement_id: string | null
          user_id: string | null
        }
        Insert: {
          generated_at?: string | null
          id?: string
          insight_text?: string | null
          statement_id?: string | null
          user_id?: string | null
        }
        Update: {
          generated_at?: string | null
          id?: string
          insight_text?: string | null
          statement_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insights_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "statements"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_requests: {
        Row: {
          amount_ugx: number
          email: string
          id: string
          momo_transaction_id: string
          network: string | null
          plan: string
          status: string | null
          submitted_at: string | null
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          amount_ugx: number
          email: string
          id?: string
          momo_transaction_id: string
          network?: string | null
          plan: string
          status?: string | null
          submitted_at?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          amount_ugx?: number
          email?: string
          id?: string
          momo_transaction_id?: string
          network?: string | null
          plan?: string
          status?: string | null
          submitted_at?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          last_reset_date: string | null
          pages_limit_month: number | null
          pages_used_month: number | null
          pages_used_today: number | null
          plan: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          last_reset_date?: string | null
          pages_limit_month?: number | null
          pages_used_month?: number | null
          pages_used_today?: number | null
          plan?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          last_reset_date?: string | null
          pages_limit_month?: number | null
          pages_used_month?: number | null
          pages_used_today?: number | null
          plan?: string | null
          user_id?: string
        }
        Relationships: []
      }
      statements: {
        Row: {
          account_name: string | null
          date_from: string | null
          date_to: string | null
          id: string
          net_balance: number | null
          provider: string | null
          total_fees: number | null
          total_in: number | null
          total_out: number | null
          total_pages: number | null
          total_taxes: number | null
          total_transactions: number | null
          uploaded_at: string | null
          user_id: string | null
        }
        Insert: {
          account_name?: string | null
          date_from?: string | null
          date_to?: string | null
          id?: string
          net_balance?: number | null
          provider?: string | null
          total_fees?: number | null
          total_in?: number | null
          total_out?: number | null
          total_pages?: number | null
          total_taxes?: number | null
          total_transactions?: number | null
          uploaded_at?: string | null
          user_id?: string | null
        }
        Update: {
          account_name?: string | null
          date_from?: string | null
          date_to?: string | null
          id?: string
          net_balance?: number | null
          provider?: string | null
          total_fees?: number | null
          total_in?: number | null
          total_out?: number | null
          total_pages?: number | null
          total_taxes?: number | null
          total_transactions?: number | null
          uploaded_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "statements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount_ugx: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          pages_limit: number | null
          payment_method: string | null
          payment_reference: string | null
          plan: string
          started_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_ugx?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          pages_limit?: number | null
          payment_method?: string | null
          payment_reference?: string | null
          plan: string
          started_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_ugx?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          pages_limit?: number | null
          payment_method?: string | null
          payment_reference?: string | null
          plan?: string
          started_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number | null
          category: string | null
          created_at: string | null
          date: string | null
          description: string | null
          direction: string | null
          fees: number | null
          id: string
          running_balance: number | null
          statement_id: string | null
          taxes: number | null
          time: string | null
          transaction_id_ref: string | null
          transaction_type: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          category?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          direction?: string | null
          fees?: number | null
          id?: string
          running_balance?: number | null
          statement_id?: string | null
          taxes?: number | null
          time?: string | null
          transaction_id_ref?: string | null
          transaction_type?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          category?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          direction?: string | null
          fees?: number | null
          id?: string
          running_balance?: number | null
          statement_id?: string | null
          taxes?: number | null
          time?: string | null
          transaction_id_ref?: string | null
          transaction_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "statements"
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
