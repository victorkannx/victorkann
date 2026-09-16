import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  ExternalLink,
  Funnel,
  GitBranch,
  Layers3,
  Mail,
  Megaphone,
  MessageCircle,
  Workflow,
} from "lucide-react";
import { LeadFormProvider, useLeadForm } from "@/components/lead-form-dialog";
import cozyNestImg from "@/assets/cozy-nest-yaba.jpg";
import averyLekkiImg from "@/assets/avery-lekki.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Victor Kann | Systems, Audiences & Digital Income" },
      {
        name: "description",
        content:
          "Victor Kann builds and documents practical systems across AI, funnels, automation, marketing and online business.",
      },
      {
        property: "og:title",
        content: "Victor Kann | Systems, Audiences & Digital Income",
      },
      {
        property: "og:description",
        content:
          "Building systems, audiences and digital income through practical experiments in AI, funnels, automation and online business.",
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
          <ExploringSection />
          <BuildingSection />
          <HelpSection />
          <SelectedWorkSection />
          <WritingSection />
          <AboutSection />
          <WorkWithMeSection />
          <BookCallSection />
          <ContactSection />
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
    { label: "Exploring", href: "#exploring" },
    { label: "Work", href: "#work" },
    { label: "Writing", href: "#writing" },
    { label: "About", href: "#about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-xl">
      <nav className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 container-padding sm:flex sm:justify-between">
        <a href="#top" className="display-font min-w-0 text-base font-bold tracking-[0.12em] text-foreground sm:text-lg">
          VICTOR KANN<span className="text-muted-foreground">.</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <Button size="sm" className="gap-2 font-semibold" onClick={() => openLeadForm("Navbar — work with Victor") }>
            Work with me
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        <Button size="sm" className="gap-2 font-semibold md:hidden" onClick={() => openLeadForm("Navbar — work with Victor") }>
          Work with me
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </nav>
    </header>
  );
}

function Hero() {
  const { openLeadForm } = useLeadForm();

  return (
    <section className="bg-ink text-ink-foreground">
      <div className="mx-auto grid min-h-[min(760px,82svh)] max-w-7xl items-end gap-12 container-padding section-padding lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <div className="max-w-4xl">
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">Victor Kann</p>
          <h1 className="display-font max-w-4xl text-balance text-[clamp(2.8rem,8vw,6.8rem)] font-bold leading-[0.96]">
            Building systems, audiences &amp; digital income.
          </h1>
          <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-ink-muted sm:text-xl">
            I build and experiment with AI, funnels, automation and online business systems, while documenting what I learn along the way.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="w-full gap-2 bg-ink-foreground text-ink hover:bg-ink-foreground/90 sm:w-auto" onClick={() => openLeadForm("Hero — work with Victor") }>
              Work with me
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="w-full gap-2 border-ink-border bg-transparent text-ink-foreground hover:bg-ink-soft sm:w-auto" asChild>
              <a href="#building">
                See what I&apos;m building
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="border-l border-ink-border pl-5 sm:pl-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">A personal workspace</p>
          <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink-muted">
            <p>Curious about what makes digital work compound: better systems, clearer ideas and consistent distribution.</p>
            <div className="flex items-center gap-3 text-ink-foreground">
              <CircleDot className="h-4 w-4 shrink-0 text-ink-muted" />
              <span>Building in public, one useful experiment at a time.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>
      <h2 className="display-font mt-4 text-balance text-3xl font-bold leading-tight sm:text-5xl">{title}</h2>
      {sub && <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{sub}</p>}
    </div>
  );
}

