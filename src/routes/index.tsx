import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Smartphone,
  CreditCard,
  MapPin,
  CheckCircle2,
  XCircle,
  Percent,
  Instagram,
  Mail,
  Phone,
  ArrowUpRight,
  MessageCircle,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { LeadFormProvider, useLeadForm } from "@/components/lead-form-dialog";
import cozyNestImg from "@/assets/cozy-nest-yaba.jpg";
import averyLekkiImg from "@/assets/avery-lekki.jpg";



export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Victor Kannayo | Premium Direct Booking Websites for Shortlets" },
      {
        name: "description",
        content:
          "Victor Kannayo designs premium direct booking websites for shortlet owners and Airbnb hosts. Live in 72 hours, built to convert Instagram views into paid bookings.",
      },
      {
        property: "og:title",
        content: "Victor Kannayo | Premium Direct Booking Websites for Shortlets",
      },
      {
        property: "og:description",
        content:
          "Premium direct booking websites for shortlet owners & Airbnb hosts. Live in 72 hours. Book a strategy call.",
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
      <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <ProblemSection />
        <WorkSection />
        <ServicesSection />
        <PricingSection />
        <HowItWorksSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingBooking />
      </div>
    </LeadFormProvider>
  );
}

function Navbar() {
  const { openLeadForm } = useLeadForm();
  const navLinks = [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between container-padding">
        <a
          href="#"
          className="display-font text-base font-bold tracking-[0.14em] text-foreground sm:text-lg"
        >
          VICTOR KANN<span className="text-primary">.</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <Button
            size="sm"
            className="gap-2 font-semibold"
            onClick={() => openLeadForm("Navbar — start my project")}
          >
            <Sparkles className="h-4 w-4" />
            Start My Project
          </Button>
        </div>

        <div className="flex items-center md:hidden">
          <Button
            size="sm"
            className="gap-2 font-semibold"
            onClick={() => openLeadForm("Navbar — start my project")}
          >
            <Sparkles className="h-4 w-4" />
            Start Project
          </Button>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  const { openLeadForm } = useLeadForm();

  return (
    <section className="relative overflow-hidden section-padding container-padding">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 max-w-3xl rounded-full bg-emerald-mid/20 blur-[120px]"
      />
      <div className="relative mx-auto max-w-5xl">
        <div className="grid items-end gap-8 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <Badge
              variant="secondary"
              className="mb-6 inline-flex max-w-full items-center gap-2 whitespace-normal rounded-full border border-primary/30 bg-secondary px-3 py-1 text-[11px] font-medium uppercase leading-snug tracking-[0.18em] text-primary sm:text-xs"
            >
              <Sparkles className="h-3 w-3 shrink-0" />
              Taking 3 new projects this month
            </Badge>

            <h1 className="display-font text-balance text-[2rem] font-bold leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
              Booking websites that turn Instagram views into{" "}
              <span className="text-primary">paid bookings.</span>
            </h1>

            <div className="mt-6 h-px w-32 gold-rule" />

            <p className="mt-6 max-w-xl text-balance text-[0.98rem] leading-relaxed text-muted-foreground sm:text-lg">
              For shortlet owners &amp; Airbnb hosts tired of losing 15% to Airbnb and answering
              &quot;how much?&quot; all day. Your direct booking site, live in 72 hours.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full gap-2 px-6 font-semibold sm:w-auto"
                onClick={() => openLeadForm("Hero — I need a booking website")}
              >
                Get My Booking Site
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2 border-border px-6 font-semibold text-foreground hover:bg-secondary sm:w-auto"
                asChild
              >
                <a href="#work">
                  See the Work
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:gap-4">
            {[
              { k: "72hrs", v: "Average delivery" },
              { k: "20+", v: "Hosts onboarded" },
              { k: "0%", v: "Platform commission" },
            ].map((s) => (
              <div key={s.k} className="premium-card p-4 lg:px-5 lg:py-4">
                <dt className="display-font text-xl font-bold text-primary sm:text-2xl">{s.k}</dt>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="border-y border-border/70 bg-secondary/40 py-7">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 container-padding md:flex-row md:gap-8">
        <p className="text-center text-xs uppercase tracking-[0.16em] text-muted-foreground md:text-left">
          Trusted by shortlet owners in <span className="text-foreground">Lekki, Yaba, Abuja &amp; London</span>
        </p>
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current text-primary" />
            ))}
          </div>
          <span className="ml-2 text-sm font-bold text-foreground">4.9</span>
          <span className="text-sm text-muted-foreground">rating</span>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="display-font mt-3 text-balance text-[1.7rem] font-bold leading-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-4 text-base leading-relaxed text-muted-foreground">{sub}</p>}
    </div>
  );
}

