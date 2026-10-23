CREATE TABLE public.apk_download_events (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.apk_download_events TO service_role;
ALTER TABLE public.apk_download_events ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION public.get_apk_download_count()
RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT 10200 + count(*) FROM public.apk_download_events; $$;
REVOKE ALL ON FUNCTION public.get_apk_download_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_apk_download_count() TO anon, authenticated, service_role;

CREATE FUNCTION public.record_apk_download(p_event_id uuid)
RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF p_event_id IS NULL THEN RAISE EXCEPTION 'Download event required'; END IF;
  INSERT INTO public.apk_download_events(id) VALUES (p_event_id) ON CONFLICT (id) DO NOTHING;
  RETURN (SELECT 10200 + count(*) FROM public.apk_download_events);
END;
$$;
REVOKE ALL ON FUNCTION public.record_apk_download(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_apk_download(uuid) TO anon, authenticated, service_role;