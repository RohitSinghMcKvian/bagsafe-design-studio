import { useMemo, useState, useEffect, useRef } from "react";
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

function AnimatedSavings({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value === prevValue.current) return;
    const start = prevValue.current;
    const diff = value - start;
    const duration = 500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValue.current = value;
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <>{formatINR(display)}</>;
}

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

  return (
    <div
      className={`grid gap-4 rounded-2xl p-4 lg:grid-cols-[1.15fr_1fr] ${
        isDark
          ? "bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] text-ink-foreground"
          : "bg-card border border-border text-foreground shadow-elegant"
      }`}
    >
      {/* Controls */}
      <div className="space-y-3">
        <div>
          <p
            className={`text-[10px] font-semibold uppercase tracking-widest ${
              isDark ? "text-amber" : "text-primary"
            }`}
          >
            Savings calculator
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold leading-tight md:text-xl">
            See what you'd save
          </h3>
          <p
            className={`mt-1 line-clamp-1 text-[11px] ${
              isDark ? "text-ink-foreground/40" : "text-muted-foreground"
            }`}
          >
            Domestic · {formatINR(BAGSAFE_HANDLING_FEE)} handling & pickup fee
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-end justify-between">
            <span
              className={`text-[10px] font-medium ${isDark ? "text-ink-foreground/70" : "text-foreground/70"}`}
            >
              Bag weight
            </span>
            <span className="font-display text-base font-semibold">
              {weight} <span className="text-xs font-normal opacity-50">kg</span>
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
            className={`flex justify-between text-[10px] ${
              isDark ? "text-ink-foreground/40" : "text-muted-foreground"
            }`}
          >
            <span>1kg</span>
            <span>50kg</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label
              className={`text-[10px] font-medium ${isDark ? "text-ink-foreground/70" : "text-foreground/70"}`}
            >
              Speed
            </label>
            <Select value={service} onValueChange={(v) => setService(v as ServiceType)}>
              <SelectTrigger
                className={`h-8 text-xs ${
                  isDark
                    ? "border-white/15 bg-white/[0.06] text-ink-foreground"
                    : ""
                }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="surface" className="text-xs">
                  {SERVICE_LABEL.surface}
                </SelectItem>
                <SelectItem value="urgent" className="text-xs">
                  {SERVICE_LABEL.urgent}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label
              className={`text-[10px] font-medium ${isDark ? "text-ink-foreground/70" : "text-foreground/70"}`}
            >
              Airline
            </label>
            <Select value={airlineId} onValueChange={setAirlineId}>
              <SelectTrigger
                className={`h-8 text-xs ${
                  isDark
                    ? "border-white/15 bg-white/[0.06] text-ink-foreground"
                    : ""
                }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AIRLINES.map((a) => (
                  <SelectItem key={a.id} value={a.id} className="text-xs">
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Result */}
      <div
        className={`flex flex-col justify-between gap-3 rounded-xl p-4 ${
          isDark
            ? "bg-white/[0.06] backdrop-blur-sm border border-white/[0.10]"
            : "bg-muted/40 border border-border/60"
        }`}
      >
        <div className="grid grid-cols-2 gap-2">
          <ResultCard
            label="Airline"
            value={airlineCharge}
            sublabel={`${formatINR(
              (AIRLINES.find((x) => x.id === airlineId) ?? AIRLINES[0]).excessFee,
            )}/kg`}
            muted
            isDark={isDark}
          />
          <ResultCard
            label="BagSafe"
            value={ourCharge}
            sublabel={`+${formatINR(BAGSAFE_HANDLING_FEE)} fee`}
            accent
            isDark={isDark}
          />
        </div>

        <div
          className={`rounded-xl p-3 ${
            isDark
              ? "bg-amber/20 border border-amber/30 text-ink-foreground"
              : "bg-gradient-to-br from-amber/20 via-amber/10 to-amber/5 border border-amber/20 text-foreground"
          }`}
          style={isDark ? { boxShadow: "0 0 24px -6px oklch(67% 0.2 281 / 25%)" } : {}}
        >
          <div
            className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest ${
              isDark ? "text-amber" : "text-amber"
            }`}
          >
            <TrendingDown className="h-3 w-3" />
            You save
          </div>
          <div className="mt-1 font-display text-2xl font-bold leading-none md:text-3xl">
            <AnimatedSavings value={savings} />
          </div>
          <p
            className={`mt-1 text-[10px] ${isDark ? "text-ink-foreground/50" : "text-muted-foreground"}`}
          >
            {weight}kg {SERVICE_LABEL[service].toLowerCase()}
          </p>
        </div>

        <Button
          asChild
          size="sm"
          className={`group rounded-full text-xs ${
            isDark
              ? "bg-amber text-amber-foreground hover:bg-amber/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          <Link to="/book">
            Book pickup
            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
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
  isDark = false,
}: {
  label: string;
  value: number;
  sublabel?: string;
  muted?: boolean;
  accent?: boolean;
  isDark?: boolean;
}) {
  return (
    <div
      className={`rounded-lg px-2 py-2 ${
        accent
          ? isDark
            ? "bg-primary/15 border border-primary/25"
            : "bg-primary/10 border border-primary/20"
          : isDark
            ? "bg-white/[0.05] border border-white/[0.10]"
            : "bg-muted/50 border border-border/60"
      }`}
    >
      <div
        className={`text-[9px] font-medium uppercase tracking-wider ${
          muted ? "opacity-40" : "opacity-60"
        }`}
      >
        {label}
      </div>
      <div
        className={`font-display text-sm font-semibold leading-none ${
          muted ? "line-through opacity-40" : ""
        }`}
      >
        {formatINR(value)}
      </div>
      {sublabel && (
        <div className="mt-0.5 text-[9px] opacity-40">{sublabel}</div>
      )}
    </div>
  );
}