function ProblemSection() {
  const problems = [
    {
      icon: <XCircle className="h-5 w-5 text-destructive" />,
      title: "Guests ask price and disappear",
      description: "No booking flow means every DM is a dead-end conversation.",
    },
    {
      icon: <Percent className="h-5 w-5 text-destructive" />,
      title: "You lose 15% to Airbnb",
      description: "Platform fees eat your profit every single night.",
    },
    {
      icon: <Instagram className="h-5 w-5 text-destructive" />,
      title: "You look like every other shortlet",
      description: "A link-in-bio does not build trust or collect deposits.",
    },
  ];

  return (
    <section className="section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="The problem"
          title="Your WhatsApp link in bio is costing you bookings."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem) => (
            <div key={problem.title} className="premium-card p-6">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/12">
                {problem.icon}
              </div>
              <h3 className="display-font text-lg font-semibold text-foreground">{problem.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkSection() {
  const { openLeadForm } = useLeadForm();
  const demos = [
    {
      image: cozyNestImg,
      title: "Cozy Nest — Yaba",
      tag: "Budget demo",
      price: "From ₦35k/night",
      href: "https://cozy.victorkann.com",
      alt: "Cozy Nest Yaba shortlet direct booking website",
      slug: "demo-cozy-nest-yaba",
      topic: "I want a site like Cozy Nest — Yaba (budget demo)",
      span: "lg:col-span-3",
    },
    {
      image: averyLekkiImg,
      title: "The Avery — Lekki",
      tag: "Luxury demo",
      price: "From ₦130k/night",
      href: "https://avery.victorkann.com",
      alt: "The Avery Lekki luxury shortlet direct booking website",
      slug: "demo-avery-lekki",
      topic: "I want a site like The Avery — Lekki (luxury demo)",
      span: "lg:col-span-3",
    },
  ];

  return (
    <section id="work" className="section-padding container-padding bg-secondary/30">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Selected work"
          title="Live sites built for shortlet owners."
          sub="Mobile-first, fast, and designed for one job: collecting the booking."
        />

        <div className="grid gap-5 lg:grid-cols-6">
          {demos.map((demo) => (
            <article key={demo.title} className={`premium-card group overflow-hidden ${demo.span}`}>
              <a
                href={demo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-[16/10] overflow-hidden border-b border-border/70"
              >
                <img
                  src={demo.image}
                  alt={demo.alt}
                  width={1280}
                  height={800}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </a>
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="display-font text-xl font-bold text-foreground">{demo.title}</h3>
                  <span className="rounded-full border border-primary/30 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-primary">
                    {demo.tag}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{demo.price}</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button className="w-full gap-2 font-semibold" asChild>
                    <a href={demo.href} target="_blank" rel="noopener noreferrer">
                      View Live Demo
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-border text-foreground hover:bg-secondary"
                    onClick={() => openLeadForm(demo.topic)}
                  >
                    Get one like this
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: <Smartphone className="h-5 w-5 text-primary" />,
      title: "Direct Booking Website",
      description: "Mobile-first design that loads fast and looks expensive on every device.",
      span: "lg:col-span-4",
    },
    {
      icon: <MessageCircle className="h-5 w-5 text-primary" />,
      title: "Booking & enquiry flow",
      description: "Serious guests schedule and confirm. Time-wasters filter themselves out.",
      span: "lg:col-span-2",
    },
    {
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      title: "Paystack deposit collection",
      description: "Collect money even at 2am while you sleep.",
      span: "lg:col-span-2",
    },
    {
      icon: <MapPin className="h-5 w-5 text-primary" />,
      title: "Google Maps & search setup",
      description: "Get found on Google and build trust before guests ever message you.",
      span: "lg:col-span-4",
    },
  ];

  return (
    <section id="services" className="section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="What you get"
          title="A complete direct booking system, not just a page."
          sub="Everything you need to start taking direct bookings in 72 hours."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {services.map((service) => (
            <div key={service.title} className={`premium-card p-6 ${service.span}`}>
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12">
                {service.icon}
              </div>
              <h3 className="display-font text-lg font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const { openLeadForm } = useLeadForm();
  const plans = [
    {
      name: "Starter",
      description: "1-page site, enquiry system, 3 days delivery",
      features: ["1-page direct booking site", "Booking enquiry system", "3 days delivery"],
      popular: false,
      slug: "package-starter",
    },
    {
      name: "Growth",
      description: "Multi-page, Paystack, Google setup, 72hrs",
      features: [
        "Multi-page direct booking site",
        "Paystack deposit collection",
        "Google Maps setup",
        "72 hours delivery",
      ],
      popular: true,
      slug: "package-growth",
    },
    {
      name: "Premium",
      description: "Everything + 5 pages + SEO + 30 days support",
      features: ["Everything in Growth", "Up to 5 pages", "SEO setup", "30 days support"],
      popular: false,
      slug: "package-premium",
    },
  ];

  return (
    <section id="pricing" className="section-padding container-padding bg-secondary/30">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Investment"
          title="Tailored pricing for your shortlet."
          sub="Every build is different. Pick a package, then get a custom quote sent to your WhatsApp in minutes."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`premium-card relative flex flex-col p-7 ${
                plan.popular ? "ring-1 ring-primary/60" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-7 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]">
                  Most popular
                </Badge>
              )}
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {plan.name}
              </p>
              <p className="display-font mt-3 text-lg font-semibold text-foreground">{plan.description}</p>
              <p className="mt-2 text-xs italic text-muted-foreground">Pricing available on request</p>
              <div className="my-6 h-px w-full bg-border" />
              <ul className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full gap-2 font-semibold"
                variant={plan.popular ? "default" : "outline"}
                onClick={() =>
                  openLeadForm(`${plan.name} package — request pricing and build slot`)
                }
              >
                Request {plan.name} Quote
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Book a 30-minute call",
      description: "Pick a time that works. We map your apartment, pricing, and goals.",
    },
    {
      step: "02",
      title: "I build in 72hrs",
      description: "Your site goes live with Paystack, maps, and a clean booking flow.",
    },
    {
      step: "03",
      title: "You collect direct bookings",
      description: "Guests book and pay while you focus on hosting.",
    },
  ];

  return (
    <section className="section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Process" title="Three steps to direct bookings." />
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="premium-card p-6">
              <span className="display-font text-3xl font-bold text-primary/70">{item.step}</span>
              <h3 className="display-font mt-4 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const { openLeadForm } = useLeadForm();

  return (
    <section className="section-padding container-padding">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-primary/25 bg-emerald-deep/60 px-6 py-14 text-center sm:px-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          Limited slots
        </p>
        <h2 className="display-font mx-auto mt-4 max-w-2xl text-balance text-[1.75rem] font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
          Ready to stop losing bookings to Airbnb?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
          Join 20+ shortlet owners who now get direct bookings daily. Schedule your strategy call.
        </p>
        <Button
          size="lg"
          className="mt-8 w-full gap-2 px-7 font-semibold sm:w-auto"
          onClick={() => openLeadForm("Final CTA — ready to stop losing bookings")}
        >
          Start My Project
          <ArrowUpRight className="h-5 w-5" />
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          Takes 60 seconds. Sent straight to my WhatsApp — reply within a few hours.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/70 py-10">
      <div className="mx-auto max-w-7xl container-padding">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <p className="display-font text-sm tracking-[0.14em] text-muted-foreground">
            © {new Date().getFullYear()} VICTOR KANNAYO
          </p>
          <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground md:flex-row md:gap-6">
            <a
              href="mailto:hello@victorkann.com"
              className="flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              hello@victorkann.com
            </a>
            <a
              href="tel:+2348161123296"
              className="flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              08161123296
            </a>
            <a
              href="https://instagram.com/victorkannayo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Instagram className="h-4 w-4" />
              @victorkannayo
            </a>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground md:text-left">
          Premium direct booking websites for shortlet owners worldwide.
        </p>
      </div>
    </footer>
  );
}

function FloatingBooking() {
  const { openLeadForm } = useLeadForm();

  return (
    <button
      type="button"
      onClick={() => openLeadForm("Floating button — start my project")}
      aria-label="Start my project"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-xl shadow-black/40 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-5 w-5" />
      Start My Project
    </button>
  );
}
