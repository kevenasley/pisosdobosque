REVOKE ALL ON FUNCTION public.get_meta_dashboard_data() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.sync_meta_ads_rpc() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_meta_dashboard_data() TO authenticated;
GRANT EXECUTE ON FUNCTION public.sync_meta_ads_rpc() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_meta_dashboard_data() TO service_role;
GRANT EXECUTE ON FUNCTION public.sync_meta_ads_rpc() TO service_role;
