CREATE OR REPLACE FUNCTION public.get_meta_dashboard_data()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    daily_stats JSONB;
    last_sync_val TIMESTAMPTZ;
BEGIN
    -- Verificar se o usuário está autenticado
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;

    SELECT jsonb_agg(d) INTO daily_stats
    FROM (
        SELECT * FROM meta_ads_daily ORDER BY date DESC
    ) d;

    SELECT completed_at INTO last_sync_val
    FROM meta_ads_sync_runs
    WHERE status = 'success'
    ORDER BY completed_at DESC
    LIMIT 1;

    RETURN jsonb_build_object(
        'dailyStats', COALESCE(daily_stats, '[]'::jsonb),
        'lastSync', last_sync_val
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_meta_dashboard_data() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_meta_dashboard_data() TO service_role;

CREATE OR REPLACE FUNCTION public.sync_meta_ads_rpc()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Verificar se o usuário está autenticado
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;

    RETURN jsonb_build_object(
        'error', 'Meta Ads ainda não configurado',
        'code', 'CONFIG_MISSING'
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.sync_meta_ads_rpc() TO authenticated;
GRANT EXECUTE ON FUNCTION public.sync_meta_ads_rpc() TO service_role;
