import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Star,
  Smartphone,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Percent,
  Instagram,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import cozyNestImg from "@/assets/cozy-nest-yaba.jpg";
import averyLekkiImg from "@/assets/avery-lekki.jpg";

const WHATSAPP_MAIN =
  "https://wa.me/2348161123296?text=Hi%20Victor%2C%20I%20need%20a%20booking%20website%20for%20my%20shortlet.%20My%20name%20is%3A%20";
const WHATSAPP_HERO =
  "https://wa.me/2348161123296?text=Hi%20Victor%2C%20I%20need%20a%20booking%20website%20for%20my%20shortlet.";
const WHATSAPP_CTA =
  "https://wa.me/2348161123296?text=Hi%20Victor%2C%20I%20saw%20victorkann.com%20and%20I%20want%20a%20website%20for%20my%20shortlet.%20Name%3A%20%20Location%3A%20";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Victor Kannayo | Direct Booking Websites for Shortlets" },
      {
        name: "description",
        content:
          "Victor Kannayo builds direct booking websites for shortlet owners and Airbnb hosts. Professional, fast, mobile-first sites that turn Instagram views into paid bookings.",
      },
      {
        property: "og:title",
        content: "Victor Kannayo | Direct Booking Websites for Shortlets",
      },
      {
        property: "og:description",
        content:
          "I build booking websites that turn Instagram views into paid bookings for shortlet owners & Airbnb hosts.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://victorkann.com" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return (
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
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function Navbar() {
  const navLinks = [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between container-padding">
        <a href="#" className="text-lg font-bold tracking-tight text-foreground">
          VICTOR KANN.
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <a href={WHATSAPP_MAIN} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </Button>
        </div>

        <div className="flex items-center md:hidden">
          <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <a href={WHATSAPP_MAIN} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </Button>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="section-padding container-padding">
      <div className="mx-auto max-w-4xl text-center">
        <Badge
          variant="secondary"
          className="mb-5 inline-flex max-w-full items-center gap-1.5 whitespace-normal bg-agency-blue-light/60 px-3 py-1 text-[11px] font-medium leading-snug text-agency-blue sm:text-xs"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </span>
          Available for 3 new projects this month
        </Badge>

        <h1 className="text-balance text-[1.75rem] font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          I build booking websites that turn Instagram views into paid bookings.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-balance text-[0.95rem] text-muted-foreground sm:text-lg md:text-xl">
          For shortlet owners & Airbnb hosts who are tired of losing 15% to Airbnb and wasting hours
          answering &quot;how much?&quot; on WhatsApp. Get your direct booking site live in 72 hours.
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="w-full gap-2 bg-primary px-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 sm:w-auto"
            asChild
          >
            <a href="#work">
              See My Work
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full gap-2 border-foreground/20 px-6 text-sm font-semibold text-foreground hover:bg-muted sm:w-auto sm:text-base"
            asChild
          >
            <a href={WHATSAPP_HERO} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span className="sm:hidden">WhatsApp 08161123296</span>
              <span className="hidden sm:inline">Chat Me on WhatsApp - 08161123296</span>
            </a>
          </Button>
        </div>

      </div>
    </section>
  );
}

function TrustBar() {
  const locations = ["Lekki", "Yaba", "Abuja", "London"];

  return (
    <section className="border-y border-border/60 bg-muted/30 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 container-padding md:flex-row md:gap-8">
        <p className="text-center text-sm font-medium text-muted-foreground md:text-left">
          Trusted by shortlet owners in{" "}
          <span className="text-foreground">{locations.join(", ")}</span>
        </p>
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 fill-current sm:h-5 sm:w-5 ${i < 4 ? "text-yellow-500" : "text-yellow-500"}`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm font-bold text-foreground">4.9</span>
          <span className="text-sm text-muted-foreground">rating</span>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    {
      icon: <XCircle className="h-6 w-6 text-destructive" />,
      title: "Guests ask price and disappear",
      description: "No booking flow means every DM is a dead-end conversation.",
    },
    {
      icon: <Percent className="h-6 w-6 text-destructive" />,
      title: "You lose 15% to Airbnb",
      description: "Platform fees eat your profit every single night.",
    },
    {
      icon: <Instagram className="h-6 w-6 text-destructive" />,
      title: "You look like every other shortlet on Instagram",
      description: "A link-in-bio does not build trust or collect deposits.",
    },
  ];

  return (
    <section className="section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-balance text-[1.6rem] font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            Your WhatsApp link in bio is costing you bookings.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem) => (
            <Card
              key={problem.title}
              className="border-border/60 bg-card text-card-foreground"
            >
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  {problem.icon}
                </div>
                <CardTitle className="text-lg font-semibold">{problem.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">
                  {problem.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkSection() {
  const demos = [
    {
      image: cozyNestImg,
      title: "Cozy Nest - Yaba (Budget Demo)",
      price: "From N35k/night",
      href: "https://cozy-nest-yaba.lovable.app",
      alt: "Cozy Nest Yaba shortlet booking website demo",
    },
    {
      image: averyLekkiImg,
      title: "The Avery - Lekki (Luxury Demo)",
      price: "From N130k/night",
      href: "https://avery-lekki.lovable.app",
      alt: "The Avery Lekki luxury shortlet booking website demo",
    },
  ];

  return (
    <section id="work" className="section-padding container-padding bg-muted/20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-balance text-[1.6rem] font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            My Work
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Live demo sites built for shortlet owners. Each one is mobile-first, fast, and designed
            to collect bookings.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {demos.map((demo) => (
            <Card
              key={demo.title}
              className="group overflow-hidden border-border/60 bg-card text-card-foreground"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={demo.image}
                  alt={demo.alt}
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold">{demo.title}</CardTitle>
                <CardDescription className="text-base font-medium text-primary">
                  {demo.price}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row">
                <Button
                  className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  asChild
                >
                  <a href={demo.href} target="_blank" rel="noopener noreferrer">
                    View Live Demo
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-foreground/20 text-foreground hover:bg-muted"
                  asChild
                >
                  <a href={WHATSAPP_MAIN} target="_blank" rel="noopener noreferrer">
                    Get one like this
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: <Smartphone className="h-6 w-6 text-primary" />,
      title: "Direct Booking Website",
      description: "Mobile-first design that loads fast and looks expensive on every device.",
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-primary" />,
      title: "WhatsApp auto-fill system",
      description: "Pre-filled messages that filter time-wasters and capture serious guests.",
    },
    {
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      title: "Paystack deposit collection",
      description: "Collect money even at 2am while you sleep.",
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Google Maps setup",
      description: "Get found on Google and build trust before guests ever message you.",
    },
  ];

  return (
    <section id="services" className="section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-balance text-[1.6rem] font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            What you get
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Everything you need to start taking direct bookings in 72 hours.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card
              key={service.title}
              className="border-border/60 bg-card text-card-foreground"
            >
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  {service.icon}
                </div>
                <CardTitle className="text-lg font-semibold">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "N95k",
      description: "1-page site, WhatsApp system, 3 days delivery",
      features: ["1-page direct booking site", "WhatsApp auto-fill system", "3 days delivery"],
      popular: false,
    },
    {
      name: "Growth",
      price: "N195k",
      description: "Multi-page, Paystack, Google setup, 72hrs",
      features: [
        "Multi-page direct booking site",
        "Paystack deposit collection",
        "Google Maps setup",
        "72 hours delivery",
      ],
      popular: true,
    },
    {
      name: "Premium",
      price: "N350k",
      description: "Everything + 5 pages + SEO + 30 days support",
      features: [
        "Everything in Growth",
        "Up to 5 pages",
        "SEO setup",
        "30 days support",
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="section-padding container-padding bg-muted/20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-balance text-[1.6rem] font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            One investment. No Airbnb commission. No hourly WhatsApp back-and-forth.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col border-border/60 bg-card text-card-foreground ${
                plan.popular ? "ring-2 ring-primary" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  MOST POPULAR
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-semibold text-muted-foreground">
                  {plan.name}
                </CardTitle>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-foreground">
                    {plan.price}
                  </span>
                </div>
                <CardDescription className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-8 w-full gap-2 font-semibold ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-foreground/20 bg-background text-foreground hover:bg-muted"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <a
                    href={`https://wa.me/2348161123296?text=Hi%20Victor%2C%20I%20want%20the%20${plan.name.toUpperCase()}%20package%20for%20${plan.price.replace(
                      "N",
                      "N%23",
                    )}.%20My%20apartment%20name%20is%3A%20`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pay via Paystack & Start
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
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
      title: "You send pictures + prices on WhatsApp",
      description: "No forms. No meetings. Just your photos, prices, and location.",
    },
    {
      step: "02",
      title: "I build in 72hrs",
      description: "Your direct booking site goes live with Paystack, maps, and WhatsApp flows.",
    },
    {
      step: "03",
      title: "You start collecting direct bookings",
      description: "Guests book and pay while you focus on hosting.",
    },
  ];

  return (
    <section className="section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-balance text-[1.6rem] font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {steps.map((item, index) => (
            <div key={item.step} className="relative flex flex-col items-start">
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-12 hidden h-full w-px bg-border md:block" />
              )}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                {item.step}
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">{item.title}</h3>
              <p className="mt-2 text-base text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="section-padding container-padding bg-foreground text-background">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-balance text-[1.6rem] font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
          Ready to stop losing bookings to Airbnb?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-background/70 sm:text-lg md:text-xl">
          Join 20+ shortlet owners who now get direct bookings daily.
        </p>
        <Button
          size="lg"
          className="mt-8 w-full gap-2 bg-background px-6 text-sm sm:text-base font-semibold text-foreground hover:bg-background/90 sm:w-auto"
          asChild
        >
          <a href={WHATSAPP_CTA} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-5 w-5" />
            <span className="sm:hidden">Chat Victor Now - 08161123296</span>
            <span className="hidden sm:inline">Chat Victor on WhatsApp Now - 08161123296</span>
          </a>
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background py-10">
      <div className="mx-auto max-w-7xl container-padding">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Victor Kannayo
          </p>
          <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground md:flex-row md:gap-6">
            <a
              href="mailto:hello@victorkann.com"
              className="flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              hello@victorkann.com
            </a>
            <a
              href={WHATSAPP_MAIN}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Phone className="h-4 w-4" />
              WhatsApp 08161123296
            </a>
            <a
              href="https://instagram.com/victorkannayo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Instagram className="h-4 w-4" />
              @victorkannayo
            </a>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground md:text-left">
          Built for shortlet owners worldwide.
        </p>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_MAIN}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-4 right-4 z-50 flex h-12 w-12 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/20 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <MessageCircle className="h-6 w-6 fill-current sm:h-7 sm:w-7" />
    </a>
  );
}