function ExploringSection() {
  const topics = [
    { icon: <Bot className="h-5 w-5" />, title: "AI", description: "Practical AI tools, workflows and systems." },
    { icon: <Funnel className="h-5 w-5" />, title: "Funnels", description: "Turning attention into leads and customers." },
    { icon: <Workflow className="h-5 w-5" />, title: "Automation", description: "Reducing repetitive work with better systems." },
    { icon: <Megaphone className="h-5 w-5" />, title: "Marketing", description: "Learning what earns attention, trust and action." },
    { icon: <BriefcaseBusiness className="h-5 w-5" />, title: "Online Business", description: "Building, testing and documenting digital businesses." },
  ];

  return (
    <section id="exploring" className="section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="What I&apos;m exploring" title="The ideas and systems I keep coming back to." />
        <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {topics.map((topic) => (
            <article key={topic.title} className="bg-background p-6 transition-colors hover:bg-surface-dim sm:p-7">
              <div className="mb-12 text-muted-foreground">{topic.icon}</div>
              <h3 className="display-font text-xl font-semibold">{topic.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{topic.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BuildingSection() {
  return (
    <section id="building" className="border-y border-border bg-surface-dim section-padding container-padding">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] lg:items-end">
        <div>
          <SectionHeading
            eyebrow="Currently building"
            title="OneLink Funnel"
            sub="A focused project for turning scattered attention into a clearer path from click to conversation."
          />
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            It is being built, tested and improved in public. The goal is not to ship a shiny idea and disappear, but to learn what actually helps people move from interest to action.
          </p>
          <Button variant="outline" className="mt-8 gap-2 border-border font-semibold" asChild>
            <a href="https://x.com/iamVictorKann" target="_blank" rel="noopener noreferrer">
              Follow the build
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
        <div className="border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          <Badge variant="outline" className="rounded-full border-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Active experiment
          </Badge>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Notes, iterations and lessons will live here as the project takes shape.</p>
        </div>
      </div>
    </section>
  );
}

function HelpSection() {
  const { openLeadForm } = useLeadForm();
  const areas = [
    { icon: <GitBranch className="h-5 w-5" />, title: "Lead Generation", description: "Build systems that turn attention into qualified leads." },
    { icon: <Funnel className="h-5 w-5" />, title: "Funnels", description: "Create a clearer path from visitor to lead to customer." },
    { icon: <Workflow className="h-5 w-5" />, title: "Automation", description: "Connect tools and workflows so less work has to be done manually." },
    { icon: <Bot className="h-5 w-5" />, title: "AI Systems", description: "Use AI where it can genuinely improve a business workflow." },
  ];

  return (
    <section className="section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="What I can help with" title="Useful systems for the part of the business that feels stuck." />
        <div className="grid gap-4 md:grid-cols-2">
          {areas.map((area) => (
            <article key={area.title} className="border border-border p-6 sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border text-muted-foreground">{area.icon}</div>
                <span className="text-xs text-muted-foreground">0{areas.indexOf(area) + 1}</span>
              </div>
              <h3 className="display-font mt-12 text-2xl font-semibold">{area.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{area.description}</p>
            </article>
          ))}
        </div>
        <Button className="mt-8 gap-2 font-semibold" onClick={() => openLeadForm("What I can help with — work with Victor") }>
          Work with me
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}

function SelectedWorkSection() {
  const { openLeadForm } = useLeadForm();
  const projects = [
    {
      image: cozyNestImg,
      title: "Cozy Nest — Yaba",
      type: "Direct booking website",
      description: "A conversion-focused shortlet website built around clear information and a simple enquiry path.",
      href: "https://cozy.victorkann.com",
      alt: "Cozy Nest Yaba direct booking website",
      source: "Selected work — Cozy Nest Yaba",
    },
    {
      image: averyLekkiImg,
      title: "The Avery — Lekki",
      type: "Hospitality website",
      description: "A more elevated direction for a luxury apartment brand, with the experience doing the selling.",
      href: "https://avery.victorkann.com",
      alt: "The Avery Lekki luxury apartment website",
      source: "Selected work — The Avery Lekki",
    },
  ];

  return (
    <section id="work" className="border-y border-border bg-surface-dim section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Selected work" title="Systems, websites and digital projects I&apos;ve built or worked on." sub="Shortlet websites are one part of the work, not the whole story." />
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <article key={project.title} className="overflow-hidden border border-border bg-background">
              <a href={project.href} target="_blank" rel="noopener noreferrer" className="group block aspect-[16/10] overflow-hidden border-b border-border">
                <img src={project.image} alt={project.alt} width={1280} height={800} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
              </a>
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{project.type}</p>
                    <h3 className="display-font mt-3 text-2xl font-semibold">{project.title}</h3>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">{project.description}</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button className="w-full gap-2 font-semibold sm:w-auto" asChild>
                    <a href={project.href} target="_blank" rel="noopener noreferrer">
                      View live site
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full gap-2 border-border font-semibold sm:w-auto" onClick={() => openLeadForm(project.source)}>
                    Build something similar
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

function WritingSection() {
  const categories = ["AI", "Funnels", "Automation", "Marketing", "Building Online"];

  return (
    <section id="writing" className="section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Build log / writing" title="Notes from the work, not polished lessons from a mountaintop." sub="A place for future posts, experiments and build-in-public updates." />
        <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category, index) => (
            <article key={category} className="flex min-h-44 flex-col justify-between bg-background p-6 transition-colors hover:bg-surface-dim">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Coming soon · 0{index + 1}</p>
                <h3 className="display-font mt-3 text-xl font-semibold">{category}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="border-y border-border bg-ink text-ink-foreground section-padding container-padding">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">About</p>
        <div className="max-w-3xl">
          <h2 className="display-font text-3xl font-bold sm:text-5xl">I&apos;m Victor Kann.</h2>
          <div className="mt-7 space-y-5 text-lg leading-relaxed text-ink-muted">
            <p>I&apos;m interested in the intersection of AI, marketing, automation and online business.</p>
            <p>I&apos;m building systems, testing ideas and documenting what works, what doesn&apos;t, and what I&apos;m learning along the way.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkWithMeSection() {
  const { openLeadForm } = useLeadForm();

  return (
    <section className="section-padding container-padding">
      <div className="mx-auto max-w-7xl border border-border p-7 sm:p-12 lg:p-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.65fr)] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Work with me</p>
            <h2 className="display-font mt-4 max-w-3xl text-balance text-3xl font-bold leading-tight sm:text-5xl">Have something you&apos;re trying to build or improve?</h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">Tell me what you&apos;re working on, where you&apos;re stuck and what you&apos;re trying to achieve. I&apos;ll use that information to understand whether I can help.</p>
          </div>
          <div>
            <div className="border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
              <Layers3 className="mb-4 h-5 w-5" />
              Start with a few practical details. The enquiry form is the first version of the prospecting system we&apos;ll improve later.
            </div>
            <Button size="lg" className="mt-7 w-full gap-2 font-semibold sm:w-auto" onClick={() => openLeadForm("Work with me — start a conversation") }>
              Start a conversation
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function BookCallSection() {
  return (
    <section className="border-y border-border bg-surface-dim section-padding container-padding">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Book a call</p>
          <h2 className="display-font mt-4 text-3xl font-bold sm:text-4xl">Prefer to talk it through?</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">Book a short discovery call and tell me what you&apos;re working on.</p>
        </div>
        <Button size="lg" className="w-full gap-2 font-semibold sm:w-auto" asChild>
          <a href="https://cal.com/autogrowhq/15" target="_blank" rel="noopener noreferrer">
            <CalendarDays className="h-4 w-4" />
            Book a 15-minute call
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="section-padding container-padding">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Other contact option</p>
          <p className="mt-3 text-base text-muted-foreground">Prefer email or don&apos;t use WhatsApp?</p>
        </div>
        <a href="mailto:iamvictorkann@outlook.com" className="inline-flex items-center gap-3 text-base font-semibold text-foreground underline-offset-4 hover:underline">
          <Mail className="h-5 w-5 text-muted-foreground" />
          iamvictorkann@outlook.com
        </a>
      </div>
    </section>
  );
}

function Footer() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    ["What is this site about?", "This is my working space for AI, funnels, automation, marketing and online business experiments."],
    ["Can I work with you?", "Yes. Start a conversation with the enquiry form and share what you are building, where you are stuck and what you want to improve."],
  ];

  return (
    <footer className="border-t border-border bg-surface-dim py-10 container-padding">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <p className="display-font text-lg font-bold tracking-[0.12em]">VICTOR KANN</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">AI · Funnels · Automation · Marketing · Online Business</p>
          </div>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground md:items-end">
            <a href="https://x.com/iamVictorKann" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-foreground">
              X: @iamVictorKann
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a href="mailto:iamvictorkann@outlook.com" className="inline-flex items-center gap-2 hover:text-foreground">
              Email: iamvictorkann@outlook.com
              <Mail className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">A couple of quick answers</p>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {faqs.map(([question, answer], index) => {
              const isOpen = openFaq === index;
              return (
                <div key={question} className="border border-border bg-background">
                  <Button variant="ghost" className="h-auto w-full justify-between gap-4 px-4 py-4 text-left font-semibold hover:bg-surface-dim" onClick={() => setOpenFaq(isOpen ? null : index)} aria-expanded={isOpen}>
                    {question}
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </Button>
                  {isOpen && <p className="border-t border-border px-4 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground">{answer}</p>}
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">© {new Date().getFullYear()} Victor Kann</p>
      </div>
    </footer>
  );
}

function FloatingBooking() {
  const { openLeadForm } = useLeadForm();

  return (
    <Button type="button" onClick={() => openLeadForm("Floating button — work with Victor")} aria-label="Work with Victor" className="fixed bottom-4 right-4 z-50 h-12 w-12 gap-2 rounded-full px-0 font-semibold shadow-lg shadow-foreground/15 transition-transform hover:scale-105 sm:bottom-6 sm:right-6 sm:w-auto sm:px-4">
      <MessageCircle className="h-4 w-4" />
      <span className="hidden sm:inline">Work with me</span>
    </Button>
  );
}