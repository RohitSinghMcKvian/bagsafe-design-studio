// Centralized pricing logic shared by the home calculator, /pricing, and /book.
// Domestic-only for now. We charge a flat per-booking handling fee plus a
// per-kg rate that depends on the chosen delivery speed.

export type ServiceType = "surface" | "urgent";

// Backwards-compat alias: older code referred to this as RouteType.
export type RouteType = ServiceType;

export type Airline = {
  id: string;
  name: string;
  // Domestic checked baggage allowance in kg before excess fees apply.
  allowance: number;
  // Per-kg domestic excess fee in INR.
  excessFee: number;
};

export const AIRLINES: Airline[] = [
  { id: "indigo", name: "IndiGo", allowance: 15, excessFee: 600 },
  { id: "air-india", name: "Air India", allowance: 25, excessFee: 500 },
  { id: "vistara", name: "Vistara", allowance: 15, excessFee: 600 },
  { id: "spicejet", name: "SpiceJet", allowance: 15, excessFee: 700 },
  { id: "akasa", name: "Akasa Air", allowance: 15, excessFee: 550 },
  { id: "go-first", name: "Go First", allowance: 15, excessFee: 650 },
];

// BagSafe per-kg rates (domestic only, by delivery speed).
export const BAGSAFE_RATE: Record<ServiceType, number> = {
  surface: 150,
  urgent: 250,
};

// One-time handling, packaging & pickup charge applied to every booking.
export const BAGSAFE_HANDLING_FEE = 499;

export const SERVICE_LABEL: Record<ServiceType, string> = {
  surface: "Surface delivery",
  urgent: "Urgent delivery",
};

export const SERVICE_ETA: Record<ServiceType, string> = {
  surface: "3–6 business days",
  urgent: "1–2 business days",
};

export function airlineExcessCharge(
  airlineId: string,
  totalWeightKg: number,
): number {
  const airline = AIRLINES.find((a) => a.id === airlineId) ?? AIRLINES[0];
  const excess = Math.max(0, totalWeightKg - airline.allowance);
  return Math.round(excess * airline.excessFee);
}

export function bagsafeCharge(
  service: ServiceType,
  totalWeightKg: number,
): number {
  const weight = Math.max(1, totalWeightKg);
  return BAGSAFE_HANDLING_FEE + Math.round(weight * BAGSAFE_RATE[service]);
}

export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
