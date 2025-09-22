-- Migration: Create promotional popup settings table
-- Stores admin-editable content and behavior for the promotional popup

CREATE TABLE IF NOT EXISTS public.promotional_popup_settings (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    enabled BOOLEAN DEFAULT TRUE,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    button_text TEXT,
    show_delay_ms INTEGER DEFAULT 3000,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.promotional_popup_settings ENABLE ROW LEVEL SECURITY;

-- Allow read for all, write for authenticated
DO $$ BEGIN
  CREATE POLICY "promotional_popup_read_all"
  ON public.promotional_popup_settings FOR SELECT
  TO public USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "promotional_popup_write_auth"
  ON public.promotional_popup_settings FOR ALL
  TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Seed a default row if none exists
INSERT INTO public.promotional_popup_settings (enabled, title, subtitle, description, button_text, show_delay_ms)
SELECT TRUE,
       'FIRST TIMER?',
       '20% OFF',
       '& FREE SHIPPING ON YOUR FIRST ORDER.',
       'GET THE OFFER',
       3000
WHERE NOT EXISTS (SELECT 1 FROM public.promotional_popup_settings);

COMMENT ON TABLE public.promotional_popup_settings IS 'Admin-editable settings for the promotional popup.';

