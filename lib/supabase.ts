import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types matching your existing products table structure
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number | null;
          image_url: string | null;
          category: string | null;
          in_stock: boolean | null;
          amazon_link: string | null;
          created_at: string;
          updated_at: string;
          // Future enhancements (will be added via migration)
          original_price?: number | null;
          tags?: string[] | null;
          notes?: string | null;
          priority?: 'low' | 'medium' | 'high' | null;
          status?: 'active' | 'wishlist' | 'purchased' | 'discontinued' | null;
          last_checked?: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price?: number | null;
          image_url?: string | null;
          category?: string | null;
          in_stock?: boolean | null;
          amazon_link?: string | null;
          created_at?: string;
          updated_at?: string;
          original_price?: number | null;
          tags?: string[] | null;
          notes?: string | null;
          priority?: 'low' | 'medium' | 'high' | null;
          status?: 'active' | 'wishlist' | 'purchased' | 'discontinued' | null;
          last_checked?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number | null;
          image_url?: string | null;
          category?: string | null;
          in_stock?: boolean | null;
          amazon_link?: string | null;
          created_at?: string;
          updated_at?: string;
          original_price?: number | null;
          tags?: string[] | null;
          notes?: string | null;
          priority?: 'low' | 'medium' | 'high' | null;
          status?: 'active' | 'wishlist' | 'purchased' | 'discontinued' | null;
          last_checked?: string | null;
        };
      };
    };
  };
};

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];
