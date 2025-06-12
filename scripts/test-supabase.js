// Test script to verify Supabase connection and examine existing data
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔗 Testing Supabase connection...');

  try {
    // Test basic connection with count
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Connection failed:', countError.message);
      return;
    }

    console.log('✅ Connection successful!');
    console.log(`📊 Total products: ${count || 0}`);

    // Get sample data to understand current schema
    const { data: sampleData, error: sampleError } = await supabase
      .from('products')
      .select('*')
      .limit(3);

    if (sampleError) {
      console.error('❌ Error fetching sample data:', sampleError.message);
      return;
    }

    if (sampleData && sampleData.length > 0) {
      console.log('\n📋 Current table schema (based on sample data):');
      const firstProduct = sampleData[0];
      Object.keys(firstProduct).forEach((key) => {
        const value = firstProduct[key];
        const type = value === null ? 'null' : typeof value;
        console.log(`  ${key}: ${type}`);
      });

      console.log('\n📦 Sample products:');
      sampleData.forEach((product, index) => {
        console.log(
          `  ${index + 1}. ${product.name || 'Unnamed'} - ${product.status || 'No status'}`
        );
      });
    } else {
      console.log('\n📭 No existing products found - ready for fresh start!');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

testConnection();
