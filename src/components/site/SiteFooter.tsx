import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { BAGSAFE_CONTACT, whatsappLink } from "@/lib/contact";
import { Instagram, Twitter, Facebook } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo variant="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-foreground/70">
              BagSafe collects your overweight luggage from home, ships it ahead,
              and delivers it to your destination — so you skip excess baggage
              fees and travel light.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <SocialIcon href="#" label="Instagram">
                <Instagram className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="#" label="Twitter">
                <Twitter className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="#" label="Facebook">
                <Facebook className="h-4 w-4" />
              </SocialIcon>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">
              Company
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-ink-foreground/75">
              <li>
                <Link to="/about" className="hover:text-amber">
                  About
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-amber">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-amber">
                  Book a Pickup
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">
              Get in touch
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-ink-foreground/75">
              <li>{BAGSAFE_CONTACT.phoneDisplay}</li>
              <li>{BAGSAFE_CONTACT.email}</li>
              <li>
                <a
                  href={whatsappLink("Hi BagSafe, I'd like to know more.")}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-amber"
                >
                  WhatsApp us
                </a>
              </li>
              <li className="text-ink-foreground/50">{BAGSAFE_CONTACT.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-ink-foreground/50 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} BagSafe. All rights reserved.</p>
          <p>Made with care in India.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-ink-foreground/80 transition-colors hover:border-amber hover:text-amber"
    >
      {children}
    </a>
  );
}
