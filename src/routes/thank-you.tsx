import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_URL = "https://wa.me/2348161123296";
const CAL_URL = "https://cal.com/kanayo/15";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Next steps | Victor Kann" },
      {
        name: "description",
        content: "Review your WhatsApp enquiry and choose the next step with Victor Kann.",
      },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-dim px-4 py-12">
      <section className="w-full max-w-2xl border border-border bg-background p-6 shadow-sm sm:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Your next step</p>
        <h1 className="display-font mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          Your enquiry message is ready.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          WhatsApp should have opened with your details addressed to Victor. Please check the message and press Send. Your enquiry is only submitted when you send that message.
        </p>

        <div className="mt-7 border-l-2 border-primary bg-surface-dim p-4">
            <p className="text-sm font-semibold">Before you leave WhatsApp</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Check that your name, email, WhatsApp number, business details and main challenge are correct, then press Send. The message goes to Victor at +234 816 112 3296.
            </p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Reopen WhatsApp <MessageCircle className="h-4 w-4" />
            </a>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="gap-2 rounded-full">
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer">
              Book a 15-minute call <CalendarCheck className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" className="gap-2 rounded-full">
            <Link to="/">
              Back to the website <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="mt-7 text-xs leading-relaxed text-muted-foreground">
          If WhatsApp did not open, use the Reopen WhatsApp link above. Your details are not stored on this website at this stage.
        </p>
      </section>
    </main>
  );
}
