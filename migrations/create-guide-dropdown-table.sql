-- Create table for guide dropdown content
CREATE TABLE IF NOT EXISTS guide_dropdown_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  link_url VARCHAR(500) NOT NULL,
  badge_text VARCHAR(50),
  badge_color VARCHAR(50) DEFAULT 'blue',
  rating DECIMAL(3,1),
  tags TEXT[], -- Array of tag strings
  slot_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_guide_dropdown_slot ON guide_dropdown_items(slot_index);

-- Insert some default guide content
INSERT INTO guide_dropdown_items (title, description, image_url, link_url, badge_text, badge_color, rating, tags, slot_index) VALUES
('Mattress Buying Guide', 'Complete guide to choosing the right mattress', '/placeholder.jpg', '/guides', 'NEW', 'red', 4.9, ARRAY['Expert Tips', 'Step-by-Step'], 0),
('Sleep Tips Guide', 'Expert tips for better sleep quality', '/placeholder.jpg', '/guides', 'POPULAR', 'blue', 4.8, ARRAY['Sleep Science', 'Proven Methods'], 1),
('Bedroom Design Guide', 'Create your perfect sleep sanctuary', '/placeholder.jpg', '/guides', 'TRENDING', 'green', 4.7, ARRAY['Interior Tips', 'Color Schemes'], 2),
('Furniture Care Guide', 'Maintain your furniture for years', '/placeholder.jpg', '/guides', 'ESSENTIAL', 'purple', 4.9, ARRAY['Maintenance', 'Longevity'], 3);
