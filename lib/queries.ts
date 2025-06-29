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
    in_stock?: boolean;
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
      query = query.or(
        `name.ilike.%${filters.search}%,category.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }
    if (filters?.in_stock !== undefined) {
      query = query.eq('in_stock', filters.in_stock);
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

export const bookmarkQueries = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*, product:products(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async getByProduct(productId: string, userId: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('product_id', productId)
      .eq('user_id', userId)
      .maybeSingle();
    
    return { data, error };
  },

  async create(productId: string, userId: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({ product_id: productId, user_id: userId })
      .select()
      .single();
    
    return { data, error };
  },

  async delete(productId: string, userId: string) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('product_id', productId)
      .eq('user_id', userId);
    
    return { error };
  },
};

export const likeQueries = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('likes')
      .select('*, product:products(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async getByProduct(productId: string) {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('product_id', productId);
    
    return { data, error };
  },

  async getUserLike(productId: string, userId: string) {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('product_id', productId)
      .eq('user_id', userId)
      .maybeSingle();
    
    return { data, error };
  },

  async create(productId: string, userId: string) {
    const { data, error } = await supabase
      .from('likes')
      .insert({ product_id: productId, user_id: userId })
      .select()
      .single();
    
    return { data, error };
  },

  async delete(productId: string, userId: string) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('product_id', productId)
      .eq('user_id', userId);
    
    return { error };
  },

  async countByProduct(productId: string) {
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', productId);
    
    return { count: count || 0, error };
  },
};

export const listQueries = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    return { data, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('lists')
      .select('*, list_products(*, product:products(*))')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  async create(name: string, description: string | null, userId: string) {
    const { data, error } = await supabase
      .from('lists')
      .insert({ name, description, user_id: userId })
      .select()
      .single();
    
    return { data, error };
  },

  async update(id: string, updates: { name?: string; description?: string }) {
    const { data, error } = await supabase
      .from('lists')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', id);
    
    return { error };
  },

  async addProduct(listId: string, productId: string, notes?: string) {
    const { data, error } = await supabase
      .from('list_products')
      .insert({ list_id: listId, product_id: productId, notes })
      .select()
      .single();
    
    return { data, error };
  },

  async removeProduct(listId: string, productId: string) {
    const { error } = await supabase
      .from('list_products')
      .delete()
      .eq('list_id', listId)
      .eq('product_id', productId);
    
    return { error };
  },
};

export const peopleQueries = {
  // Get all people for a user
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('people')
      .select('*')
      .eq('user_id', userId)
      .order('name');
      
    return { data, error };
  },

  // Get a single person
  async getById(id: string) {
    const { data, error } = await supabase
      .from('people')
      .select('*')
      .eq('id', id)
      .single();
      
    return { data, error };
  },

  // Create a new person
  async create(person: any) {
    const { data, error } = await supabase
      .from('people')
      .insert(person)
      .select()
      .single();
      
    return { data, error };
  },

  // Update a person
  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('people')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    return { data, error };
  },

  // Delete a person
  async delete(id: string) {
    const { error } = await supabase
      .from('people')
      .delete()
      .eq('id', id);
      
    return { error };
  },
};

export const specialDatesQueries = {
  // Get all special dates for a person
  async getByPerson(personId: string) {
    const { data, error } = await supabase
      .from('special_dates')
      .select('*')
      .eq('person_id', personId)
      .order('date');
      
    return { data, error };
  },

  // Get upcoming dates for a user
  async getUpcoming(userId: string, days: number = 30) {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + days);

    const { data, error } = await supabase
      .from('special_dates')
      .select('*, person:people(*)')
      .eq('user_id', userId)
      .gte('date', today.toISOString())
      .lte('date', future.toISOString())
      .order('date');
      
    return { data, error };
  },

  // Create a special date
  async create(date: any) {
    const { data, error } = await supabase
      .from('special_dates')
      .insert(date)
      .select()
      .single();
      
    return { data, error };
  },

  // Update a special date
  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('special_dates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    return { data, error };
  },

  // Delete a special date
  async delete(id: string) {
    const { error } = await supabase
      .from('special_dates')
      .delete()
      .eq('id', id);
      
    return { error };
  },
};
