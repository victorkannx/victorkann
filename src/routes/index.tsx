import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  ExternalLink,
  GitBranch,
  Layers3,
  Mail,
  Menu,
  MessageCircle,
  Network,
  X,
  Workflow,
} from "lucide-react";
import { LeadFormProvider, useLeadForm } from "@/components/lead-form-dialog";
import cozyNestImg from "@/assets/cozy-nest-yaba.jpg";
import averyLekkiImg from "@/assets/avery-lekki.jpg";

const CAL_LINK = "https://cal.com/autogrowhq/15";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Victor Kanayo — Business Systems & Automation Builder" },
      {
        name: "description",
        content:
          "Victor Kanayo builds the websites, funnels, booking systems, automations and AI workflows behind growing businesses.",
      },
      {
        property: "og:title",
        content: "Victor Kanayo — Business Systems & Automation Builder",
      },
      {
        property: "og:description",
        content:
          "I build the systems behind growing businesses: websites, funnels, booking systems, automations and AI workflows.",
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
          <ProblemSection />
          <BuildSection />
          <MessySystemSection />
          <SelectedWorkSection />
          <ProcessSection />
          <AboutSection />
          <EngagementSection />
          <FinalCta />
        </main>
        <Footer />
        <FloatingBooking />
      </div>
    </LeadFormProvider>
  );
}

function Navbar() {
  const { openLeadForm } = useLeadForm();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between container-padding">
        <a href="#top" className="display-font text-sm font-bold tracking-[0.16em] text-foreground sm:text-base">
          VICTOR KANAYO<span className="text-muted-foreground">.</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
          <Button size="sm" className="gap-2 font-semibold" asChild>
            <a href={CAL_LINK} target="_blank" rel="noopener noreferrer">
              Book a call
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="border-border md:hidden"
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
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={closeMenu} className="border-b border-border py-3 text-sm font-medium text-muted-foreground last:border-0 hover:text-foreground">
                {link.label}
              </a>
            ))}
            <Button className="mt-3 w-full justify-between gap-2 font-semibold" asChild>
              <a href={CAL_LINK} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                Book a call
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-ink text-ink-foreground">
      <div className="mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-7xl items-center gap-14 container-padding section-padding lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:gap-20">
        <div className="max-w-3xl">
          <p className="mb-7 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink-muted">Business systems &amp; automation</p>
          <h1 className="display-font max-w-3xl text-balance text-[clamp(3.1rem,8vw,7.3rem)] font-bold leading-[0.92]">
            I build the systems behind growing businesses.
          </h1>
          <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-ink-muted sm:text-xl">
            Websites, funnels, booking systems and automations designed to turn attention into customers.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="w-full gap-2 bg-ink-foreground text-ink hover:bg-ink-foreground/90 sm:w-auto" asChild>
              <a href={CAL_LINK} target="_blank" rel="noopener noreferrer">
                Book a call
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="w-full gap-2 border-ink-border bg-transparent text-ink-foreground hover:bg-ink-soft sm:w-auto" asChild>
              <a href="#work">
                View my work
                <ArrowDown className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
        <SystemFlow />
      </div>
    </section>
  );
}

function SystemFlow() {
  const nodes = ["Visitor", "Website", "Lead", "Qualification", "Booking", "Customer"];

  return (
    <div className="relative border border-ink-border bg-ink-soft/40 p-5 sm:p-8" aria-label="Business system flow">
      <div className="mb-8 flex items-center justify-between border-b border-ink-border pb-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-muted">A connected system</span>
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-ink-muted"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-foreground" />Live flow</span>
      </div>
      <div className="space-y-0">
        {nodes.map((node, index) => (
          <div key={node} className="system-flow-node flex items-center gap-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-ink-border text-xs text-ink-muted">0{index + 1}</span>
            <span className="display-font text-lg font-semibold capitalize text-ink-foreground sm:text-xl">{node}</span>
            {index < nodes.length - 1 && <span className="ml-auto h-8 w-px bg-ink-border" />}
          </div>
        ))}
      </div>
      <p className="mt-8 border-t border-ink-border pt-4 text-xs leading-relaxed text-ink-muted">The right pieces, connected in the right order.</p>
    </div>
  );
}

