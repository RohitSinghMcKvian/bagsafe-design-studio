import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Clock, MapPin, Sparkles, Hand } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/lib/auth";
import { SavingsCalculator } from "@/components/site/SavingsCalculator";
import { AnimatedCounter } from "@/components/site/AnimatedCounter";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { whatsappLink } from "@/lib/contact";

import heroImg from "@/assets/hero-airplane.jpg";
import travelerImg from "@/assets/traveler-window.jpg";
import vanImg from "@/assets/delivery-van.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BagSafe — Travel Light. Save Big on Excess Baggage." },
      {
        name: "description",
        content:
          "BagSafe collects your overweight luggage from your doorstep and delivers it to your destination. Skip airline excess baggage fees on domestic and international flights.",
      },
      {
        property: "og:title",
        content: "BagSafe — Travel Light. Save Big on Excess Baggage.",
      },
      {
        property: "og:description",
        content:
          "Doorstep luggage pickup & delivery. Save up to 70% on airline excess baggage fees with BagSafe.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <TrustStrip />
      <WhyBagSafe />
      <HowItWorks />
      <CalculatorSection />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </SiteLayout>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Airplane on a runway at sunset"
          width={1920}
          height={1280}
          className="h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/55 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />
      </div>

      <div className="container-page relative pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40">
        <div className="max-w-3xl animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber">
            <Sparkles className="h-3.5 w-3.5" />
            Excess baggage, zero stress
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.02] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            Travel light.
            <br />
            <span className="italic text-amber">Save big</span> on excess baggage.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-foreground/80 md:text-xl">
            BagSafe picks up your overweight luggage from your doorstep, ships it
            ahead of you, and delivers it to your destination — for a fraction of
            airline excess fees.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-amber px-7 text-amber-foreground hover:bg-amber/90"
            >
              <Link to="/book">
                Book a Pickup
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-white/30 bg-white/5 text-ink-foreground hover:bg-white/15 hover:text-ink-foreground"
            >
              <Link to="/pricing">See Pricing</Link>
            </Button>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
            <Stat label="Travelers served">
              <AnimatedCounter end={42000} suffix="+" />
            </Stat>
            <Stat label="₹ saved (Cr)">
              <AnimatedCounter end={4.2} suffix="" format={(n) => n.toFixed(1)} />
            </Stat>
            <Stat label="Cities covered">
              <AnimatedCounter end={120} suffix="+" />
            </Stat>
          </dl>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-[0.16em] text-ink-foreground/60">
        {label}
      </dt>
      <dd className="mt-2 font-display text-3xl font-semibold text-ink-foreground md:text-4xl">
        {children}
      </dd>
    </div>
  );
}

