import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://victorkann.com",
  "https://www.victorkann.com",
  "https://victorkann-git-feat-crm-lead-intake-victorkannx-6846s-projects.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
]);
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && allowedOrigins.has(origin) ? origin : "https://victorkann.com",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});
const reply = (data: Record<string, unknown>, status: number, origin: string | null) =>
  new Response(JSON.stringify(data), { status, headers: { ...cors(origin), "Content-Type": "application/json" } });
const textValue = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
const validScore = (value: unknown) => typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 2;

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(origin) });
  if (req.method !== "POST") return reply({ error: "Method not allowed." }, 405, origin);
  if (!origin || !allowedOrigins.has(origin)) return reply({ error: "Origin not allowed." }, 403, origin);

  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return reply({ error: "Invalid request." }, 400, origin);
    if (textValue(body.company_website, 200)) return reply({ ok: true }, 200, origin);

    const fullName = textValue(body.full_name, 160);
    const email = textValue(body.email, 320).toLowerCase();
    const consent = body.follow_up_consent === true;
    if (fullName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return reply({ error: "Please enter a valid name and email address." }, 422, origin);
    }
    if (!consent) return reply({ error: "Please confirm that we may contact you about your review." }, 422, origin);

    const stageKeys = ["attention", "capture", "response", "follow_up", "conversion"] as const;
    const allowedStages = new Set<string>(stageKeys);
    const assessment = body.assessment && typeof body.assessment === "object" ? body.assessment : null;
    let scores: Record<string, number> | null = null;
    let priorityAreas: string[] = [];
    let answers: Record<string, unknown> = {};
    if (assessment) {
      const raw = assessment.scores;
      if (!raw || typeof raw !== "object" || !stageKeys.every((key) => validScore(raw[key]))) {
        return reply({ error: "Assessment scores are incomplete. Please retake the assessment." }, 422, origin);
      }
      scores = Object.fromEntries(stageKeys.map((key) => [key, raw[key]]));
      if (Array.isArray(assessment.priority_areas)) {
        priorityAreas = assessment.priority_areas.filter((key: unknown) => typeof key === "string" && allowedStages.has(key)).slice(0, 5);
      }
      if (assessment.answers && typeof assessment.answers === "object" && !Array.isArray(assessment.answers)) {
        answers = Object.fromEntries(Object.entries(assessment.answers).filter(([key, value]) => allowedStages.has(key) && validScore(value)));
      }
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) throw new Error("Server configuration is incomplete.");
    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

    // Store only a one-way hash of the forwarded IP. Limit each IP to 5 submissions per 15 minutes.
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip + supabaseUrl));
    const ipHash = Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
    const rateTable = admin.from("crm_intake_rate_limits");
    const { data: rate, error: readError } = await rateTable.select("window_started_at,request_count").eq("ip_hash", ipHash).maybeSingle();
    if (readError) throw readError;
    const now = Date.now();
    const withinWindow = rate && now - new Date(rate.window_started_at).getTime() < 900000;
    if (withinWindow && rate.request_count >= 5) return reply({ error: "Too many attempts. Please try again shortly." }, 429, origin);
    const { error: writeError } = await rateTable.upsert({
      ip_hash: ipHash,
      window_started_at: withinWindow ? rate.window_started_at : new Date().toISOString(),
      request_count: withinWindow ? rate.request_count + 1 : 1,
      updated_at: new Date().toISOString(),
    }, { onConflict: "ip_hash" });
    if (writeError) throw writeError;

    const { data: existing, error: lookupError } = await admin.from("crm_leads").select("id,status").eq("email", email).maybeSingle();
    if (lookupError) throw lookupError;
    const serviceInterest = textValue(body.service_interest, 120) || "free_conversion_review";
    const lead = {
      full_name: fullName, email, whatsapp: textValue(body.whatsapp, 40) || null,
      country: textValue(body.country, 100) || null, website_url: textValue(body.website_url, 2048) || null,
      business_name: textValue(body.business_name, 200) || null, business_type: textValue(body.business_type, 120) || null,
      primary_challenge: textValue(body.primary_challenge, 2000) || null, desired_outcome: textValue(body.desired_outcome, 2000) || null,
      status: existing?.status ?? "review_requested", source: "victorkann.com", source_detail: serviceInterest,
      utm_source: textValue(body.utm_source, 200) || null, utm_medium: textValue(body.utm_medium, 200) || null,
      utm_campaign: textValue(body.utm_campaign, 200) || null, utm_content: textValue(body.utm_content, 200) || null,
      utm_term: textValue(body.utm_term, 200) || null, follow_up_consent: true,
      consent_text_version: textValue(body.consent_text_version, 40) || "follow-up-v1", consent_at: new Date().toISOString(),
    };
    let leadId = existing?.id;
    if (leadId) {
      const { error } = await admin.from("crm_leads").update(lead).eq("id", leadId);
      if (error) throw error;
    } else {
      const { data, error } = await admin.from("crm_leads").insert(lead).select("id").single();
      if (error) throw error;
      leadId = data.id;
    }
    if (scores) {
      const { error } = await admin.from("crm_assessments").insert({
        lead_id: leadId, attention_score: scores.attention, capture_score: scores.capture,
        response_score: scores.response, follow_up_score: scores.follow_up, conversion_score: scores.conversion,
        priority_areas: priorityAreas, answers, assessment_version: "scoreboard-v1",
      });
      if (error) throw error;
    }
    const { error: activityError } = await admin.from("crm_activities").insert({
      lead_id: leadId, activity_type: "review_requested", subject: "Free Conversion Review requested",
      body: scores ? "Lead submitted the Conversion Leak Scoreboard and requested a free review." : "Lead requested a free Conversion Review.",
      metadata: { service_interest: serviceInterest, assessment_submitted: Boolean(scores) },
    });
    if (activityError) throw activityError;
    return reply({ ok: true, message: "Your request has been received." }, 201, origin);
  } catch (error) {
    console.error("lead-intake error", error);
    return reply({ error: "We couldn't submit your request just now. Please try again." }, 500, origin);
  }
});
