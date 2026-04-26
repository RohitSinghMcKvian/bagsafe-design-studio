import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Heart, Globe2, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import luggageImg from "@/assets/luggage-stack.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About BagSafe — Travel light, save big." },
      {
        name: "description",
        content:
          "BagSafe is on a mission to make air travel lighter, cheaper, and effortless — by reimagining how luggage gets from your home to your destination.",
      },
      { property: "og:title", content: "About BagSafe" },
      {
        property: "og:description",
        content:
          "We're reimagining how travelers move their bags — door to doorstep, anywhere in the world.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="bg-ink pt-32 pb-16 text-ink-foreground md:pt-40 md:pb-24">
        <div className="container-page">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">
            Our story
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-tight md:text-6xl lg:text-7xl">
            We believe travelers
            <br />
            shouldn't be <span className="italic text-amber">punished</span> for
            packing.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-foreground/80">
            Excess baggage fees can cost more than the flight itself. BagSafe
            exists to set travelers free — to bring home the gifts, the
            keepsakes, the books, the extra outfit — without the airport drama.
          </p>
        </div>
      </section>

      <section className="bg-background py-20 md:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl shadow-elegant">
            <img
              src={luggageImg}
              alt="A stack of premium suitcases"
              loading="lazy"
              width={1280}
              height={1280}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Why we exist
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
              Built by frequent flyers, for frequent flyers.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              BagSafe started in 2024 after our co-founder paid ₹18,000 in excess
              baggage fees on a single Mumbai → London trip. There had to be a
              better way. Today, we're a team of logistics, travel and tech folks
              who've shipped over 60,000 bags door-to-doorstep across 120+ cities.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              We treat every bag like our own — sealed, insured, tracked, and
              hand-delivered.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              What we stand for
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
              Our values.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: "Trust first",
                desc: "Every bag is sealed, insured, and tracked end-to-end.",
              },
              {
                icon: Heart,
                title: "Traveler-led",
                desc: "We design for stressed-out travelers, not logistics dashboards.",
              },
              {
                icon: Globe2,
                title: "Global reach",
                desc: "120+ cities and counting, with international customs handled.",
              },
              {
                icon: Sparkles,
                title: "Premium feel",
                desc: "Concierge-style service at fair, transparent prices.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-elegant"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