function TrustStrip() {
  const airlines = ["IndiGo", "Air India", "Vistara", "SpiceJet", "Emirates", "Qatar"];
  return (
    <section className="border-b border-border bg-background py-10">
      <div className="container-page">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Trusted by travelers flying with
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
          {airlines.map((a) => (
            <span key={a} className="font-display text-xl font-semibold tracking-tight text-foreground/70">
              {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyBagSafe() {
  const items = [
    { icon: Clock, title: "15-minute pickup", desc: "Schedule a slot, our courier arrives at your door within the hour. No queues. No drama." },
    { icon: MapPin, title: "Door-to-doorstep delivery", desc: "We hand-deliver your bags to your hotel, residence, or destination — anywhere in India." },
    { icon: ShieldCheck, title: "₹50,000 insured", desc: "Every booking is insured up to ₹50,000 with real-time tracking and tamper-proof seals." },
    { icon: Sparkles, title: "Save up to 70%", desc: "Pay flat per-kg pricing. No surprise excess fees, no payment counter at the airport." },
  ];

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Why BagSafe</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
            The smarter way to fly with extra bags.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.title} className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-elegant">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Book your pickup", desc: "Tell us your flight, weight, pickup and delivery addresses in 2 minutes." },
    { num: "02", title: "We collect your bags", desc: "A trained courier arrives at your door, weighs, seals and tags your luggage." },
    { num: "03", title: "We ship them ahead", desc: "Bags travel via our trusted partner network with end-to-end tracking." },
    { num: "04", title: "Doorstep delivery", desc: "We deliver to your destination address — often before you've checked in." },
  ];

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-page">
        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">How it works</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
              4 simple steps to <span className="italic text-amber">freedom</span>.
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            From the moment you book to the moment your bags land at your destination, every step is handled by us. You just travel.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <ol className="space-y-3">
            {steps.map((s) => (
              <li key={s.num} className="group flex gap-5 rounded-2xl border border-transparent bg-card p-5 transition-all hover:border-border hover:shadow-elegant md:p-6">
                <div className="font-display text-3xl font-semibold leading-none text-amber md:text-4xl">{s.num}</div>
                <div>
                  <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="relative overflow-hidden rounded-3xl shadow-elegant">
            <img src={travelerImg} alt="Traveler relaxing by an airplane window at sunset" loading="lazy" width={1280} height={1280} className="h-full max-h-[640px] w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-6 text-ink-foreground md:p-8">
              <p className="font-display text-2xl font-semibold leading-tight">
                "I boarded with a single carry-on. My bags were waiting at the hotel."
              </p>
              <p className="mt-2 text-sm text-ink-foreground/70">Aanya R. — Mumbai → Dubai</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CalculatorSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container-page">
        <SavingsCalculator />
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    { quote: "Pickup was bang on time, the courier was professional, and my suitcase reached Bangalore before I did. Genuinely game-changing.", name: "Rohan M.", meta: "Frequent flyer · Delhi" },
    { quote: "Saved me ₹12,000 in excess fees on a single Emirates flight. I'll never check overweight at the counter again.", name: "Priya S.", meta: "Mumbai → London" },
    { quote: "Tracking was real-time, support replied on WhatsApp within minutes. Premium service at a fair price.", name: "Arjun K.", meta: "Bengaluru → Singapore" },
  ];

  return (
    <section className="bg-ink py-20 text-ink-foreground md:py-28">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">Loved by travelers</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
            The road changes.
            <br />
            <span className="italic text-amber">The luggage doesn't.</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-amber/30">
              <div aria-hidden className="font-display text-5xl leading-none text-amber">"</div>
              <blockquote className="mt-2 text-base leading-relaxed text-ink-foreground/85">{q.quote}</blockquote>
              <figcaption className="mt-5 border-t border-white/10 pt-4 text-sm">
                <div className="font-semibold">{q.name}</div>
                <div className="text-ink-foreground/60">{q.meta}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "How far in advance should I book?", a: "We recommend booking at least 48 hours before your flight. Same-day pickups are available in most metro cities, subject to courier availability." },
    { q: "What can I send through BagSafe?", a: "Personal clothing, accessories, gifts, electronics (declared), and most non-perishable items. Prohibited items include hazardous materials, liquids over airline limits, perishables, and currency." },
    { q: "Is my luggage insured?", a: "Yes. Every booking includes ₹50,000 of complimentary insurance. Higher coverage is available on request." },
    { q: "How long does delivery take?", a: "Domestic deliveries take 1–3 business days. International shipments take 3–7 business days depending on the route and customs clearance." },
    { q: "Do you handle customs for international shipments?", a: "Yes — we coordinate documentation and brokerage. You'll be notified of any duties or taxes payable at destination." },
  ];

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">FAQ</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">Questions, answered.</h2>
            <p className="mt-4 text-muted-foreground">Still curious? Message us on WhatsApp — we usually reply in minutes.</p>
            <Button asChild variant="outline" className="mt-6 rounded-full">
              <a href={whatsappLink("Hi BagSafe, I have a question.")} target="_blank" rel="noreferrer noopener">
                Chat with us
              </a>
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 text-ink-foreground shadow-elegant md:p-16 lg:p-20">
          <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
                Ready to see the
                <br />
                <span className="italic text-amber">difference?</span>
              </h2>
              <p className="mt-5 max-w-lg text-lg text-ink-foreground/80">
                Book your first pickup in under 2 minutes. We'll handle the rest.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full bg-amber px-7 text-amber-foreground hover:bg-amber/90">
                  <Link to="/book">
                    Book a Pickup
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full border-white/30 bg-white/5 text-ink-foreground hover:bg-white/15 hover:text-ink-foreground">
                  <a href={whatsappLink("Hi BagSafe, I'd like to book a pickup.")} target="_blank" rel="noreferrer noopener">
                    WhatsApp us
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative hidden overflow-hidden rounded-2xl shadow-elegant lg:block">
              <img src={vanImg} alt="BagSafe delivery van at a customer's doorstep" loading="lazy" width={1280} height={960} className="h-72 w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
