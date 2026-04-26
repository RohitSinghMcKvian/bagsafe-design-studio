import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BAGSAFE_CONTACT, whatsappLink } from "@/lib/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact BagSafe — We're here to help." },
      {
        name: "description",
        content:
          "Get in touch with BagSafe. Phone, email, WhatsApp — we usually reply in minutes.",
      },
      { property: "og:title", content: "Contact BagSafe" },
      {
        property: "og:description",
        content: "Phone, email, or WhatsApp — we're here to help with your luggage.",
      },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(100, "Name is too long"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .max(255, "Email is too long"),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[+0-9 ()-]+$/, "Phone may only contain digits and + ( ) - "),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more")
    .max(1000, "Message is too long"),
});

function ContactPage() {
  return (
    <SiteLayout>
      <section className="bg-ink pt-32 pb-16 text-ink-foreground md:pt-40 md:pb-24">
        <div className="container-page">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">
            Contact
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-tight md:text-6xl lg:text-7xl">
            Talk to a real
            <br />
            <span className="italic text-amber">human.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-foreground/80">
            Whether you want to book, track, or just ask us a question, we're a
            tap away.
          </p>
        </div>
      </section>

      <section className="bg-background py-20 md:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <ContactInfo />
          <ContactForm />
        </div>
      </section>
    </SiteLayout>
  );
}

function ContactInfo() {
  const items = [
    { icon: Phone, label: "Call us", value: BAGSAFE_CONTACT.phoneDisplay },
    { icon: Mail, label: "Email", value: BAGSAFE_CONTACT.email },
    { icon: MapPin, label: "Office", value: BAGSAFE_CONTACT.address },
    { icon: Clock, label: "Hours", value: BAGSAFE_CONTACT.hours },
  ];
  return (
    <div className="space-y-8">
      <ul className="space-y-4">
        {items.map((it) => (
          <li
            key={it.label}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
          >
            <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-primary/10 text-primary">
              <it.icon className="h-4 w-4" />
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {it.label}
              </div>
              <div className="mt-1 font-medium">{it.value}</div>
            </div>
          </li>
        ))}
      </ul>

      <a
        href={whatsappLink("Hi BagSafe, I'd like to chat.")}
        target="_blank"
        rel="noreferrer noopener"
        className="flex items-center gap-3 rounded-2xl bg-gradient-amber p-5 text-amber-foreground transition-transform hover:-translate-y-0.5"
      >
        <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-ink/15">
          <MessageCircle className="h-4 w-4" />
        </span>
        <div>
          <div className="font-display text-lg font-semibold leading-tight">
            Prefer WhatsApp?
          </div>
          <div className="text-sm opacity-80">We usually reply in minutes.</div>
        </div>
      </a>
    </div>
  );
}

function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }

    setSubmitting(true);
    const data = parsed.data;
    const text =
      `Hi BagSafe, I'd like to get in touch.\n\n` +
      `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n\n${data.message}`;

    // Open WhatsApp pre-filled with the contact message.
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp — your message is ready to send.");
    (e.currentTarget as HTMLFormElement).reset();
    setSubmitting(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-border bg-card p-6 shadow-elegant md:p-10"
    >
      <h2 className="font-display text-3xl font-semibold">Send us a message</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We'll get back to you within 1 business day. Or skip the wait — your
        message will open in WhatsApp ready to send.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" required maxLength={100} />
        <Field label="Email" name="email" type="email" required maxLength={255} />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          required
          maxLength={20}
          inputMode="tel"
          className="sm:col-span-2"
        />
        <div className="sm:col-span-2">
          <Label htmlFor="message" className="text-sm font-medium">
            Message
          </Label>
          <Textarea
            id="message"
            name="message"
            required
            maxLength={1000}
            rows={5}
            className="mt-2"
            placeholder="Tell us about your trip, route, and how we can help."
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="mt-6 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
      >
        {submitting ? "Opening WhatsApp…" : "Send via WhatsApp"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  maxLength,
  inputMode,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        inputMode={inputMode}
        className="mt-2"
      />
    </div>
  );
}
