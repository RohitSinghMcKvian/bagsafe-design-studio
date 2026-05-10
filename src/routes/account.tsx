import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, Package, Plane, Truck, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — BagSafe" },
      { name: "description", content: "Track your active luggage shipment and view past BagSafe orders." },
    ],
  }),
  component: AccountPage,
});

type Order = {
  id: string;
  status: string;
  full_name: string;
  pickup_address: string;
  delivery_address: string;
  weight_kg: number;
  bag_count: number;
  airline: string | null;
  flight_number: string | null;
  travel_date: string | null;
  tracking_url: string | null;
  courier_name: string | null;
  created_at: string;
};

const statusMeta: Record<string, { label: string; color: string; icon: typeof Package }> = {
  scheduled: { label: "Scheduled", color: "bg-blue-500/15 text-blue-700 dark:text-blue-400", icon: Package },
  picked_up: { label: "Picked up", color: "bg-purple-500/15 text-purple-700 dark:text-purple-400", icon: Truck },
  in_transit: { label: "In transit", color: "bg-amber/20 text-amber", icon: Plane },
  delivered: { label: "Delivered", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-destructive/15 text-destructive", icon: XCircle },
};

function AccountPage() {
  const { user, loading, signOut, isVendor, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/account", mode: "login" } });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    setBusy(true);
    supabase
      .from("orders")
      .select("*")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data ?? []) as Order[]);
        setBusy(false);
      });
  }, [user]);

  if (loading || !user) return null;

  const active = orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
  const past = orders.filter((o) => o.status === "delivered" || o.status === "cancelled");

  return (
    <SiteLayout>
      <section className="container-page pt-28 pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">My Account</p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-foreground">
              Hi {user.user_metadata?.full_name?.split(" ")[0] ?? "Traveler"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isVendor && (
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/vendor">Vendor dashboard</Link>
              </Button>
            )}
            {isAdmin && (
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/admin">Admin</Link>
              </Button>
            )}
            <Button asChild className="rounded-full bg-amber text-amber-foreground hover:bg-amber/90">
              <Link to="/book">New pickup</Link>
            </Button>
            <Button variant="ghost" className="rounded-full" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-semibold">Active shipment</h2>
            {busy ? (
              <LoadingScreen variant="both" showText />
            ) : active.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
                <p className="text-sm text-muted-foreground">No active shipments right now.</p>
                <Button asChild className="mt-4 rounded-full bg-amber text-amber-foreground hover:bg-amber/90">
                  <Link to="/book">Book a pickup</Link>
                </Button>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {active.map((o) => (
                  <OrderCard key={o.id} order={o} primary />
                ))}
              </div>
            )}

            <h2 className="mt-12 font-display text-2xl font-semibold">Past orders</h2>
            {past.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No past orders yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {past.map((o) => (
                  <OrderCard key={o.id} order={o} />
                ))}
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold">Need help?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Our team is available 7am–11pm IST every day.
            </p>
            <Button asChild variant="outline" className="mt-4 w-full rounded-full">
              <Link to="/contact">Contact support</Link>
            </Button>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}

function OrderCard({ order, primary = false }: { order: Order; primary?: boolean }) {
  const meta = statusMeta[order.status] ?? statusMeta.scheduled;
  const Icon = meta.icon;
  return (
    <div
      className={`rounded-2xl border p-6 ${primary ? "border-amber/40 bg-amber/5" : "border-border bg-card"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge className={`${meta.color} border-0 font-medium`}>
              <Icon className="mr-1 h-3 w-3" /> {meta.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <p className="mt-2 font-display text-lg font-semibold">
            {order.bag_count} bag · {order.weight_kg} kg
            {order.airline && ` · ${order.airline} ${order.flight_number ?? ""}`}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {order.pickup_address} → {order.delivery_address}
          </p>
          {order.travel_date && (
            <p className="mt-1 text-xs text-muted-foreground">
              Travel date: {new Date(order.travel_date).toLocaleDateString("en-IN")}
            </p>
          )}
        </div>

        {order.tracking_url ? (
          <a
            href={order.tracking_url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Track shipment <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <span className="rounded-full bg-muted px-4 py-2 text-xs text-muted-foreground">
            Tracking link coming soon
          </span>
        )}
      </div>
      {order.courier_name && (
        <p className="mt-3 text-xs text-muted-foreground">
          Courier partner: <span className="font-medium text-foreground">{order.courier_name}</span>
        </p>
      )}
    </div>
  );
}
