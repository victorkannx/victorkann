import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CalendarCheck, MessageCircle, Pencil, ShieldCheck, Phone } from "lucide-react";

const WHATSAPP_NUMBER = "2348161123296";
const CAL_BASE = "https://cal.com/autogrowhq/15";

const FEATURE_OPTIONS = [
  "Paystack deposits",
  "Booking calendar",
  "Photo gallery",
  "Google Maps",
  "Multiple apartments",
  "Reviews section",
  "SEO setup",
  "WhatsApp enquiry flow",
];

const BUDGET_OPTIONS = [
  "Under ₦100k",
  "₦100k — ₦200k",
  "₦200k — ₦350k",
  "Above ₦350k",
  "Not sure yet",
];

function inferredPackagePrice(source: string) {
  if (source.includes("Starter")) return { name: "Starter", price: "₦95k" };
  if (source.includes("Growth")) return { name: "Growth", price: "₦195k" };
  if (source.includes("Premium")) return { name: "Premium", price: "₦350k" };
  return null;
}

const phoneRegex = /^[+0-9][\s0-9\-()]{6,}$/;

const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address").max(160),
  phone: z.string().trim().regex(phoneRegex, "Enter a valid WhatsApp number").max(30),
  siteName: z.string().trim().min(2, "Tell me the apartment or website name").max(120),
  features: z.string().trim().min(2, "Pick or describe at least one feature").max(600),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  notes: z.string().trim().max(800).optional().or(z.literal("")),
});

type LeadValues = z.infer<typeof leadSchema>;
type Errors = Partial<Record<keyof LeadValues, string | undefined>>;

type LeadFormContextValue = { openLeadForm: (source?: string) => void };
const LeadFormContext = createContext<LeadFormContextValue>({ openLeadForm: () => {} });

export function useLeadForm() {
  return useContext(LeadFormContext);
}

export function LeadFormProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<string>("Website CTA");

  const openLeadForm = useCallback((nextSource?: string) => {
    setSource(nextSource ?? "Website CTA");
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openLeadForm }), [openLeadForm]);

  return (
    <LeadFormContext.Provider value={value}>
      {children}
      <LeadFormDialog open={open} onOpenChange={setOpen} source={source} />
    </LeadFormContext.Provider>
  );
}

