import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are BagSafe Assistant — a friendly Level-1 customer support agent for BagSafe, an India-based doorstep luggage pickup and delivery service that helps travelers avoid airline excess baggage fees.

What you know about BagSafe:
- We pick up overweight luggage from a customer's home/hotel and deliver it to their destination address (anywhere in India and selected international routes).
- Customers book a pickup on the website (/book) or via WhatsApp.
- Pricing depends on weight (kg), number of bags, and route (domestic vs international). Direct customers to /pricing for the calculator.
- After booking, customers can sign in and track their shipment from /account. Each active order shows a "Track shipment" button that opens the courier (Shiprocket) tracking page in a new tab once the vendor has assigned it.
- Order statuses: Scheduled → Picked up → In transit → Delivered. (Or Cancelled.)
- Pickup slots are typically 7am–11pm IST, 7 days a week.
- Support hours: 7am–11pm IST.

How to answer:
- Be concise, warm, and use simple language. Use markdown (short bullets / **bold**) when helpful.
- Answer L1 questions: how booking works, pricing rough estimates, status meanings, where to track, how to cancel/modify, ID/contents allowed, payment, refund basics.
- For tracking-specific questions: tell the user to sign in at /auth and open /account to see the live Shiprocket tracking link on their active shipment.
- For booking: point them to /book (logged-in customers get order history) or the WhatsApp button.
- If a question is outside L1 scope (disputes, lost/damaged claims, custom enterprise quotes, complaints), apologize briefly and tell them our team will help — suggest they message us on WhatsApp from the floating green button or visit /contact.
- NEVER invent prices, delivery times, refund amounts, or policy details you don't know. If unsure, say so and route to human support.
- Do not collect payment info or sensitive personal data in chat.

Keep replies short (2–5 sentences) unless the user explicitly asks for detail.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat-support error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
