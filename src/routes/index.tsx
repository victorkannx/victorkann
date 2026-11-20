import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LeadFormProvider, useLeadForm } from "@/components/lead-form-dialog";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Menu,
  RotateCcw,
  X,
} from "lucide-react";

type StageKey = "attention" | "capture" | "response" | "follow_up" | "conversion";
type Answers = Partial<Record<StageKey, 0 | 1 | 2>>;

const stages: {
  key: StageKey;
  number: string;
  title: string;
  question: string;
  options: [string, string, string];
}[] = [
  {
    key: "attention",
    number: "01",
    title: "Turn attention into action",
    question: "When someone discovers your business, is the next step to enquire or buy obvious?",
    options: [
      "Yes. The next step is clear wherever people find me.",
      "It is there, but people can miss it.",
      "There is no clear next step.",
    ],
  },
  {
    key: "capture",
    number: "02",
    title: "Capture interested leads",
    question: "Can an interested visitor leave their details in a simple, reliable way?",
    options: [
      "Yes. Leads go into one reliable place.",
      "Some are captured, but they come from scattered places.",
      "I do not have a consistent way to capture leads.",
    ],
  },
  {
    key: "response",
    number: "03",
    title: "Respond to enquiries",
    question: "Do new enquiries receive a useful response within one business day?",
    options: [
      "Yes. New enquiries are answered within one business day.",
      "Sometimes replies are delayed or missed.",
      "Enquiries are often delayed or go unanswered.",
    ],
  },
  {
    key: "follow_up",
    number: "04",
    title: "Follow up consistently",
    question: "Does every lead who has not bought receive a planned follow-up?",
    options: [
      "Yes. Follow-up happens through a repeatable process.",
      "Sometimes. It still depends on memory or manual effort.",
      "No. There is no consistent follow-up process.",
    ],
  },
  {
    key: "conversion",
    number: "05",
    title: "Track conversion",
    question: "Can you see which enquiries become paying customers and where others drop off?",
    options: [
      "Yes. I can follow an enquiry through to a sale.",
      "I can see some of it, but the information is scattered.",
      "No. I cannot reliably track what happens after an enquiry.",
    ],
  },
];

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Victor Kann | Turn Attention Into Customers" },
      {
        name: "description",
        content:
          "I build systems that help online businesses turn attention into customers. Find the gaps in your customer journey with the Conversion Leak Scoreboard.",
      },
      { property: "og:title", content: "Victor Kann | Turn Attention Into Customers" },
      {
        property: "og:description",
        content:
          "A clearer path from first click to paying customer. Find where leads are slipping through your business.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://victorkann.com" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return (
    <LeadFormProvider>
      <div id="top" className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main>
          <Hero />
          <FrictionSection />
          <ScoreboardSection />
          <ApproachSection />
          <AboutSection />
          <FinalCta />
        </main>
        <Footer />
        <FloatingContact />
      </div>
    </LeadFormProvider>
  );
}

function Navbar() {
  const { openLeadForm } = useLeadForm();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { label: "The problem", href: "#problem" },
    { label: "Scoreboard", href: "#scoreboard" },
    { label: "My approach", href: "#approach" },
    { label: "About", href: "#about" },
  ];

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between container-padding">
        <a href="#top" className="display-font text-sm font-bold tracking-[0.13em] sm:text-base">
          VICTOR KANN<span className="text-primary">.</span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
          <Button size="sm" className="gap-2 rounded-full px-5" asChild>
            <a href="#scoreboard">
              Find my leaks <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </nav>
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={closeMenu} className="border-b border-border py-3 text-sm text-muted-foreground last:border-0 hover:text-foreground">
                {link.label}
              </a>
            ))}
            <Button className="mt-3 w-full rounded-full" asChild>
              <a href="#scoreboard" onClick={closeMenu}>Take the Scoreboard <ArrowUpRight className="ml-2 h-4 w-4" /></a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-grid relative overflow-hidden bg-ink text-ink-foreground">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[34rem] w-[34rem] rounded-full border border-ink-border/70" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-[24rem] w-[24rem] rounded-full border border-ink-border/70" />
      <div className="relative mx-auto grid min-h-[690px] max-w-7xl items-center gap-14 container-padding section-padding lg:min-h-[min(820px,calc(100svh-4.5rem))] lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div className="max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-ink-border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Business systems · Conversion · Automation
          </div>
          <h1 className="display-font max-w-3xl text-balance text-[clamp(3.2rem,7.8vw,7.1rem)] font-bold leading-[0.92] tracking-[-0.055em]">
            Attention is good. <span className="text-primary">Customers</span> are better.
          </h1>
          <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-ink-muted sm:text-xl">
            I build systems that help online businesses turn attention into customers. So fewer good leads get lost between the first click and the sale.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="w-full gap-2 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90 sm:w-auto" asChild>
              <a href="#scoreboard">Find where leads are slipping <ArrowDown className="h-4 w-4" /></a>
            </Button>
            <Button size="lg" variant="outline" className="w-full rounded-full border-ink-border bg-transparent px-7 text-ink-foreground hover:bg-ink-soft sm:w-auto" asChild>
              <a href="#approach">See how I work <ArrowRight className="h-4 w-4" /></a>
            </Button>
          </div>
          <p className="mt-6 text-xs text-ink-muted">For founders, creators and small online businesses. Working globally.</p>
        </div>
        <JourneyPanel />
      </div>
    </section>
  );
}

