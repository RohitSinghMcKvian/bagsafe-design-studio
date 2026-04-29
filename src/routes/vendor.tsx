import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/vendor")({
  head: () => ({
    meta: [
      { title: "Vendor Dashboard — BagSafe" },
      { name: "description", content: "Internal vendor dashboard for managing customer luggage orders." },
    ],
  }),
  component: VendorPage,
});

type VendorOrder = {
  id: string;
  customer_id: string;
  full_name: string;
  phone: string;
  pickup_address: string;
  delivery_address: string;
  weight_kg: number;
  bag_count: number;
  airline: string | null;
  flight_number: string | null;
  travel_date: string | null;
  status: string;
  tracking_url: string | null;
  courier_name: string | null;
  vendor_notes: string | null;
  created_at: string;
};

const STATUSES = ["scheduled", "picked_up", "in_transit", "delivered", "cancelled"] as const;

function VendorPage() {
  const { user, loading, isVendor, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [busy, setBusy] = useState(true);
  const [filter, setFilter] = useState<string>("active");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth", search: { redirect: "/vendor", mode: "login" } });
      return;
    }
    if (!isVendor && !isAdmin) {
      toast.error("Vendor access required");
      navigate({ to: "/account" });
    }
  }, [user, loading, isVendor, isAdmin, navigate]);

  const fetchOrders = async () => {
    setBusy(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setOrders((data ?? []) as VendorOrder[]);
    setBusy(false);
  };

  useEffect(() => {
    if ((isVendor || isAdmin) && user) fetchOrders();
  }, [isVendor, isAdmin, user]);

  const filtered = useMemo(() => {
    if (filter === "all") return orders;
    if (filter === "active")
      return orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  if (loading || !user || (!isVendor && !isAdmin)) return null;

  return (
    <SiteLayout>
      <section className="container-page pt-28 pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">Vendor</p>
            <h1 className="mt-2 font-display text-4xl font-semibold">Order operations</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {orders.length} total · {filtered.length} shown
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px] rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active orders</SelectItem>
                <SelectItem value="all">All orders</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="picked_up">Picked up</SelectItem>
                <SelectItem value="in_transit">In transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-full" onClick={fetchOrders}>
              Refresh
            </Button>
            <Button asChild variant="ghost" className="rounded-full">
              <Link to="/account">My account</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          {busy ? (
            <p className="p-8 text-center text-sm text-muted-foreground">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No orders match this filter.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-4">Order</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Route</th>
                  <th className="p-4">Bags</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Tracking</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="p-4">
                      <p className="font-mono text-xs">#{o.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(o.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{o.full_name}</p>
                      <p className="text-xs text-muted-foreground">{o.phone}</p>
                    </td>
                    <td className="p-4 text-xs">
                      <p className="max-w-[200px] truncate">{o.pickup_address}</p>
                      <p className="text-muted-foreground">↓</p>
                      <p className="max-w-[200px] truncate">{o.delivery_address}</p>
                      {o.airline && (
                        <p className="mt-1 text-muted-foreground">
                          ✈ {o.airline} {o.flight_number}
                        </p>
                      )}
                    </td>
                    <td className="p-4">{o.bag_count}× / {o.weight_kg}kg</td>
                    <td className="p-4">
                      <Badge variant="outline">{o.status.replace("_", " ")}</Badge>
                    </td>
                    <td className="p-4 text-xs">
                      {o.tracking_url ? (
                        <a
                          href={o.tracking_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-primary hover:underline"
                        >
                          {o.courier_name ?? "Open"} ↗
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <ManageOrderDialog order={o} onSaved={fetchOrders} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function ManageOrderDialog({ order, onSaved }: { order: VendorOrder; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [trackingUrl, setTrackingUrl] = useState(order.tracking_url ?? "");
  const [courier, setCourier] = useState(order.courier_name ?? "");
  const [notes, setNotes] = useState(order.vendor_notes ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    if (trackingUrl && !/^https?:\/\//i.test(trackingUrl)) {
      toast.error("Tracking URL must start with http:// or https://");
      setSaving(false);
      return;
    }
    const { error } = await supabase
      .from("orders")
      .update({
        status: status as (typeof STATUSES)[number],
        tracking_url: trackingUrl || null,
        courier_name: courier || null,
        vendor_notes: notes || null,
      })
      .eq("id", order.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Order updated");
    setOpen(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="rounded-full">
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Order #{order.id.slice(0, 8).toUpperCase()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Courier (e.g. Shiprocket, Delhivery)</Label>
            <Input value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="Shiprocket" />
          </div>
          <div className="space-y-1.5">
            <Label>Tracking URL</Label>
            <Input
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              placeholder="https://shiprocket.co/tracking/AWB..."
            />
            <p className="text-xs text-muted-foreground">
              Customer will see a "Track shipment" button that opens this link.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>Internal notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button onClick={save} disabled={saving} className="w-full rounded-full bg-amber text-amber-foreground hover:bg-amber/90">
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
