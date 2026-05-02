## Problem

On desktop, both floating buttons sit on the bottom-right and expand into labeled pills ("Ask BagSafe" and "Chat on WhatsApp"). The current spacing (`md:right-44` for ChatBot, `md:right-6` for WhatsApp) was tuned for the old icon-only widths, so the wider pills now visually overlap (visible in the screenshot).

## Fix

Place the two FABs in a single bottom-right stack with consistent gap, and let widths flow naturally instead of guessing pixel offsets.

### `src/components/site/WhatsAppFab.tsx`
- Keep the WhatsApp button anchored at `bottom-20 right-4` on mobile (stacked above the chat icon).
- On desktop (`md:`), keep it at `md:bottom-6 md:right-6` — this stays the rightmost pill.

### `src/components/site/ChatBot.tsx`
- Mobile: keep `bottom-4 right-4` (icon below WhatsApp icon — unchanged).
- Desktop: replace `md:right-44` with positioning that sits cleanly to the LEFT of the WhatsApp pill with a real gap. Use `md:bottom-6 md:right-[15rem]` (≈240px) so the "Ask BagSafe" pill ends well before the "Chat on WhatsApp" pill starts, regardless of label width.
- Alternative considered: stack them vertically on desktop too (`md:bottom-20` for WhatsApp, `md:bottom-6` for ChatBot, both at `md:right-6`). Cleaner and fully overlap-proof. **Recommended.**

### Recommended approach: vertical stack on desktop too

```text
┌──────────────────────┐
│ [Chat on WhatsApp]   │  ← md:bottom-20 right-6
│ [Ask BagSafe]        │  ← md:bottom-6  right-6
└──────────────────────┘
```

- `WhatsAppFab`: `md:bottom-20 md:right-6` (was `md:bottom-6 md:right-6`)
- `ChatBot` button: `md:bottom-6 md:right-6` (was `md:bottom-6 md:right-44`)
- `ChatBot` open panel: keep `md:bottom-6 md:right-6` — when the panel opens, the trigger is hidden, so no conflict.

This guarantees no horizontal overlap regardless of label length or future copy changes, and matches the existing mobile stacking pattern.

## Files

- `src/components/site/WhatsAppFab.tsx`
- `src/components/site/ChatBot.tsx`
