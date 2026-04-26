# BagSafe — Website Plan

A premium, bold website for BagSafe — the service that picks up travelers' overweight luggage and delivers it to their doorstep, helping them avoid airline excess baggage fees.

## Site Structure (Hybrid)

A rich one-page home with all key sections + dedicated routes for deeper content and conversion.

- `/` — Home (hero, why us, how it works, calculator preview, social proof, CTA)
- `/pricing` — Full pricing details, comparison table, FAQs about charges
- `/book` — Pickup booking form (name, phone, pickup address, delivery address, flight details, weight, date)
- `/contact` — Contact info, support hours, embedded map, WhatsApp link
- `/about` *(optional)* — Brand story, trust signals, insurance & safety info

Each route gets its own SEO metadata (title, description, og tags).

## Visual Direction — Bold & Premium

Inspired by your Figma but elevated:

- **Palette**: Deep navy / near-black hero (`#0B0F1F`-ish) with warm cream secondary (`#F7F4EE`), rich purple accent (`#5B47E0`), and a single gold/amber highlight for prices and CTAs.
- **Typography**: Large editorial display headings (e.g., "Travel Light. Land Heavy on Savings.") paired with clean modern sans body. Strong size hierarchy — hero headline ~80–120px on desktop.
- **Imagery**: Full-bleed cinematic hero with airport / runway photo, dark gradient overlay, subtle parallax on scroll.
- **Motion**: Fade-and-rise on scroll, number counters in pricing comparison, animated baggage/airplane icon, smooth slider interactions.
- **Layout**: Generous whitespace, asymmetric grids, premium card treatments with soft shadows and 1px borders.

## Page Sections

### Home (`/`)
1. **Sticky nav** — Logo, Pricing, How it works, Book, Contact, prominent "Book Pickup" CTA.
2. **Hero** — "Avoid Extra Baggage Fees. Send Your Luggage to Your Doorstep." Subhead, primary CTA "Book a Pickup", secondary "See Pricing". Animated savings ticker (e.g., "₹4.2 Cr saved by travelers").
3. **Why Choose BagSafe** — 4 cards: 15-Min Pickup · Doorstep Delivery · ₹50,000 Insured · Real-time Tracking.
4. **How It Works** — 4 steps with iconography: Book → We Pick Up → We Fly/Ship → Doorstep Delivery.
5. **Savings Calculator (interactive)** — Slider for weight (1–30 kg) + dropdown for airline + route (Domestic/International). Side-by-side comparison: "Airline charges ₹X" vs "BagSafe ₹Y" with animated savings number.
6. **Trust strip** — Airline logos served, partner couriers, ratings.
7. **Testimonials** — 3–4 traveler quotes with photos.
8. **FAQ** — Accordion: prohibited items, insurance, timing, refunds.
9. **Final CTA banner** — "Ready to travel light?" with Book + WhatsApp buttons.
10. **Footer** — Links, social, contact, legal.

### Pricing (`/pricing`)
- Pricing tiers (Domestic / International / Same-city).
- Transparent per-kg breakdown.
- Comparison table: BagSafe vs Indigo, Air India, Vistara, Emirates excess fees.
- Inclusions (insurance, tracking, packaging).
- FAQ.

### Book (`/book`)
- Multi-step form (validated with Zod):
  1. Trip details — flight number, airline, travel date, route.
  2. Pickup — full name, phone, email, pickup address, preferred slot.
  3. Delivery — destination address, recipient name & phone.
  4. Baggage — number of bags, estimated weight, contents declaration.
  5. Review & instant quote → submit.
- Submissions stored in database via server function (Lovable Cloud).
- Confirmation screen with booking ID and WhatsApp follow-up.

### Contact (`/contact`)
- Phone, email, support hours, head office.
- Contact form (name, phone, message — validated, stored).
- Embedded map.
- Big WhatsApp CTA.

## Functional Features

1. **Working Price Calculator** (home + pricing)
   - Inputs: weight slider, route type, airline.
   - Computes airline fee from a configurable rate table vs BagSafe rate.
   - Shows live savings amount and a "Book this pickup" CTA that prefills the booking form.

2. **Booking / Pickup Request Form**
   - Stored in Lovable Cloud database (`bookings` table with RLS).
   - Server-side Zod validation.
   - Generates a booking reference; optionally emails confirmation.

3. **Floating WhatsApp Button**
   - Persistent bottom-right on every page.
   - Pre-filled message ("Hi BagSafe, I'd like to book a pickup…").
   - You provide the WhatsApp number during build.

## Trust & Polish
- 404 page on-brand.
- Per-route SEO meta + Open Graph image.
- Mobile-first responsive design (hero scales, calculator stacks, sticky CTA on mobile).
- Subtle scroll animations, no layout shift.

## What I'll need from you (after approval)
- WhatsApp business number.
- Final logo (or I'll style the wordmark "BagSafe" for now).
- Confirmed BagSafe pricing rates (₹ per kg for domestic / international).
- Any real testimonials / partner logos (placeholders used otherwise).