function JourneyPanel() {
  const steps = [
    ["01", "Attention", "Someone finds you"],
    ["02", "Capture", "They raise their hand"],
    ["03", "Response", "They hear back"],
    ["04", "Follow-up", "The conversation continues"],
    ["05", "Conversion", "A customer is made"],
  ];
  return (
    <div className="relative mx-auto w-full max-w-lg border border-ink-border bg-ink-soft/55 p-5 shadow-2xl shadow-black/10 sm:p-7">
      <div className="flex items-center justify-between border-b border-ink-border pb-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-muted">The customer journey</p>
          <p className="mt-1 text-sm font-medium text-ink-foreground">One connected path</p>
        </div>
        <span className="rounded-full border border-ink-border px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-ink-muted">5 stages</span>
      </div>
      <div className="mt-5 space-y-2">
        {steps.map(([number, title, description], index) => (
          <div key={number} className="flex items-center gap-3 border border-ink-border/80 bg-ink/55 p-3.5 sm:p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">{number}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink-foreground">{title}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
            </div>
            {index < steps.length - 1 ? <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-ink-muted" /> : <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-primary" />}
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs leading-relaxed text-ink-muted">A leak at any stage can make the next stage harder. The first step is finding it.</p>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-12 max-w-3xl">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
      <h2 className="display-font mt-4 text-balance text-3xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-5xl">{title}</h2>
      {description && <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>}
    </div>
  );
}

function FrictionSection() {
  const friction = [
    ["People are interested, but hesitate", "The next step is unclear, hard to find or asks for too much too soon."],
    ["Enquiries arrive from everywhere", "Messages, forms and social channels make it hard to keep every lead in one place."],
    ["Replies depend on someone remembering", "A busy day can mean a slow response or a promising conversation left hanging."],
    ["You cannot see what turns into sales", "Without a clear view of the journey, it is difficult to know what needs fixing first."],
  ];
  return (
    <section id="problem" className="section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Where growth gets stuck"
          title="A lead rarely disappears all at once."
          description="It usually slips through a few small gaps. A missed message. A confusing next step. A follow-up that never happens."
        />
        <div className="grid gap-0 border-y border-border sm:grid-cols-2">
          {friction.map(([title, description], index) => (
            <article key={title} className="border-b border-border py-7 sm:px-7 sm:py-9 [&:nth-child(2n)]:sm:border-l [&:nth-child(2n)]:sm:pl-9 [&:nth-last-child(-n+2)]:sm:border-b-0 [&:nth-child(odd)]:sm:pr-9">
              <span className="text-xs font-semibold tabular-nums text-primary">0{index + 1}</span>
              <h3 className="display-font mt-5 text-xl font-semibold sm:text-2xl">{title}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScoreboardSection() {
  const { openLeadForm } = useLeadForm();
  const [answers, setAnswers] = useState<Answers>({});
  const [showResult, setShowResult] = useState(false);
  const completed = stages.every((stage) => answers[stage.key] !== undefined);
  const answeredCount = stages.filter((stage) => answers[stage.key] !== undefined).length;
  const total = stages.reduce((sum, stage) => sum + (answers[stage.key] ?? 0), 0);
  const highest = Math.max(...stages.map((stage) => answers[stage.key] ?? 0));
  const priorities = total === 0 ? [] : stages.filter((stage) => answers[stage.key] === highest);

  const reset = () => {
    setAnswers({});
    setShowResult(false);
  };

  return (
    <section id="scoreboard" className="border-y border-border bg-surface-dim section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Free self-check"
              title="Find the gaps between attention and sales."
              description="The Conversion Leak Scoreboard is a short five-question check of the journey from first discovery to paying customer."
            />
            <div className="border-l-2 border-primary pl-5">
              <p className="text-sm leading-relaxed text-muted-foreground">Answer based on what happens today, not what you hope happens. There are no trick questions and no made-up industry benchmarks.</p>
            </div>
            <p className="mt-7 text-xs text-muted-foreground">Five stages · About two minutes · Score from 0 to 10</p>
          </div>

          <div className="border border-border bg-background p-5 sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Conversion Leak Scoreboard</p>
                <p className="mt-1 text-sm text-muted-foreground">{showResult ? "Your self-check result" : "Choose the answer that best describes today"}</p>
              </div>
              <span className="text-xs font-semibold tabular-nums text-muted-foreground">{answeredCount}/5</span>
            </div>

            {!showResult ? (
              <>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${(answeredCount / stages.length) * 100}%` }} />
                </div>
                <div className="mt-7 space-y-8">
                  {stages.map((stage) => (
                    <fieldset key={stage.key} className="border-b border-border pb-7 last:border-0 last:pb-0">
                      <legend className="w-full">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 text-xs font-semibold text-primary">{stage.number}</span>
                          <div>
                            <h3 className="text-base font-semibold">{stage.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stage.question}</p>
                          </div>
                        </div>
                      </legend>
                      <div className="mt-4 space-y-2 pl-7">
                        {stage.options.map((option, score) => {
                          const selected = answers[stage.key] === score;
                          return (
                            <button
                              key={option}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => setAnswers((current) => ({ ...current, [stage.key]: score as 0 | 1 | 2 }))}
                              className={`flex w-full items-start gap-3 border px-3.5 py-3 text-left text-sm transition-colors sm:px-4 ${selected ? "border-primary bg-primary/5 text-foreground" : "border-border hover:border-primary/50 hover:bg-surface-dim"}`}
                            >
                              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold ${selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40 text-muted-foreground"}`}>{selected ? <Check className="h-3 w-3" /> : score}</span>
                              <span className="leading-relaxed">{option}</span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">Your answers stay in this browser session.</p>
                  <Button disabled={!completed} onClick={() => setShowResult(true)} className="gap-2 rounded-full px-6">
                    See my result <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-7">
                <div className="grid gap-7 sm:grid-cols-[auto_1fr] sm:items-center">
                  <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-[6px] border-primary/20 text-center">
                    <span className="display-font text-4xl font-bold tabular-nums">{total}<span className="text-xl text-muted-foreground">/10</span></span>
                    <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Your score</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Your self-check is complete</p>
                    <h3 className="display-font mt-3 text-2xl font-semibold sm:text-3xl">{total === 0 ? "No clear leak surfaced." : priorities.length > 1 ? "A few stages need attention." : "Start with this stage."}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{total === 0 ? "Your answers suggest these five steps are working consistently. Keep checking them as your business grows." : "Your highest-scoring stage or stages are the best place to begin a closer look. This score is a self-check, not a validated industry benchmark."}</p>
                  </div>
                </div>
                {priorities.length > 0 && (
                  <div className="mt-8 border border-primary/30 bg-primary/5 p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-primary">Priority {priorities.length > 1 ? "leaks" : "leak"}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {priorities.map((stage) => <span key={stage.key} className="rounded-full border border-primary/30 bg-background px-3 py-1.5 text-xs font-medium">{stage.title}</span>)}
                    </div>
                  </div>
                )}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button onClick={() => openLeadForm(`Conversion Leak Scoreboard: ${total}/10 · Priority: ${priorities.map((stage) => stage.title).join(", ") || "No priority leak"}`)} className="gap-2 rounded-full px-6">
                    Talk through my result <ArrowUpRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={reset} className="gap-2 rounded-full">
                    <RotateCcw className="h-4 w-4" /> Retake the check
                  </Button>
                </div>
                <p className="mt-5 text-xs leading-relaxed text-muted-foreground">This result is calculated in your browser. It is not saved or emailed. If you request a review, you can choose to send your details and result to Victor on WhatsApp.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ApproachSection() {
  const steps = [
    ["01", "Understand the journey", "We look at how people find you, enquire, hear back and decide to buy."],
    ["02", "Find the biggest leak", "We identify where good leads are getting stuck and what is causing the friction."],
    ["03", "Build the right fix", "Only then do we decide what needs to change, connect or be automated."],
  ];
  return (
    <section id="approach" className="section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="The way I work"
          title="Audit first. Build what the business actually needs."
          description="No pile of tools for the sake of it. We start with the customer journey, find the weak point and make a practical plan."
        />
        <div className="grid border-y border-border md:grid-cols-3">
          {steps.map(([number, title, description]) => (
            <article key={number} className="border-b border-border py-7 md:border-b-0 md:border-r md:px-7 md:py-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
              <span className="text-xs font-semibold text-primary">{number}</span>
              <h3 className="display-font mt-8 text-xl font-semibold sm:text-2xl">{title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="border-y border-ink-border bg-ink text-ink-foreground section-padding container-padding">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.6fr_1.4fr] lg:items-center">
        <div className="flex aspect-square max-w-xs items-end border border-ink-border bg-ink-soft p-6 sm:p-8">
          <div>
            <div className="display-font text-7xl font-bold leading-none sm:text-8xl">VK<span className="text-primary">.</span></div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-ink-muted">Nigeria · Working globally</p>
          </div>
        </div>
        <div className="max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">A little about me</p>
          <h2 className="display-font mt-4 text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl">I’m Victor Kann.</h2>
          <div className="mt-7 space-y-4 text-base leading-relaxed text-ink-muted sm:text-lg">
            <p>I work with founders, creators and small online businesses that already have people paying attention, but need a clearer path from interest to sale.</p>
            <p>My work brings strategy, websites and automation together around one simple goal: help the business move forward without making every step harder than it needs to be.</p>
          </div>
          <a href="https://x.com/iamVictorKann" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink-foreground transition-colors hover:text-primary">
            Follow my thinking on X <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  const { openLeadForm } = useLeadForm();
  return (
    <section className="section-padding container-padding">
      <div className="mx-auto max-w-7xl overflow-hidden bg-primary p-7 text-primary-foreground sm:p-12 lg:p-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/75">Make the next step count</p>
            <h2 className="display-font mt-4 text-balance text-4xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-6xl">You worked to get their attention. Let’s make it easier for them to become customers.</h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/80">Start with the Scoreboard or tell me where your customer journey feels stuck.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button size="lg" variant="secondary" className="rounded-full px-6" asChild><a href="#scoreboard">Take the Scoreboard <ArrowDown className="ml-2 h-4 w-4" /></a></Button>
            <Button size="lg" variant="outline" className="rounded-full border-primary-foreground/40 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => openLeadForm("Homepage — discuss a conversion review")}>Talk to Victor <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-9 container-padding">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <a href="#top" className="display-font text-sm font-bold tracking-[0.13em]">VICTOR KANN<span className="text-primary">.</span></a>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">Systems that help online businesses turn attention into customers.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <a href="#scoreboard" className="hover:text-foreground">Conversion Leak Scoreboard</a>
          <a href="#approach" className="hover:text-foreground">My approach</a>
          <a href="https://x.com/iamVictorKann" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">X</a>
          <a href="mailto:iamvictorkann@outlook.com" className="hover:text-foreground">Email</a>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-2 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} Victor Kann</span>
        <span>Based in Nigeria · Working globally</span>
      </div>
    </footer>
  );
}

function FloatingContact() {
  const { openLeadForm } = useLeadForm();
  return (
    <Button
      type="button"
      onClick={() => openLeadForm("Floating contact button")}
      aria-label="Talk to Victor"
      className="fixed bottom-4 right-4 z-50 h-12 gap-2 rounded-full px-5 font-semibold shadow-lg shadow-primary/20 transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
    >
      Talk to Victor <ArrowUpRight className="h-4 w-4" />
    </Button>
  );
}
