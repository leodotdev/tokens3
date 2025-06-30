const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSchema() {
  try {
    // Get table schema
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('Products table exists');
    
    // Try to get one product to see the schema
    const { data: products, error: selectError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
      
    if (products && products.length > 0) {
      console.log('Sample product columns:', Object.keys(products[0]));
    } else {
      console.log('No products found, will insert a test product to see schema');
      
      // Try to insert a minimal product to see what columns exist
      const { data: insertData, error: insertError } = await supabase
        .from('products')
        .insert({
          name: 'Test Product',
          description: 'Test description',
          category: 'Test',
          price: 10.99
        })
        .select();
        
      if (insertError) {
        console.error('Insert error:', insertError);
      } else {
        console.log('Test product columns:', Object.keys(insertData[0]));
        
        // Delete the test product
        await supabase
          .from('products')
          .delete()
          .eq('name', 'Test Product');
      }
    }
    
  } catch (error) {
    console.error('Schema check failed:', error);
  }
}

checkSchema();