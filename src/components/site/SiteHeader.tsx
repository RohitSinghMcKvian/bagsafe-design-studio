import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isVendor, isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const accountHref = isAdmin ? "/admin" : isVendor ? "/vendor" : "/account";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Logo variant={scrolled ? "dark" : "light"} />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                scrolled
                  ? "text-foreground/80 hover:bg-accent hover:text-foreground"
                  : "text-ink-foreground/85 hover:bg-white/10 hover:text-ink-foreground"
              }`}
              activeOptions={{ exact: true }}
              activeProps={{
                className: scrolled
                  ? "rounded-full px-4 py-2 text-sm font-semibold text-primary bg-accent"
                  : "rounded-full px-4 py-2 text-sm font-semibold text-amber bg-white/10",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Button
              asChild
              variant="ghost"
              className={`rounded-full ${scrolled ? "" : "text-ink-foreground hover:bg-white/10 hover:text-ink-foreground"}`}
            >
              <Link to={accountHref}>
                <User className="mr-1 h-4 w-4" />
                {isAdmin ? "Admin" : isVendor ? "Vendor" : "Account"}
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              variant="ghost"
              className={`rounded-full ${scrolled ? "" : "text-ink-foreground hover:bg-white/10 hover:text-ink-foreground"}`}
            >
              <Link to="/auth" search={{ mode: "login" }}>Login</Link>
            </Button>
          )}
          <Button
            asChild
            className="rounded-full bg-amber text-amber-foreground hover:bg-amber/90"
          >
            <Link to="/book">Book Pickup</Link>
          </Button>
        </div>

        <button
          type="button"
          className={`grid h-10 w-10 place-items-center rounded-full md:hidden ${
            scrolled ? "text-foreground" : "text-ink-foreground"
          }`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-accent"
                activeProps={{
                  className:
                    "rounded-lg px-3 py-3 text-base font-semibold text-primary bg-accent",
                }}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <Link
                to={accountHref}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-accent"
              >
                {isAdmin ? "Admin dashboard" : isVendor ? "Vendor dashboard" : "My account"}
              </Link>
            ) : (
              <Link
                to="/auth"
                search={{ mode: "login" }}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-accent"
              >
                Login / Sign up
              </Link>
            )}
            <Button
              asChild
              className="mt-2 rounded-full bg-amber text-amber-foreground hover:bg-amber/90"
            >
              <Link to="/book" onClick={() => setOpen(false)}>
                Book Pickup
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
