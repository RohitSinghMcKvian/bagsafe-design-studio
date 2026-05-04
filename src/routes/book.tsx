import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Check, ArrowRight, ArrowLeft, Plane } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AIRLINES,
  bagsafeCharge,
  formatINR,
  SERVICE_LABEL,
  SERVICE_ETA,
  BAGSAFE_HANDLING_FEE,
  BAGSAFE_RATE,
  type ServiceType,
} from "@/lib/pricing";
import { whatsappLink } from "@/lib/contact";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Pickup — BagSafe" },
      {
        name: "description",
        content:
          "Book a doorstep luggage pickup with BagSafe in under 2 minutes. Domestic and international shipping available.",
      },
      { property: "og:title", content: "Book a Pickup with BagSafe" },
      {
        property: "og:description",
        content:
          "Schedule pickup, share your trip details, and we'll handle the rest.",
      },
    ],
  }),
  component: BookPage,
});

const bookingSchema = z.object({
  // Trip
  airlineId: z.string().min(1, "Select your airline"),
  flightNumber: z
    .string()
    .trim()
    .min(2, "Enter your flight number")
    .max(10, "Flight number is too long")
    .regex(/^[A-Za-z0-9 -]+$/, "Use letters and numbers only"),
  serviceType: z.enum(["surface", "urgent"]),
  travelDate: z.string().min(1, "Pick a travel date"),

  // Pickup
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[+0-9 ()-]+$/, "Use digits and + ( ) - only"),
  email: z.string().trim().email("Enter a valid email").max(255),
  pickupAddress: z
    .string()
    .trim()
    .min(10, "Pickup address is too short")
    .max(500),
  pickupSlot: z.string().min(1, "Choose a pickup slot"),

  // Delivery
  recipientName: z.string().trim().min(2, "Enter recipient name").max(100),
  recipientPhone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[+0-9 ()-]+$/, "Use digits and + ( ) - only"),
  deliveryAddress: z
    .string()
    .trim()
    .min(10, "Delivery address is too short")
    .max(500),

  // Baggage
  bagCount: z
    .number()
    .int()
    .min(1, "At least 1 bag")
    .max(10, "Max 10 bags per booking"),
  totalWeight: z
    .number()
    .min(1, "Weight must be at least 1 kg")
    .max(200, "Max 200 kg per booking"),
  contents: z.string().trim().min(3, "Briefly describe contents").max(500),
});

type BookingValues = z.infer<typeof bookingSchema>;

const initialValues: BookingValues = {
  airlineId: AIRLINES[0].id,
  flightNumber: "",
  serviceType: "surface",
  travelDate: "",
  fullName: "",
  phone: "",
  email: "",
  pickupAddress: "",
  pickupSlot: "morning",
  recipientName: "",
  recipientPhone: "",
  deliveryAddress: "",
  bagCount: 1,
  totalWeight: 20,
  contents: "",
};

const STEPS = [
  { id: 1, label: "Trip" },
  { id: 2, label: "Pickup" },
  { id: 3, label: "Delivery" },
  { id: 4, label: "Bags" },
  { id: 5, label: "Review" },
] as const;

function BookPage() {
  return (
    <SiteLayout>
      <section className="bg-ink pt-32 pb-12 text-ink-foreground md:pt-40 md:pb-16">
        <div className="container-page">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">
            Book a pickup
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            Tell us about your trip.
          </h1>
          <p className="mt-3 max-w-xl text-base text-ink-foreground/75 md:text-lg">
            Five quick steps. Two minutes. Zero airport drama.
          </p>
        </div>
      </section>

      <section className="bg-background py-12 md:py-16">
        <div className="container-page max-w-3xl">
          <BookingForm />
        </div>
      </section>
    </SiteLayout>
  );
}

