-- Add user features to tokens3
-- Run this migration when you have database access

-- Add user_id to products table (optional - for personal products)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Create lists table
CREATE TABLE IF NOT EXISTS lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create list_products junction table
CREATE TABLE IF NOT EXISTS list_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(list_id, product_id)
);

-- Create bookmarks table (renamed from quicksave)
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create likes table (hearts)
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_is_public ON products(is_public);
CREATE INDEX IF NOT EXISTS idx_lists_user_id ON lists(user_id);
CREATE INDEX IF NOT EXISTS idx_list_products_list_id ON list_products(list_id);
CREATE INDEX IF NOT EXISTS idx_list_products_product_id ON list_products(product_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_product_id ON bookmarks(product_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_product_id ON likes(product_id);

-- Enable RLS on all tables
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view public products or their own" ON products;
DROP POLICY IF EXISTS "Users can insert their own products" ON products;
DROP POLICY IF EXISTS "Users can update their own products" ON products;
DROP POLICY IF EXISTS "Users can delete their own products" ON products;

-- Products policies: users can see public products or their own
CREATE POLICY "Users can view public products or their own" ON products
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own products" ON products
  FOR INSERT WITH CHECK (auth.uid() = user_id OR (user_id IS NULL AND is_public = true));

CREATE POLICY "Users can update their own products" ON products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" ON products
  FOR DELETE USING (auth.uid() = user_id);

-- Lists policies
CREATE POLICY "Users can view their own lists" ON lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lists" ON lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lists" ON lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists" ON lists
  FOR DELETE USING (auth.uid() = user_id);

-- List products policies
CREATE POLICY "Users can view products in their lists" ON list_products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lists 
      WHERE lists.id = list_products.list_id 
      AND lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add products to their lists" ON list_products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM lists 
      WHERE lists.id = list_products.list_id 
      AND lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove products from their lists" ON list_products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM lists 
      WHERE lists.id = list_products.list_id 
      AND lists.user_id = auth.uid()
    )
  );

-- Bookmarks policies
CREATE POLICY "Users can view their own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Users can view all likes" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own likes" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- Add updated_at trigger for lists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_lists_updated_at ON lists;
CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();