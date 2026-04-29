import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

const authSearchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
  mode: z.enum(["login", "signup"]).optional().catch("login"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: authSearchSchema,
  head: () => ({
    meta: [
      { title: "Login or Signup — BagSafe" },
      { name: "description", content: "Login or create your BagSafe account to book and track luggage pickups." },
    ],
  }),
  component: AuthPage,
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Invalid email").max(200),
  phone: z.string().trim().min(7, "Enter your phone").max(20),
  password: z.string().min(8, "Min 8 characters").max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(1, "Enter your password"),
});

function AuthPage() {
  const { user, loading } = useAuth();
  const search = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">(search.mode ?? "login");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: search.redirect ?? "/" });
    }
  }, [user, loading, navigate, search.redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const parsed = signupSchema.parse(form);
        const { error } = await supabase.auth.signUp({
          email: parsed.email,
          password: parsed.password,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
            data: { full_name: parsed.fullName, phone: parsed.phone },
          },
        });
        if (error) throw error;
        toast.success("Account created! You're signed in.");
      } else {
        const parsed = loginSchema.parse({ email: form.email, password: form.password });
        const { error } = await supabase.auth.signInWithPassword(parsed);
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (err) {
      const msg = err instanceof z.ZodError ? err.issues[0].message : (err as Error).message;
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <section className="container-page flex min-h-[calc(100vh-5rem)] items-center justify-center pt-28 pb-16">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">BagSafe</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-foreground">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Sign up to book pickups and track your shipments."
              : "Login to manage your luggage orders."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 9XXXXXXXXX"
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={mode === "signup" ? 8 : 1}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-amber text-amber-foreground hover:bg-amber/90"
            >
              {submitting
                ? "Please wait..."
                : mode === "signup"
                  ? "Create account"
                  : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "New to BagSafe?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="font-semibold text-primary hover:underline"
            >
              {mode === "signup" ? "Login" : "Sign up"}
            </button>
          </p>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:underline">← Back to home</Link>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
