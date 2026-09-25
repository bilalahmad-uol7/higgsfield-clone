// Mirrors supabase/migrations. Regenerate from the live schema with
// `npm run db:types` after changing a migration.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          provider: string;
          role: string;
          credits: number;
          plan_id: string | null;
          plan_interval: string | null;
          subscription_status: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          provider?: string;
          role?: string;
          credits?: number;
          plan_id?: string | null;
          plan_interval?: string | null;
          subscription_status?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      credit_ledger: {
        Row: {
          id: number;
          user_id: string;
          delta: number;
          reason: string;
          ref: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          delta: number;
          reason: string;
          ref: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["credit_ledger"]["Insert"]>;
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string | null;
          stripe_object_id: string;
          stripe_event_id: string;
          stripe_customer_id: string | null;
          kind: string;
          plan_id: string | null;
          plan_interval: string | null;
          amount: number;
          currency: string;
          credits_granted: number;
          customer_email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          stripe_object_id: string;
          stripe_event_id: string;
          stripe_customer_id?: string | null;
          kind: string;
          plan_id?: string | null;
          plan_interval?: string | null;
          amount: number;
          currency: string;
          credits_granted?: number;
          customer_email?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      spend_credits: { Args: { p_user: string; p_amount: number; p_ref: string }; Returns: number };
      refund_credits: { Args: { p_user: string; p_ref: string }; Returns: number };
      grant_credits: {
        Args: { p_user: string; p_amount: number; p_reason: string; p_ref: string };
        Returns: number | null;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
