// Centralized pricing logic shared by the home calculator, /pricing, and /book.
// All amounts in INR. Per-kg rates are applied to *excess* weight (over allowance).

export type RouteType = "domestic" | "international";

export type Airline = {
  id: string;
  name: string;
  // Allowance in kg before excess fees apply (checked baggage).
  allowance: { domestic: number; international: number };
  // Per-kg excess fee in INR.
  excessFee: { domestic: number; international: number };
};

export const AIRLINES: Airline[] = [
  {
    id: "indigo",
    name: "IndiGo",
    allowance: { domestic: 15, international: 30 },
    excessFee: { domestic: 600, international: 1200 },
  },
  {
    id: "air-india",
    name: "Air India",
    allowance: { domestic: 25, international: 30 },
    excessFee: { domestic: 500, international: 1500 },
  },
  {
    id: "vistara",
    name: "Vistara",
    allowance: { domestic: 15, international: 30 },
    excessFee: { domestic: 600, international: 1400 },
  },
  {
    id: "spicejet",
    name: "SpiceJet",
    allowance: { domestic: 15, international: 30 },
    excessFee: { domestic: 700, international: 1300 },
  },
  {
    id: "emirates",
    name: "Emirates",
    allowance: { domestic: 30, international: 30 },
    excessFee: { domestic: 1800, international: 1800 },
  },
  {
    id: "qatar",
    name: "Qatar Airways",
    allowance: { domestic: 30, international: 30 },
    excessFee: { domestic: 1700, international: 1700 },
  },
];

// BagSafe per-kg rates (flat, no allowance gimmicks).
export const BAGSAFE_RATE = {
  domestic: 199,
  international: 499,
} as const;

// Minimum charge per booking.
export const BAGSAFE_MIN_CHARGE = 999;

export function airlineExcessCharge(
  airlineId: string,
  route: RouteType,
  totalWeightKg: number,
): number {
  const airline = AIRLINES.find((a) => a.id === airlineId) ?? AIRLINES[0];
  const allowance = airline.allowance[route];
  const excess = Math.max(0, totalWeightKg - allowance);
  return Math.round(excess * airline.excessFee[route]);
}

export function bagsafeCharge(route: RouteType, totalWeightKg: number): number {
  const raw = Math.round(totalWeightKg * BAGSAFE_RATE[route]);
  return Math.max(BAGSAFE_MIN_CHARGE, raw);
}

export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
