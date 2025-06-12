import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enhanced database types based on tokens2 learnings
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          url: string;
          price: number | null;
          original_price: number | null; // Track price changes
          image_url: string | null;
          category: string | null;
          status: 'active' | 'wishlist' | 'purchased' | 'discontinued';
          tags: string[] | null; // For flexible organization
          notes: string | null; // Personal notes
          priority: 'low' | 'medium' | 'high' | null; // Purchase priority
          last_checked: string | null; // When price was last checked
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          url: string;
          price?: number | null;
          original_price?: number | null;
          image_url?: string | null;
          category?: string | null;
          status?: 'active' | 'wishlist' | 'purchased' | 'discontinued';
          tags?: string[] | null;
          notes?: string | null;
          priority?: 'low' | 'medium' | 'high' | null;
          last_checked?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          url?: string;
          price?: number | null;
          original_price?: number | null;
          image_url?: string | null;
          category?: string | null;
          status?: 'active' | 'wishlist' | 'purchased' | 'discontinued';
          tags?: string[] | null;
          notes?: string | null;
          priority?: 'low' | 'medium' | 'high' | null;
          last_checked?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];
