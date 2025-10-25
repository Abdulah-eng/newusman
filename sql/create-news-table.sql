-- Create news table for press releases and company news
CREATE TABLE IF NOT EXISTS news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    read_time VARCHAR(50) DEFAULT '5 min read',
    author VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    image VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(featured);
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_news_updated_at 
    BEFORE UPDATE ON news 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO news (title, excerpt, category, read_time, author, date, image, featured, tags) VALUES
(
    'Bedora Living Launches Revolutionary Sleep Technology',
    'New hybrid mattress collection combines advanced cooling technology with premium comfort materials for the ultimate sleep experience.',
    'Product Launch',
    '5 min read',
    'Press Team',
    '2024-01-20',
    '/press-tech-launch.jpg',
    true,
    ARRAY['technology', 'launch', 'innovation']
),
(
    'Bedora Living Expands UK Operations with New Distribution Center',
    'Strategic expansion to better serve customers across the United Kingdom with faster delivery and improved service.',
    'Business News',
    '4 min read',
    'Business Team',
    '2024-01-15',
    '/press-expansion.jpg',
    true,
    ARRAY['expansion', 'business', 'uk']
),
(
    'Bedora Living Partners with Leading Sleep Research Institute',
    'Collaboration aims to advance sleep science and develop next-generation mattress technologies.',
    'Partnership',
    '6 min read',
    'Research Team',
    '2024-01-10',
    '/press-partnership.jpg',
    false,
    ARRAY['partnership', 'research', 'science']
),
(
    'Bedora Living Receives Best Mattress Brand 2024 Award',
    'Industry recognition for excellence in product quality, customer service, and innovation.',
    'Awards',
    '3 min read',
    'Awards Team',
    '2024-01-05',
    '/press-award.jpg',
    false,
    ARRAY['award', 'recognition', 'excellence']
),
(
    'Bedora Living Announces 14-Night Trial Program',
    'New customer-friendly trial program allows customers to test mattresses risk-free for 14 nights.',
    'Customer Service',
    '4 min read',
    'Customer Team',
    '2024-01-01',
    '/press-trial.jpg',
    false,
    ARRAY['trial', 'customer service', 'guarantee']
),
(
    'Bedora Living Opens New Showroom in London',
    'Flagship showroom in central London showcases the latest in sleep technology and bedroom design.',
    'Retail',
    '5 min read',
    'Retail Team',
    '2023-12-28',
    '/press-showroom.jpg',
    false,
    ARRAY['showroom', 'retail', 'london']
);

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL ON news TO authenticated;
-- GRANT ALL ON news TO anon;
