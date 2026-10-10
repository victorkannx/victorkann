-- Victor Kann: Conversion Leak Scoreboard persistence.
-- Prepared for a NEW, user-controlled Supabase project. Do not apply to the
-- Lovable Cloud project or any production database until the target is verified.
-- Requires the existing public.app_role enum and private.has_role() helper
-- from the baseline project migrations.

CREATE TABLE IF NOT EXISTS public.scoreboard_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  name TEXT,
  consent BOOLEAN NOT NULL DEFAULT FALSE CHECK (consent = TRUE),
  source TEXT NOT NULL DEFAULT 'x',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT scoreboard_leads_email_format
    CHECK (email = lower(trim(email)) AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  CONSTRAINT scoreboard_leads_submission_email_unique UNIQUE (submission_id, email)
);

CREATE TABLE IF NOT EXISTS public.scoreboard_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  answers JSONB NOT NULL,
  stage_scores JSONB NOT NULL,
  score SMALLINT NOT NULL CHECK (score BETWEEN 0 AND 20),
  priority_leak TEXT NOT NULL CHECK (length(trim(priority_leak)) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT scoreboard_assessments_lead_fk
    FOREIGN KEY (submission_id, email)
    REFERENCES public.scoreboard_leads (submission_id, email)
    ON DELETE CASCADE,
  CONSTRAINT scoreboard_assessments_email_format
    CHECK (email = lower(trim(email)) AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  CONSTRAINT scoreboard_assessments_answers_shape
    CHECK (jsonb_typeof(answers) = 'array' AND jsonb_array_length(answers) = 10),
  CONSTRAINT scoreboard_assessments_stage_scores_shape
    CHECK (jsonb_typeof(stage_scores) = 'object' AND jsonb_object_length(stage_scores) = 5)
);

CREATE OR REPLACE FUNCTION private.validate_scoreboard_assessment()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, private
AS $$
DECLARE
  answer_total INTEGER;
  stage_total INTEGER;
  highest_stage_score INTEGER;
BEGIN
  NEW.email := lower(trim(NEW.email));
  NEW.priority_leak := trim(NEW.priority_leak);

  IF jsonb_typeof(NEW.answers) <> 'array'
     OR jsonb_array_length(NEW.answers) <> 10 THEN
    RAISE EXCEPTION 'Scoreboard answers must contain exactly 10 values';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements_text(NEW.answers) AS a(value)
    WHERE a.value !~ '^[0-2]$'
  ) THEN
    RAISE EXCEPTION 'Each answer must be an integer from 0 to 2';
  END IF;

  SELECT COALESCE(SUM(a.value::INTEGER), 0)
    INTO answer_total
  FROM jsonb_array_elements_text(NEW.answers) AS a(value);

  IF jsonb_typeof(NEW.stage_scores) <> 'object'
     OR jsonb_object_length(NEW.stage_scores) <> 5 THEN
    RAISE EXCEPTION 'Stage scores must contain exactly five stages';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_each_text(NEW.stage_scores) AS s(stage, value)
    WHERE s.value !~ '^[0-4]$'
  ) THEN
    RAISE EXCEPTION 'Each stage score must be an integer from 0 to 4';
  END IF;

  SELECT COALESCE(SUM(s.value::INTEGER), 0), COALESCE(MAX(s.value::INTEGER), -1)
    INTO stage_total, highest_stage_score
  FROM jsonb_each_text(NEW.stage_scores) AS s(stage, value);

  IF answer_total <> stage_total OR answer_total NOT BETWEEN 0 AND 20 THEN
    RAISE EXCEPTION 'Answer total and stage-score total must match and be between 0 and 20';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM jsonb_each_text(NEW.stage_scores) AS s(stage, value)
    WHERE s.stage = NEW.priority_leak
      AND s.value::INTEGER = highest_stage_score
  ) THEN
    RAISE EXCEPTION 'Priority leak must be a highest-scoring stage key';
  END IF;

  -- Derive the total on the database side instead of trusting the browser.
  NEW.score := answer_total;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_scoreboard_assessment_before_write
  ON public.scoreboard_assessments;
CREATE TRIGGER validate_scoreboard_assessment_before_write
  BEFORE INSERT OR UPDATE ON public.scoreboard_assessments
  FOR EACH ROW
  EXECUTE FUNCTION private.validate_scoreboard_assessment();

ALTER TABLE public.scoreboard_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scoreboard_assessments ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON public.scoreboard_leads TO anon, authenticated;
GRANT INSERT ON public.scoreboard_assessments TO anon, authenticated;
GRANT SELECT ON public.scoreboard_leads TO authenticated;
GRANT SELECT ON public.scoreboard_assessments TO authenticated;
GRANT ALL ON public.scoreboard_leads TO service_role;
GRANT ALL ON public.scoreboard_assessments TO service_role;

DROP POLICY IF EXISTS "Public can submit scoreboard leads" ON public.scoreboard_leads;
CREATE POLICY "Public can submit scoreboard leads"
  ON public.scoreboard_leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (consent = TRUE);

DROP POLICY IF EXISTS "Admins can view scoreboard leads" ON public.scoreboard_leads;
CREATE POLICY "Admins can view scoreboard leads"
  ON public.scoreboard_leads
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public can submit scoreboard assessments" ON public.scoreboard_assessments;
CREATE POLICY "Public can submit scoreboard assessments"
  ON public.scoreboard_assessments
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view scoreboard assessments" ON public.scoreboard_assessments;
CREATE POLICY "Admins can view scoreboard assessments"
  ON public.scoreboard_assessments
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

REVOKE UPDATE, DELETE ON public.scoreboard_leads FROM anon, authenticated;
REVOKE UPDATE, DELETE ON public.scoreboard_assessments FROM anon, authenticated;