function LeadFormDialog({
  open,
  onOpenChange,
  source,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: string;
}) {
  const [values, setValues] = useState<LeadValues>({
    name: "",
    email: "",
    phone: "",
    siteName: "",
    features: "",
    budget: "",
    notes: "",
  });
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [review, setReview] = useState<LeadValues | null>(null);

  const set = (key: keyof LeadValues, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) => {
      const next = prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature];
      const extra = values.features
        .split(", ")
        .filter((f) => f && !FEATURE_OPTIONS.includes(f.trim()))
        .join(", ");
      const merged = [next.join(", "), extra].filter(Boolean).join(", ");
      setValues((prevVals) => ({ ...prevVals, features: merged }));
      setErrors((prevErr) => ({ ...prevErr, features: undefined }));
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = leadSchema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof LeadValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setReview(parsed.data);
  };

  const buildMessage = (d: LeadValues) => {
    const pkg = inferredPackagePrice(source);
    const lines = [
      "New project enquiry from victorkann.com",
      `Interest: ${source}`,
      "",
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `WhatsApp number: ${d.phone}`,
      `Website / apartment name: ${d.siteName}`,
      `Features wanted: ${d.features}`,
      `Budget: ${d.budget?.trim() ? d.budget.trim() : "—"}`,
      `Other details: ${d.notes?.trim() ? d.notes.trim() : "—"}`,
    ];
    if (pkg) {
      lines.push(
        "",
        `Package requested: ${pkg.name}`,
        `Indicative price: ${pkg.price} (final quote depends on scope)`
      );
    }
    return lines.join("\n");
  };

  const sendToWhatsApp = () => {
    if (!review) return;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(review))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onOpenChange(false);
    setReview(null);
  };

  const calLink = `${CAL_BASE}?${new URLSearchParams({
    utm_source: "victorkann.com",
    utm_campaign: "lead-form",
    a1: source,
    ...(review
      ? {
          name: review.name,
          email: review.email,
          a2: `${review.siteName} — ${review.budget || "budget not set"}`,
          a3: review.phone,
        }
      : {}),
  }).toString()}`;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setReview(null);
      }}
    >
      <DialogContent className="max-h-[92dvh] overflow-y-auto border-border/80 bg-card p-0 sm:max-w-lg">
        <div className="border-b border-border/70 px-6 pb-5 pt-6">
          <DialogHeader className="space-y-2 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              {review ? `Step 2 of 2 · ${source}` : `Step 1 of 2 · ${source}`}
            </p>
            <DialogTitle className="display-font text-xl font-bold">
              {review ? "Check your details" : "Tell me about your project"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {review
                 ? "Confirm everything looks right, then send it to me on WhatsApp or book a call."
                 : "Share a few details about what you are building or improving. I’ll reply with a useful next step."}
            </DialogDescription>
          </DialogHeader>
        </div>

        {review ? (
          <div className="space-y-5 px-6 pb-6 pt-5">
            <dl className="divide-y divide-border/70 overflow-hidden rounded-xl border border-border/70">
              {[
                ["Name", review.name],
                ["Email", review.email],
                ["WhatsApp number", review.phone],
                ["Website / apartment", review.siteName],
                ["Features", review.features],
                ["Budget", review.budget?.trim() ? review.budget.trim() : "—"],
                ["Other details", review.notes?.trim() ? review.notes.trim() : "—"],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="text-sm break-words text-foreground">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="gap-2 font-semibold sm:flex-1"
                onClick={() => setReview(null)}
              >
                <Pencil className="h-4 w-4" />
                Edit details
              </Button>
              <Button
                type="button"
                size="lg"
                className="gap-2 font-semibold sm:flex-1"
                onClick={sendToWhatsApp}
              >
                <MessageCircle className="h-4 w-4" />
                Send on WhatsApp
              </Button>
            </div>

            <div className="flex flex-col items-center gap-3 text-center">
              <a
                  href={calLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium text-primary underline-offset-4 hover:underline"
              >
                <CalendarCheck className="h-3.5 w-3.5" />
                Or book a 15-minute call
              </a>
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-full bg-secondary text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
              >
                <ShieldCheck className="h-3 w-3" />
                Your details stay private
              </Badge>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6 pt-5">
              <Field id="name" label="Your name" error={errors.name}>
                <Input
                  id="name"
                  value={values.name}
                  maxLength={80}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Victor Kannayo"
                  autoComplete="name"
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="email" label="Email address" error={errors.email}>
                  <Input
                    id="email"
                    type="email"
                    value={values.email}
                    maxLength={160}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@email.com"
                    autoComplete="email"
                  />
                </Field>

                <Field id="phone" label="WhatsApp number" error={errors.phone}>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={values.phone}
                      maxLength={30}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="+234 816 112 3296"
                      autoComplete="tel"
                      className="pl-9"
                    />
                  </div>
                </Field>
              </div>

              <Field id="siteName" label="Intended website / apartment name" error={errors.siteName}>
                <Input
                  id="siteName"
                  value={values.siteName}
                  maxLength={120}
                  onChange={(e) => set("siteName", e.target.value)}
                  placeholder="e.g. The Avery, Lekki"
                />
              </Field>

              <Field id="features" label="Features to include" error={errors.features}>
                <div className="mb-3 flex flex-wrap gap-2">
                  {FEATURE_OPTIONS.map((feature) => {
                    const active = selectedFeatures.includes(feature);
                    return (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => toggleFeature(feature)}
                        aria-pressed={active}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                        }`}
                      >
                        {feature}
                      </button>
                    );
                  })}
                </div>
                <Textarea
                  id="features"
                  value={values.features}
                  maxLength={600}
                  rows={2}
                  onChange={(e) => set("features", e.target.value)}
                  placeholder="Tap the tags above or type what you need"
                />
              </Field>

              <Field id="budget" label="Your budget" error={errors.budget} optional>
                <Input
                  id="budget"
                  value={values.budget}
                  maxLength={80}
                  onChange={(e) => set("budget", e.target.value)}
                  placeholder="e.g. ₦150k, ₦200k — ₦350k, or 'not sure'"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {BUDGET_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => set("budget", option)}
                      aria-pressed={values.budget === option}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        values.budget === option
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </Field>

              <Field id="notes" label="Anything else I should consider?" error={errors.notes} optional>
                <Textarea
                  id="notes"
                  value={values.notes ?? ""}
                  maxLength={800}
                  rows={3}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Launch date, number of apartments, branding, etc."
                />
              </Field>

              <Button type="submit" size="lg" className="w-full gap-2 font-semibold">
                <ArrowRight className="h-4 w-4" />
                Review my details
              </Button>

              <div className="flex flex-col items-center gap-3 text-center">
                <a
                  href={calLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-primary underline-offset-4 hover:underline"
                >
                  <CalendarCheck className="h-3.5 w-3.5" />
                  Prefer a call? Schedule 15 minutes instead
                </a>
                <Badge
                  variant="secondary"
                  className="gap-1.5 rounded-full bg-secondary text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                >
                  <ShieldCheck className="h-3 w-3" />
                  Your details stay private
                </Badge>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  optional?: boolean | undefined;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.12em]">
        {label}
        {optional && <span className="ml-2 normal-case tracking-normal text-muted-foreground">(optional)</span>}
      </Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
