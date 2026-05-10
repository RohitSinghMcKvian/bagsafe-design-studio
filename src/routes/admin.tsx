import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — BagSafe" },
      { name: "description", content: "Admin tools for managing BagSafe users and roles." },
    ],
  }),
  component: AdminPage,
});

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
};

type RoleRow = { user_id: string; role: "customer" | "vendor" | "admin" };

function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth", search: { redirect: "/admin", mode: "login" } });
      return;
    }
    if (!isAdmin) {
      toast.error("Admin access required");
      navigate({ to: "/account" });
    }
  }, [user, loading, isAdmin, navigate]);

  const load = async () => {
    setBusy(true);
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email, phone"),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    setProfiles((p ?? []) as ProfileRow[]);
    setRoles((r ?? []) as RoleRow[]);
    setBusy(false);
  };

  useEffect(() => {
    if (isAdmin && user) load();
  }, [isAdmin, user]);

  const toggleRole = async (uid: string, role: "vendor" | "admin", has: boolean) => {
    if (has) {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", uid)
        .eq("role", role);
      if (error) return toast.error(error.message);
      toast.success(`Removed ${role}`);
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: uid, role });
      if (error) return toast.error(error.message);
      toast.success(`Granted ${role}`);
    }
    load();
  };

  if (loading || !user || !isAdmin) return null;

  const rolesByUser = (uid: string) => roles.filter((r) => r.user_id === uid).map((r) => r.role);

  return (
    <SiteLayout>
      <section className="container-page pt-28 pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber">Admin</p>
            <h1 className="mt-2 font-display text-4xl font-semibold">Users & roles</h1>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/vendor">Vendor view</Link>
            </Button>
            <Button asChild variant="ghost" className="rounded-full">
              <Link to="/account">My account</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          {busy ? (
            <LoadingScreen variant="both" showText />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Roles</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => {
                  const ur = rolesByUser(p.id);
                  const isV = ur.includes("vendor");
                  const isA = ur.includes("admin");
                  return (
                    <tr key={p.id} className="border-t border-border">
                      <td className="p-4">
                        <p className="font-medium">{p.full_name || "—"}</p>
                        <p className="text-xs text-muted-foreground">{p.email}</p>
                        <p className="text-xs text-muted-foreground">{p.phone}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {ur.length === 0 && <span className="text-xs text-muted-foreground">none</span>}
                          {ur.map((r) => (
                            <Badge key={r} variant="outline">{r}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={isV ? "secondary" : "outline"}
                            className="rounded-full"
                            onClick={() => toggleRole(p.id, "vendor", isV)}
                            disabled={p.id === user.id}
                          >
                            {isV ? "Revoke vendor" : "Make vendor"}
                          </Button>
                          <Button
                            size="sm"
                            variant={isA ? "secondary" : "outline"}
                            className="rounded-full"
                            onClick={() => toggleRole(p.id, "admin", isA)}
                            disabled={p.id === user.id}
                          >
                            {isA ? "Revoke admin" : "Make admin"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          You cannot change your own roles here — ask another admin or use the database directly.
        </p>
      </section>
    </SiteLayout>
  );
}