function SectionHeading({ eyebrow, title, sub, light = false }: { eyebrow: string; title: string; sub?: string; light?: boolean }) {
  return (
    <div className="mb-12 max-w-3xl">
      <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${light ? "text-ink-muted" : "text-muted-foreground"}`}>{eyebrow}</p>
      <h2 className={`display-font mt-4 text-balance text-3xl font-bold leading-[1.02] sm:text-5xl ${light ? "text-ink-foreground" : "text-foreground"}`}>{title}</h2>
      {sub && <p className={`mt-5 max-w-2xl text-base leading-relaxed sm:text-lg ${light ? "text-ink-muted" : "text-muted-foreground"}`}>{sub}</p>}
    </div>
  );
}

function ProblemSection() {
  const journey = ["Traffic", "Landing page", "Lead", "Follow-up", "Booking", "Customer"];
  return (
    <section className="section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="The problem" title="Most businesses don’t need another website." sub="They need the pieces behind it to work together." />
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <p className="max-w-md text-xl leading-relaxed text-muted-foreground sm:text-2xl">I design and build the infrastructure connecting those pieces.</p>
          <div className="border-y border-border py-2">
            {journey.map((step, index) => (
              <div key={step} className="flex items-center gap-3 border-b border-border py-4 last:border-0 sm:gap-5 sm:py-5">
                <span className="text-[10px] font-semibold text-muted-foreground">0{index + 1}</span>
                <span className="display-font text-lg font-semibold sm:text-xl">{step}</span>
                {index < journey.length - 1 && <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BuildSection() {
  const { openLeadForm } = useLeadForm();
  const services = [
    { number: "01", icon: <Layers3 className="h-5 w-5" />, title: "Websites", description: "Conversion-focused websites that give businesses a clear digital front door." },
    { number: "02", icon: <GitBranch className="h-5 w-5" />, title: "Funnels", description: "Landing pages and customer journeys designed to turn traffic into leads and sales." },
    { number: "03", icon: <CalendarDays className="h-5 w-5" />, title: "Booking systems", description: "Booking experiences that let customers discover, qualify, schedule and receive confirmations automatically." },
    { number: "04", icon: <Workflow className="h-5 w-5" />, title: "Automation", description: "Workflows, integrations and AI systems that remove repetitive manual processes." },
  ];

  return (
    <section id="services" className="border-y border-border bg-surface-dim section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="What I build" title="The infrastructure behind the attention." sub="Not isolated deliverables. Connected systems that help a business move with less friction." />
        <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
          {services.map((service) => (
            <article key={service.title} className="group flex min-h-[17rem] flex-col bg-background p-6 transition-colors hover:bg-ink hover:text-ink-foreground sm:p-8">
              <div className="flex items-start justify-between">
                <span className="text-muted-foreground transition-colors group-hover:text-ink-muted">{service.icon}</span>
                <span className="text-xs text-muted-foreground transition-colors group-hover:text-ink-muted">{service.number}</span>
              </div>
              <div className="mt-auto pt-12">
                <h3 className="display-font text-2xl font-semibold">{service.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-ink-muted">{service.description}</p>
                <button type="button" onClick={() => openLeadForm(`${service.title} — discuss a project`)} className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-colors group-hover:text-ink-foreground">
                  Discuss this system <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MessySystemSection() {
  const before = ["WhatsApp messages", "Spreadsheets", "Missed leads", "Manual follow-ups", "Scattered customer information", "Repetitive admin work"];
  const after = ["Lead", "Capture", "Qualify", "Automate", "Book", "Follow up", "Convert"];
  return (
    <section className="section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Messy → system" title="You bring me the messy process. I turn it into a system." />
        <div className="grid border border-border lg:grid-cols-2">
          <div className="border-b border-border p-6 sm:p-10 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Before</span>
              <span className="text-xs text-muted-foreground">Disconnected</span>
            </div>
            <ul className="mt-7 space-y-4">
              {before.map((item) => <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />{item}</li>)}
            </ul>
          </div>
          <div className="bg-ink p-6 text-ink-foreground sm:p-10">
            <div className="flex items-center justify-between border-b border-ink-border pb-5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-foreground">After</span>
              <span className="text-xs text-ink-muted">Connected</span>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-px border border-ink-border bg-ink-border sm:grid-cols-3">
              {after.map((item, index) => <div key={item} className="flex items-center gap-2 bg-ink p-3 text-sm font-medium"><Check className="h-3.5 w-3.5 text-ink-muted" />{item}<span className="ml-auto text-[10px] text-ink-muted">0{index + 1}</span></div>)}
            </div>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-ink-muted">Clear inputs. Useful automation. A business that can keep moving when you are not watching every step.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

type Project = { number: string; title: string; description: string; tags: string[]; image?: string; href?: string; alt?: string };

function ProjectVisual({ project }: { project: Project }) {
  if (project.image) return <img src={project.image} alt={project.alt ?? project.title} width={1280} height={800} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />;
  const labels = project.title === "Real Estate Lead Recovery System" ? ["New lead", "AI qualification", "Recovery"] : project.title === "Service Booking Platform" ? ["Customer", "Provider", "Booking"] : ["Plan", "Schedule", "Publish"];
  return (
    <div className="flex h-full items-center justify-center bg-ink p-6 text-ink-foreground sm:p-10">
      <div className="w-full max-w-sm border border-ink-border bg-ink-soft/50 p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between border-b border-ink-border pb-4"><Network className="h-4 w-4 text-ink-muted" /><span className="text-[10px] uppercase tracking-[0.16em] text-ink-muted">System map</span></div>
        <div className="space-y-2">{labels.map((label, index) => <div key={label} className="flex items-center gap-3 border border-ink-border p-3 text-sm"><span className="text-[10px] text-ink-muted">0{index + 1}</span><span>{label}</span><ArrowRight className="ml-auto h-3.5 w-3.5 text-ink-muted" /></div>)}</div>
      </div>
    </div>
  );
}

function SelectedWorkSection() {
  const { openLeadForm } = useLeadForm();
  const projects: Project[] = [
    { number: "01", title: "Real Estate Lead Recovery System", description: "AI-powered lead qualification and recovery system for turning missed conversations into organized next steps.", tags: ["Website", "AI", "CRM", "Automation"] },
    { number: "02", title: "Service Booking Platform", description: "A booking system connecting customers with service providers through a clearer path from discovery to confirmation.", tags: ["Marketplace", "Booking", "Payments", "Database"] },
    { number: "03", title: "X Dispatcher", description: "Content planning, scheduling and publishing system for a more consistent distribution workflow.", tags: ["SaaS", "Automation", "Scheduling", "AI"] },
    { number: "04", title: "Cozy Nest — Yaba", description: "A direct booking website for a shortlet brand, built around clear information and a simple enquiry path.", tags: ["Website", "Hospitality", "Direct booking"], image: cozyNestImg, href: "https://cozy.victorkann.com", alt: "Cozy Nest Yaba direct booking website" },
    { number: "05", title: "The Avery — Lekki", description: "An elevated hospitality website for a luxury apartment brand, with the experience doing the selling.", tags: ["Website", "Hospitality", "Luxury stay"], image: averyLekkiImg, href: "https://avery.victorkann.com", alt: "The Avery Lekki luxury apartment website" },
  ];

  return (
    <section id="work" className="border-y border-border bg-surface-dim section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Selected work" title="Systems I’ve built." sub="A mix of platforms, workflows and websites. Each project is about making the next step clearer." />
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <article key={project.title} className={`group overflow-hidden border border-border bg-background ${project.number === "01" ? "lg:col-span-2 lg:grid lg:grid-cols-[1.05fr_0.95fr]" : ""}`}>
              <a href={project.href ?? "#contact"} target={project.href ? "_blank" : undefined} rel={project.href ? "noopener noreferrer" : undefined} className="block aspect-[16/10] overflow-hidden border-b border-border lg:border-b-0 lg:border-r">
                <ProjectVisual project={project} />
              </a>
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-5"><span className="text-xs font-semibold text-muted-foreground">PROJECT {project.number}</span><ArrowUpRight className="h-4 w-4 text-muted-foreground" /></div>
                <h3 className="display-font mt-7 text-2xl font-semibold sm:text-3xl">{project.title}</h3>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">{project.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">{project.tags.map((tag) => <Badge key={tag} variant="outline" className="rounded-full border-border text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">{tag}</Badge>)}</div>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  {project.href ? <Button className="w-full gap-2 font-semibold sm:w-auto" asChild><a href={project.href} target="_blank" rel="noopener noreferrer">View live site <ExternalLink className="h-4 w-4" /></a></Button> : <Button className="w-full gap-2 font-semibold sm:w-auto" onClick={() => openLeadForm(`${project.title} — discuss a case study`)}>View case study <ArrowUpRight className="h-4 w-4" /></Button>}
                  <Button variant="outline" className="w-full gap-2 border-border font-semibold sm:w-auto" onClick={() => openLeadForm(`${project.title} — discuss a similar system`)}>Discuss a similar system</Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    ["01", "Understand", "Map the business, customer journey and current process."],
    ["02", "Architect", "Design the system, workflow and user experience."],
    ["03", "Build", "Build the website, funnel, database, integrations and automations."],
    ["04", "Launch", "Test everything, connect the components and launch."],
    ["05", "Optimize", "Improve the system based on real usage and feedback."],
  ];
  return (
    <section className="section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="How I work" title="From idea to working system." />
        <div className="grid border-y border-border md:grid-cols-5">
          {steps.map(([number, title, description]) => <article key={number} className="border-b border-border p-6 last:border-0 md:border-b-0 md:border-r md:last:border-r-0 sm:p-7"><span className="text-xs font-semibold text-muted-foreground">{number}</span><h3 className="display-font mt-12 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p></article>)}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="border-y border-border bg-ink text-ink-foreground section-padding container-padding">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:items-center">
        <div className="flex aspect-square max-w-xs items-end border border-ink-border bg-ink-soft/50 p-6 sm:p-8">
          <div><div className="display-font text-7xl font-bold leading-none text-ink-foreground sm:text-8xl">VK</div><p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-ink-muted">Based in Nigeria<br />Working globally</p></div>
        </div>
        <div className="max-w-3xl">
          <SectionHeading eyebrow="About" title="I’m Victor Kanayo." light />
          <div className="space-y-5 text-lg leading-relaxed text-ink-muted sm:text-xl"><p>I build digital systems for businesses.</p><p>My work sits somewhere between web development, automation, marketing and AI.</p><p>I like taking complicated business processes and turning them into simple systems that actually work.</p></div>
          <div className="mt-9 flex flex-wrap gap-5 text-sm text-ink-muted"><a href="https://x.com/iamVictorKann" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-ink-foreground">X <ExternalLink className="h-3.5 w-3.5" /></a><span className="text-ink-border">/</span><span>Instagram — coming soon</span><span className="text-ink-border">/</span><span>LinkedIn — coming soon</span></div>
        </div>
      </div>
    </section>
  );
}

function EngagementSection() {
  const { openLeadForm } = useLeadForm();
  const paths: Array<{ title: string; description: string; items: string[] }> = [
    ["Build", "For businesses that need a new digital system.", ["Websites", "Funnels", "Booking", "Automation"]],
    ["Automate", "For businesses that already have a process but want to remove manual work.", ["Workflows", "CRM", "AI", "Integrations"]],
    ["Optimize", "For businesses that already have a system and want to improve it.", ["Conversion", "Automation", "UX", "Analytics"]],
  ].map(([title, description, items]) => ({ title, description, items }));
  return (
    <section id="contact" className="section-padding container-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Engagement" title="What can I build for you?" />
        <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {paths.map(([title, description, items]) => <article key={title} className="flex min-h-72 flex-col bg-background p-6 sm:p-8"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</span><p className="mt-7 max-w-xs text-base leading-relaxed">{description}</p><div className="mt-auto flex flex-wrap gap-2 pt-8">{items.map((item) => <span key={item} className="text-xs text-muted-foreground">{item}</span>)}</div></article>)}
        </div>
        <Button className="mt-8 gap-2 font-semibold" onClick={() => openLeadForm("Engagement — let’s discuss the project")}>Let’s discuss your project <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="border-y border-border bg-surface-dim section-padding container-padding">
      <div className="mx-auto flex max-w-7xl flex-col gap-9 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl"><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Start a conversation</p><h2 className="display-font mt-4 text-balance text-4xl font-bold leading-[0.98] sm:text-6xl">Have a business process that feels unnecessarily complicated?</h2><p className="mt-6 text-lg text-muted-foreground">Let’s turn it into a system.</p></div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"><Button size="lg" className="w-full gap-2 font-semibold sm:w-auto" asChild><a href={CAL_LINK} target="_blank" rel="noopener noreferrer">Book a call <ArrowUpRight className="h-4 w-4" /></a></Button><Button size="lg" variant="outline" className="w-full gap-2 border-border font-semibold sm:w-auto" asChild><a href="mailto:iamvictorkann@outlook.com">Send an email <Mail className="h-4 w-4" /></a></Button></div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10 container-padding">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start"><div><a href="#top" className="display-font text-base font-bold tracking-[0.14em]">VICTOR KANAYO</a><p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">Building websites, funnels, booking systems and automations for modern businesses.</p></div><div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm text-muted-foreground"><a href="#work" className="hover:text-foreground">Work</a><a href="#services" className="hover:text-foreground">Services</a><a href="#about" className="hover:text-foreground">About</a><a href="#contact" className="hover:text-foreground">Contact</a><a href="https://x.com/iamVictorKann" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-foreground">X <ExternalLink className="h-3 w-3" /></a><a href="mailto:iamvictorkann@outlook.com" className="inline-flex items-center gap-2 hover:text-foreground">Email <Mail className="h-3 w-3" /></a></div></div>
        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Victor Kanayo</span><span>Business systems · Automation · AI</span></div>
      </div>
    </footer>
  );
}

function FloatingBooking() {
  return <Button type="button" asChild aria-label="Book a call" className="fixed bottom-4 right-4 z-50 h-12 gap-2 rounded-full px-4 font-semibold shadow-lg shadow-foreground/15 transition-transform hover:scale-105 sm:bottom-6 sm:right-6"><a href={CAL_LINK} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" /><span>Book a call</span></a></Button>;
}