ALTER TABLE public.prospects ALTER COLUMN source SET DEFAULT 'Direct';
UPDATE public.prospects SET source = 'Direct' WHERE source IS NULL;
ALTER TABLE public.prospects ADD COLUMN IF NOT EXISTS investment_tier text;
ALTER TABLE public.prospects ADD COLUMN IF NOT EXISTS submission_id uuid;
CREATE UNIQUE INDEX IF NOT EXISTS prospects_submission_id_key ON public.prospects(submission_id) WHERE submission_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.prospects_default_source()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF NEW.source IS NULL OR trim(NEW.source) = '' THEN NEW.source := 'Direct'; END IF;
  NEW.source := left(trim(NEW.source), 100);
  IF NEW.investment_tier IS NOT NULL AND NEW.investment_tier NOT IN ('tier_1','tier_2','tier_3','tier_4','tier_5') THEN
    RAISE EXCEPTION 'Invalid investment tier';
  END IF;
  IF NEW.status NOT IN ('New','Contacted','Qualified','Call Booked','Proposal','Client','Not Now') THEN
    RAISE EXCEPTION 'Invalid status';
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS prospects_default_source ON public.prospects;
CREATE TRIGGER prospects_default_source BEFORE INSERT OR UPDATE ON public.prospects
FOR EACH ROW EXECUTE FUNCTION public.prospects_default_source();