function BookingForm() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<BookingValues>(initialValues);
  const [confirmed, setConfirmed] = useState<{ id: string; saved: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const quote = useMemo(
    () => bagsafeCharge(values.serviceType, values.totalWeight),
    [values.serviceType, values.totalWeight],
  );

  function patch<K extends keyof BookingValues>(key: K, value: BookingValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function validateStep(): boolean {
    const fieldsByStep: Record<number, (keyof BookingValues)[]> = {
      1: ["airlineId", "flightNumber", "serviceType", "travelDate"],
      2: ["fullName", "phone", "email", "pickupAddress", "pickupSlot"],
      3: ["recipientName", "recipientPhone", "deliveryAddress"],
      4: ["bagCount", "totalWeight", "contents"],
      5: [],
    };
    const fields = fieldsByStep[step];
    const partial = bookingSchema.safeParse(values);
    if (!partial.success) {
      const issue = partial.error.issues.find((i) =>
        fields.includes(i.path[0] as keyof BookingValues),
      );
      if (issue) {
        toast.error(issue.message);
        return false;
      }
    }
    return true;
  }

  function next() {
    if (!validateStep()) return;
    setStep((s) => Math.min(STEPS.length, s + 1));
  }

  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  async function submit() {
    const parsed = bookingSchema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setSubmitting(true);
    let id = `BAG-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    let saved = false;

    if (user) {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          customer_id: user.id,
          full_name: values.fullName,
          phone: values.phone,
          airline: AIRLINES.find((a) => a.id === values.airlineId)?.name ?? values.airlineId,
          flight_number: values.flightNumber,
          travel_date: values.travelDate,
          route_type: values.serviceType,
          pickup_address: values.pickupAddress,
          pickup_slot: values.pickupSlot,
          delivery_address: values.deliveryAddress,
          recipient_name: values.recipientName,
          recipient_phone: values.recipientPhone,
          bag_count: values.bagCount,
          weight_kg: values.totalWeight,
          contents_note: values.contents,
          estimated_price: quote,
          status: "scheduled",
        })
        .select("id")
        .single();
      if (error) {
        toast.error("Couldn't save to your account, but you can still send via WhatsApp.");
      } else if (data) {
        id = data.id.slice(0, 8).toUpperCase();
        saved = true;
      }
    }

    setSubmitting(false);
    setConfirmed({ id, saved });

    const summary =
      `New BagSafe booking — ${id}\n\n` +
      `Trip: ${values.serviceType.toUpperCase()} · ${values.flightNumber} · ${values.travelDate}\n` +
      `Airline: ${AIRLINES.find((a) => a.id === values.airlineId)?.name}\n\n` +
      `Pickup: ${values.fullName} · ${values.phone}\n${values.pickupAddress}\nSlot: ${values.pickupSlot}\n\n` +
      `Delivery: ${values.recipientName} · ${values.recipientPhone}\n${values.deliveryAddress}\n\n` +
      `Bags: ${values.bagCount} · ${values.totalWeight} kg · ${values.contents}\n` +
      `Quote: ${formatINR(quote)}`;

    window.open(whatsappLink(summary), "_blank", "noopener,noreferrer");
  }

  if (confirmed) {
    return <Confirmation id={confirmed.id} quote={quote} saved={confirmed.saved} />;
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant md:p-10">
      {!user && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber/30 bg-amber/10 p-4 text-sm">
          <span>
            <b>Tip:</b> Login to save this booking to your account and track shipments.
          </span>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/auth" search={{ redirect: "/book", mode: "login" }}>Login</Link>
          </Button>
        </div>
      )}
      <Stepper step={step} />

      <div className="mt-8">
        {step === 1 && <StepTrip values={values} patch={patch} />}
        {step === 2 && <StepPickup values={values} patch={patch} />}
        {step === 3 && <StepDelivery values={values} patch={patch} />}
        {step === 4 && <StepBags values={values} patch={patch} quote={quote} />}
        {step === 5 && <StepReview values={values} quote={quote} />}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={back}
          disabled={step === 1 || submitting}
          className="rounded-full"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        {step < STEPS.length ? (
          <Button
            type="button"
            onClick={next}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Continue
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="rounded-full bg-amber text-amber-foreground hover:bg-amber/90"
          >
            {submitting ? "Saving..." : "Confirm booking"}
            <Check className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex items-center justify-between gap-1">
      {STEPS.map((s, i) => {
        const active = s.id === step;
        const done = s.id < step;
        return (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <span
              className={`grid h-8 w-8 flex-none place-items-center rounded-full text-xs font-bold ${
                done
                  ? "bg-primary text-primary-foreground"
                  : active
                    ? "bg-amber text-amber-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : s.id}
            </span>
            <span
              className={`hidden text-xs font-medium uppercase tracking-wider sm:inline ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <span
                className={`mx-1 h-px flex-1 ${
                  done ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

type Patch = <K extends keyof BookingValues>(k: K, v: BookingValues[K]) => void;

function StepTrip({ values, patch }: { values: BookingValues; patch: Patch }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <SectionTitle>Trip details</SectionTitle>
      <div>
        <Label>Delivery speed</Label>
        <Select
          value={values.serviceType}
          onValueChange={(v) => patch("serviceType", v as ServiceType)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="surface">
              {SERVICE_LABEL.surface} · {SERVICE_ETA.surface} · {formatINR(BAGSAFE_RATE.surface)}/kg
            </SelectItem>
            <SelectItem value="urgent">
              {SERVICE_LABEL.urgent} · {SERVICE_ETA.urgent} · {formatINR(BAGSAFE_RATE.urgent)}/kg
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Airline</Label>
        <Select
          value={values.airlineId}
          onValueChange={(v) => patch("airlineId", v)}
        >
          <SelectTrigger className="mt-2">
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
      <div>
        <Label htmlFor="flightNumber">Flight number</Label>
        <Input
          id="flightNumber"
          className="mt-2"
          placeholder="e.g. 6E-203"
          maxLength={10}
          value={values.flightNumber}
          onChange={(e) => patch("flightNumber", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="travelDate">Travel date</Label>
        <Input
          id="travelDate"
          type="date"
          className="mt-2"
          value={values.travelDate}
          onChange={(e) => patch("travelDate", e.target.value)}
        />
      </div>
    </div>
  );
}

function StepPickup({ values, patch }: { values: BookingValues; patch: Patch }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <SectionTitle>Pickup details</SectionTitle>
      <div>
        <Label htmlFor="fullName">Your name</Label>
        <Input
          id="fullName"
          className="mt-2"
          maxLength={100}
          value={values.fullName}
          onChange={(e) => patch("fullName", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          className="mt-2"
          maxLength={20}
          value={values.phone}
          onChange={(e) => patch("phone", e.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          className="mt-2"
          maxLength={255}
          value={values.email}
          onChange={(e) => patch("email", e.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="pickupAddress">Pickup address</Label>
        <Textarea
          id="pickupAddress"
          className="mt-2"
          rows={3}
          maxLength={500}
          value={values.pickupAddress}
          onChange={(e) => patch("pickupAddress", e.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <Label>Preferred pickup slot</Label>
        <Select
          value={values.pickupSlot}
          onValueChange={(v) => patch("pickupSlot", v)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">Morning · 7am – 11am</SelectItem>
            <SelectItem value="afternoon">Afternoon · 11am – 3pm</SelectItem>
            <SelectItem value="evening">Evening · 3pm – 7pm</SelectItem>
            <SelectItem value="night">Night · 7pm – 11pm</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function StepDelivery({
  values,
  patch,
}: {
  values: BookingValues;
  patch: Patch;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <SectionTitle>Delivery details</SectionTitle>
      <div>
        <Label htmlFor="recipientName">Recipient name</Label>
        <Input
          id="recipientName"
          className="mt-2"
          maxLength={100}
          value={values.recipientName}
          onChange={(e) => patch("recipientName", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="recipientPhone">Recipient phone</Label>
        <Input
          id="recipientPhone"
          type="tel"
          inputMode="tel"
          className="mt-2"
          maxLength={20}
          value={values.recipientPhone}
          onChange={(e) => patch("recipientPhone", e.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="deliveryAddress">Delivery address</Label>
        <Textarea
          id="deliveryAddress"
          className="mt-2"
          rows={3}
          maxLength={500}
          value={values.deliveryAddress}
          onChange={(e) => patch("deliveryAddress", e.target.value)}
        />
      </div>
    </div>
  );
}

function StepBags({
  values,
  patch,
  quote,
}: {
  values: BookingValues;
  patch: Patch;
  quote: number;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <SectionTitle>Baggage</SectionTitle>
      <div>
        <Label htmlFor="bagCount">Number of bags</Label>
        <Input
          id="bagCount"
          type="number"
          min={1}
          max={10}
          className="mt-2"
          value={values.bagCount}
          onChange={(e) => patch("bagCount", Number(e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="totalWeight">Total estimated weight (kg)</Label>
        <Input
          id="totalWeight"
          type="number"
          min={1}
          max={200}
          step={1}
          className="mt-2"
          value={values.totalWeight}
          onChange={(e) => patch("totalWeight", Number(e.target.value))}
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="contents">Contents declaration</Label>
        <Textarea
          id="contents"
          className="mt-2"
          rows={3}
          maxLength={500}
          placeholder="e.g. Personal clothing, books, gifts."
          value={values.contents}
          onChange={(e) => patch("contents", e.target.value)}
        />
      </div>
      <div className="sm:col-span-2 rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Estimated quote
          </span>
          <span className="font-display text-3xl font-bold text-foreground">
            {formatINR(quote)}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Final price confirmed after weighing at pickup. Insurance, tracking and
          delivery included.
        </p>
      </div>
    </div>
  );
}

function StepReview({ values, quote }: { values: BookingValues; quote: number }) {
  const airline = AIRLINES.find((a) => a.id === values.airlineId)?.name;
  return (
    <div className="space-y-5">
      <SectionTitle>Review &amp; confirm</SectionTitle>
      <ReviewBlock title="Trip">
        <li>
          <b>{values.serviceType}</b> · {airline} · {values.flightNumber}
        </li>
        <li>Travel date: {values.travelDate}</li>
      </ReviewBlock>
      <ReviewBlock title="Pickup">
        <li>
          {values.fullName} · {values.phone}
        </li>
        <li>{values.email}</li>
        <li>{values.pickupAddress}</li>
        <li>Slot: {values.pickupSlot}</li>
      </ReviewBlock>
      <ReviewBlock title="Delivery">
        <li>
          {values.recipientName} · {values.recipientPhone}
        </li>
        <li>{values.deliveryAddress}</li>
      </ReviewBlock>
      <ReviewBlock title="Baggage">
        <li>
          {values.bagCount} bag(s) · {values.totalWeight} kg
        </li>
        <li className="text-muted-foreground">{values.contents}</li>
      </ReviewBlock>
      <div className="rounded-2xl bg-gradient-amber p-5 text-amber-foreground">
        <div className="text-xs font-semibold uppercase tracking-[0.16em]">
          Total quote
        </div>
        <div className="mt-1 font-display text-3xl font-bold">
          {formatINR(quote)}
        </div>
        <p className="mt-1 text-xs opacity-80">
          By confirming, your booking summary opens in WhatsApp ready to send to
          our team.
        </p>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl font-semibold sm:col-span-2">
      {children}
    </h2>
  );
}

function ReviewBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        {title}
      </div>
      <ul className="mt-2 space-y-1 text-sm">{children}</ul>
    </div>
  );
}

function Confirmation({ id, quote, saved }: { id: string; quote: number; saved: boolean }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-elegant md:p-12">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-amber text-amber-foreground">
        <Plane className="h-7 w-7" />
      </div>
      <h2 className="mt-6 font-display text-3xl font-semibold md:text-4xl">
        Booking received!
      </h2>
      <p className="mt-3 text-muted-foreground">
        Your booking reference is{" "}
        <span className="font-mono font-semibold text-foreground">{id}</span>.
        {saved
          ? " We've saved it to your account and opened WhatsApp with your details for our concierge to confirm."
          : " We've opened a WhatsApp chat with your details — please send it so our concierge can confirm your slot."}
      </p>
      <div className="mt-6 inline-flex items-baseline gap-2 rounded-full bg-primary/10 px-5 py-2 text-primary">
        <span className="text-xs font-semibold uppercase tracking-[0.16em]">
          Quote
        </span>
        <span className="font-display text-2xl font-bold">
          {formatINR(quote)}
        </span>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {saved && (
          <Button
            asChild
            className="rounded-full bg-amber text-amber-foreground hover:bg-amber/90"
          >
            <Link to="/account">View my orders</Link>
          </Button>
        )}
        <Button
          asChild
          variant={saved ? "outline" : "default"}
          className={saved ? "rounded-full" : "rounded-full bg-primary text-primary-foreground hover:bg-primary/90"}
        >
          <Link to="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/pricing">See pricing</Link>
        </Button>
      </div>
    </div>
  );
}
