-- Create lists table for organizing products
CREATE TABLE IF NOT EXISTS lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  criteria TEXT, -- AI-parsed criteria like "under $100", "for tech lovers"
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create list_products junction table
CREATE TABLE IF NOT EXISTS list_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  ai_suggested BOOLEAN DEFAULT false, -- Whether this was suggested by AI
  UNIQUE(list_id, product_id)
);

-- Enable RLS
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_products ENABLE ROW LEVEL SECURITY;

-- Create policies for lists
CREATE POLICY "Users can view their own lists" ON lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lists" ON lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lists" ON lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists" ON lists
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for list_products
CREATE POLICY "Users can view products in their lists" ON list_products
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM lists WHERE lists.id = list_products.list_id AND lists.user_id = auth.uid()
  ));

CREATE POLICY "Users can add products to their lists" ON list_products
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM lists WHERE lists.id = list_products.list_id AND lists.user_id = auth.uid()
  ));

CREATE POLICY "Users can update products in their lists" ON list_products
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM lists WHERE lists.id = list_products.list_id AND lists.user_id = auth.uid()
  ));

CREATE POLICY "Users can remove products from their lists" ON list_products
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM lists WHERE lists.id = list_products.list_id AND lists.user_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS lists_user_id_idx ON lists(user_id);
CREATE INDEX IF NOT EXISTS lists_created_at_idx ON lists(created_at);
CREATE INDEX IF NOT EXISTS list_products_list_id_idx ON list_products(list_id);
CREATE INDEX IF NOT EXISTS list_products_product_id_idx ON list_products(product_id);

-- Create updated_at trigger for lists
CREATE OR REPLACE FUNCTION update_lists_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lists_updated_at_trigger
  BEFORE UPDATE ON lists
  FOR EACH ROW
  EXECUTE FUNCTION update_lists_updated_at();