import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

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
      lists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          category: string | null;
          criteria: string | null;
          is_public: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          category?: string | null;
          criteria?: string | null;
          is_public?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          category?: string | null;
          criteria?: string | null;
          is_public?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      list_products: {
        Row: {
          id: string;
          list_id: string;
          product_id: string;
          added_at: string;
          notes: string | null;
          ai_suggested: boolean | null;
        };
        Insert: {
          id?: string;
          list_id: string;
          product_id: string;
          added_at?: string;
          notes?: string | null;
          ai_suggested?: boolean | null;
        };
        Update: {
          id?: string;
          list_id?: string;
          product_id?: string;
          added_at?: string;
          notes?: string | null;
          ai_suggested?: boolean | null;
        };
      };
    };
  };
};

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export type List = Database['public']['Tables']['lists']['Row'];
export type ListInsert = Database['public']['Tables']['lists']['Insert'];
export type ListUpdate = Database['public']['Tables']['lists']['Update'];

export type ListProduct = Database['public']['Tables']['list_products']['Row'];
export type ListProductInsert = Database['public']['Tables']['list_products']['Insert'];
export type ListProductUpdate = Database['public']['Tables']['list_products']['Update'];

// User feature types
export interface Bookmark {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string | null;
  product?: Product;
}

export interface Like {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string | null;
  product?: Product;
}

// Extended types with relations
export interface ListWithProducts extends List {
  products?: (ListProduct & { product?: Product })[];
}

export interface ListProductWithProduct extends ListProduct {
  product?: Product;
}

// People and gift tracking types
export interface Person {
  id: string;
  user_id: string;
  name: string;
  relationship?: string;
  birthday?: string;
  age?: number;
  interests?: string[];
  address?: string;
  notes?: string;
  ai_context?: any;
  created_at?: string;
  updated_at?: string;
}

export interface SpecialDate {
  id: string;
  person_id: string;
  user_id: string;
  name: string;
  date?: string;
  recurrence_type?: 'once' | 'annual' | 'quarterly' | 'monthly';
  category?: string;
  notes?: string;
  reminder_days_before?: number;
  created_at?: string;
  updated_at?: string;
}

export interface GiftGiven {
  id: string;
  person_id: string;
  user_id: string;
  product_id?: string;
  name: string;
  date_given?: string;
  occasion?: string;
  price?: number;
  notes?: string;
  created_at?: string;
}

export interface PersonProductBookmark {
  id: string;
  person_id: string;
  product_id: string;
  user_id: string;
  notes?: string;
  created_at?: string;
  person?: Person;
  product?: Product;
}
