
-- Add ban columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_banned boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ban_reason text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS banned_at timestamptz;

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS public.admin_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (needed for maintenance mode check etc.)
CREATE POLICY "Anyone can read settings" ON public.admin_settings FOR SELECT USING (true);
-- Allow anyone to update settings (admin auth is handled at app level)
CREATE POLICY "Anyone can update settings" ON public.admin_settings FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert settings" ON public.admin_settings FOR INSERT WITH CHECK (true);

-- Pre-populate settings
INSERT INTO public.admin_settings (key, value) VALUES
  ('free_daily_limit', '5'),
  ('starter_monthly_limit', '150'),
  ('pro_monthly_limit', '300'),
  ('business_monthly_limit', '1000'),
  ('mtn_momo_number', '0760325115'),
  ('airtel_number', '0758246468'),
  ('support_email', 'support@momosense.app'),
  ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;
