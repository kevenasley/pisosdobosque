-- Create meta_ads_daily table
CREATE TABLE public.meta_ads_daily (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    date date NOT NULL,
    account_id text NOT NULL,
    campaign_id text NOT NULL,
    campaign_name text NOT NULL,
    campaign_status text NOT NULL,
    objective text,
    spend numeric(12,2) NOT NULL DEFAULT 0,
    impressions bigint NOT NULL DEFAULT 0,
    reach bigint NOT NULL DEFAULT 0,
    clicks bigint NOT NULL DEFAULT 0,
    link_clicks bigint NOT NULL DEFAULT 0,
    ctr numeric(10,6),
    cpc numeric(12,4),
    cpm numeric(12,4),
    frequency numeric(10,6),
    leads bigint,
    cpl numeric(12,4),
    lead_action_type text,
    updated_at timestamptz DEFAULT now(),
    UNIQUE(date, campaign_id)
);

-- Create meta_ads_sync_runs table
CREATE TABLE public.meta_ads_sync_runs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    started_at timestamptz DEFAULT now(),
    finished_at timestamptz,
    status text NOT NULL, -- 'running', 'success', 'error'
    date_from date,
    date_to date,
    records_processed integer DEFAULT 0,
    error_message text
);

-- Create meta_ads_config table
CREATE TABLE public.meta_ads_config (
    key text PRIMARY KEY,
    value jsonb NOT NULL,
    updated_at timestamptz DEFAULT now()
);

-- RLS and Grants
GRANT SELECT ON public.meta_ads_daily TO authenticated;
GRANT ALL ON public.meta_ads_daily TO service_role;

GRANT SELECT ON public.meta_ads_sync_runs TO authenticated;
GRANT ALL ON public.meta_ads_sync_runs TO service_role;

GRANT SELECT ON public.meta_ads_config TO authenticated;
GRANT ALL ON public.meta_ads_config TO service_role;

ALTER TABLE public.meta_ads_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_ads_sync_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_ads_config ENABLE ROW LEVEL SECURITY;

-- Simple policies (only authenticated users can read)
CREATE POLICY "Authenticated users can read daily stats" ON public.meta_ads_daily FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read sync runs" ON public.meta_ads_sync_runs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read config" ON public.meta_ads_config FOR SELECT TO authenticated USING (true);

-- Functions and Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_meta_ads_daily_update
    BEFORE UPDATE ON public.meta_ads_daily
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_meta_ads_config_update
    BEFORE UPDATE ON public.meta_ads_config
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
