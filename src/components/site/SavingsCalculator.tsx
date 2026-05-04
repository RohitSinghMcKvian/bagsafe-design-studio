import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AIRLINES,
  airlineExcessCharge,
  bagsafeCharge,
  formatINR,
  SERVICE_LABEL,
  SERVICE_ETA,
  BAGSAFE_HANDLING_FEE,
  type ServiceType,
} from "@/lib/pricing";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TrendingDown, ArrowRight } from "lucide-react";

export function SavingsCalculator({
  defaultWeight = 25,
  defaultService = "surface" as ServiceType,
  defaultAirlineId = "indigo",
  variant = "light",
}: {
  defaultWeight?: number;
  defaultService?: ServiceType;
  defaultAirlineId?: string;
  variant?: "light" | "dark";
}) {
  const [weight, setWeight] = useState(defaultWeight);
  const [service, setService] = useState<ServiceType>(defaultService);
  const [airlineId, setAirlineId] = useState(defaultAirlineId);

  const airlineCharge = useMemo(
    () => airlineExcessCharge(airlineId, weight),
    [airlineId, weight],
  );
  const ourCharge = useMemo(() => bagsafeCharge(service, weight), [service, weight]);
  const savings = Math.max(0, airlineCharge - ourCharge);

  const isDark = variant === "dark";
  const cardBase = isDark
    ? "bg-white/5 border border-white/10 text-ink-foreground"
    : "bg-card border border-border text-foreground";

  return (
    <div
      className={`grid gap-6 rounded-3xl p-6 md:p-10 lg:grid-cols-[1.1fr_1fr] ${
        isDark
          ? "bg-ink text-ink-foreground"
          : "bg-card text-foreground shadow-elegant"
      }`}
    >
      {/* Controls */}
      <div className="space-y-7">
        <div>
          <p
            className={`text-xs font-semibold uppercase tracking-[0.18em] ${
              isDark ? "text-amber" : "text-primary"
            }`}
          >
            Savings calculator
          </p>
          <h3 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">
            See what you'd save with BagSafe
          </h3>
          <p
            className={`mt-2 text-sm ${
              isDark ? "text-ink-foreground/60" : "text-muted-foreground"
            }`}
          >
            Domestic deliveries across India. Includes a one-time {formatINR(BAGSAFE_HANDLING_FEE)}{" "}
            handling, packaging &amp; pickup fee.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <label
              className={`text-sm font-medium ${isDark ? "text-ink-foreground/80" : "text-foreground/80"}`}
            >
              Total bag weight
            </label>
            <span className="font-display text-2xl font-semibold">
              {weight} <span className="text-base font-normal opacity-70">kg</span>
            </span>
          </div>
          <Slider
            value={[weight]}
            min={1}
            max={50}
            step={1}
            onValueChange={(v) => setWeight(v[0] ?? 1)}
            aria-label="Total bag weight in kilograms"
          />
          <div
            className={`flex justify-between text-xs ${
              isDark ? "text-ink-foreground/50" : "text-muted-foreground"
            }`}
          >
            <span>1 kg</span>
            <span>50 kg</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              className={`text-sm font-medium ${isDark ? "text-ink-foreground/80" : "text-foreground/80"}`}
            >
              Delivery speed
            </label>
            <Select value={service} onValueChange={(v) => setService(v as ServiceType)}>
              <SelectTrigger
                className={
                  isDark
                    ? "border-white/15 bg-white/5 text-ink-foreground"
                    : ""
                }
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="surface">
                  {SERVICE_LABEL.surface} · {SERVICE_ETA.surface}
                </SelectItem>
                <SelectItem value="urgent">
                  {SERVICE_LABEL.urgent} · {SERVICE_ETA.urgent}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label
              className={`text-sm font-medium ${isDark ? "text-ink-foreground/80" : "text-foreground/80"}`}
            >
              Your airline
            </label>
            <Select value={airlineId} onValueChange={setAirlineId}>
              <SelectTrigger
                className={
                  isDark
                    ? "border-white/15 bg-white/5 text-ink-foreground"
                    : ""
                }
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AIRLINES.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className={`flex flex-col justify-between gap-6 rounded-2xl p-6 ${cardBase}`}>
        <div className="grid grid-cols-2 gap-4">
          <ResultCard
            label="Airline charges"
            value={airlineCharge}
            sublabel={(() => {
              const a = AIRLINES.find((x) => x.id === airlineId) ?? AIRLINES[0];
              return `${formatINR(a.excessFee)}/kg over ${a.allowance} kg free`;
            })()}
            muted
          />
          <ResultCard
            label="BagSafe charges"
            value={ourCharge}
            sublabel={`${formatINR(BAGSAFE_HANDLING_FEE)} + ${formatINR(
              service === "surface" ? 150 : 250,
            )}/kg`}
            accent
          />
        </div>

        <div
          className={`rounded-2xl p-5 ${
            isDark ? "bg-amber text-amber-foreground" : "bg-gradient-amber text-amber-foreground"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
            <TrendingDown className="h-3.5 w-3.5" />
            You save
          </div>
          <div className="mt-2 font-display text-4xl font-bold leading-none md:text-5xl">
            {formatINR(savings)}
          </div>
          <p className="mt-2 text-sm opacity-80">
            on a {weight} kg {SERVICE_LABEL[service].toLowerCase()} booking
          </p>
        </div>

        <Button
          asChild
          size="lg"
          className="group rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link to="/book">
            Book this pickup
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  sublabel,
  muted = false,
  accent = false,
}: {
  label: string;
  value: number;
  sublabel?: string;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl px-4 py-4 ${
        accent
          ? "bg-primary/10 border border-primary/20"
          : "bg-muted/50 border border-border/60"
      }`}
    >
      <div
        className={`text-xs font-medium uppercase tracking-wider ${
          muted ? "opacity-60" : "opacity-80"
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-1.5 font-display text-2xl font-semibold ${
          muted ? "line-through opacity-60" : ""
        }`}
      >
        {formatINR(value)}
      </div>
      {sublabel && (
        <div className="mt-1 text-[11px] opacity-60">{sublabel}</div>
      )}
    </div>
  );
}
