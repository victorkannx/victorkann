CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

CREATE TABLE public.prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  country TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  business_type TEXT NOT NULL,
  service_interest TEXT NOT NULL,
  challenge TEXT NOT NULL,
  desired_outcome TEXT NOT NULL,
  investment_range TEXT NOT NULL,
  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  whatsapp_clicked BOOLEAN NOT NULL DEFAULT false,
  cal_clicked BOOLEAN NOT NULL DEFAULT false,
  email_clicked BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT prospects_status_check CHECK (status IN ('New', 'Contacted', 'Qualified', 'Call Booked', 'Proposal', 'Client', 'Not Now'))
);

GRANT INSERT ON public.prospects TO anon;
GRANT SELECT, INSERT, UPDATE ON public.prospects TO authenticated;
GRANT ALL ON public.prospects TO service_role;

ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public visitors can create prospects"
  ON public.prospects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view prospects"
  ON public.prospects
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update prospects"
  ON public.prospects
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.currency_for_country(p_country TEXT)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE lower(trim(p_country))
    WHEN 'nigeria' THEN 'NGN'
    WHEN 'united states' THEN 'USD'
    WHEN 'united kingdom' THEN 'GBP'
    WHEN 'canada' THEN 'CAD'
    WHEN 'australia' THEN 'AUD'
    WHEN 'ghana' THEN 'GHS'
    WHEN 'kenya' THEN 'KES'
    WHEN 'south africa' THEN 'ZAR'
    WHEN 'germany' THEN 'EUR'
    WHEN 'france' THEN 'EUR'
    WHEN 'netherlands' THEN 'EUR'
    ELSE 'USD'
  END;
$$;

CREATE OR REPLACE FUNCTION public.prospects_validate_and_set_currency()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  currency_symbol TEXT;
  normalized_investment TEXT;
BEGIN
  NEW.name := trim(NEW.name);
  NEW.email := lower(trim(NEW.email));
  NEW.whatsapp := trim(NEW.whatsapp);
  NEW.country := trim(NEW.country);
  NEW.business_type := trim(NEW.business_type);
  NEW.service_interest := trim(NEW.service_interest);
  NEW.challenge := trim(NEW.challenge);
  NEW.desired_outcome := trim(NEW.desired_outcome);
  NEW.investment_range := trim(NEW.investment_range);

  IF NEW.name = '' OR NEW.email = '' OR NEW.whatsapp = '' OR NEW.country = ''
     OR NEW.business_type = '' OR NEW.service_interest = '' OR NEW.challenge = ''
     OR NEW.desired_outcome = '' OR NEW.investment_range = '' THEN
    RAISE EXCEPTION 'Required prospect fields cannot be empty';
  END IF;

  IF NEW.email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
    RAISE EXCEPTION 'Please provide a valid email address';
  END IF;

  IF NEW.whatsapp !~ '^[+0-9][0-9 ()-]{6,}$' OR length(regexp_replace(NEW.whatsapp, '[^0-9]', '', 'g')) < 7 THEN
    RAISE EXCEPTION 'Please provide a valid WhatsApp number';
  END IF;

  NEW.currency := public.currency_for_country(NEW.country);

  currency_symbol := CASE NEW.currency
    WHEN 'NGN' THEN '₦'
    WHEN 'USD' THEN '$'
    WHEN 'GBP' THEN '£'
    WHEN 'CAD' THEN 'C$'
    WHEN 'AUD' THEN 'A$'
    WHEN 'GHS' THEN 'GH₵'
    WHEN 'KES' THEN 'KSh'
    WHEN 'ZAR' THEN 'R'
    WHEN 'EUR' THEN '€'
    ELSE NEW.currency
  END;

  normalized_investment := lower(NEW.investment_range);
  IF position(lower(NEW.currency) IN normalized_investment) = 0
     AND position(lower(currency_symbol) IN normalized_investment) = 0 THEN
    RAISE EXCEPTION 'Investment range must use the currency generated from the selected country';
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_prospects_before_write
  BEFORE INSERT OR UPDATE ON public.prospects
  FOR EACH ROW
  EXECUTE FUNCTION public.prospects_validate_and_set_currency();

CREATE OR REPLACE FUNCTION public.update_prospects_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_prospects_updated_at
  BEFORE UPDATE ON public.prospects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_prospects_updated_at();