import { supabase } from './supabase';
import type { Product, ProductInsert, ProductUpdate } from './supabase';

// Product queries with error handling and type safety
export const productQueries = {
  // Get all products with optional filtering
  async getAll(filters?: {
    status?: Product['status'];
    category?: string;
    priority?: Product['priority'];
    search?: string;
  }) {
    let query = supabase.from('products').select('*').order('updated_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,category.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    return { data: data as Product[] | null, error };
  },

  // Get single product by ID
  async getById(id: string) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

    return { data: data as Product | null, error };
  },

  // Create new product
  async create(product: ProductInsert) {
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    return { data: data as Product | null, error };
  },

  // Update existing product
  async update(id: string, updates: ProductUpdate) {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    return { data: data as Product | null, error };
  },

  // Delete product
  async delete(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);

    return { error };
  },

  // Bulk operations
  async deleteMany(ids: string[]) {
    const { error } = await supabase.from('products').delete().in('id', ids);

    return { error };
  },

  async updateMany(ids: string[], updates: ProductUpdate) {
    const { error } = await supabase
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .in('id', ids);

    return { error };
  },

  // Get unique categories for filtering
  async getCategories() {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null);

    if (error) return { data: null, error };

    const categories = [...new Set(data?.map((p) => p.category).filter(Boolean))];
    return { data: categories, error: null };
  },

  // Real-time subscription
  subscribeToChanges(callback: (payload: any) => void) {
    return supabase
      .channel('products_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, callback)
      .subscribe();
  },
};
