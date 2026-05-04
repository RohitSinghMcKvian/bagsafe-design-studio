import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SavingsCalculator } from "@/components/site/SavingsCalculator";
import { Button } from "@/components/ui/button";
import {
  AIRLINES,
  BAGSAFE_RATE,
  BAGSAFE_HANDLING_FEE,
  SERVICE_LABEL,
  SERVICE_ETA,
  bagsafeCharge,
  formatINR,
} from "@/lib/pricing";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — BagSafe" },
      {
        name: "description",
        content:
          "Transparent per-kg pricing for doorstep luggage delivery across India. ₹150/kg surface, ₹250/kg urgent, plus a one-time ₹499 handling fee.",
      },
      { property: "og:title", content: "BagSafe Pricing — Flat per-kg, no surprises." },
      {
        property: "og:description",
        content:
          "₹150/kg surface, ₹250/kg urgent + ₹499 one-time handling. See exactly what you save vs. airline excess fees.",
      },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <SiteLayout>
      <PageHero />
      <Tiers />
      <ComparisonTable />
      <CalcSection />
      <Inclusions />
    </SiteLayout>
  );
}

function PageHero() {
  return (
    <section className="bg-ink pt-32 pb-16 text-ink-foreground md:pt-40 md:pb-24">
      <div className="container-page">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">
          Pricing · Domestic
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-tight md:text-6xl lg:text-7xl">
          Flat per-kg rates.
          <br />
          <span className="italic text-amber">No airport surprises.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-foreground/80">
          Pay only for the weight you ship — plus one flat {formatINR(BAGSAFE_HANDLING_FEE)}{" "}
          handling, packaging &amp; pickup fee. Insurance and tracking included.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-ink-foreground/60">
          We currently serve domestic routes within India. International coming soon.
        </p>
      </div>
    </section>
  );
}

function Tiers() {
  const tiers = [
    {
      name: SERVICE_LABEL.surface,
      tag: "Most affordable",
      rate: BAGSAFE_RATE.surface,
      eta: SERVICE_ETA.surface,
      perks: [
        "Door-to-doorstep pickup & delivery",
        SERVICE_ETA.surface,
        "₹50,000 insurance included",
        "Real-time WhatsApp tracking",
      ],
      featured: false,
      service: "surface" as const,
    },
    {
      name: SERVICE_LABEL.urgent,
      tag: "Fastest option",
      rate: BAGSAFE_RATE.urgent,
      eta: SERVICE_ETA.urgent,
      perks: [
        "Priority pickup within 24 hours",
        SERVICE_ETA.urgent,
        "₹50,000 insurance included",
        "Dedicated WhatsApp concierge",
        "Tamper-proof sealing & tags",
      ],
      featured: true,
      service: "urgent" as const,
    },
  ];

  return (
    <section className="bg-background py-20 md:py-24">
      <div className="container-page">
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl border p-7 transition-all md:p-8 ${
                t.featured
                  ? "border-primary/30 bg-gradient-purple text-ink-foreground shadow-elegant"
                  : "border-border bg-card text-foreground hover:-translate-y-1 hover:shadow-elegant"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-7 rounded-full bg-amber px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-foreground">
                  Most popular
                </span>
              )}
              <p
                className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                  t.featured ? "text-amber" : "text-primary"
                }`}
              >
                {t.tag}
              </p>
              <h3 className="mt-2 font-display text-3xl font-semibold">
                {t.name}
              </h3>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">
                  {formatINR(t.rate)}
                </span>
                <span
                  className={`text-sm ${t.featured ? "text-ink-foreground/70" : "text-muted-foreground"}`}
                >
                  / kg
                </span>
              </div>
              <p
                className={`mt-1 text-xs ${t.featured ? "text-ink-foreground/60" : "text-muted-foreground"}`}
              >
                + {formatINR(BAGSAFE_HANDLING_FEE)} one-time handling, packaging &amp; pickup
              </p>
              <p
                className={`mt-3 text-sm font-medium ${
                  t.featured ? "text-ink-foreground/80" : "text-foreground/80"
                }`}
              >
                Example: 3 kg = {formatINR(bagsafeCharge(t.service, 3))}
              </p>

              <ul className="mt-7 space-y-3">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm">
                    <span
                      className={`mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full ${
                        t.featured
                          ? "bg-amber text-amber-foreground"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`mt-8 w-full rounded-full ${
                  t.featured
                    ? "bg-amber text-amber-foreground hover:bg-amber/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                <Link to="/book">
                  Book {t.name}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonTable() {
  // Show airline domestic excess fees vs BagSafe surface per kg.
  return (
    <section className="bg-cream py-20 md:py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Comparison
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
            BagSafe vs. airline excess fees.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Per-kg domestic excess fees — compared to BagSafe's flat{" "}
            {formatINR(BAGSAFE_RATE.surface)}/kg surface rate.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Airline</th>
                <th className="px-5 py-4 text-right">Excess fee / kg</th>
                <th className="px-5 py-4 text-right">BagSafe / kg</th>
                <th className="px-5 py-4 text-right">You save / kg</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {AIRLINES.map((a) => {
                const fee = a.excessFee;
                const save = fee - BAGSAFE_RATE.surface;
                return (
                  <tr key={a.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-5 py-4 font-semibold">{a.name}</td>
                    <td className="px-5 py-4 text-right">{formatINR(fee)}</td>
                    <td className="px-5 py-4 text-right">
                      {formatINR(BAGSAFE_RATE.surface)}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-primary">
                      {formatINR(save)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Airline fees are indicative averages and may vary by route, fare class,
          and date of travel. Always confirm with the airline.
        </p>
      </div>
    </section>
  );
}

function CalcSection() {
  return (
    <section className="bg-background py-20 md:py-24">
      <div className="container-page">
        <SavingsCalculator />
      </div>
    </section>
  );
}

function Inclusions() {
  const included = [
    "₹50,000 insurance per booking",
    "End-to-end real-time tracking",
    "Tamper-proof seals & tags",
    "WhatsApp customer support",
    "Door-to-door pickup & delivery",
    "Packaging materials & labels",
  ];
  const notIncluded = [
    "Hazardous goods (batteries, fuels, chemicals)",
    "Cash, jewellery, important documents",
    "Perishables & fresh food",
    "International shipments (coming soon)",
  ];

  return (
    <section className="bg-cream pb-24">
      <div className="container-page grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-7 shadow-elegant">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Always included
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold">
            What's in every booking
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {included.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 flex-none text-primary" strokeWidth={3} />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-7 shadow-elegant">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-destructive">
            Prohibited items
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold">
            What we can't ship
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {notIncluded.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <X className="mt-0.5 h-4 w-4 flex-none text-destructive" strokeWidth={3} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
