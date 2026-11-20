import { createContext, useCallback, useContext, useMemo, useState, type FormEvent, type ReactNode } from "react";

const CAL_BASE = "https://cal.com/kanayo/15";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
type StageKey = "attention" | "capture" | "response" | "follow_up" | "conversion";
type AssessmentPayload = { scores: Record<StageKey, 0 | 1 | 2>; priority_areas: StageKey[]; answers: Partial<Record<StageKey, 0 | 1 | 2>> };
type BookingContextValue = { openLeadForm: (source?: string, assessment?: AssessmentPayload) => void };
const BookingContext = createContext<BookingContextValue>({ openLeadForm: () => {} });
export function useLeadForm() { return useContext(BookingContext); }

export function LeadFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState("Free Conversion Review");
  const [assessment, setAssessment] = useState<AssessmentPayload | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<Record<string, FormDataEntryValue> | null>(null);

  const openLeadForm = useCallback((nextSource?: string, nextAssessment?: AssessmentPayload) => {
    setSource(nextSource || "Free Conversion Review"); setAssessment(nextAssessment); setError(""); setSubmitted(false); setIsOpen(true);
  }, []);
  const closeLeadForm = () => { if (!submitting) setIsOpen(false); };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const params = new URLSearchParams(window.location.search);
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) { setError("The form is not configured yet. Please contact us directly by email."); return; }
    setSubmitting(true);
    try {
      const response = await fetch(SUPABASE_URL + "/functions/v1/lead-intake", {
        method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_PUBLISHABLE_KEY },
        body: JSON.stringify({
          full_name: values.full_name, email: values.email, whatsapp: values.whatsapp, country: values.country,
          business_name: values.business_name, website_url: values.website_url, business_type: values.business_type,
          primary_challenge: values.primary_challenge, desired_outcome: values.desired_outcome, service_interest: source,
          source: "victorkann.com", utm_source: params.get("utm_source") || "website", utm_medium: params.get("utm_medium"),
          utm_campaign: params.get("utm_campaign"), utm_content: params.get("utm_content"), utm_term: params.get("utm_term"),
          follow_up_consent: values.follow_up_consent === "on", consent_text_version: "follow-up-v1",
          company_website: values.company_website, assessment
        })
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "We could not submit your request. Please try again.");
      setBookingDetails(values);
      setSubmitted(true); form.reset();
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Something went wrong. Please try again."); }
    finally { setSubmitting(false); }
  };

  const bookingUrl = useMemo(() => {
    const url = new URL(CAL_BASE);
    url.searchParams.set("utm_source", "victorkann.com");
    url.searchParams.set("utm_campaign", "free-conversion-review");
    if (bookingDetails) {
      const name = String(bookingDetails.full_name || "").trim();
      const email = String(bookingDetails.email || "").trim();
      if (name) url.searchParams.set("name", name);
      if (email) url.searchParams.set("email", email);
      const context = [
        `Request: ${source}`,
        bookingDetails.business_name ? `Business: ${bookingDetails.business_name}` : "",
        bookingDetails.business_type ? `Business type: ${bookingDetails.business_type}` : "",
        bookingDetails.website_url ? `Website: ${bookingDetails.website_url}` : "",
        bookingDetails.country ? `Country: ${bookingDetails.country}` : "",
        bookingDetails.whatsapp ? `WhatsApp: ${bookingDetails.whatsapp}` : "",
        bookingDetails.primary_challenge ? `Main challenge: ${bookingDetails.primary_challenge}` : "",
        bookingDetails.desired_outcome ? `Desired outcome: ${bookingDetails.desired_outcome}` : "",
        assessment ? `Scoreboard: ${Object.entries(assessment.scores).map(([key, score]) => `${key.replace("_", " ")} ${score}/2`).join(", ")} (total ${Object.values(assessment.scores).reduce((sum, score) => sum + score, 0)}/10)` : "",
        assessment?.priority_areas.length ? `Priority areas: ${assessment.priority_areas.join(", ").replaceAll("_", " ")}` : ""
      ].filter(Boolean);
      if (context.length) url.searchParams.set("a1", context.join("\\n"));
    } else {
      url.searchParams.set("a1", source);
    }
    return url.toString();
  }, [assessment, bookingDetails, source]);
  const value = useMemo(() => ({ openLeadForm }), [openLeadForm]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-3 sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) closeLeadForm(); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="lead-form-title" className="my-auto w-full max-w-xl border border-border bg-background p-5 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4"><div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Victor Kann · Enquiry</p>
              <h2 id="lead-form-title" className="display-font mt-2 text-2xl font-bold sm:text-3xl">{submitted ? "Your request is in." : "Let’s look at your customer journey."}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{submitted ? "Your details and assessment have been saved. Choose a time for your free review to complete the next step." : "Share a few details so I can understand your business before we speak."}</p>
            </div><button type="button" onClick={closeLeadForm} aria-label="Close form" className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground hover:text-foreground">✕</button></div>
            {submitted ? (
              <div className="mt-7 space-y-4"><div className="border border-primary/30 bg-primary/5 p-4 text-sm"><p className="font-semibold">Saved successfully</p><p className="mt-1 text-muted-foreground">Your request is now in the Victor Kann lead system.</p></div>
                <a href={bookingUrl} className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Choose a time for my free review</a>
                <button type="button" onClick={() => setIsOpen(false)} className="w-full rounded-full border border-border px-6 py-3 text-sm font-medium">Close</button></div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium">Your name *<input name="full_name" required maxLength={160} autoComplete="name" className="mt-1.5 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary" placeholder="Full name" /></label>
                  <label className="block text-sm font-medium">Email address *<input name="email" type="email" required maxLength={320} autoComplete="email" className="mt-1.5 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary" placeholder="you@example.com" /></label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium">WhatsApp (optional)<input name="whatsapp" type="tel" maxLength={40} autoComplete="tel" className="mt-1.5 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary" placeholder="+234..." /></label>
                  <label className="block text-sm font-medium">Country<input name="country" maxLength={100} autoComplete="country-name" className="mt-1.5 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary" placeholder="Your country" /></label>
                </div>
                <label className="block text-sm font-medium">Business name<input name="business_name" maxLength={200} className="mt-1.5 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary" placeholder="Business or brand name" /></label>
                <label className="block text-sm font-medium">Website or main page<input name="website_url" type="url" maxLength={2048} className="mt-1.5 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary" placeholder="https://" /></label>
                <label className="block text-sm font-medium">What best describes your business?<select name="business_type" className="mt-1.5 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"><option value="">Choose one (optional)</option><option>Creator or personal brand</option><option>Service business or freelancer</option><option>Online store or ecommerce</option><option>Digital products or courses</option><option>Agency or consultancy</option><option>Other</option></select></label>
                <label className="block text-sm font-medium">What is the biggest challenge right now?<textarea name="primary_challenge" rows={3} maxLength={2000} className="mt-1.5 w-full resize-y border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary" placeholder="Tell me where leads or sales seem to get stuck..." /></label>
                <label className="block text-sm font-medium">What would you like to improve?<textarea name="desired_outcome" rows={2} maxLength={2000} className="mt-1.5 w-full resize-y border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary" placeholder="What would a better result look like?" /></label>
                <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label>Leave this field empty<input name="company_website" tabIndex={-1} autoComplete="off" /></label></div>
                <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground"><input name="follow_up_consent" type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-primary" /><span>I agree that Victor Kann may contact me about this request and the free Conversion Review. I can ask to stop these messages at any time. *</span></label>
                {error && <p role="alert" className="border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
                <button type="submit" disabled={submitting} className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Sending your request..." : "Send my details"}</button>
                <p className="text-center text-[11px] leading-relaxed text-muted-foreground">Your details are used to respond to this request. They are not displayed publicly.</p>
              </form>
            )}
          </section>
        </div>
      )}
    </BookingContext.Provider>
  );
}