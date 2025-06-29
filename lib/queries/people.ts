import { supabase } from '../supabase';
import type { Person, SpecialDate, GiftGiven, PersonProductBookmark } from '../supabase';

export const peopleQueries = {
  // Get all people for a user
  async getAll(userId: string) {
    return await supabase
      .from('people')
      .select('*')
      .eq('user_id', userId)
      .order('name');
  },

  // Get a single person
  async getById(id: string) {
    return await supabase
      .from('people')
      .select('*')
      .eq('id', id)
      .single();
  },

  // Create a new person
  async create(person: Omit<Person, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase
      .from('people')
      .insert(person)
      .select()
      .single();
  },

  // Update a person
  async update(id: string, updates: Partial<Person>) {
    return await supabase
      .from('people')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  },

  // Delete a person
  async delete(id: string) {
    return await supabase
      .from('people')
      .delete()
      .eq('id', id);
  },
};

export const specialDatesQueries = {
  // Get all special dates for a person
  async getByPerson(personId: string) {
    return await supabase
      .from('special_dates')
      .select('*')
      .eq('person_id', personId)
      .order('date');
  },

  // Get upcoming dates for a user
  async getUpcoming(userId: string, days: number = 30) {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + days);

    return await supabase
      .from('special_dates')
      .select('*, person:people(*)')
      .eq('user_id', userId)
      .gte('date', today.toISOString())
      .lte('date', future.toISOString())
      .order('date');
  },

  // Create a special date
  async create(date: Omit<SpecialDate, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase
      .from('special_dates')
      .insert(date)
      .select()
      .single();
  },

  // Update a special date
  async update(id: string, updates: Partial<SpecialDate>) {
    return await supabase
      .from('special_dates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  },

  // Delete a special date
  async delete(id: string) {
    return await supabase
      .from('special_dates')
      .delete()
      .eq('id', id);
  },
};

export const giftsGivenQueries = {
  // Get all gifts given to a person
  async getByPerson(personId: string) {
    return await supabase
      .from('gifts_given')
      .select('*, product:products(*)')
      .eq('person_id', personId)
      .order('date_given', { ascending: false });
  },

  // Create a gift given record
  async create(gift: Omit<GiftGiven, 'id' | 'created_at'>) {
    return await supabase
      .from('gifts_given')
      .insert(gift)
      .select()
      .single();
  },

  // Delete a gift given record
  async delete(id: string) {
    return await supabase
      .from('gifts_given')
      .delete()
      .eq('id', id);
  },
};

export const personBookmarksQueries = {
  // Get all bookmarks for a person
  async getByPerson(personId: string) {
    return await supabase
      .from('person_product_bookmarks')
      .select('*, product:products(*)')
      .eq('person_id', personId)
      .order('created_at', { ascending: false });
  },

  // Create a bookmark for a person
  async create(bookmark: {
    person_id: string;
    product_id: string;
    user_id: string;
    notes?: string;
  }) {
    return await supabase
      .from('person_product_bookmarks')
      .insert(bookmark)
      .select()
      .single();
  },

  // Delete a bookmark
  async delete(id: string) {
    return await supabase
      .from('person_product_bookmarks')
      .delete()
      .eq('id', id);
  },
};