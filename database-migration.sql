-- Database migration to enhance existing products table
-- Run this in your Supabase SQL editor if these columns don't exist

-- Add new columns to existing products table (safely)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS original_price DECIMAL,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS last_checked TIMESTAMPTZ;

-- Update status column to use proper enum values (if needed)
-- Note: Only run if your current status column is different
-- ALTER TABLE products 
-- ADD CONSTRAINT status_check CHECK (status IN ('active', 'wishlist', 'purchased', 'discontinued'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_status_idx ON products(status);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_priority_idx ON products(priority);
CREATE INDEX IF NOT EXISTS products_updated_at_idx ON products(updated_at);

-- Enable Row Level Security (recommended)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Example RLS policy (adjust based on your auth setup)
-- CREATE POLICY "Users can view all products" ON products
--   FOR SELECT USING (true);
-- 
-- CREATE POLICY "Users can insert products" ON products
--   FOR INSERT WITH CHECK (true);
-- 
-- CREATE POLICY "Users can update products" ON products
--   FOR UPDATE USING (true);
-- 
-- CREATE POLICY "Users can delete products" ON products
--   FOR DELETE USING (true);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();